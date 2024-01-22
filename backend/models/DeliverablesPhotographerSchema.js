const mongoose = require('mongoose');

const photographerSchema=mongoose.Schema({
  userID:{
      type: mongoose.Types.ObjectId,
      ref: 'user'
  },
  deliverableId:{
      type: mongoose.Types.ObjectId,
      ref: 'Deliverbales'
  },
  eventId:{
    type: mongoose.Types.ObjectId,
    ref: 'Event'
},
ClientId:{
      type: mongoose.Types.ObjectId,
      ref: 'Booking'
  },
  EditorId:{
      type: mongoose.Types.ObjectId,
      ref: 'user'
  },
  Editor:{
    type:String
    },
  WeddingDate:{
      type:String
  }, 
  companyDate:{
      type:String
  },
  ClientDate:{
      type:String
  },
  Status:{
      type:String
  },
  ClientRevision:{
      type:String
  }
})

const photoGrapherModel = mongoose.model('PhotoGrapherDeliverable',  photographerSchema);

module.exports = photoGrapherModel;
