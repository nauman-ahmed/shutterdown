const mongoose = require('mongoose');

const calenderListViewSchema = mongoose.Schema({
  eventId: {
    type: String,
  },
  shootDirectorName: [{
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }],
  photoGrapherName: [{
   type: mongoose.Types.ObjectId,
    ref: 'user'
  }],
  cinematoGrapherName: [{
   type: mongoose.Types.ObjectId,
    ref: 'user'
  }],
  droneFlyerName: [{
   type: mongoose.Types.ObjectId,
    ref: 'user'
  }],
  managerName: [{
   type: mongoose.Types.ObjectId,
    ref: 'user'
  }],
  assistantName: [{
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
});

const CalenderListViewModel = mongoose.model('calenderListView', calenderListViewSchema);
module.exports = CalenderListViewModel;