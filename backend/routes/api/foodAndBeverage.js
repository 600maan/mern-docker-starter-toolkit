const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');
const FoodAndBeverageModel = require('../../models/FoodAndBeverage');
const validationResult = require('../../middlewares/parseValidation');
const logger = require('../../middlewares/logging');

const auth = passport.authenticate('jwt', { session: false });

router.get('/test', (req, res) => {
  res.send('<h1>Food Beverage API is live</h1>');
  return false;
});

// @route:  GET api/food-and-beverage/is-unique/:key/:value/:id
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
    const count = await FoodAndBeverageModel.count(filterParam);

    res.send({ unique: count === 0 });
  } catch (error) {
    logger.error(error);
    console.error(error);
    res.status(400).send({ message: 'unable to process' });
  }
});

// @route:  GET api/food-and-beverage/
// @desc:   get all the non isDeleted food and beverage item
// @access: private
router.get('/', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  if (!req.user.isAdmin) filterQuery.activeStatus = true;
  try {
    const totalResult = await FoodAndBeverageModel.find(filterQuery);
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

// @route:  POST api/food-and-beverage/
// @desc:   add or edit a FoodAndBeverage Item
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
      'description',
      'rank',
      'photos',
      'activePhoto',
      'keywords',
      'activeStatus',
      'menuImage',
      'shortDescription',
    ]);

    itemBody.gps = {};
    if (req.body.latitude) itemBody.gps.latitude = req.body.latitude;
    if (req.body.longitude) itemBody.gps.longitude = req.body.longitude;

    try {
      // if request body has _id property and it is valid,
      //  then client wants to update the item, else creates one
      const existingId = await FoodAndBeverageModel.findOne({
        _id: itemId,
        isDeleted: false,
      });
      if (existingId) {
        // update
        itemBody.updatedDateTime = Date.now();
        itemBody.updatedBy = req.user._id;

        const updatedData = await FoodAndBeverageModel.findByIdAndUpdate(
          itemId,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: 'Successfully updated Food and Beverage item',
          });
        }
        return res
          .status(400)
          .json({ message: 'Cannot update Food and Beverage item' });
      }
      // create
      itemBody.createdBy = req.user._id;
      itemBody.vendorId = req.body.vendorId;

      const existingTitle = await FoodAndBeverageModel.findOne({
        name: itemBody.name,
        isDeleted: false,
      });
      if (existingTitle) {
        return res.status(400).json({
          message:
              'No duplicate name allowed. Please change the title and try again.',
        });
      }
      const modelDoc = new FoodAndBeverageModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Successfully created Food and Beverage item',
          _id: savedData._id,
        });
      }
      return res
        .status(400)
        .json({ message: 'Cannot create Food and Beverage item' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/food-and-beverage/id/<itemId>
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
    const item = await FoodAndBeverageModel.findOne(filterQuery);
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

// @route:  GET api/food-and-beverage/vendorId/<id>
// @desc:   get the details of one item
// @access: public
router.get('/vendorId/:id', authentication, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await FoodAndBeverageModel.findOne({
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

// @route:  DELETE api/food-and-beverage/many
// @desc:   Delete multiple FoodAndBeverage items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await FoodAndBeverageModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message:
            `${updatedData.n
            } Food and Beverage Items are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Food and Beverage items',
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

// @route:  DELETE api/food-and-beverage/<itemId>
// @desc:   delete single FoodAndBeverage Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await FoodAndBeverageModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      res.json({
        message: `Food And Beverage: ${updatedItem.name} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Food and Beverage found from such ID',
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

// @route:  PUT api/food-and-beverage/toogle/<itemId>/<toogleStatus>
// @desc:   Toogle active status of food and beverage item
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
        const updatedData = await FoodAndBeverageModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of Food and Beverage: ${updatedData.name} has been turned ${toggleStatus}`,
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
