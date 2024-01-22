const mongoose=require('mongoose')
const checkListSchema=mongoose.Schema({
    id:{
        type:String
    },
    client:{
        BrideName:{
            type:String
        },
        GroomName:{
            type:String
        }
    },
    WhatsAppAccount:{
        type:String
    },
    LightSopSentDate:{
        type:String
    },
    QuesnrSentDate:{
        type:String
    },
    iternaryCollection:{
        type:String
    }
})


const CheckListModelSchema=mongoose.model('CheckList',checkListSchema)
module.exports=CheckListModelSchema