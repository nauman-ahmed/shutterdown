const deliverableModel = require("../models/DeliverableModel");
const DeliverableModel = require("../models/DeliverableModel");
const DeliverableOptionsSchema = require("../models/DeliverableOptionsSchema");
const dayjs = require("dayjs");
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
  December: 12,
};

const getCinematography = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;

    let startDate, endDate;
    const { currentMonth, currentYear, currentDate } = req.query;
    // Date filter logic
    if (currentDate !== "null" && currentDate) {
      // Single day filter
      startDate = dayjs(new Date(currentDate)).format("YYYY-MM-DD");
      endDate = dayjs(new Date(currentDate)).format("YYYY-MM-DD");
    } else {
      // Use month and year for range filtering
      startDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-01`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // First day of the month
      endDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-${dayjs(
          `${currentYear}-${monthNumbers[currentMonth]}`
        ).daysInMonth()}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // Last day of the month
    }
    
    // Fetch Cinematography deliverables
    const cinematographyDeliverables = await DeliverableModel.find({
      deliverableName: { $in: ["Long Film", "Reel", "Promo"] },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .skip(skip)
      .limit(10)
      .populate([
        {
          path: "client",
          populate: {
            path: "events",
            model: "Event",
          },
        },
        { path: "editor", model: "user" },
      ]);
      console.log(cinematographyDeliverables);
      
    const hasMore = cinematographyDeliverables.length == 10;
    // Send response with filtered deliverables and hasMore flag
    res.status(200).json({ hasMore, data: cinematographyDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getAlbums = async (req, res) => {
  try {
    // Fetch album values from the schema
    const allDocument = await DeliverableOptionsSchema.find({}, { albums: 1 });
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
    if (currentDate !== "null" && currentDate) {
      // Use the date directly and format it to YYYY-MM-DD
      startDate = dayjs(currentDate).format("YYYY-MM-DD");
      endDate = dayjs(currentDate).format("YYYY-MM-DD"); // Both start and end will be the same day
    } else {
      // Use the numeric month for parsing and monthNumbers object from the previous controller
      startDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-01`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // First day of the month
      endDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-${dayjs(
          `${currentYear}-${monthNumbers[currentMonth]}`
        ).daysInMonth()}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // Last day of the month
    }

    // Fetch album deliverables based on album values
    const albumsDeliverables = await DeliverableModel.find({
      deliverableName: { $in: albumValues },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .skip(skip)
      .limit(10)
      .populate([
        {
          path: "client",
          populate: {
            path: "events",
            model: "Event",
          },
        },
        { path: "editor", model: "user" },
      ]);

    // Determine if there are more albums to fetch
    const hasMore = albumsDeliverables.length === 10;
    // Respond with hasMore and filtered deliverables
    res.status(200).json({ hasMore, data: albumsDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;

    let startDate, endDate;
    const { currentMonth, currentYear, currentDate } = req.query;

    // Date filter logic
    if (currentDate !== "null" && currentDate) {
      // Use the date directly and format it to YYYY-MM-DD
      startDate = dayjs(currentDate).format("YYYY-MM-DD");
      endDate = dayjs(currentDate).format("YYYY-MM-DD"); // Both start and end will be the same day
    } else {
      // Use the numeric month for parsing and monthNumbers object from the previous controller
      startDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-01`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // First day of the month
      endDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-${dayjs(
          `${currentYear}-${monthNumbers[currentMonth]}`
        ).daysInMonth()}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // Last day of the month
    }

    // Fetch photos deliverables
    const photosDeliverables = await DeliverableModel.find({
      deliverableName: "Photos",
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .skip(skip)
      .limit(10)
      .populate([
        {
          path: "client",
          populate: {
            path: "events",
            model: "Event",
          },
        },
        { path: "editor", model: "user" },
      ]);

    // Determine if there are more albums to fetch
    const hasMore = photosDeliverables.length === 10;
    res.status(200).json({ hasMore, data: photosDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getPreWeds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;

    let startDate, endDate;
    const { currentMonth, currentYear, currentDate } = req.query;
    // Extend dayjs with customParseFormat to handle custom date formats
    // dayjs.extend(customParseFormat);

    // Date filter logic
    if (currentDate !== "null" && currentDate) {
      // Use the date directly and format it to YYYY-MM-DD
      startDate = dayjs(currentDate).format("YYYY-MM-DD");
      endDate = dayjs(currentDate).format("YYYY-MM-DD"); // Both start and end will be the same day
    } else {
      // Use the numeric month for parsing and monthNumbers object from the previous controller
      startDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-01`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // First day of the month
      endDate = dayjs(
        `${currentYear}-${monthNumbers[currentMonth]}-${dayjs(
          `${currentYear}-${monthNumbers[currentMonth]}`
        ).daysInMonth()}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD"); // Last day of the month
    }

    // Fetch Pre-Wedding deliverables
    const preWedDeliverables = await DeliverableModel.find({
      deliverableName: { $in: ["Pre-Wedding Photos", "Pre-Wedding Videos"] },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .skip(skip)
      .limit(10)
      .populate([
        {
          path: "client",
          populate: {
            path: "events",
            model: "Event",
          },
        },
        { path: "editor", model: "user" },
      ]);

    // Extract dates and assign them to deliverables
    // const deliverablesWithDates = preWedDeliverables.map(deliverable => {
    //     const weddingEvent = deliverable?.client?.events?.find(event => event.isWedding);
    //     const eventDate = weddingEvent?.eventDate || deliverable.client.events?.[0]?.eventDate;
    //     return {
    //         ...deliverable.toObject(),
    //         date: eventDate ? dayjs(eventDate).format('YYYY-MM-DD') : null,
    //     };
    // });

    // Filter deliverables based on date
    // const filteredDeliverables = deliverablesWithDates.filter(deliverable => {
    //     if (deliverable.date) {
    //         const deliverableDate = dayjs(new Date(deliverable.date)).format('YYYY-MM-DD');
    //         return (deliverableDate >= startDate) && deliverableDate <= endDate;
    //     }
    //     return false;
    // });

    const hasMore = preWedDeliverables.length === 10 ? true : false;

    // Send response with filtered deliverables and hasMore flag
    res.status(200).json({ hasMore, data: preWedDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const updateDeliverable = async (req, res) => {
  try {
    await DeliverableModel.findByIdAndUpdate(req.body.deliverable._id, {
      ...req.body.deliverable,
      client: req.body.deliverable.client._id,
      editor: req.body.deliverable.editor?._id,
    }).then(() => {
      res.status(200).json("Deliverable Updated Successfully!");
    });
  } catch (error) {
    console.log(error);
  }
};

const addDateinDeliverales = async () => {
  const allDeliverables = await deliverableModel.find().populate([
    {
      path: "client",
      populate: {
        path: "events",
        model: "Event",
      },
    },
  ]);
  allDeliverables.forEach(async (deliverable) => {
    let dateforDeliverable = null;
    deliverable.client.events.forEach(async (event) => {
      if (event.isWedding) {
        dateforDeliverable = dayjs(event.eventDate).format("YYYY-MM-DD");
      }
    });
    if (dateforDeliverable == null) {
      dateforDeliverable = dayjs(
        deliverable.client.events[deliverable.client.events.length - 1]
          .eventDate
      ).format("YYYY-MM-DD");
    }
    deliverable.date = dateforDeliverable;
    await deliverableModel.findByIdAndUpdate(deliverable._id, deliverable);
  });
  console.log("added dates in deliverales");
};
module.exports = {
  getCinematography,
  getAlbums,
  getPhotos,
  getPreWeds,
  updateDeliverable,
  addDateinDeliverales,
};
