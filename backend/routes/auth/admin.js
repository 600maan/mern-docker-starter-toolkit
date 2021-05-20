const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongoose').Types;
const _ = require('lodash');
const passport = require('passport');
const validator = require('validator');

const jwt = require('jsonwebtoken');

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const validationResult = require('../../middlewares/parseValidation');
const isAdminAuth = require('../../middlewares/isAdmin');
const AdminModel = require('../../models/Admin');
const logger = require('../../middlewares/logging');

router.get('/test', (req, res) => {
  res.send('Welcome Home buddy');
});

// @route:  POST api/admin/register
// @desc:   register the user
// @access: public
router.post(
  '/register',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    // check validation
    const errors = {};
    try {
      const existingEmailUser = await AdminModel.findOne({
        email: req.body.email,
      });
      if (existingEmailUser) {
        if (existingEmailUser.isDeleted) {
          errors.message = 'You cannot registered with this email. Your account has been freezed.';
          return res.status(406).json(errors);
        }
        errors.email = 'Email already exists';
        return res.status(406).json(errors);
      }
      const existingUsernameUser = await AdminModel.findOne({
        username: req.body.username,
      });
      if (existingUsernameUser) {
        if (existingUsernameUser.isDeleted) {
          errors.message = 'You cannot registered with this username. Your account has been freezed.';
          return res.status(406).json(errors);
        }
        errors.email = 'Username already exists';
        return res.status(406).json(errors);
      }
      const modelBody = _.pick(req.body, [
        'email',
        'password',
        'username',
        'name',
      ]);

      const modelDoc = new AdminModel(modelBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        const JWTPayload = {
          id: savedData.id,
          role: 'admin',
        };
        // sign Token
        jwt.sign(
          JWTPayload,
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.ADMIN_SESSION_EXPIRES_IN, // session active duration
          },
          (err, token) => {
            if (!err) {
              const BearerToken = `Bearer ${token}`;
              return res.json({
                success: true,
                message: 'Successfully created account',
                token: BearerToken,
              });
            }
            return res.status(400).json({ message: 'Cannot proceed' });
          },
        );
      } else {
        return res.status(400).json({ message: 'Cannot proceed' });
      }
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

// @route:  POST api/admin/editUser
// @desc:  User can edit their profile
// @access: private
router.post(
  '/editUser',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('name', 'Name/Username is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
  ],
  auth,
  validationResult,
  async (req, res) => {
    const itemBody = _.pick(req.body, ['email', 'name', 'username']);
    const itemId = req.body._id;

    try {
      const existingId = await AdminModel.findOne({
        _id: itemId,
        isDeleted: false,
      });

      if (existingId) {
        const updatedData = await AdminModel.findByIdAndUpdate(
          itemId,
          { $set: itemBody },
          { new: true },
        );
        if (updatedData) {
          return res.json({
            message: 'Successfully updated User Detail.',
          });
        }
        return res.status(400).json({ message: 'Cannot update User Detail' });
      }
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

// @route:  POST api/admin/changePassword
// @desc:  User can change the password
// @access: private
router.post(
  '/changePassword',
  auth,
  [
    check('oldPassword', 'Old Password is required').not().isEmpty(),
    check('password', 'New Password is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, password } = req.body;
    try {
      const existingUser = await AdminModel.findOne({
        _id: userId,
        isDeleted: false,
      });

      if (existingUser) {
        bcrypt.compare(
          oldPassword,
          existingUser.password,
          async (err, isMatch) => {
            if (err) {
              return res
                .status(400)
                .json({ message: 'Cannot update User Password.' });
            }
            if (isMatch) {
              existingUser.password = password;
              const updatedUser = await existingUser.save();
              if (updatedUser) {
                return res.json({
                  message: 'Successfully updated User Password.',
                });
              }
              return false;
            }
            return res
              .status(400)
              .json({ message: 'Old password do not match' });
          },
        );
      }
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

// @route:  POST api/admin/login
// @desc:  User can login into the cms
// @access: public
router.post(
  '/login',
  [
    check('emailOrUsername', 'Email/Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    const errors = {};
    const { emailOrUsername, password } = req.body;

    const isEmail = validator.isEmail(emailOrUsername);

    try {
      const adminData = await AdminModel.findOne(
        isEmail ? { email: emailOrUsername } : { username: emailOrUsername },
      );
      if (adminData) {
        if (adminData.isDeleted) {
          errors.emailOrUsername = `You cannot Login with this ${
            isEmail ? 'email' : 'username'
          }`;
          return res.status(401).json({ errors });
        }

        bcrypt.compare(password, adminData.password, (err, isMatch) => {
          if (err) {
            return console.error(err);
          }
          if (isMatch) {
            // user matched

            const JWTPayload = {
              id: adminData.id,
              role: 'admin',
            };
            // sign Token
            jwt.sign(
              JWTPayload,
              process.env.JWT_SECRET,
              {
                expiresIn: process.env.ADMIN_SESSION_EXPIRES_IN, // session active duration
              },
              (_err, token) => {
                if (!_err) {
                  res.json({
                    token: `Bearer ${token}`,
                  });
                } else {
                  console.error(_err);
                }
              },
            );
          } else {
            // password do not match
            errors.password = 'Password do not match';
            return res.status(401).json({ errors });
          }
          return false;
        });
      } else {
        // no user with such email
        errors.emailOrUsername = `No user with this ${
          isEmail ? 'email' : 'username'
        }`;
        return res.status(401).json({ errors });
      }
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

// @route:  GET api/admin/id/<userId>
// @desc:   get the details of one item
// @access: private
router.get('/id/:userId', auth, async (req, res) => {
  try {
    if (req.params.userId === undefined) return res.status(400).json({ message: 'Invalid params id' });
    const userId = ObjectId(req.params.userId);
    const item = await AdminModel.findById({
      _id: userId,
      isDeleted: false,
    });
    if (item) {
      return res.json({
        data: item,
      });
    }
    return res.status(404).json({ message: 'No such user exists' });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
});

// @route:  POST api/admin/current
// @desc:   get the details of currently logged in user
// @access: private
router.get('/current', auth, async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({
        message: 'You are unauthorized',
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

// @route:  POST api/admin/current
// @desc:   get the details of currently logged in user
// @access: private
router.get('/list', auth, isAdminAuth, async (req, res) => {
  try {
    const adminList = await AdminModel.find(
      {
        isDeleted: false,
      },
      '-__v -isDeleted -password',
    );
    res.json({
      data: adminList || [],
    });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  DELETE api/admin/many
// @desc:   Delete multiple user at once
// @access: private
router.post('/many', auth, isAdminAuth, (req, res) => {
  if (req.body.ids) {
    AdminModel.updateMany(
      { _id: { $in: req.body.ids }, isDeleted: false },
      { isDeleted: true },
      { new: true },
    )
      .then((data) => res.json({ message: `${data.n} admins deleted successfully.` }))
      .catch((error) => {
        console.error(error);
        return res.status(400).json({
          message: 'Unable to process.',
        });
      });
  } else res.status(404).json({ message: 'No IDs to delete' });
});

// @route:  DELETE api/admin/current
// @desc:   delete an admin [setting isDeleted to false]
// @access: private
router.delete('/:adminId', auth, isAdminAuth, async (req, res) => {
  let adminId;
  try {
    try {
      adminId = Mongoose.Types.ObjectId(req.params.adminId);
    } catch (error) {
      logger.error(error);
      console.error(error);
      return res.status(400).json({
        message: 'Invalid Object Id',
      });
    }
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      adminId,
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (updatedAdmin) {
      res.json({
        message: `Admin ${updatedAdmin.email} has been deleted.`,
      });
    } else {
      res.status(404).json({
        message: 'No such admin from such ID',
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

module.exports = router;
