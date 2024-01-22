const mongoose = require('mongoose');

const dummySchema = mongoose.Schema({
  events:[{
    dates: {
      type: String,
    },
    eventType: {
      type: String,
    },
    locationSelect: {
      type: String,
    },
    travelBySelect: {
      type: String,
    },
    photoGrapher: {
      type: String,
    },
    CinematographerSelect: {
      type: String,
    },
    droneSelect: {
      type: String,
    },
    sameVideoSelect:{
      type:String
    },
    sameDaySelect: {
      type: String,
    },
    tentative:{
      type:String
    },
    assistantName: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    managerName: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    droneFlyerName: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    cinematoGrapherName: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    photoGrapherName: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    shootDirectorName: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    photoEdit: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
    videoEdit: [{
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }],
  }],
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
    },
  clientId: {
      type: mongoose.Types.ObjectId,
      ref: 'Booking'
  },
});

const DummyModel = mongoose.model('clientEvent', dummySchema);
module.exports = DummyModel;