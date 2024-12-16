const mongoose=require('mongoose')

const WhatsappTextSchema=mongoose.Schema({
    albumTextGetImmutable:{
        type:String,
    },
    cinematographyTextGetImmutable:{
        type:String,
    }
})
const WhatsappTextModel=mongoose.model("Whatsapp Text",WhatsappTextSchema)
module.exports = WhatsappTextModel;