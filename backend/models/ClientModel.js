const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
  brideName: {
    type: String,
    required: true
  },
  albums: [{
    type: String
  }],
  groomName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  deliverables: {
    type: Object
  },
  promos: {
    type: String
  },
  longFilms: {
    type: Number
  },
  reels: {
    type: Number
  },
  hardDrives: {
    type: Number
  },
  email: {
    type: String,
  },
  bookingConfirmed: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  suggestion: {
    type: String,
  },
  preWeddingDetails: {
    type: Object,
  },
  checklistDetails: {
    type: Object
  },
  cinematography: {
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    weddingDate: {
      type: Date
    },
    companyDeadline: {
      type: Date
    },
    status: {
      type: String
    },
    clientRevision: {
      type: Number
    }
  },
  photosDeliverables: {
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    weddingDate: {
      type: Date
    },
    companyDeadline: {
      type: Date
    },
    status: {
      type: String
    },
    clientRevision: {
      type: Number
    }
  },
  albumsDeliverables: {
    editor : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'user'
    },
    
    status : {
      type : String
    },
    
  },
  events: [{
    type: mongoose.Types.ObjectId,
    ref: 'Event'
  }],
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
});

const ClientModel = mongoose.model('Client', ClientSchema);
module.exports = ClientModel;
