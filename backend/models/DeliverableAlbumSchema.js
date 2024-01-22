const mongoose = require('mongoose');

const albumSchema=mongoose.Schema({
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
    Album:{
        type:String
    },
    EditorId:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    Editor:{
        type:String
    },
    Status:{
        type:String
    },
    Reminder:{
        type:String,
        default: "No"
    },
})

const DeliverableModel=mongoose.model("DeliverableAlbum",albumSchema)

module.exports=DeliverableModel
