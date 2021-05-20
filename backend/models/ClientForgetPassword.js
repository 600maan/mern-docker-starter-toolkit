const mongoose = require('mongoose');

const { Schema } = mongoose;

const ForgetSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'client-user',
  },
  pin: {
    type: String,
    minlength: 5,
  },
  isPinVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
  },
  createdDateTime: {
    type: Date,
    default: Date.now,
  },
  validateWithin: {
    type: Number,
    default: 7200,
  }, // 7200 seconds= 2hours
});

module.exports = mongoose.model('client-user-forget-password', ForgetSchema);
