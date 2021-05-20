const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

// Thread answer details
const ThreadAnswerSchema = Schema({
  answerId: {
    type: String,
    required: true,
    unique: true,
  },
  threadId: {
    type: Schema.Types.ObjectId,
    ref: 'community-forum',
  },
  threadAnswer: {
    type: String,
    required: true,
    min: 2,
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
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'admin-user',
  },
  updatedDateTime: Date,
  activeStatus: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
ThreadAnswerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('thread-answer', ThreadAnswerSchema);
