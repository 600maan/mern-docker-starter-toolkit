const router = require('express').Router();
const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const _ = require('lodash');
const isAdminAuth = require('../../middlewares/isAdmin');
const validationResult = require('../../middlewares/parseValidation');
const EmailLogModel = require('../../models/EmailLog');
const mailSender = require('../../services/mailer');
const generalTemplate = require('../../services/templates/generalTemplate');
const logger = require('../../middlewares/logging');

router.get('/test', (req, res) => {
  res.send('<h1>Contacts API is live</h1>');
  return false;
});

// @route:  POST api/email/send
// @desc:  send email
// @access: private (admin)
router.post(
  '/send',
  auth, isAdminAuth,
  [check('email', 'Email is required').not().isEmpty()],
  [check('body', 'message is required').not().isEmpty()],
  validationResult,
  async (req, res) => {
    const itemBody = _.pick(req.body, ['email', 'body', 'subject']);

    // send Email
    await mailSender({
      to: itemBody.email,
      subject: generalTemplate.generic.subject(itemBody.subject),
      html: generalTemplate.generic.html(itemBody.body),
      text: generalTemplate.generic.text(itemBody.body),
    });
    itemBody.createdBy = req.user._id;
    try {
      // create
      const modelDoc = new EmailLogModel(itemBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        return res.json({
          message: 'Email has been sent succesfully',
          _id: savedData._id,
        });
      }
      return res.status(400).json({
        message: 'Email cannot be recorded at the moment. Try again later!',
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

module.exports = router;
