const mongoose=require('mongoose')

const ShooterEditorData=mongoose.Schema({
    Shooter:{
        type:String
    },
    Editor:{
        type:String
    },
    CheckIncurrentTime:{
        type:String
    },
    CheckIncurrentDate:{
        type:String
    },
    CheckOutCurrentTime:{
        type:String
    },
    CheckOutCurrentDate:{
        type:String
    },
    UserID:{

        type:String
    }
})

const shooterEditorModel=mongoose.model("ShooterEditorAttendence",ShooterEditorData)
module.exports=shooterEditorModel