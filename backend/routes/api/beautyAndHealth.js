const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');
const logger = require('../../middlewares/logging');
const BeautyAndHealthModel = require('../../models/BeautyAndHealth');
const validationResult = require('../../middlewares/parseValidation');

router.get('/test', (req, res) => {
  res.send('<h1>Beauty and health API is live</h1>');
});

/*
security middleware: authentication, auth, isAdminAuth
1. if api is used for non-registered clients only, no need to use any security middleware.
2. if api is used for registered clients only, we used auth middleware.
3. if api is used for admin only, we used auth and isAdminAuth middleware
4. if api is used for admin and clients both, but separate response, then use authentication.
*/

// @route:  GET api/beauty-and-health/is-unique/:key/:value/:id
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
    const count = await BeautyAndHealthModel.count(filterParam);

    res.send({ unique: count === 0 });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'unable to process' });
  }
});

// @route:  GET api/beauty-and-health/
// @desc:   get all the non isDeleted beauty and health item
// @access: private
router.get('/', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  // if this api is not called by admin token,
  // we returns the document only if active status is true
  if (!req.user.isAdmin) filterQuery.activeStatus = true;
  try {
    const totalResult = await BeautyAndHealthModel.find(filterQuery);
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

// @route:  POST api/beauty-and-health/
// @desc:   add or edit a BeautyAndHealth Item
// @access: private (admin)
router.post(
  '/',
  auth,
  isAdminAuth,
  [
    check('vendorId', 'Vendor Id is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    const itemId = req.body._id;

    const itemBody = _.pick(req.body, [
      'name',
      'category',
      'phoneNumber',
      'address',
      'email',
      'website',
      'shortDescription',
      'description',
      'rank',
      'photos',
      'activePhoto',
      'keywords',
      'activeStatus',
    ]);

    itemBody.gps = {};
    if (req.body.latitude) itemBody.gps.latitude = req.body.latitude;
    if (req.body.longitude) itemBody.gps.longitude = req.body.longitude;

    try {
      // if request body has _id property and it is valid,
      //  then client wants to update the item, else creates one
      const existingId = await BeautyAndHealthModel.findOne({
        _id: itemId,
        isDeleted: false,
      });
      if (existingId) {
        // update
        itemBody.updatedDateTime = Date.now();
        itemBody.updatedBy = req.user._id;

        const updatedData = await BeautyAndHealthModel.findByIdAndUpdate(
          itemId,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: 'Successfully updated Beauty and Health item',
          });
        }
        return res
          .status(400)
          .json({ message: 'Cannot update Beauty and Health item' });
      }
      // create
      itemBody.createdBy = req.user._id;
      itemBody.vendorId = req.body.vendorId;
      // before saving the item, check if title is already exists,
      // if exists throws error message to client
      const existingTitle = await BeautyAndHealthModel.findOne({
        name: itemBody.name,
        isDeleted: false,
      });
      if (existingTitle) {
        return res.status(400).json({
          message:
              'No duplicate name allowed. Please change the title and try again.',
        });
      }
      const modelDoc = new BeautyAndHealthModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Successfully created Beauty and Health item',
          _id: savedData._id,
        });
      }
      return res
        .status(400)
        .json({ message: 'Cannot create Beauty and Health item' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/beauty-and-health/id/<itemId>
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
    const item = await BeautyAndHealthModel.findOne(filterQuery);
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

// @route:  GET api/beauty-and-health/vendorId/<id>
// @desc:   get the details of one item
// @access: public
router.get('/vendorId/:id', authentication, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await BeautyAndHealthModel.findOne({
      vendorId: itemId,
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

// @route:  DELETE api/beauty-and-health/many
// @desc:   Delete multiple BeautyAndHealth items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await BeautyAndHealthModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        return res.json({
          message:
            `${updatedData.n
            } Beauty and Health Items are deleted successfully.`,
        });
      }
      return res.status(400).json({
        message: 'Cannot delete selected Beauty and Health items',
      });
    } return res.status(400).json({ message: 'No IDs to delete' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  DELETE api/beauty-and-health/<itemId>
// @desc:   delete single BeautyAndHealth Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await BeautyAndHealthModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      return res.json({
        message: `Beauty and health: ${updatedItem.name} has been deleted.`,
      });
    }
    return res.status(404).json({
      message: 'No such Beauty and health found from such ID',
    });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  PUT api/beauty-and-health/toggle/<itemId>/<toggleStatus>
// @desc:   Toggle active status of beauty and health item
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
        const updatedData = await BeautyAndHealthModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: `Active status of Beauty and Health: ${updatedData.name} has been turned ${toggleStatus}`,
          });
        }
        return res.status(400).json({
          message: 'Cannot change active status.',
        });
      } return res.status(404).json({ message: 'No ID to toggle active status' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

module.exports = router;
