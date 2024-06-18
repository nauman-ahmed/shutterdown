const mongoose = require('mongoose');

const eventOptionsSchema = mongoose.Schema({
    travelBy: {
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
    shootDirector: {
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
    sameDayPhotoEditors: {
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
    sameDayVideoEditors: {
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

const eventOptionsModel = new mongoose.model('Event Options', eventOptionsSchema);
module.exports = eventOptionsModel;
