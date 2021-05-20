const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');

const JobApplicationModel = require('../../models/JobApplications');
const validationResult = require('../../middlewares/parseValidation');
const logger = require('../../middlewares/logging');

const getApplicationId = async () => {
  let applicationId = 'application-0';
  const latestRecord = await JobApplicationModel.findOne({}, 'applicationId', {
    sort: { createdDateTime: -1 },
  });

  if (latestRecord) {
    const splittedId = latestRecord.toObject().applicationId.split('-');
    if (splittedId.length > 1) {
      let isExist = true;
      let orderNumber = parseInt(splittedId[1], 10);

      do {
        orderNumber += 1;
        applicationId = `application-${orderNumber}`;
        // eslint-disable-next-line no-await-in-loop
        isExist = await JobApplicationModel.findOne({
          applicationId,
        });
      } while (isExist);
    }
  }
  return applicationId;
};
router.get('/test', (req, res) => {
  res.send('<h1>Job Application API is live</h1>');
  return false;
});

// @route:  GET api/job-application/
// @desc:   get all the non deleted rsvp product item
// @access: private
router.get('/', auth, isAdminAuth, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  try {
    const totalResult = await JobApplicationModel.find(filterQuery)
      .populate({
        path: 'jobId',
        select: 'title jobId companyName',
      })
      .populate({
        path: 'userId',
        select: 'name email',
      });
    const data = totalResult.map((one) => {
      const eachBody = _.pick(one, [
        '_id',
        'activeStatus',
        'contact',
        'createdDateTime',
        'message',
        'applicationId',
        'cv',
      ]);
      if (one.jobId) {
        eachBody.jobId = one.jobId.jobId;
        eachBody.job_id = one.jobId._id;
        eachBody.companyName = one.jobId.companyName;
        eachBody.jobTitle = one.jobId.title;
      }
      if (one.userId) {
        eachBody.userId = one.userId._id;
        eachBody.userEmail = one.userId.email;
        eachBody.userName = one.userId.name;
      }
      return eachBody;
    });
    res.json({ data });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  POST api/job-application/
// @desc:   add or edit a Job Application Item
// @access: private (admin)
router.post(
  '/',
  auth,
  [check('jobId', 'Job is required').not().isEmpty()],
  [check('contact', 'contact is required').not().isEmpty()],
  validationResult,
  async (req, res) => {
    const itemBody = _.pick(req.body, ['jobId', 'message', 'contact']);
    itemBody.applicationId = await getApplicationId();

    const currentTimeStamp = Math.floor(Date.now() / 1000); // in seconds

    // check cv
    const uploadFile = req.files.file;
    const ext = uploadFile.name.substr(uploadFile.name.lastIndexOf('.') + 1);
    const name = `job_application_${req.body.jobId}_${currentTimeStamp}.${ext}`;
    uploadFile.mv(`${__dirname}/../../public/files/${name}`, (err) => {
      if (err) {
        return res.status(500).json({ success: false, err });
      }
      return false;
    });
    try {
      // create
      itemBody.userId = req.user._id;
      itemBody.cv = name;
      const modelDoc = new JobApplicationModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Your application has been recorded.',
          _id: savedData._id,
        });
      }
      return res.status(400).json({
        message: 'You application cannot be recorded at the moment. Try again later!',
      });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/job-application/id/<itemId>
// @desc:   get the details of one item
// @access: public
router.get('/id/:itemId', authentication, async (req, res) => {
  try {
    if (req.params.itemId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = ObjectId(req.params.itemId);
    const item = await JobApplicationModel.findOne({
      _id: itemId,
      isDeleted: false,
    })
      .populate({
        path: 'jobId',
      })
      .populate({
        path: 'userId',
        select: '-password -__v',
      });

    if (item) {
      return res.json({
        data: item,
      });
    }
    return res.status(404).json({ message: 'No such item exists' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  GET api/job-application/productId/<id>
// @desc:   get the details of one item
// @access: public
router.get('/applicationId/:id', auth, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await JobApplicationModel.findOne({
      applicationId: itemId,
      isDeleted: false,
    })
      .populate({
        path: 'jobId',
      })
      .populate({
        path: 'userId',
        select: '-password -__v',
      });
    if (item) {
      return res.json({
        data: item,
      });
    }
    return res.status(404).json({ message: 'No such item exists' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  DELETE api/job-application/many
// @desc:   Delete multiple Job Application items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await JobApplicationModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message: `${updatedData.n} Job Applications are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Job Applications',
        });
      }
    } else res.status(400).json({ message: 'No IDs to delete' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  DELETE api/job-application/<itemId>
// @desc:   delete single Job Application Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await JobApplicationModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      res.json({
        message: `Job Application: ${updatedItem.applicationId} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Job Application found from such ID',
      });
    }
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  PUT api/job-application/toggle/<itemId>/<toggleStatus>
// @desc:   Toggle active status of rsvp product item
// @access: private
router.put(
  '/toggle/:itemId/:toggleStatus',
  auth,
  isAdminAuth,
  async (req, res) => {
    const toggleStatus = req.params.toggleStatus || 'on';
    const itemId = Mongoose.Types.ObjectId(req.params.itemId);

    try {
      if (itemId) {
        const updatedData = await JobApplicationModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of Job Application: ${updatedData.applicationId} has been turned ${toggleStatus}`,
          });
        } else {
          res.status(400).json({
            message: 'Cannot change active status.',
          });
        }
      } else res.status(404).json({ message: 'No ID to toggle active status' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
    return false;
  },
);

// @route:  GET api/job-application/user/id/<id>
// @desc:   get the details of one item
// @access: public
router.get('/user/id/:itemId', auth, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await JobApplicationModel.findOne({
      userId: req.user._id,
      applicationId: itemId,
      isDeleted: false,
      activeStatus: true,
    })
      .populate({
        path: 'jobId',
        select: 'title companyName workTime applicationDeadline experienceYears expiryDate salary logoImage workingLocation benefits jobDescriptions',
      })
      .populate({
        path: 'userId',
        select: '-password -__v',
      });
    if (item) {
      return res.json({
        data: item,
      });
    }
    return res.status(404).json({ message: 'No such item exists' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  GET api/job-application/
// @desc:   get all the non deleted rsvp application item
// @access: private
router.get('/user', auth, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
    activeStatus: true,
    userId: req.user._id,
  };
  try {
    const totalResult = await JobApplicationModel.find(filterQuery).populate({
      path: 'jobId',
      select: 'title companyName workTime applicationDeadline experienceYears expiryDate salary logoImage workingLocation benefits jobDescriptions',
    });

    res.json({ data: totalResult });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

module.exports = router;
