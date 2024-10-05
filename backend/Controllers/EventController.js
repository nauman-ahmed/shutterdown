const EventModel = require('../models/EventModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');
const dayjs = require('dayjs');
const customParseFormat = 'dayjs/plugin/customParseFormat';

const AddEvent = async (req, res) => {
    try {
        const newEvent = new EventModel({ ...req.body.data, eventDate: dayjs(req.body.data.eventDate).format('YYYY-MM-DD') });
        const client = await ClientModel.findById(req.body.data.client)
        client.events.push(newEvent._id);

        await newEvent.save();
        console.log(newEvent);
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

        if (event.shootDirectors.length && event.choosenPhotographers.length && event.choosenCinematographers.length
            && event.droneFlyers.length && event.manager.length && event.assistants.length && event.sameDayPhotoMakers.length
            && event.sameDayVideoMakers.length
        ) {
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
        const { _id, ...eventData } = req.body.data;
        const event = await EventModel.findByIdAndUpdate(req.body.data._id, {...eventData, eventDate : dayjs(eventData.eventDate).format('YYYY-MM-DD')});

        res.status(200).json('Event Added SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};

const getEventsByMonth = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the page from the query, default to 1
        const limit = 10; // Define how many events to return per page
        const skip = (page - 1) * limit; // Calculate how many records to skip
        // Extend dayjs with the customParseFormat plugin
        dayjs.extend(customParseFormat);
        // Ensure currentMonth is passed as a full month name (e.g., "January")
        // Parse the current month and create start and end dates
        let currentMonth = dayjs(`${dayjs().year()}-${req.body.currentMonth}-01`, "YYYY-MMMM-DD").startOf('day').format('YYYY-MM-DD');
        let endOfMonth = dayjs(`${dayjs().year()}-${req.body.currentMonth}-01`, "YYYY-MMMM-DD").endOf('month').format('YYYY-MM-DD');

        const query = {
            eventDate: {
                $gte: currentMonth,
                $lte: endOfMonth
            }
        };

        // Fetch the events with pagination
        const events = await EventModel.find(query)
            .populate('client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers')
            .sort({ eventDate: 1 }) // Sort by eventDate in ascending order
            .skip(skip) // Skip the previous pages
            .limit(limit); // Limit the results to 10 per page

        // Group events by brideName as an array of objects
        const groupedByBrideName = events.reduce((acc, event) => {
            const brideName = event.client.brideName;
            const found = acc.find(item => item.client.brideName === brideName);
            const index = acc.findIndex(item => item.client.brideName === brideName);
            if (!found) {
                acc.push(event);
            } else {
                acc.splice(index + 1, 0, event);
            }
            return acc;
        }, []);

        res.status(200).json(groupedByBrideName);
    } catch (error) {
        console.log(error, 'error');
        res.status(500).json({ message: "Internal server error" });
    }
};


const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        let obj = {};

        // Apply clientId filter if present
        if (req.body.clientId) {
            obj.client = req.body.clientId;
        } else {
            // Apply filtering for the specific month and year
            if (req.body.currentMonth && req.body.currentYear) {
                const year = req.body.currentYear;
                const month = req.body.currentMonth;

                // Extend dayjs with customParseFormat to handle custom date formats
                // dayjs.extend(customParseFormat);

                // Generate the start and end date for the given month and year
                let startOfMonth = dayjs(`${year}-${month}-01`, "YYYY-MMMM-DD").startOf('month').format('YYYY-MM-DD');
                let endOfMonth = dayjs(`${year}-${month}-01`, "YYYY-MMMM-DD").endOf('month').format('YYYY-MM-DD');
                // Add date filtering for the specified month and year
                obj.eventDate = {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                };
            }
        }

        // Fetch events based on the filters
        const events = await EventModel.find(obj)
            .skip(skip)
            .limit(10)
            .populate('client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers');

        // Step 1: Sort by eventDate
        events.sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return dateA - dateB;
        });

        // Step 2: Group by brideName, but store the result as an array of objects
        const groupedByBrideName = events.reduce((acc, event) => {
            const brideName = event.client.brideName;
            const found = acc.find(item => item.client.brideName === brideName);
            const index = acc.findIndex(item => item.client.brideName === brideName);
            if (!found) {
                acc.push(event);
            } else {
                acc.splice(index + 1, 0, event);
            }
            return acc;
        }, []);

        res.status(200).json(groupedByBrideName);
    } catch (error) {
        console.log(error, 'error');
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getEventsByDate = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        let obj = {};

        if (req.body.clientId) {
            obj.client = req.body.clientId;
        }


        // Get specific date from frontend
        if (req.body.eventDate) {
            // Extend dayjs with customParseFormat for parsing custom date formats
            // dayjs.extend(customParseFormat);

            // Parse the date and get the start and end of the day
            const date = dayjs(req.body.eventDate, "YYYY-MM-DD").startOf('day').format('YYYY-MM-DD');
            const endOfDay = dayjs(req.body.eventDate, "YYYY-MM-DD").endOf('day').format('YYYY-MM-DD');


            // Filter by exact date
            obj.eventDate = {
                $gte: date,
                $lte: endOfDay
            };
        }

        const events = await EventModel.find(obj)
            .skip(skip)
            .limit(10)
            .populate('client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers');

        // Sort by eventDate
        events.sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return dateA - dateB;
        });

        // Group by brideName
        const groupedByBrideName = events.reduce((acc, event) => {
            const brideName = event.client.brideName;
            const found = acc.find(item => item.client.brideName === brideName);
            const index = acc.findIndex(item => item.client.brideName === brideName);
            if (!found) {
                acc.push(event);
            } else {
                acc.splice(index + 1, 0, event);
            }
            return acc;
        }, []);

        res.status(200).json(groupedByBrideName);
    } catch (error) {
        console.log(error, 'error');
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllEvents = async (req, res) => {
    try {

        const events = await EventModel.find().populate('client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers');

        // Step 1: Sort by eventDate
        events.sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return dateA - dateB
        })



        res.status(200).json(events);
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
        res.status(200).json('Event Deleted SucccessFully');
    } catch (error) {
        console.log(error, 'error');
    }
};


module.exports = { AddEvent, getEventsByDate, DeleteEvent, updateEvent, getEvents, AssignTeam, getEventsByMonth, getAllEvents }