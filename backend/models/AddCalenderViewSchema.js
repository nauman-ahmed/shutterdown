const mongoose = require('mongoose');

const CalenderData = mongoose.Schema({

    userID: {
      type: String,
    },
    eventsId: {
      type: String,
    },
    client: {
      BrideName: {
        type: String,
      },
      GroomName: {
        type: String,
      },
    },
    // Deliverable: {
    //   type: String,
    // },
    Editor: {
      type: String,
    },
    WeddingDate: {
      type: String,
    },
    companyDate: {
      type: String,
    },
    ClientDate: {
      type: String,
    },
    Status: {
      type: String,
    },

    ClientRevision: {
      type: String,
    },
    commonId:{
      type:String
    }
  
 
});

const ClientModel = mongoose.model('AssignTeam', CalenderData);

module.exports = ClientModel;
