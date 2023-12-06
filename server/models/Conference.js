const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    submissionDeadline: {
        type: Date,
    },
    programChairId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    reviewDeadline: {
        type: Date,
    },
});

const Conference = mongoose.model('Conference', conferenceSchema, 'conferences');

module.exports = Conference;
