const mongoose = require('mongoose');

const preWeddingShootSchema=mongoose.Schema({
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
    shootDate:{
        type: Date,
    },
    Status:{
        type:String
    }
})

const PreWeddingShootModel=mongoose.model("PreWeddingShoot",preWeddingShootSchema)

module.exports=PreWeddingShootModel
