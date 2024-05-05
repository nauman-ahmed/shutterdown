const mongoose=require('mongoose')

const AttendenceSchema=mongoose.Schema({
    userID:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    checkInTime:{
        type:String,
        default:"Not Marked"
    },
    checkOutTime:{
        type:String,
        default:"Not Marked"
    },
    currentDate:{
        type:String,
    },
    fromHome:{
        type:Boolean,
        default:false
    }
})
const AttendenceModel=mongoose.model("Attendence",AttendenceSchema)
module.exports = AttendenceModel;