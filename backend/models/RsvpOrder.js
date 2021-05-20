const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

// RSVP Product details
const RsvpOrderSchema = Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'rsvp-product',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'client-user',
  },
  contact: {
    type: String,
    trim: true,
  },
  message: String,
  createdDateTime: {
    type: Date,
    default: Date.now,
  },
  updatedDateTime: Date,
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
RsvpOrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('rsvp-order', RsvpOrderSchema);
