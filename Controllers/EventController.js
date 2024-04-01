const EventModel = require('../models/EventModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');


const AddEvent = async (req, res) => {
    try {
        const newEvent = new EventModel(req.body.data);
        const client = await ClientModel.findById(req.body.data.client)
        client.events.push(newEvent._id);
        await newEvent.save();
        await client.save();
        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};


const AssignTeam = async (req, res) => {
    try {
        // console.log(req.body.data);
        const event = await EventModel.findById(req.body.data._id);
        const photographersIds = req.body.data.choosenPhotographers?.map(user => user._id);
        const cinematographersIds = req.body.data.choosenCinematographers?.map(user => user._id);
        const droneFlyersIds = req.body.data.droneFlyers?.map(user => user._id);
        const sameDayPhotoMakersIds = req.body.data.sameDayPhotoMakers?.map(user => user._id);
        const sameDayVideoMakersIds = req.body.data.sameDayVideoMakers?.map(user => user._id);
        const assistantsIds = req.body.data.assistants?.map(user => user._id);
        const managerIds = req.body.data.manager?.map(user => user._id);
        const directorIds = req.body.data.shootDirector?.map(user => user._id);
        event.choosenCinematographers = cinematographersIds;
        event.choosenPhotographers = photographersIds;
        event.droneFlyers = droneFlyersIds;
        event.sameDayPhotoMakers = sameDayPhotoMakersIds;
        event.sameDayVideoMakers = sameDayVideoMakersIds;
        event.assistants = assistantsIds;
        event.manager = managerIds;
        event.shootDirector = directorIds;
        console.log(event);
        await event.save();
        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};
const updateEvent = async (req, res) => {
    try {
        // console.log(req.body.data);
        const event = await EventModel.findByIdAndUpdate(req.body.data._id, req.body.data);
        
        console.log(event);
        
        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await EventModel.find().populate('client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirector sameDayPhotoMakers sameDayVideoMakers');
        res.status(200).json(events);
    } catch (error) {
        console.log(error, 'error');
    }
};
const DeleteEvent = async (req, res) => {
    try {
        console.log(req.params.eventId);
        const eventToDelete = await EventModel.findById(req.params.eventId);
        const client = await ClientModel.findById(eventToDelete.client)
        console.log(client);
        client.events = client.events.filter(eventId => !eventId.equals(eventToDelete._id));
        await client.save();
        await eventModel.findByIdAndDelete(eventToDelete._id)
        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};


module.exports = { AddEvent, DeleteEvent,updateEvent, getEvents, AssignTeam }