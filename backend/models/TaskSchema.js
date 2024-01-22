const mongoose=require('mongoose')
const taskSchema=mongoose.Schema({
    ClientId:{
        type: mongoose.Types.ObjectId,
        ref: 'Booking'
    },
    eventId:{
        type: mongoose.Types.ObjectId,
        ref: 'Event'
    },
    companyDate:{
        type:String
    },
    completionDate:{
        type:String
    },
    assignTo:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    assignBy:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    taskName:{
        type:String
    }
})


const taskModel=mongoose.model("task",taskSchema)
module.exports=taskModel