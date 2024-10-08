const mongoose = require('mongoose');

const deliverableSchema = mongoose.Schema({
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    deliverableName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    quantity: {
        type: Number
    },
    firstDeliveryDate: {
        type: Date
    },
    finalDeliveryDate: {
        type: Date
    },
    clientDeadline: {
        type: Date
    },
    companyDeadline: {
        type: Date
    },
    editor: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        default: 'Yet to Start',
        required: true
    },
    clientRevision: {
        type: Number
    },
    clientRating: {
        type: Number
    },
})

const deliverableModel = new mongoose.model('Deliverable', deliverableSchema);
module.exports = deliverableModel