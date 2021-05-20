const mongoose = require('mongoose');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');

const { Schema } = mongoose;

// Food and Beverage Vendor details
const FoodAndBeverageSchema = Schema({
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
  description: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
    minlength: 10,
    trim: true,
  },
  rank: {
    type: Number,
    default: 0,
  },
  photos: [String],
  activePhoto: String,
  keywords: [String],
  gps: {
    latitude: Number, // latitude
    longitude: Number, // longitude
  }, // gps
  menuImage: [String],
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
FoodAndBeverageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('food-beverage', FoodAndBeverageSchema);
