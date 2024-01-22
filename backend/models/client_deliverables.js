const mongoose = require('mongoose');

const dummySchema = mongoose.Schema({
    albumArray: [{
        type: String,
    }],
    promoSelect: {
        type: String,
    },
    longFilmSelect: {
        type: String,
    },
    reelsSelect: {
        type: String,
    },
    harddriveSelect: {
        type: String,
    },
    deliverablesCheck: [{
        type: String,
    }],
    clientSuggestions: {
        type: String,
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    clientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Booking'
    },
});

const DummyModel = mongoose.model('Deliverbales', dummySchema);
module.exports = DummyModel;