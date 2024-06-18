const userModel = require('../models/userSchema')
const WhatsappSchema = require('../models/Whatsapp')

const addWhatsappText = async (req, res) => {
    try {
        await WhatsappSchema.findByIdAndUpdate(req.body.data._id,req.body.data)
        res.status(200).json({ message: 'Data has been saved' })
    } catch (error) {
        res.status(400).json({ message: 'Something went wrong' })
        console.log(error);
    }
}

const getAllText = async (req, res) => {
    try {
        const text = await WhatsappSchema.find({ })
        res.status(200).json({ message: 'Retrived', data: text })
    } catch (error) {
        console.log(error);
    }
}




module.exports = { addWhatsappText, getAllText } 