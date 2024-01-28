const ClientModel = require('../models/ClientModel');
const DummySchema = require('../models/DummySchema');
const ClientDeliverablesSchema = require('../models/client_deliverables');
const EventModel = require('../models/EventModel');

const getAllDeliverables = async (req, res) => {
  try {
    const booking = await AddClientSchema.find({})
    const deliverableS = await ClientDeliverablesSchema.find({})
    res.status(200).json({ booking, deliverableS });

  } catch (error) {
    console.log(error, 'error');
  }
}

const AddClientFunction = async (req, res) => {
  try {
    const client = new ClientModel(req.body.data);
    const eventIds = await Promise.all(req.body.data.events.map(async (eventData) => {
      const event = new EventModel({ ...eventData, client: client._id });
      await event.save();
      return event._id
    }))
    client.events = eventIds;
    
    await client.save()
    res.status(200).json('Client Added SucccessFully');
  } catch (error) {
    console.log(error, 'error');
  }
};

const AddCinematography = async (req, res) => {
  try {
    console.log('request for cinematography');
    console.log(req.body);
    const client = await ClientModel.findById(req.body.client._id);

    client.cinematography = {...req.body.client.cinematography, editor : req.body.client.cinematography.editor._id};
    await client.save();
    res.status(200).json('Cinematography Added SucccessFully');
  } catch (error) {
    console.log(error, 'error');
  }
};

const AddPhotosDeliverables = async (req, res) => {
  try {
    console.log('request for photos');
    const client = await ClientModel.findById(req.body.client._id);
    client.photosDeliverables = {...req.body.client.photosDeliverables, editor : req.body.client.photosDeliverables.editor._id};
    console.log(client);
    await client.save();
    res.status(200).json('Cinematography Added SucccessFully');
  } catch (error) {
    console.log(error, 'error');
  }
};

const AddAlbumsDeliverables = async (req, res) => {
  try {
    const client = await ClientModel.findById(req.body.client._id);

    client.albumsDeliverables = {...req.body.client.albumsDeliverables, editor : req.body.client.albumsDeliverables.editor._id};
    await client.save();
    res.status(200).json('Albums Deliverables Added SucccessFully');
  } catch (error) {
    console.log(error, 'error');
  }
};
const updateClient = async (req, res) => {
  try {
    console.log(req.body);
    const client = await ClientModel.findByIdAndUpdate(req.body.client._id, req.body.client);

    res.status(200).json('client Updated SucccessFully');
  } catch (error) {
    console.log(error, 'error');
  }
};

const getAllClients = async (req, res) => {

  try {
    const clients = await ClientModel.find().populate({
      path: 'events',
      model: 'Event',
      populate: [
        { path: 'choosenPhotographers', model: 'user' },
        { path: 'choosenCinematographers', model: 'user' },
        { path: 'droneFlyers', model: 'user' },
        { path: 'manager', model: 'user' },
        { path: 'assistants', model: 'user' },
        { path: 'sameDayPhotoMakers', model: 'user' },
        { path: 'sameDayVideoMakers', model: 'user' },
        { path: 'shootDirector', model: 'user' },
      ],
    }).populate({
      path : 'cinematography',
      populate : {
        path : 'editor',
        model : 'user'
      }
    }).populate({
      path : 'photosDeliverables',
      populate : {
        path : 'editor',
        model : 'user'
      }
    }).populate({
      path : 'albumsDeliverables',
      populate : {
        path : 'editor',
        model : 'user'
      }
    }).populate('userID');

    res.status(200).json(clients);

  } catch (error) {
    res.status(404).json(error);
  }

};
const getClientById = async (req, res) => {
  try {
    const client = await ClientModel.findById(req.params.clientId).populate("userID").populate({
      path: 'events',
      model: 'Event',
      populate: [
        { path: 'choosenPhotographers', model: 'user' },
        { path: 'choosenCinematographers', model: 'user' },
        { path: 'droneFlyers', model: 'user' },
        { path: 'manager', model: 'user' },
        { path: 'assistants', model: 'user' },
        { path: 'sameDayPhotoMakers', model: 'user' },
        { path: 'sameDayVideoMakers', model: 'user' },
        { path: 'shootDirector', model: 'user' },
      ],
    }).populate({
      path : 'cinematography',
      populate : {
        path : 'editor',
        model : 'user'
      }
    }).populate({
      path : 'photosDeliverables',
      populate : {
        path : 'editor',
        model : 'user'
      }
    }).populate({
      path : 'albumsDeliverables',
      populate : {
        path : 'editor',
        model : 'user'
      }
    });
    console.log(client);
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

const AddMoreClientFunction = async (req, res) => {
  try {
    const {
      userEmail,
      Bride_Name,
      Groom_Name,
      Bride_s_House_Address,
      Groom_s_House_Address,
      EmailID,
      phone_Number,
      Booking_confirmed,
      Payment_Status,
      POC,
    } = req.body.data.info1;

    const userID = userEmail
    const array = req.body.data.info2;

    let DataBaseId = [];
    const inputData = [];
    array.map((data) => {
      DataBaseId.push(data._id);
      inputData.push(data.Bride_Name);
    });

    var DataBaseData = [];
    const dummyData = await DummySchema.find();
    let dummyDataArray = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element) {
        const DummyId = await DummySchema.findByIdAndDelete({ _id: element._id });
      }
    }

    const client = await AddClientSchema({
      userID,
      Bride_Name,
      Groom_Name,
      Bride_s_House_Address,
      Groom_s_House_Address,
      EmailID,
      phone_Number,
      Booking_confirmed,
      Payment_Status,
      POC,
      events: req.body.data.info2,
    });
    res
      .status(200)
      .json({ message: 'Client Added SucccessFully', data: client });
    await client.save();
  } catch (error) {
    console.log(error, 'error');
  }
};

module.exports = {
  AddClientFunction,
  AddMoreClientFunction,
  getAllDeliverables, getAllClients, getClientById, AddCinematography,
  AddPhotosDeliverables,
  AddAlbumsDeliverables,
  updateClient
};
