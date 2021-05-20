const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');

// Retail and Wholesale Vendor details
const RetailAndWholesaleSchema = Schema({
  vendorId: {
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
  phoneNumber: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  website: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
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
  gps: {
    latitude: Number, // latitude
    longitude: Number, // longitude
  }, // gps
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
RetailAndWholesaleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('retail-wholesale', RetailAndWholesaleSchema);
