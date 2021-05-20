const mongoose = require('mongoose');

const { Schema } = mongoose;
// const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate');

// Jobs details
const JobPortalSchema = Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  advertiserEmail: {
    type: String,
  },
  category: {
    type: String,
    trim: true,
  },
  workTime: String, // example: part time, full time etc
  applicationDeadline: Date,
  salary: Number,
  expiryDate: Date,
  rank: {
    type: Number,
    default: 0,
  },
  logoImage: String,
  keywords: [String],
  workingLocation: String,
  experienceYears: Number,
  benefits: String,
  jobDescriptions: [String],
  status: String, // future extension
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
JobPortalSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('job-portal', JobPortalSchema);
