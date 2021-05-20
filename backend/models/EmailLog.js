const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');

const EmailLogSchema = Schema({
  email: [{
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
    },
  }],
  subject: {
    type: String,
    required: true,
    minlength: 4,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  createdDateTime: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

EmailLogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('email-sent', EmailLogSchema);
