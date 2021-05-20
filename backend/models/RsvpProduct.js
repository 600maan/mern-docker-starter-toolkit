const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

// RSVP Product details
const RsvpProductSchema = Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  category: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  shortDescription: {
    type: String,
    minlength: 10,
    maxlength: 200,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  rank: {
    type: Number,
    default: 0,
  },
  photos: [String],
  activePhoto: String,
  keywords: [String],
  createdDateTime: {
    type: Date,
    default: Date.now,
  },
  updatedDateTime: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
  },
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
RsvpProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('rsvp-product', RsvpProductSchema);
