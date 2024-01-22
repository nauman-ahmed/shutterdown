const addClientSchema = require('../models/ClientModel');
const ClientEventSchema = require('../models/client_events');
const userSchema = require('../models/userSchema');
const CalenderListViewSchema = require('../models/CalendarListView');


const dayjs = require('dayjs');

const ClientCalenderViewFunction = async (req, res) => {
  try {
    const allDates = await ClientEventSchema.find({}).populate("clientId");
    const users = await userSchema.find({});
    let listView = await CalenderListViewSchema.find({}).populate("shootDirectorName photoGrapherName cinematoGrapherName droneFlyerName managerName assistantName photoEdit videoEdit")
    res.status(200).json({ data: allDates, users:users, listView: listView });
  } catch (error) {
    console.log(error);
  }
};

const clientModelFunction = async (req, res) => {
  try {
    let obj = {
      assistantName:req.body.data.data.assistantName,
      cinematoGrapherName:req.body.data.data.cinematoGrapherName,
      droneFlyerName:req.body.data.data.droneFlyerName,
      managerName:req.body.data.data.managerName,
      photoEdit:req.body.data.data.photoEdit,
      photoGrapherName:req.body.data.data.photoGrapherName,
      shootDirectorName:req.body.data.data.shootDirectorName,
      videoEdit:req.body.data.data.videoEdit,
    }
    const allDates = await CalenderListViewSchema.findOneAndUpdate(
      {eventId:req.body.data.eventId}, obj
     );
      res.status(200).json("{ allDates }");
  } catch (error) {

    res.status(500).json(error);
  }
};

const eventsToGetDates = async (req, res) => {
  try {


    const allDates = await ClientEventSchema.find({}).populate("clientId");

    let tempDates = []
    for (let index = 0; index < allDates.length; index++) {
      for (let index1 = 0; index1 < allDates[index].events.length; index1++) {
        tempDates.push(allDates[index].events[index1].dates)
      }      
    }

    res.status(200).json(tempDates);
  } catch (error) {

    res.status(500).json(error);
  }
};

module.exports = { ClientCalenderViewFunction, clientModelFunction, eventsToGetDates };
