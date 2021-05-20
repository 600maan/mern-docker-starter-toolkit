const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');

const TravelAndTourModel = require('../../models/TravelAndTour');
const validationResult = require('../../middlewares/parseValidation');
const logger = require('../../middlewares/logging');

router.get('/test', (req, res) => {
  res.send('<h1>Travel and tour API is live</h1>');
});

// @route:  GET api/travel-and-tour/is-unique/:key/:value/:id
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
    const count = await TravelAndTourModel.find(filterParam);
    res.send({ unique: count.length === 0 });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ message: 'unable to process' });
  }
});

// @route:  GET api/travel-and-tour/
// @desc:   get all the non isDeleted travel and tour item
// @access: private
router.get('/', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  if (!req.user.isAdmin) filterQuery.activeStatus = true;
  try {
    const totalResult = await TravelAndTourModel.find(filterQuery);
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

// @route:  POST api/travel-and-tour/
// @desc:   add or edit a TravelAndTour Item
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
      'logoImage',
      'keywords',
      'activeStatus',
    ]);

    itemBody.gps = {};
    if (req.body.latitude) itemBody.gps.latitude = req.body.latitude;
    if (req.body.longitude) itemBody.gps.longitude = req.body.longitude;

    try {
      // if request body has _id property and it is valid,
      //  then client wants to update the item, else creates one
      const existingId = await TravelAndTourModel.findOne({
        _id: itemId,
        isDeleted: false,
      });
      if (existingId) {
        // update
        itemBody.updatedDateTime = Date.now();
        itemBody.updatedBy = req.user._id;

        const updatedData = await TravelAndTourModel.findByIdAndUpdate(
          itemId,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: 'Successfully updated Travel and Tour item',
          });
        }
        return res
          .status(400)
          .json({ message: 'Cannot update Travel and Tour item' });
      }
      // create
      itemBody.createdBy = req.user._id;
      itemBody.vendorId = req.body.vendorId;

      const existingTitle = await TravelAndTourModel.findOne({
        name: itemBody.name,
        isDeleted: false,
      });
      if (existingTitle) {
        return res.status(400).json({
          message:
              'No duplicate name allowed. Please change the title and try again.',
        });
      }
      const modelDoc = new TravelAndTourModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Successfully created Travel and Tour item',
          _id: savedData._id,
        });
      }
      return res
        .status(400)
        .json({ message: 'Cannot create Travel and Tour item' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/travel-and-tour/id/<itemId>
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
    const item = await TravelAndTourModel.findById(filterQuery);
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

// @route:  GET api/travel-and-tour/vendorId/<id>
// @desc:   get the details of one item
// @access: public
router.get('/vendorId/:id', authentication, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await TravelAndTourModel.findOne({
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

// @route:  DELETE api/travel-and-tour/many
// @desc:   Delete multiple TravelAndTour items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await TravelAndTourModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message:
            `${updatedData.n} Travel and Tour Items are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Travel and Tour items',
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

// @route:  DELETE api/travel-and-tour/<itemId>
// @desc:   delete single TravelAndTour Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await TravelAndTourModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      res.json({
        message: `Travel And Tour: ${updatedItem.name} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Travel and Tour found from such ID',
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

// @route:  PUT api/travel-and-tour/toggle/<itemId>/<toggleStatus>
// @desc:   Toggle active status of travel and tour item
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
        const updatedData = await TravelAndTourModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of travel and tour: ${updatedData.name} has been turned ${toggleStatus}`,
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
