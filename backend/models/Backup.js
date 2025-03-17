const mongoose = require('mongoose')

const BackupSchema = mongoose.Schema({
    fileId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    fileName: {
        type: String 
    },
})
const BackupModel = mongoose.model("Backup", BackupSchema)
module.exports = BackupModel;