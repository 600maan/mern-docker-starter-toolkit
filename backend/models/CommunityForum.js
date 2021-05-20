const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');

const { Schema } = mongoose;

// Community Forum details
const CommunityForumSchema = Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },
  threadQuestion: {
    type: String,
    required: true,
    minLength: 4,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'client-user',
  },
  adminUserId: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
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
CommunityForumSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('community-forum', CommunityForumSchema);
