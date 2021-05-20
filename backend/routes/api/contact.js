const router = require('express').Router();
const { ObjectId } = require('mongoose').Types;
const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const _ = require('lodash');
const authentication = require('../../middlewares/authentication');
const isAdminAuth = require('../../middlewares/isAdmin');
const validationResult = require('../../middlewares/parseValidation');
const ContactsModel = require('../../models/Contacts');
const logger = require('../../middlewares/logging');

router.get('/test', (req, res) => {
  res.send('<h1>Contacts API is live</h1>');
  return false;
});

// @route:  GET api/rsvp-order/
// @desc:   get all the non deleted rsvp product item
// @access: private
router.get('/', authentication, async (req, res) => {
  const filterQuery = {
    isDeleted: false,
  };
  if (!req.user.isAdmin) filterQuery.activeStatus = true;
  try {
    const totalResult = await ContactsModel.find(
      filterQuery,
      '-isDeleted -__v',
    );

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

// @route:  POST api/rsvp-order/
// @desc:   add or edit a RsvpProduct Item
// @access: private (admin)
router.post(
  '/',
  [check('name', 'name is required').not().isEmpty()],
  [check('message', 'message is required').not().isEmpty()],
  [check('contact', 'contact is required').not().isEmpty()],
  validationResult,
  async (req, res) => {
    const itemBody = _.pick(req.body, ['name', 'contact', 'subject', 'message']);
    try {
      // create
      const modelDoc = new ContactsModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Your message has been recorded.',
          _id: savedData._id,
        });
      }
      return res.status(400).json({
        message: 'You message cannot be recorded at the moment. Try again later!',
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

// @route:  GET api/contact-message/id/<itemId>
// @desc:   get the details of one item
// @access: public
router.get('/id/:itemId', auth, isAdminAuth, async (req, res) => {
  try {
    if (req.params.itemId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const itemId = ObjectId(req.params.itemId);
    const item = await ContactsModel.findOne(
      {
        _id: itemId,
        isDeleted: false,
      },
      '-isDeleted -__v',
    );

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
      const updatedData = await ContactsModel.updateMany(
        { _id: { $in: req.body.ids } },
        { isDeleted: true },
        { new: true },
      );
      if (updatedData) {
        res.json({
          message: `${updatedData.n} contact messages are deleted successfully.`,
        });
      } else {
        res.status(400).json({
          message: 'Cannot delete selected contact messages',
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
    const updatedItem = await ContactsModel.findByIdAndUpdate(
      itemId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedItem) {
      res.json({
        message: `Contact Message of ${updatedItem.name} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such Contact Message found from such ID',
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
        const updatedData = await ContactsModel.findByIdAndUpdate(
          itemId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of Contact Message of ${updatedData.name} has been turned ${toggleStatus}`,
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
