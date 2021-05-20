const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const LogSchema = Schema({
  action: String,
  of: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
  },
  to: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  ip: String,
  geo: {
    lat: String,
    lng: String,
  },
});
LogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('log', LogSchema);
