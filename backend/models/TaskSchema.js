const mongoose = require('mongoose')
const taskSchema = mongoose.Schema({
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'Client'
    },
    deadlineDate: {
        type: Date
    },
    assignDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    ended: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date
    },
    assignTo: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    assignBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    taskName: {
        type: String
    }
})


const taskModel = mongoose.model("Task", taskSchema)
module.exports = taskModel