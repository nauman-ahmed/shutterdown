const DeliverableModel = require('../models/DeliverableModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');
const DeliverableOptionsSchema = require('../models/DeliverableOptionsSchema');
const moment = require('moment');

const getCinematography = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        // Get currentMonth, currentYear, and currentDate from the request query
        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;
        // Check if a specific date is provided and valid
        if (currentDate !== 'null') {
            // Single date filter
            startDate = moment(new Date(currentDate), "YYYY-MM-DD").startOf('day').toDate();
            endDate = moment(new Date(currentDate), "YYYY-MM-DD").endOf('day').toDate();
        } else {
            // If no specific date, use the month and year filter
            startDate = new Date(`${currentYear}-${currentMonth}-01`);
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0); // Set to last day of the month
        }

        // Fetch deliverables
        const cinematographyDeliverables = await DeliverableModel
            .find({ deliverableName: { $in: ['Long Film', 'Reel', 'Promo'] } })
            .skip(skip)
            .limit(10)
            .populate('client editor');

        const cinematographyDeliverablesWithEvents = [];

        // Iterate over deliverables and filter by event date
        for (let index = 0; index < cinematographyDeliverables.length; index++) {
            const clientId = cinematographyDeliverables[index].client.toObject()._id;

            // Find events for the client within the specified date range
            const events = await eventModel.find({
                client: clientId,
                eventDate: { $gte: startDate, $lte: endDate } // Date range filter
            });

            if (events.length > 0) {
                // Only include if events exist in the date range
                const weddingEvent = events.filter(event => event.isWedding);
                let dummyObj = { ...cinematographyDeliverables[index].toObject() };

                // Assign event date based on whether a wedding event exists
                if (weddingEvent.length > 0) {
                    dummyObj["client"]["eventDate"] = weddingEvent[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = true;
                } else {
                    dummyObj["client"]["eventDate"] = events[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = false;
                }

                // Push to the result only if an event is found
                cinematographyDeliverablesWithEvents.push(dummyObj);
            }
        }

        // Send only deliverables where event dates exist
        res.status(200).json(cinematographyDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

const getAlbums = async (req, res) => {
    try {
        // Fetch album values from the schema
        const allDocument = await DeliverableOptionsSchema.find({}, { "albums": 1 });
        let albumValues = [];

        for (let index = 0; index < allDocument[0].albums.values.length; index++) {
            albumValues.push(allDocument[0].albums.values[index]["value"]);
        }

        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        // Get currentMonth, currentYear, and currentDate from the request query
        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;

        // Date filter logic
        if (currentDate !== 'null') {
            // Parse currentDate as a specific day filter
            startDate = moment(new Date(currentDate), "YYYY-MM-DD").startOf('day').toDate();
            endDate = moment(new Date(currentDate), "YYYY-MM-DD").endOf('day').toDate();
        } else {
            // If no specific date, use the month and year filter
            startDate = new Date(`${currentYear}-${currentMonth}-01`);
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0); // Set to last day of the month
        }

        // Fetch album deliverables based on album values
        const albumsDeliverables = await DeliverableModel
            .find({ deliverableName: { $in: albumValues } })
            .skip(skip)
            .limit(10)
            .populate('client editor');

        const albumDeliverablesWithEvents = [];

        // Iterate over deliverables and filter by event date
        for (let index = 0; index < albumsDeliverables.length; index++) {
            const clientId = albumsDeliverables[index].client.toObject()._id;

            // Find events for the client within the specified date range
            const events = await eventModel.find({
                client: clientId,
                eventDate: { $gte: startDate, $lte: endDate } // Date range filter
            });

            if (events.length > 0) {
                // Only include if events exist in the date range
                const weddingEvent = events.filter(event => event.isWedding);
                let dummyObj = { ...albumsDeliverables[index].toObject() };

                // Assign event date based on whether a wedding event exists
                if (weddingEvent.length > 0) {
                    dummyObj["client"]["eventDate"] = weddingEvent[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = true;
                } else {
                    dummyObj["client"]["eventDate"] = events[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = false;
                }

                // Push to the result only if an event is found
                albumDeliverablesWithEvents.push(dummyObj);
            }
        }

        // Send only deliverables where event dates exist
        res.status(200).json(albumDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

const getPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        // Get currentMonth, currentYear, and currentDate from the request query
        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;

        // Date filter logic
        if (currentDate !== 'null') {
            // Parse currentDate as a specific day filter
            startDate = moment(new Date(currentDate), "YYYY-MM-DD").startOf('day').toDate();
            endDate = moment(new Date(currentDate), "YYYY-MM-DD").endOf('day').toDate();
        } else {
            // If no specific date, use the month and year filter
            startDate = new Date(`${currentYear}-${currentMonth}-01`);
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0); // Set to last day of the month
        }

        // Fetch photos deliverables
        const photosDeliverables = await DeliverableModel
            .find({ deliverableName: 'Photos' })
            .skip(skip)
            .limit(10)
            .populate('client editor');

        const photosDeliverablesWithEvents = [];

        // Iterate over deliverables and filter by event date
        for (let index = 0; index < photosDeliverables.length; index++) {
            const clientId = photosDeliverables[index].client.toObject()._id;

            // Find events for the client within the specified date range
            const events = await eventModel.find({
                client: clientId,
                eventDate: { $gte: startDate, $lte: endDate } // Date range filter
            });

            if (events.length > 0) {
                // Only include if events exist in the date range
                const weddingEvent = events.filter(event => event.isWedding);
                let dummyObj = { ...photosDeliverables[index].toObject() };

                // Assign event date based on whether a wedding event exists
                if (weddingEvent.length > 0) {
                    dummyObj["client"]["eventDate"] = weddingEvent[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = true;
                } else {
                    dummyObj["client"]["eventDate"] = events[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = false;
                }

                // Push to the result only if an event is found
                photosDeliverablesWithEvents.push(dummyObj);
            }
        }

        // Send only deliverables where event dates exist
        res.status(200).json(photosDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

const getPreWeds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        // Get currentMonth, currentYear, and currentDate from the request query
        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;

        // Date filter logic
        if (currentDate !== 'null') {
            // Parse currentDate as a specific day filter
            startDate = moment(new Date(currentDate), "YYYY-MM-DD").startOf('day').toDate();
            endDate = moment(new Date(currentDate), "YYYY-MM-DD").endOf('day').toDate();
        } else {
            // If no specific date, use the month and year filter
            startDate = new Date(`${currentYear}-${currentMonth}-01`);
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0); // Set to last day of the month
        }

        // Fetch Pre-Wedding deliverables
        const preWedDeliverables = await DeliverableModel
            .find({ deliverableName: { $in: ['Pre-Wedding Photos', 'Pre-Wedding Videos'] } })
            .skip(skip)
            .limit(10)
            .populate('client editor');

        const preWedDeliverablesWithEvents = [];

        // Iterate over deliverables and filter by event date
        for (let index = 0; index < preWedDeliverables.length; index++) {
            const clientId = preWedDeliverables[index].client.toObject()._id;

            // Find events for the client within the specified date range
            const events = await eventModel.find({
                client: clientId,
                eventDate: { $gte: startDate, $lte: endDate } // Date range filter
            });

            if (events.length > 0) {
                // Only include if events exist in the date range
                const weddingEvent = events.filter(event => event.isWedding);
                let dummyObj = { ...preWedDeliverables[index].toObject() };

                // Assign event date based on whether a wedding event exists
                if (weddingEvent.length > 0) {
                    dummyObj["client"]["eventDate"] = weddingEvent[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = true;
                } else {
                    dummyObj["client"]["eventDate"] = events[0]?.eventDate;
                    dummyObj["client"]["isWedding"] = false;
                }

                // Push to the result only if an event is found
                preWedDeliverablesWithEvents.push(dummyObj);
            }
        }

        // Send only deliverables where event dates exist
        res.status(200).json(preWedDeliverablesWithEvents);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

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