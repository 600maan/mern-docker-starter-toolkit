const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');

const JobsPortalModel = require('../../models/JobsPortal');
const validationResult = require('../../middlewares/parseValidation');
const logger = require('../../middlewares/logging');

router.get('/test', (req, res) => {
  res.send('<h1>Jobs Portal API is live</h1>');
});

// @route:  GET api/jobs-portal/is-unique/:key/:value/:id
// @desc:   Check if value of certain key: rank/vendorID of item id is unique or not
// @access: private
router.get('/is-unique/:key/:value/:id', auth, isAdminAuth, async (req, res) => {
  try {
    const { value, key, id } = req.params;
    // contruct a filter object, in such a way that it is vendorId: "23",
    // if key is vendorId, and value is 23, so that we can check any key, like vendorId, rank
    const filterParam = {
      [key]: value,
    };

    if (id && id !== 'undefined') filterParam._id = { $ne: id };
    const count = await JobsPortalModel.count(filterParam);

    res.send({ unique: count === 0 });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'unable to process' });
  }
});

// @route:  GET api/jobs-portal/
// @desc:   get all the non isDeleted jobs portal item
// @access: private
router.get('/', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  if (!req.user.isAdmin) {
    filterQuery.activeStatus = true;
    filterQuery.expiryDate = { $gte: Date.now() };
  }
  try {
    const totalResult = await JobsPortalModel.find(filterQuery);
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

// @route:  POST api/jobs-portal/
// @desc:   add or edit a Jobs Portal Item
// @access: private (admin)
router.post(
  '/',
  auth,
  isAdminAuth,
  [
    check('jobId', 'Job Id is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('companyName', 'Company Name is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    const itemId = req.body._id;
    const itemBody = _.pick(req.body, [
      'companyName',
      'title',
      'advertiserEmail',
      'category',
      'workTime',
      'applicationDeadline',
      'salary',
      'expiryDate',
      'description',
      'rank',
      'keywords',
      'activeStatus',
      'workingLocation',
      'experienceYears',
      'benefits',
      'logoImage',
      'status',
      'jobDescriptions',
    ]);

    try {
      // if request body has _id property and it is valid,
      //  then client wants to update the item, else creates one
      const existingId = await JobsPortalModel.findOne({
        _id: itemId,
        isDeleted: false,
      });
      if (existingId) {
        // update
        itemBody.updatedDateTime = Date.now();
        itemBody.updatedBy = req.user._id;

        const updatedData = await JobsPortalModel.findByIdAndUpdate(
          itemId,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: 'Successfully updated Jobs Portal item',
          });
        }
        return res
          .status(400)
          .json({ message: 'Cannot update Jobs Portal item' });
      }
      // create
      itemBody.createdBy = req.user._id;
      itemBody.jobId = req.body.jobId;
      const modelDoc = new JobsPortalModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Successfully created Jobs Portal item',
          _id: savedData._id,
        });
      }
      return res
        .status(400)
        .json({ message: 'Cannot create Jobs Portal item' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/jobs-portal/id/<itemId>
// @desc:   get the details of one item
// @access: public
router.get('/id/:itemId', authentication, async (req, res) => {
  try {
    if (req.params.itemId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = ObjectId(req.params.itemId);
    const filterQuery = {
      _id: itemId,
      isDeleted: false,
    };
    if (!req.user.isAdmin) filterQuery.activeStatus = true;
    const item = await JobsPortalModel.findOne(filterQuery);
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

// @route:  GET api/jobs-portal/jobId/<id>
// @desc:   get the details of one item
// @access: public
router.get('/jobId/:id', authentication, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await JobsPortalModel.findOne({
      jobId: itemId,
      isDeleted: false,
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

// @route:  DELETE api/jobs-portal/many
// @desc:   Delete multiple JobsPortal items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await JobsPortalModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message:
            `${updatedData.n} Jobs listing items are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Jobs portal items',
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

// @route:  DELETE api/jobs-portal/<itemId>
// @desc:   delete single JobsPortal Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await JobsPortalModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      res.json({
        message: `Jobs portal: ${updatedItem.name} job listing has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Jobs listing found from such ID',
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

// @route:  PUT api/jobs-portal/toggle/<itemId>/<toggleStatus>
// @desc:   Toggle active status of jobs portal item
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
        const updatedData = await JobsPortalModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of Jobs Portal: ${updatedData.name} job listing has been turned ${toggleStatus}`,
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

module.exports = router;
