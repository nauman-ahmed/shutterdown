const EventModel = require('../models/EventModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');


const AddEvent = async (req, res) => {
    try {
        console.log(req.body.data)
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

        const event = await EventModel.findById(req.body.data._id);
        const photographersIds = req.body.data.choosenPhotographers?.map(user => user._id);
        const cinematographersIds = req.body.data.choosenCinematographers?.map(user => user._id);
        const droneFlyersIds = req.body.data.droneFlyers?.map(user => user._id);
        const sameDayPhotoMakersIds = req.body.data.sameDayPhotoMakers?.map(user => user._id);
        const sameDayVideoMakersIds = req.body.data.sameDayVideoMakers?.map(user => user._id);
        const assistantsIds = req.body.data.assistants?.map(user => user._id);
        const managerIds = req.body.data.manager?.map(user => user._id);
        const directorIds = req.body.data.shootDirectors?.map(user => user._id);
        
        event.choosenCinematographers = cinematographersIds;
        event.choosenPhotographers = photographersIds;
        event.droneFlyers = droneFlyersIds;
        event.sameDayPhotoMakers = sameDayPhotoMakersIds;
        event.sameDayVideoMakers = sameDayVideoMakersIds;
        event.assistants = assistantsIds;
        event.manager = managerIds;
        event.shootDirectors = directorIds;

        if(event.shootDirectors.length && event.choosenPhotographers.length && event.choosenCinematographers.length
            && event.droneFlyers.length && event.manager.length && event.assistants.length && event.sameDayPhotoMakers.length
            && event.sameDayVideoMakers.length
        ){
            event.allDataCompleted = true
        }


        await event.save();

        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};
const updateEvent = async (req, res) => {
    try {
        const {_id, ...eventData } = req.body.data;
        const event = await EventModel.findByIdAndUpdate(req.body.data._id, eventData);
        
        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};

const getEvents = async (req, res) => {
    try {
        let obj = {};
        if(req.body.clientId){
            obj = {client: req.body.clientId}
        }
        const events = await EventModel.find(obj).populate('client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers');
        
        // Step 1: Sort by eventDate
        events.sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return dateA - dateB 
        })
        
        // Step 2: Group by brideName, but store the result as an array of objects
        const groupedByBrideName = events.reduce((acc, event) => {
            const brideName = event.client.brideName;
            const found = acc.find(item => item.client.brideName === brideName);
            const index = acc.findIndex(item => item.client.brideName === brideName);
            if (!found) {
                // If no existing group for this brideName, create a new group
                acc.push(event);
            } else {
                // Add to the existing group's events array
                acc.splice(index+1, 0, event);
            }
            return acc;
        }, []);
        
        res.status(200).json(groupedByBrideName);
    } catch (error) {
        console.log(error, 'error');
    }
};
const DeleteEvent = async (req, res) => {
    try {
        const eventToDelete = await EventModel.findById(req.params.eventId);
        const client = await ClientModel.findById(eventToDelete.client)
        client.events = client.events.filter(eventId => !eventId.equals(eventToDelete._id));
        await client.save();
        await eventModel.findByIdAndDelete(eventToDelete._id)
        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};


module.exports = { AddEvent, DeleteEvent,updateEvent, getEvents, AssignTeam }