const mongoose = require('mongoose');

const deliverableOptionsSchema = mongoose.Schema({
    albums: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    assistants: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    photographers: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    cinematographers: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    drones: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    promos: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    longFilms: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    reels: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    },
    hardDrives: {
        label: {
            type: String
        },
        values:[{
            label: {
                type: String
            },
            value:{
                type: String
            }
        }]
    }
});

const deliverableOptionsModel = new mongoose.model('Deliverable Options', deliverableOptionsSchema);
module.exports = deliverableOptionsModel;
