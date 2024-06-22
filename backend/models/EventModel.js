const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    eventDate: {
        type: Date,
    },
    eventType: {
        type: String,
    },
    location: {
        type: String,
    },
    travelBy: {
        type: String,
    },
    eventStatus : {
        type : String,
        default : 'Yet to Start',
        required : true
    },
    isWedding : {
        type : Boolean,
        default : false
    },
    photographers: {
        type: String,
    },
    cinematographers: {
        type: String,
    },
    shootDirector : {
        type : String
    },
    allDataCompleted : {
        type : Boolean,
        default: false
    },
    drones: {
        type: String
    },
    choosenPhotographers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    choosenCinematographers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    assistants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    manager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    shootDirectors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    droneFlyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    sameDayPhotoMakers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    sameDayVideoMakers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    sameDayPhotoEditors: {
        type: String
    },
    sameDayVideoEditors: {
        type: String
    },
    tentative: {
        type: String
    },
});

const eventModel = new mongoose.model('Event', eventSchema);
module.exports = eventModel;
