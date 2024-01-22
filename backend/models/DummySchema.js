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
  }],

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
  sameDaySelect: {
    type: String,
  },
  albumSelect: {
    type: String,
  },
  albumArray: Array,

  promoSelect: {
    type: String,
  },
  longFilmSelect: {
    type: String,
  },
  reelsSelect: {
    type: String,
  },
  harddriveSelect: {
    type: String,
  },
  tentative:{
    type:String
  },
  eventType: {
    type: String,
  },
  radioDeliverables: {
    type: String,
  },
  checkboxValues:Array,
  //   radioDeliverables: {
  //     type: String,
  //   },
  clientSuggestions: {
    type: String,
  },
  dates: {
    type: String,
  },
  id: {
    type: String,
  },
  sameVideoSelect:{
    type:String
  },
  status:{
    type:String
  },
  
  droneFlyerName: Array,
  photoGrapherName: Array,
  cinematoGrapherName: Array,
  shootDirectorName: Array,
  managerName: Array, 
  assistantName: Array, 
});

const DummyModel = mongoose.model('Dummy', dummySchema);
module.exports = DummyModel;