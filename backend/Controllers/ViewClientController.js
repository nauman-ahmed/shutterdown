
const AddClientSchema = require('../models/ClientModel');
const ClientModel = require('../models/ClientModel');
const EventSchema = require("../models/client_events")
const DeliverbalesSchema = require("../models/client_deliverables")
const CalanderListView = require("../models/CalendarListView")

const getViewClientData = async (req, res) => {

  try {
    const clientSchema = await AddClientSchema.find({});
    const eventSchema = await EventSchema.find({});

    let temp = []

    for (let index = 0; index < clientSchema.length; index++) {
      for (let index1 = 0; index1 < eventSchema.length; index1++) {
        if (clientSchema[index]._id.toString() === eventSchema[index1].clientId.toString()) {
          temp.push({
            client: clientSchema[index],
            eventDate: eventSchema[index1].events[0].dates
          })
        }
      }
    }
    res.status(200).json(temp);

  } catch (error) {
    res.status(404).json(error);
  }

};
const getAllClients = async (req, res) => {

  try {
    const clients = await ClientModel.find().populate({
      path: 'events',
      model: 'Event'
    }).populate('userID');

    res.status(200).json(clients);

  } catch (error) {
    res.status(404).json(error);
  }

};

const getClientById = async (req, res) => {
  try {

    const client = await ClientModel.findById(req.body.clientId).populate("userID events");
  
    res.status(200).json(temp);
  } catch (error) {
    res.status(404).json(error);
  }
};
const getClientInfoData = async (req, res) => {
  try {

    const clientSchema = await AddClientSchema.find({ _id: req.body.clientId }).populate("userID");
    const eventSchema = await EventSchema.find({ clientId: req.body.clientId });
    const deliverbalesSchema = await DeliverbalesSchema.find({ clientId: req.body.clientId });

    let eventTemp = [{
      dates: [],
      eventType: [],
      locationSelect: [],
      travelBySelect: [],
      photoGrapher: [],
      CinematographerSelect: [],
      droneSelect: [],
      sameVideoSelect: [],
      sameDaySelect: [],
      tentative: [],
    }]

    for (let index = 0; index < eventSchema[0].events.length; index++) {
      eventTemp[0].dates.push(eventSchema[0].events[index].dates)
      eventTemp[0].eventType.push(eventSchema[0].events[index].eventType)
      eventTemp[0].locationSelect.push(eventSchema[0].events[index].locationSelect)
      eventTemp[0].travelBySelect.push(eventSchema[0].events[index].travelBySelect)
      eventTemp[0].photoGrapher.push(eventSchema[0].events[index].photoGrapher)
      eventTemp[0].CinematographerSelect.push(eventSchema[0].events[index].CinematographerSelect)
      eventTemp[0].droneSelect.push(eventSchema[0].events[index].droneSelect)
      eventTemp[0].sameVideoSelect.push(eventSchema[0].events[index].sameVideoSelect)
      eventTemp[0].sameDaySelect.push(eventSchema[0].events[index].sameDaySelect)
      eventTemp[0].tentative.push(eventSchema[0].events[index].tentative)
    }

    let temp = [{
      client: clientSchema[0],
      events: eventTemp[0],
      deliverables: deliverbalesSchema[0]
    }]

    res.status(200).json(temp);
  } catch (error) {
    res.status(404).json(error);
  }
};

const shootDetails = async (req, res) => {
  try {
    const clientSchema = await AddClientSchema.find({ _id: req.body.clientId }).populate("userID");
    const eventSchema = await EventSchema.find({ clientId: req.body.clientId });
    let temp = []
    for (let index = 0; index < eventSchema.length; index++) {
      eventSchema[index].events.sort((a, b) => new Date(a.dates) - new Date(b.dates));
    }
    for (let index = 0; index < eventSchema[0].events.length; index++) {
      const CalanderListViewSchema = await CalanderListView.find({ eventId: eventSchema[0].events[index]._id }).populate("assistantName cinematoGrapherName droneFlyerName managerName photoEdit photoGrapherName shootDirectorName videoEdit");
      temp.push({
        client: clientSchema[0],
        events: eventSchema[0].events[index],
        eventDetail: CalanderListViewSchema[0]
      })
    }
    res.status(200).json(temp);
  } catch (error) {
    res.status(404).json(error);
  }
};

const viewClient1Data = async (req, res) => {
  try {
    const clientIdData = await AddClientSchema.find({ "events._id": { $eq: req.params.id } })
  } catch (error) {
  }
}
module.exports = { getViewClientData,getClientById, getClientInfoData,getAllClients, viewClient1Data, shootDetails };
