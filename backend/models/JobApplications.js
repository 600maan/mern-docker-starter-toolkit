const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

// RSVP Product details
const JobsApplication = Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'job-portal',
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
  cv: {
    type: String,
    required: true,
  },
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
JobsApplication.plugin(mongoosePaginate);

module.exports = mongoose.model('jobs-application', JobsApplication);
