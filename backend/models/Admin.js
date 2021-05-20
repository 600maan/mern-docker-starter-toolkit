/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');

const AdminSchema = Schema({
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
    required: true,
    minlength: 4,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
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
});

AdminSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (_err, hashed) => {
        user.password = hashed;
        return next();
      });
    });
  } else {
    return next();
  }
  return null;
});

AdminSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('admin-user', AdminSchema);
