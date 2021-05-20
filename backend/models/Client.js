const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');
const { ACCOUNT_TYPE_DEFAULT } = require('../config/key');
const logger = require('../middlewares/logging');

const ClientSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    minlength: 3,
  },
  username: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },

  joinDate: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
  accountType: {
    type: String,
    default: ACCOUNT_TYPE_DEFAULT,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// eslint-disable-next-line func-names
ClientSchema.pre('save', function (next) {
  try {
    const user = this;
    if (user.isModified('password')) {
      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(user.password, salt, (__err, hashed) => {
          user.password = hashed;
          next();
        });
      });
    } else {
      next();
    }
  } catch (error) {
    logger.error(error);
    console.error('error', error);
  }
});

ClientSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('client-user', ClientSchema);
