const router = require('express').Router();
const passport = require('passport');
const { ObjectId } = require('mongoose').Types;

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');

const RsvpOrderModel = require('../../models/RsvpOrder');
const validationResult = require('../../middlewares/parseValidation');
const logger = require('../../middlewares/logging');

const getOrderid = async () => {
  let orderId = 'order-0';
  const latestRecord = await RsvpOrderModel.findOne({}, 'orderId', {
    sort: { createdDateTime: -1 },
  });

  if (latestRecord) {
    const splittedId = latestRecord.toObject().orderId.split('-');
    if (splittedId.length > 1) {
      let isExist = true;
      let orderNumber = parseInt(splittedId[1], 10);

      do {
        orderNumber += 1;
        orderId = `order-${orderNumber}`;
        // eslint-disable-next-line no-await-in-loop
        isExist = await RsvpOrderModel.findOne({
          orderId,
        });
      } while (isExist);
    }
  }
  return orderId;
};

router.get('/test', async (req, res) => {
  res.send('<h1>Rsvp Order API is live</h1>');
  return false;
});

// @route:  GET api/rsvp-order/
// @desc:   get all the non deleted rsvp product item
// @access: private
router.get('/', auth, isAdminAuth, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  try {
    const totalResult = await RsvpOrderModel.find(filterQuery).populate({
      path: 'userId',
      select: 'name email',
    })
      .populate({
        path: 'productId',
        select: 'productId name price discountPercent',
      });

    const data = totalResult.map((one) => {
      const eachBody = _.pick(one, [
        '_id',
        'activeStatus',
        'contact',
        'createdDateTime',
        'message',
        'orderId',
      ]);
      if (one.productId) {
        eachBody.productId = one.productId.productId;
        eachBody.product_id = one.productId._id;
        eachBody.productName = one.productId.name;
        eachBody.productPrice = one.productId.price;
        eachBody.productDiscountPercent = one.productId.discountPercent;
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

// @route:  POST api/rsvp-order/
// @desc:   add or edit a RsvpProduct Item
// @access: private (admin)
router.post(
  '/',
  auth,
  [
    check('productId', 'product is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    const itemBody = _.pick(req.body, ['productId', 'message', 'contact']);
    try {
      // create
      itemBody.userId = req.user._id;
      itemBody.orderId = await getOrderid();
      const modelDoc = new RsvpOrderModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Your order has been recorded.',
          _id: savedData._id,
        });
      }
      return res
        .status(400)
        .json({ message: 'You order cannot be recorded at the moment. Try again later!' });
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Unable to process.',
      });
    }
  },
);

// @route:  GET api/rsvp-order/id/<itemId>
// @desc:   get the details of one item
// @access: public
router.get('/id/:itemId', authentication, async (req, res) => {
  try {
    if (req.params.itemId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = ObjectId(req.params.itemId);
    const item = await RsvpOrderModel.findOne({
      _id: itemId,
      isDeleted: false,
    })
      .populate({
        path: 'productId',
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

// @route:  GET api/rsvp-order/productId/<id>
// @desc:   get the details of one item
// @access: public
router.get('/orderId/:id', auth, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await RsvpOrderModel.findOne({
      orderId: itemId,
      isDeleted: false,
    })
      .populate({
        path: 'productId',
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

// @route:  DELETE api/rsvp-order/many
// @desc:   Delete multiple RsvpProduct items at once [setting isDeleted to false]
// @access: private
router.post('/many', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.body.ids) {
      const updatedData = await RsvpOrderModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message: `${updatedData.n} Rsvp orders are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected Rsvp orders',
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

// @route:  DELETE api/rsvp-order/<itemId>
// @desc:   delete single RsvpProduct Item [setting isDeleted to false]
// @access: private
router.delete('/:itemId', auth, isAdminAuth, async (req, res) => {
  const itemId = Mongoose.Types.ObjectId(req.params.itemId);
  try {
    const updatedItem = await RsvpOrderModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      res.json({
        message: `Rsvp Order: ${updatedItem.orderId} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Rsvp Order found from such ID',
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

// @route:  PUT api/rsvp-order/toggle/<itemId>/<toggleStatus>
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
        const updatedData = await RsvpOrderModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of Rsvp Order: ${updatedData.orderId} has been turned ${toggleStatus}`,
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

// @route:  GET api/rsvp-order/user/id/<id>
// @desc:   get the details of one item
// @access: public
router.get('/user/id/:itemId', auth, async (req, res) => {
  try {
    if (req.params.id === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = req.params.id;
    const item = await RsvpOrderModel.findOne({
      userId: req.user._id,
      orderId: itemId,
      isDeleted: false,
    })
      .populate({
        path: 'productId',
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

// @route:  GET api/rsvp-order/
// @desc:   get all the non deleted rsvp order item
// @access: private
router.get('/', auth, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
    activeStatus: true,
    userId: req.user._id,
  };
  try {
    const totalResult = await RsvpOrderModel.find(filterQuery)
      .populate({
        path: 'productId',
        select: 'productId name price discountPercent',
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
