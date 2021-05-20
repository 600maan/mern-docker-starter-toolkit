const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

// RSVP Product details
const ContactsSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  subject: String,
  message: String,
  contact: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
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
ContactsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('contact-message', ContactsSchema);
