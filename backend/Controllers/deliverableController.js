const DeliverableModel = require('../models/DeliverableModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');
const DeliverableOptionsSchema = require('../models/DeliverableOptionsSchema');

const getCinematography = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        const cinematographyDeliverables = await DeliverableModel.find({ deliverableName: { $in: ['Long Film', 'Reel', 'Promo'] } }).skip(skip).limit(10).populate('client editor');

        const cinematographyDeliverablesWithEvents = []
        for (let index = 0; index < cinematographyDeliverables.length; index++) {
            const events = await eventModel.find({client : cinematographyDeliverables[index].client.toObject(), isWedding: true})
            let dummyObj = {...cinematographyDeliverables[index].toObject()}
            dummyObj["client"]["eventDate"] = events[0]?.eventDate
            dummyObj["client"]["isWedding"] = events[0]?.isWedding
            cinematographyDeliverablesWithEvents.push(dummyObj)
        }

    res.status(200).json(cinematographyDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
    }
}
const getAlbums = async (req, res) => {
    try {
        const allDocument = await DeliverableOptionsSchema.find({},{"albums":1});
        let albumValues = []

        for (let index = 0; index < allDocument[0].albums.values.length; index++) {
            albumValues.push(allDocument[0].albums.values[index]["value"])
        }

        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        const albumsDeliverables = await DeliverableModel.find({ deliverableName:  { $in: albumValues } }).skip(skip).limit(10).populate('client editor');
        
        const albumDeliverablesWithEvents = []
        for (let index = 0; index < albumsDeliverables.length; index++) {
            const events = await eventModel.find({client : albumsDeliverables[index].client.toObject(), isWedding: true})
            let dummyObj = {...albumsDeliverables[index].toObject()}
            dummyObj["client"]["eventDate"] = events[0]?.eventDate
            dummyObj["client"]["isWedding"] = events[0]?.isWedding
            albumDeliverablesWithEvents.push(dummyObj)
        }

        res.status(200).json(albumDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
    }
}
const getPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        const photosDeliverables = await DeliverableModel.find({ deliverableName: 'Photos' }).skip(skip).limit(10).populate('client editor');
        
        const photosDeliverablesWithEvents = []
        for (let index = 0; index < photosDeliverables.length; index++) {
            const events = await eventModel.find({client : photosDeliverables[index].client.toObject(), isWedding: true})
            let dummyObj = {...photosDeliverables[index].toObject()}
            dummyObj["client"]["eventDate"] = events[0]?.eventDate
            dummyObj["client"]["isWedding"] = events[0]?.isWedding
            photosDeliverablesWithEvents.push(dummyObj)
        }

        res.status(200).json(photosDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
    }
}
const getPreWeds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        const preWedDeliverables = await DeliverableModel.find({ deliverableName:  { $in: ['Pre-Wedding Photos', 'Pre-Wedding Videos'] } }).skip(skip).limit(10).populate('client editor');
        
        const preWedDeliverablesWithEvents = []
        for (let index = 0; index < preWedDeliverables.length; index++) {
            const events = await eventModel.find({client : preWedDeliverables[index].client.toObject(), isWedding: true})
            let dummyObj = {...preWedDeliverables[index].toObject()}
            dummyObj["client"]["eventDate"] = events[0]?.eventDate
            dummyObj["client"]["isWedding"] = events[0]?.isWedding
            preWedDeliverablesWithEvents.push(dummyObj)
        }

        res.status(200).json(preWedDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
    }
}
const updateDeliverable = async (req, res) => {
    try {
        await DeliverableModel.findByIdAndUpdate(req.body.deliverable._id, { ...req.body.deliverable, client: req.body.deliverable.client._id, editor: req.body.deliverable.editor?._id }).then(() => {
            res.status(200).json('Deliverable Updated Successfully!')
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = { getCinematography, getAlbums, getPhotos, getPreWeds, updateDeliverable }