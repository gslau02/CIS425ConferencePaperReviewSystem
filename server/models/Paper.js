const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  conferenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
    required: true,
  },
  mainAuthorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coAuthorIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  paperFile: {
    type: String,
    required: true,
  },
  publicationStatus: {
    type: String,
    enum: ['Publish', 'Do not publish', 'Pending'],
    default: 'Pending',
  },
  reviews: [
    {
      reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      recommendation: {
        type: String,
        enum: ['Accept', 'Reject', 'Neutral', 'Pending'],
        default: 'Pending'
      },
    },
  ],
});

const Paper = mongoose.model('Paper', paperSchema, 'papers');

module.exports = Paper;
