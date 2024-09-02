const DeliverableModel = require('../models/DeliverableModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');

const getCinematography = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        console.log(page);
        const skip = (page - 1) * 10;
        const cinematographyDeliverables = await DeliverableModel.find({ deliverableName: { $in: ['Long Film', 'Reel', 'Promo'] } }).skip(skip).limit(10).populate('client editor');
        res.status(200).json(cinematographyDeliverables);
        
    } catch (error) {
        console.log(error);
    }
}
const getAlbums = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        console.log(page);
        const skip = (page - 1) * 10;
        const albumsDeliverables = await DeliverableModel.find({ deliverableName:  { $in: ['CMYK', 'RGB'] } }).skip(skip).limit(10).populate('client editor');
        res.status(200).json(albumsDeliverables);
    } catch (error) {
        console.log(error);
    }
}
const getPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        console.log(page);
        const skip = (page - 1) * 10;
        const photosDeliverables = await DeliverableModel.find({ deliverableName: 'Photos' }).skip(skip).limit(10).populate('client editor');
        res.status(200).json(photosDeliverables);
    } catch (error) {
        console.log(error);
    }
}
const getPreWeds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        console.log(page);
        const skip = (page - 1) * 10;
        const preWedDeliverables = await DeliverableModel.find({ deliverableName:  { $in: ['Pre-Wedding Photos', 'Pre-Wedding Videos'] } }).skip(skip).limit(10).populate('client editor');
        res.status(200).json(preWedDeliverables);
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