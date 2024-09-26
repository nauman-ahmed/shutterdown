const DeliverableModel = require('../models/DeliverableModel');
const ClientModel = require('../models/ClientModel');
const eventModel = require('../models/EventModel');
const DeliverableOptionsSchema = require('../models/DeliverableOptionsSchema');
const moment = require('moment');
const monthNumbers = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
}

const getCinematography = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;

        // Date filter logic
        if (currentDate !== 'null' && currentDate) {
            // Single day filter
            startDate = moment.utc(new Date(currentDate)).startOf('day').toDate();
            endDate = moment.utc(new Date(currentDate)).endOf('day').toDate();
        } else {
            // Use month and year for range filtering
            startDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").startOf('month').toDate();
            endDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").endOf('month').toDate();
        }

        // Fetch Cinematography deliverables
        const cinematographyDeliverables = await DeliverableModel
            .find({ deliverableName: { $in: ['Long Film', 'Reel', 'Promo'] } })
            .skip(skip)
            .limit(10)
            .populate([
                {
                    path: 'client',
                    populate: {
                        path: 'events',
                        model: 'Event'
                    }
                },
                { path: 'editor', model: 'user' }
            ]);

        // Extract dates and assign them to deliverables
        const deliverablesWithDates = cinematographyDeliverables.map(deliverable => {
            const weddingEvent = deliverable?.client?.events?.find(event => event.isWedding);
            const eventDate = weddingEvent?.eventDate || deliverable.client.events?.[0]?.eventDate;
            return {
                ...deliverable.toObject(),
                date: eventDate ? moment(eventDate).startOf('day').toDate() : null,
            };
        });

        // Filter deliverables based on date range
        const filteredDeliverables = deliverablesWithDates.filter(deliverable => {
            if (deliverable.date) {
                const deliverableDate = moment(deliverable.date).startOf('day');
                return deliverableDate.isSameOrAfter(startDate) && deliverableDate.isSameOrBefore(endDate);
            }
            return false;
        });

        const hasMore = cinematographyDeliverables.length === 10 ? true : false;

        // Send response with filtered deliverables and hasMore flag
        res.status(200).json({ hasMore, data: filteredDeliverables });
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

        // Extract album values
        for (let index = 0; index < allDocument[0].albums.values.length; index++) {
            albumValues.push(allDocument[0].albums.values[index]["value"]);
        }

        // Pagination logic
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        // Get currentMonth, currentYear, and currentDate from the request query
        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;

        // Date filter logic
        if (currentDate !== 'null' && currentDate) {
            startDate = moment.utc(new Date(currentDate)).startOf('day').toDate();
            endDate = moment.utc(new Date(currentDate)).endOf('day').toDate();
        } else {
            // Use the numeric month for parsing and monthNumbers object from the previous controller
            startDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").startOf('month').toDate();
            endDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").endOf('month').toDate();
        }

        // Fetch album deliverables based on album values
        const albumsDeliverables = await DeliverableModel
            .find({ deliverableName: { $in: albumValues } })
            .skip(skip)
            .limit(10)
            .populate([
                {
                    path: 'client',
                    populate: {
                        path: 'events',
                        model: 'Event'
                    }
                },
                { path: 'editor', model: 'user' }
            ]);

        // Extract dates and assign them to deliverables
        const deliverablesWithDates = albumsDeliverables.map(deliverable => {
            const weddingEvent = deliverable?.client?.events?.find(event => event.isWedding);
            const eventDate = weddingEvent?.eventDate || deliverable.client.events?.[0]?.eventDate;
            return {
                ...deliverable.toObject(),
                date: eventDate ? moment(eventDate).startOf('day').toDate() : null,
            };
        });

        // Filter deliverables by date
        const filteredDeliverables = deliverablesWithDates.filter(deliverable => {
            if (deliverable.date) {
                const deliverableDate = moment(deliverable.date).startOf('day');
                return deliverableDate.isSameOrAfter(startDate) && deliverableDate.isSameOrBefore(endDate);
            }
            return false;
        });

        // Determine if there are more albums to fetch
        const hasMore = albumsDeliverables.length === 10;

        // Respond with hasMore and filtered deliverables
        res.status(200).json({ hasMore, data: filteredDeliverables });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};


const getPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;
       
        
        if (currentDate !== 'null' && currentDate) {
            startDate = moment.utc(new Date(currentDate)).startOf('day').toDate();
            endDate = moment.utc(new Date(currentDate)).endOf('day').toDate();
        } else {

            // Use the numeric month for parsing
            startDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").startOf('month').toDate();
            endDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").endOf('month').toDate();

        }

        // Fetch photos deliverables
        const photosDeliverables = await DeliverableModel
            .find({ deliverableName: 'Photos' })
            .skip(skip)
            .limit(10)
            .populate([
                {
                    path: 'client',
                    populate: {
                        path: 'events',
                        model: 'Event'
                    }
                },
                { path: 'editor', model: 'user' }
            ]);

        // Extract dates and assign them to deliverables
        const deliverablesWithDates = photosDeliverables.map(deliverable => {
            const weddingEvent = deliverable?.client?.events?.find(event => event.isWedding);
            const eventDate = weddingEvent?.eventDate || deliverable.client.events?.[0]?.eventDate;
            return {
                ...deliverable.toObject(),
                date: eventDate ? moment(eventDate).startOf('day').toDate() : null,
            };
        });
        const filteredDeliverables = deliverablesWithDates.filter(deliverable => {
            if (deliverable.date) {
                const deliverableDate = moment(deliverable.date).startOf('day');
                console.log(deliverableDate);
                
                return deliverableDate.isSameOrAfter(startDate) && deliverableDate.isSameOrBefore(endDate);
            }
            return false;
        });
       
        // Determine if there are more albums to fetch
        const hasMore = photosDeliverables.length === 10;
        

        res.status(200).json({hasMore, data : filteredDeliverables});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};


const getPreWeds = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        let startDate, endDate;
        const { currentMonth, currentYear, currentDate } = req.query;

        // Date filter logic
        if (currentDate !== 'null' && currentDate) {
            startDate = moment.utc(new Date(currentDate)).startOf('day').toDate();
            endDate = moment.utc(new Date(currentDate)).endOf('day').toDate();
        } else {
            // If no specific date, use the month and year filter
            startDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").startOf('month').toDate();
            endDate = moment.utc(`${currentYear}-${monthNumbers[currentMonth]}-01`, "YYYY-MM-DD").endOf('month').toDate();
        }

        // Fetch Pre-Wedding deliverables
        const preWedDeliverables = await DeliverableModel
            .find({ deliverableName: { $in: ['Pre-Wedding Photos', 'Pre-Wedding Videos'] } })
            .skip(skip)
            .limit(10)
            .populate([
                {
                    path: 'client',
                    populate: {
                        path: 'events',
                        model: 'Event'
                    }
                },
                { path: 'editor', model: 'user' }
            ]);

        // Extract dates and assign them to deliverables
        const deliverablesWithDates = preWedDeliverables.map(deliverable => {
            const weddingEvent = deliverable?.client?.events?.find(event => event.isWedding);
            const eventDate = weddingEvent?.eventDate || deliverable.client.events?.[0]?.eventDate;
            return {
                ...deliverable.toObject(),
                date: eventDate ? moment(eventDate).startOf('day').toDate() : null,
            };
        });

        // Filter deliverables based on date
        const filteredDeliverables = deliverablesWithDates.filter(deliverable => {
            if (deliverable.date) {
                const deliverableDate = moment(deliverable.date).startOf('day');
                return deliverableDate.isSameOrAfter(startDate) && deliverableDate.isSameOrBefore(endDate);
            }
            return false;
        });

        const hasMore = preWedDeliverables.length === 10 ? true : false;

        // Send response with filtered deliverables and hasMore flag
        res.status(200).json({ hasMore, data: filteredDeliverables });
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