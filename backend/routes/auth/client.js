/* eslint-disable camelcase */
/* eslint-disable no-bitwise */
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const passport = require('passport');
const validator = require('validator');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const auth = passport.authenticate('jwt', { session: false });
const { check } = require('express-validator');
const Mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const validationResult = require('../../middlewares/parseValidation');
const isAdminAuth = require('../../middlewares/isAdmin');
const ClientModel = require('../../models/Client');
const ClientForgetPassword = require('../../models/ClientForgetPassword');
const getForgetPasswordBodyTemplate = require('../../services/templates/getForgetPasswordBodyTemplate');
const mailSender = require('../../services/mailer');
const {
  ACCOUNT_TYPE_GOOGLE,
  ACCOUNT_TYPE_FACEBOOK,
  ACCOUNT_TYPE_DEFAULT,
} = require('../../config/key');
const userRegistrationBodyTemplate = require('../../services/templates/userRegistrationBodyTemplate');
const { getClientToken } = require('../../middlewares/getToken');
const getForgetUsernameBodyTemplate = require('../../services/templates/getForgetUsernameBodyTemplate');
const logger = require('../../middlewares/logging');

const sendConfirmEmail = async (user) => {
  if (!user) return false;
  // sign Token
  const JWTPayload = {
    id: user._id,
    emailVerifyToken: true,
  };
  try {
    const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.CLIENT_SESSION_EXPIRES_IN,
    });
    if (token) {
      mailSender({
        to: user.email,
        subject: userRegistrationBodyTemplate.subject(),
        html: userRegistrationBodyTemplate.html(token),
        text: userRegistrationBodyTemplate.text(token),
      });
      return true;
    }
  } catch (error) {
    logger.error(error);
    return false;
  }

  return false;
};

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
    check('username', 'Username is required').not().isEmpty(),
  ],
  validationResult,
  async (req, res) => {
    // check validation
    const errors = {};
    try {
      const existingEmailUser = await ClientModel.findOne({
        email: req.body.email.toLowerCase(),
      });
      if (existingEmailUser) {
        if (existingEmailUser.isDeleted) {
          errors.message = 'You cannot registered with this email. Your account has been freezed.';
          return res.status(406).json(errors);
        }
        errors.email = 'Email already exists';
        return res.status(406).json(errors);
      }
      const existingUsernameUser = await ClientModel.findOne({
        username: req.body.username.toLowerCase(),
      });
      if (existingUsernameUser) {
        if (existingUsernameUser.isDeleted) {
          errors.message = 'You cannot registered with this username. Your account has been freezed.';
          return res.status(406).json(errors);
        }
        errors.email = 'Username already exists';
        return res.status(406).json(errors);
      }
      const modelBody = _.pick(req.body, ['password', 'name']);

      modelBody.username = req.body.username.toLowerCase();
      modelBody.email = req.body.email.toLowerCase();
      const modelDoc = new ClientModel(modelBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        // sign Token
        const token = getClientToken(savedData);
        if (token) {
          res.json({
            success: true,
            message: 'Successfully created account',
            token: `Bearer ${token}`,
          });
          return sendConfirmEmail(savedData);
        }
        return res.status(400).json({ message: 'Fails to create Token' });
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
    let { emailOrUsername } = req.body;
    const { password } = req.body;

    const isEmail = validator.isEmail(emailOrUsername);
    emailOrUsername = emailOrUsername.toLowerCase();
    try {
      const clientData = await ClientModel.findOne(
        isEmail ? { email: emailOrUsername } : { username: emailOrUsername },
      );
      if (clientData) {
        if (clientData.isDeleted) {
          errors.emailOrUsername = `You cannot Login with this ${
            isEmail ? 'email' : 'username'
          }`;
          return res.status(401).json({
            ...errors,
            message: 'Sorry! Your account has been permanently deleted.',
          });
        }
        if (!clientData.activeStatus) {
          errors.emailOrUsername = 'Sorry! Your account has been frozen.';
          return res.status(401).json({
            ...errors,
            message: 'Sorry! Your account has been frozen.',
          });
        }
        bcrypt.compare(password, clientData.password, (err, isMatch) => {
          if (err) {
            return console.error(err);
          }
          if (isMatch) {
            // sign Token
            const token = getClientToken(clientData);
            if (token) {
              return res.json({
                token: `Bearer ${token}`,
              });
            }
            return res.status(400).json({ message: 'Fails to create Token' });
          }
          // password do not match
          errors.password = 'Password do not match';
          return res.status(401).json(errors);
        });
      } else {
        // no user with such email
        errors.emailOrUsername = `No user with this ${
          isEmail ? 'email' : 'username'
        }`;
        return res.status(401).json(errors);
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

// @route:  POST api/admin/current
// @desc:   get the details of currently logged in user
// @access: private
router.get('/current', auth, async (req, res) => {
  try {
    if (req.user) {
      res.json({ data: req.user });
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
router.get('/resend-email-confirmation-link', auth, async (req, res) => {
  try {
    if (req.user) {
      const result = sendConfirmEmail(req.user);
      if (!result) {
        return res.status(400).json({
          message: 'Problem occurs while creating a confirmation link.',
        });
      }
      return res.json({
        message: 'Confirmation link has been sent to your email.',
      });
    }
    res.status(401).json({
      message: 'You are unauthorized',
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

// @route:  POST api/admin/current
// @desc:   get the details of currently logged in user
// @access: private
router.get('/verify-email-from-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    req.user = { isLoggedIn: false };
    if (!token) {
      return res.status(400).json({
        message: 'Invalid Confirmation Link.',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid Confirmation Link!',
        });
      }

      if (user.emailVerifyToken) {
        // token is valid
        const updatedData = await ClientModel.findById(user.id);
        if (!updatedData) {
          return res.status(401).json({
            message: 'Sorry! We could not find your account.',
          });
        }
        if (updatedData.isDeleted) {
          return res.status(401).json({
            message: 'Sorry! Your account has been permanently deleted.',
          });
        }
        if (!updatedData.activeStatus) {
          return res.status(401).json({
            message: 'Sorry! Your account has been frozen.',
          });
        }
        if (updatedData.isVerified) {
          return res.json({
            message: 'Your account is already confirmed!',
          });
        }
        updatedData.isVerified = true;
        const savedData = await updatedData.save();
        if (savedData) {
          // generate token and send to the user,
          // sign Token
          const refreshToken = getClientToken(savedData);
          if (refreshToken) {
            return res.json({
              token: `Bearer ${refreshToken}`,
              message: 'Great, Your email has been confirmed!',
            });
          }
          return res.status(400).json({
            message: 'Error on generating token.',
          });
        }
        return res.status(400).json({
          success: true,
          message: 'We cannot verify you now! Please try again later.',
        });
      }
      return res.status(400).json({
        message: 'Please use the authentic comfirmation link from your email',
      });
    });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
      message: 'Unable to process.',
    });
  }
  return false;
});

// @route:  POST api/admin/list
// @desc:   get list of the client
// @access: private
router.get('/list', auth, isAdminAuth, async (req, res) => {
  try {
    const adminList = await ClientModel.find(
      {
        isDeleted: false,
      },
      '-password',
    );
    res.json({
      data: adminList || [],
    });
  } catch (error) {
    logger.error(error);
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
    ClientModel.updateMany(
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
    const updatedAdmin = await ClientModel.findByIdAndUpdate(
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

// @route:  PUT api/client/toggle/<clientId>/<toggleStatus>
// @desc:   Toggle active status of travel and tour item
// @access: private
router.put(
  '/toggle/:clientId/:toggleStatus',
  auth,
  isAdminAuth,
  async (req, res) => {
    const toggleStatus = req.params.toggleStatus || 'on';
    const clientId = Mongoose.Types.ObjectId(req.params.clientId);

    try {
      if (clientId) {
        const updatedData = await ClientModel.findByIdAndUpdate(
          clientId,
          { activeStatus: toggleStatus.toLowerCase() === 'on' },
          { new: true },
        );
        if (updatedData) {
          res.json({
            message: `Active status of client: ${updatedData.name} has been turned ${toggleStatus}`,
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

const generatePIN = () => randomstring.generate({
  length: 5,
  charset: 'numeric',
});

function mungeEmailAddress(email) {
  const i = email.indexOf('@');
  const startIndex = (i * 0.2) | 0;
  const endIndex = (i * 0.9) | 0;
  return (
    email.slice(0, startIndex) + email.slice(startIndex, endIndex).replace(/./g, '*') + email.slice(endIndex)
  );
}

// @route:  POST api/users/forget-username
// @desc:   get the details of currently logged in user
// @access: private
router.get('/forget-username/:email', async (req, res) => {
  /*
enable 2 steps verification in gmail account for the "FROM GMAIL".
GOTO https://myaccount.google.com/u/1/apppasswords and setup mail and windows computer and copy password and set it here
GOTO https://myaccount.google.com/u/1/lesssecureapps?authuser=1&pageId=none and enable less secure apps  and captcha
*/
  const { email } = req.params;
  const clientData = await ClientModel.findOne({ email });
  if (!clientData) {
    return res.status(404).json({
      message: 'No user found with this email',
    });
  }
  if (clientData.isDeleted) {
    return res.status(401).json({
      message: 'Sorry! Your account has been permanently deleted.',
    });
  }
  if (!clientData.activeStatus) {
    return res.status(401).json({
      message: 'Sorry! Your account has been Freezed.',
    });
  }
  res.json({
    message: 'Your username has been sent to your email.',
  });
  // send mail to the user
  await mailSender({
    to: clientData.email,
    subject: getForgetUsernameBodyTemplate.subject(),
    html: getForgetUsernameBodyTemplate.html(
      clientData.name,
      clientData.username,
    ),
    text: getForgetUsernameBodyTemplate.text(
      clientData.name,
      clientData.username,
    ),
  });
  return 0;
});

// @route:  POST api/users/change-password
// @desc:   get the details of currently logged in user
// @access: private
// @pre: client needs to send Authorization: token as header
router.post('/reset-password', auth, async (req, res) => {
  // if token was invalid, user will get 401,
  // if token is valid, control goes down
  const { password } = req.body;
  if (password && password.length > 3) {
    const user = await ClientModel.findById(req.user._id);
    user.password = password;
    await user.save();
    return res.json({
      message: 'Password Changed Successfully',
    });
  }
  return res.status(400).json({
    message: 'Please input strong password',
  });
});

// @route:  POST api/users/current
// @desc:   get the details of currently logged in user
// @access: private
router.get('/validate-pin/:emailOrUsername/:pin', async (req, res) => {
  const { emailOrUsername } = req.params;
  const isEmail = validator.isEmail(emailOrUsername);
  const filter = isEmail
    ? { email: emailOrUsername }
    : { username: emailOrUsername };
  filter.isDeleted = false;
  filter.activeStatus = true;

  const user = await ClientModel.findOne(filter, '_id');
  if (!user) {
    return res.status(404).json({
      message: `No user found with this ${isEmail ? 'email' : 'username'}`,
    });
  }
  const lastPinDoc = await ClientForgetPassword.findOne(
    { user: user._id },
    '-__v',
    {
      sort: { createdDateTime: -1 },
    },
  );

  if (lastPinDoc && lastPinDoc.pin === req.params.pin) {
    // check if pin still valid to use
    const createdDateTime = lastPinDoc.createdDateTime.getTime() / 1000;
    const currentTime = Date.now() / 1000;
    const expiredAt = createdDateTime + lastPinDoc.validateWithin;
    if (expiredAt < currentTime) {
      return res.status(400).json({
        message: 'Your PIN has been expired. PIN is valid for 2 hours only.',
      });
    }
    lastPinDoc.isPinVerified = true;
    lastPinDoc.verifiedAt = Date.now();
    await lastPinDoc.save();
    // sign Token
    const token = getClientToken(user);
    if (token) {
      return res.json({
        token,
        message: 'PIN has been confirmed!',
      });
    }
    return res.status(400).json({
      message: 'Error on generating token.',
    });
  }
  return res.status(400).json({
    message: 'PIN is incorrect.',
  });
});

// @route:  POST api/users/current
// @desc:   get the details of currently logged in user
// @access: private
router.get('/forget-password/:emailOrUsername', async (req, res) => {
  /*
enable 2 steps verification in gmail account for the "FROM GMAIL".
GOTO https://myaccount.google.com/u/1/apppasswords and setup mail and windows computer and copy password and set it here
GOTO https://myaccount.google.com/u/1/lesssecureapps?authuser=1&pageId=none and enable less secure apps  and captcha
*/
  const { emailOrUsername } = req.params;
  const isEmail = validator.isEmail(emailOrUsername);
  const filter = isEmail
    ? { email: emailOrUsername }
    : { username: emailOrUsername };
  filter.isDeleted = false;
  filter.activeStatus = true;
  const user = await ClientModel.findOne(filter);
  if (!user) {
    return res.status(404).json({
      message: `No user found with this ${isEmail ? 'email' : 'username'}`,
    });
  }
  const newBody = ClientForgetPassword({
    user: user._id,
    pin: generatePIN(),
  });
  const savedBody = await newBody.save();
  if (!savedBody) {
    return res.status(400).json({
      message: 'Cannot complete this operation. Please try again later',
    });
  }
  const { email } = user;
  const message = `5 Digit PIN has been sent to your mail: ${
    isEmail ? email : mungeEmailAddress(email)
  }.`;
  res.json({
    message,
    account: emailOrUsername,
  });

  // send mail to the user
  await mailSender({
    to: email,
    subject: getForgetPasswordBodyTemplate.subject(savedBody.pin),
    html: getForgetPasswordBodyTemplate.html(savedBody.pin),
    text: getForgetPasswordBodyTemplate.text(savedBody.pin),
  });
  return 0;
});

router.post('/google-login', async (req, res) => {
  const { tokenId } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  if (payload) {
    const { email_verified, email, name } = payload;
    if (email_verified) {
      const existingEmailUser = await ClientModel.findOne({
        email,
      });

      if (existingEmailUser) {
        if (existingEmailUser.accountType === ACCOUNT_TYPE_DEFAULT) {
          return res.status(400).send({
            message: 'Your email is registered through password.',
          });
        }
        if (existingEmailUser.accountType !== ACCOUNT_TYPE_GOOGLE) {
          return res.status(400).send({
            message: 'This account is not registered via Google Login',
          });
        }
        if (existingEmailUser.isDeleted) {
          return res.status(400).send({
            message: 'Your account has been permanently deleted.',
          });
        }
        if (!existingEmailUser.activeStatus) {
          return res.status(400).send({
            message: 'Your account has been temporarily deactivated.',
          });
        }
        // sign Token
        const token = getClientToken(existingEmailUser);
        if (token) {
          return res.json({
            token: `Bearer ${token}`,
            message: 'You are login to RSVPHK',
          });
        }
        return res.status(400).json({
          message: 'Error on generating token.',
        });
      }
      // register the user here
      const modelBody = {
        email,
        name,
        isVerified: true,
      };
      modelBody.accountType = ACCOUNT_TYPE_GOOGLE;
      const modelDoc = new ClientModel(modelBody);
      const savedData = await modelDoc.save();
      if (savedData && savedData._id) {
        // sign Token
        const token = getClientToken(savedData);
        if (token) {
          return res.json({
            token: `Bearer ${token}`,
            message: 'You are registered to RSVPHK',
          });
        }
        return res.status(400).json({
          message: 'Error on generating token.',
        });
      }
      return res
        .status(400)
        .json({ message: 'Sorry! Not able to save your record!' });
    }
    // email not verified, throws an error
    return res.status(400).send({
      message: 'We do not accept unverified email! Try with other accounts',
    });
  }
  return 0;
});

router.post('/facebook-login', async (req, res) => {
  const { accessToken, userId } = req.body;
  const fbVerifyURL = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(fbVerifyURL, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then(async (payload) => {
      if (payload) {
        const { email, name } = payload;
        if (email) {
          const existingEmailUser = await ClientModel.findOne({
            email,
          });

          if (existingEmailUser) {
            if (existingEmailUser.accountType === ACCOUNT_TYPE_DEFAULT) {
              return res.status(400).send({
                message: 'Your email is registered through password.',
              });
            }
            if (existingEmailUser.accountType !== ACCOUNT_TYPE_FACEBOOK) {
              return res.status(400).send({
                message: 'This account is not registered via Facebook Login',
              });
            }
            if (existingEmailUser.isDeleted) {
              return res.status(400).send({
                message: 'Your account has been permanently deleted.',
              });
            }
            if (!existingEmailUser.activeStatus) {
              return res.status(400).send({
                message: 'Your account has been temporarily deactivated.',
              });
            }
            // sign Token
            const token = getClientToken(existingEmailUser);
            if (token) {
              res.json({
                token: `Bearer ${token}`,
                message: 'You are login to RSVPHK',
              });
            }
            return res.status(400).json({
              message: 'Error on generating token.',
            });
          }
          // register the user here
          const modelBody = {
            email,
            name,
            isVerified: true,
          };
          modelBody.accountType = ACCOUNT_TYPE_FACEBOOK;
          const modelDoc = new ClientModel(modelBody);
          const savedData = await modelDoc.save();
          if (savedData && savedData._id) {
            // sign Token
            const token = getClientToken(savedData);
            if (token) {
              res.json({
                token: `Bearer ${token}`,
                message: 'You are registered to RSVPHK',
              });
            }
            return res.status(400).json({
              message: 'Error on generating token.',
            });
          }
          return res
            .status(400)
            .json({ message: 'Sorry! Not able to save your record!' });
        }
        // email not verified, throws an error
        return res.status(400).send({
          message: 'We do not accept unverified email! Try with other accounts',
        });
      }
      return 0;
    });

  return 0;
});

module.exports = router;
