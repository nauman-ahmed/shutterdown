const EventModel = require("../models/EventModel");
const ClientModel = require("../models/ClientModel");
const eventModel = require("../models/EventModel");
const dayjs = require("dayjs");
const deliverableModel = require("../models/DeliverableModel");

const AddEvent = async (req, res) => {
  try {
    const newEvent = new EventModel({
      ...req.body.data,
      eventDate: dayjs(req.body.data.eventDate).format("YYYY-MM-DD"),
    });
    const client = await ClientModel.findById(req.body.data.client);
    client.events.push(newEvent._id);
    await newEvent.save();
    client.dates = [
      ...client.dates,
      dayjs(new Date(newEvent.eventDate)).format("YYYY-MM-DD"),
    ];
    await client.save();
    const clientWithEvents = await ClientModel.findById(client._id).populate(
      "events"
    );
    let dateForDeliverales = null;
    clientWithEvents.events.forEach((event) => {
      if (event.isWedding) {
        dateForDeliverales = dayjs(event.eventDate).format("YYYY-MM-DD");
      }
    });
    if (dateForDeliverales == null) {
      dateForDeliverales = dayjs(clientWithEvents.events[0]?.eventDate).format(
        "YYYY-MM-DD"
      );
    }
    const clientDeliverales = await deliverableModel.find({
      client: client._id,
    });
    clientDeliverales.forEach(async (deliverable) => {
      deliverable.date = dateForDeliverales;
      await deliverableModel.findByIdAndUpdate(deliverable._id, deliverable);
    });
    res.status(200).json("Event Added SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const AssignTeam = async (req, res) => {
  try {
    const event = await EventModel.findById(req.body.data._id);
    const photographersIds = req.body.data.choosenPhotographers?.map(
      (user) => user._id
    );
    const cinematographersIds = req.body.data.choosenCinematographers?.map(
      (user) => user._id
    );
    const droneFlyersIds = req.body.data.droneFlyers?.map((user) => user._id);
    const sameDayPhotoMakersIds = req.body.data.sameDayPhotoMakers?.map(
      (user) => user._id
    );
    const sameDayVideoMakersIds = req.body.data.sameDayVideoMakers?.map(
      (user) => user._id
    );
    const assistantsIds = req.body.data.assistants?.map((user) => user._id);
    const managerIds = req.body.data.manager?.map((user) => user._id);
    const directorIds = req.body.data.shootDirectors?.map((user) => user._id);

    event.choosenCinematographers = cinematographersIds;
    event.choosenPhotographers = photographersIds;
    event.droneFlyers = droneFlyersIds;
    event.sameDayPhotoMakers = sameDayPhotoMakersIds;
    event.sameDayVideoMakers = sameDayVideoMakersIds;
    event.assistants = assistantsIds;
    event.manager = managerIds;
    event.shootDirectors = directorIds;

    if (
      event.shootDirectors.length &&
      event.choosenPhotographers.length &&
      event.choosenCinematographers.length &&
      event.droneFlyers.length &&
      event.manager.length &&
      event.assistants.length &&
      event.sameDayPhotoMakers.length &&
      event.sameDayVideoMakers.length
    ) {
      event.allDataCompleted = true;
    }

    await event.save();
    res.status(200).json("Event Added SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const updateEvent = async (req, res) => {
  try {
    const { _id, ...eventData } = req.body.data;
    const previousEvent = await EventModel.findById(req.body.data._id);
    const event = await EventModel.findByIdAndUpdate(
      req.body.data._id,
      {
        ...eventData,
        eventDate: dayjs(eventData.eventDate).format("YYYY-MM-DD"),
      },
      { new: true }
    );
    const client = await ClientModel.findById(previousEvent.client);
    const updatedDates = client.dates.filter(
      (date) =>
        dayjs(date).format("YYYY-MM-DD") !==
        dayjs(previousEvent.eventDate).format("YYYY-MM-DD")
    );
    client.dates = [
      ...updatedDates,
      dayjs(new Date(event.eventDate)).format("YYYY-MM-DD"),
    ];
    await client.save();
    const clientWithEvents = await ClientModel.findById(client._id).populate(
      "events"
    );
    let dateForDeliverales = null;
    clientWithEvents.events.forEach((event) => {
      if (event.isWedding) {
        dateForDeliverales = dayjs(event.eventDate).format("YYYY-MM-DD");
      }
    });
    if (dateForDeliverales == null) {
      dateForDeliverales = dayjs(clientWithEvents.events[0]?.eventDate).format(
        "YYYY-MM-DD"
      );
    }
    const clientDeliverales = await deliverableModel.find({
      client: client._id,
    });
    clientDeliverales.forEach(async (deliverable) => {
      deliverable.date = dateForDeliverales;
      await deliverableModel.findByIdAndUpdate(deliverable._id, deliverable);
    });

    res.status(200).json("Event Added SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;
    let obj = {};

    if (req.body.clientId) {
      obj.client = req.body.clientId;
    } 
    else {
      if (req.body.dateForFilter == null) {
        if (req.body.currentMonth && req.body.currentYear) {
          const year = req.body.currentYear;
          const month = req.body.currentMonth;

          let startOfMonth = dayjs(`${year}-${month}-01`, "YYYY-MMMM-DD")
            .startOf("month")
            .format("YYYY-MM-DD");
          let endOfMonth = dayjs(`${year}-${month}-01`, "YYYY-MMMM-DD")
            .endOf("month")
            .format("YYYY-MM-DD");

          obj.eventDate = {
            $gte: startOfMonth,
            $lte: endOfMonth,
          };
        }
      } else {
        let startDate = dayjs(new Date(req.body.dateForFilter)).format(
          "YYYY-MM-DD"
        );
        let endDate = dayjs(new Date(req.body.dateForFilter)).format(
          "YYYY-MM-DD"
        );
        obj.eventDate = {
          $gte: startDate,
          $lte: endDate,
        };
      }
    }
    console.log("req.body.dateForFilter", req.body.dateForFilter)
    console.log("Object", obj)
    const events = await EventModel.find(obj)
      .skip(skip)
      .limit(10)
      .populate(
        "client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers"
      );


    const hasMore = events.length === 10;
    res.status(200).json({ hasMore, data: events });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find().populate(
      "client choosenPhotographers choosenCinematographers droneFlyers manager assistants shootDirectors sameDayPhotoMakers sameDayVideoMakers"
    );

    // Step 1: Sort by eventDate
    events.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return dateA - dateB;
    });

    res.status(200).json(events);
  } catch (error) {
    console.log(error, "error");
  }
};

const DeleteEvent = async (req, res) => {
  try {
    const eventToDelete = await EventModel.findById(req.params.eventId);
    const client = await ClientModel.findById(eventToDelete.client);
    client.events = client.events.filter(
      (eventId) => !eventId.equals(eventToDelete._id)
    );
    await client.save();
    await eventModel.findByIdAndDelete(eventToDelete._id);
    res.status(200).json("Event Deleted SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const changeDateString = async () => {
  const allEvents = await eventModel.find();
  allEvents.forEach(async (event) => {
    event.eventDate = dayjs(new Date(event.eventDate)).format("YYYY-MM-DD");
    await event.save();
  });
  console.log("changed");
};

module.exports = {
  AddEvent,
  DeleteEvent,
  updateEvent,
  getEvents,
  AssignTeam,
  getAllEvents,
  changeDateString,
};
