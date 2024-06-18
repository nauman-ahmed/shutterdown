const ClientModel = require('../models/ClientModel');
const deliverableModel = require('../models/DeliverableModel');
const EventModel = require('../models/EventModel');



const AddClientFunction = async (req, res) => {
  try {
    let clientBody = req.body.data
    clientBody.preWeddingPhotos = req.body.data?.deliverables?.preWeddingPhotos
    clientBody.preWeddingVideos = req.body.data?.deliverables?.preWeddingVideos
    const client = new ClientModel(clientBody);
    let deliverables = [];
    let clientDeadline = null;
    const eventIds = await Promise.all(req.body?.data?.events.map(async (eventData) => {
      const event = new EventModel({ ...eventData, client: client._id });
      console.log("clientBody ONE",eventData)
      if (event.isWedding) {
        const newDate = new Date(event.eventDate.getTime());
        newDate.setDate(newDate.getDate() + 45)
        clientDeadline = newDate;
      }
      if (clientDeadline === null) {
        const newDate = new Date(event.eventDate.getTime());
        newDate.setDate(newDate.getDate() + 45)
        clientDeadline = newDate;
      }
      await event.save();
      return event._id
    }))
    console.log("clientBody TWO")
    const photosDeliverable = new deliverableModel({ client: client._id, deliverableName: 'Photos', quantity: 1, clientDeadline, })
    await photosDeliverable.save().then(() => {
      deliverables.push(photosDeliverable._id)
    })
    if (req.body.data.promos === 'Yes') {
      const promoDeliverable = new deliverableModel({ client: client._id, deliverableName: 'Promo', quantity: 1, clientDeadline })
      await promoDeliverable.save().then(() => {
        deliverables.push(promoDeliverable._id)
      })
    }
    const longFilmDeliverable = new deliverableModel({ client: client._id, deliverableName: 'Long Film', quantity: req.body.data.longFilms, clientDeadline })
    await longFilmDeliverable.save().then(() => {
      deliverables.push(longFilmDeliverable._id)
    })
    const reelDeliverable = new deliverableModel({ client: client._id, deliverableName: 'Reel', quantity: req.body.data.reels, clientDeadline })
    await reelDeliverable.save().then(() => {
      deliverables.push(reelDeliverable._id)
    })
    if (req.body.data?.deliverables?.preWeddingPhotos === true) {
      client.preWedding = true
      const preWedPhotosDeliverable = new deliverableModel({ client: client._id, deliverableName: 'Pre-Wedding Photos', quantity: req.body.data.reels, clientDeadline })
      await preWedPhotosDeliverable.save().then(() => {
        deliverables.push(preWedPhotosDeliverable._id)
      })
    }
    if (req.body.data?.deliverables?.preWeddingVideos === true) {
      client.preWedding = true
      const preWedVideosDeliverable = new deliverableModel({ client: client._id, deliverableName: 'Pre-Wedding Videos', quantity: req.body.data.reels, clientDeadline })
      await preWedVideosDeliverable.save().then(() => {
        deliverables.push(preWedVideosDeliverable._id)
      })
    }
    const albumsDeliverables = await Promise.all(req.body.data.albums.map(async (album) => {
      const newAlbum = new deliverableModel({ client: client._id, deliverableName: album, quantity: 1, clientDeadline })
      await newAlbum.save();
      return newAlbum._id
    }))

    client.events = eventIds;
    client.deliverables = [...deliverables, ...albumsDeliverables]
    await client.save()
    res.status(200).json('Client Added SucccessFully');
  } catch (error) {
    console.log("Client Form Error",error);
  }
};

const AddPreWedDetails = async (req, res) => {
  try {
    console.log(req.body);
    const client = await ClientModel.findById(req.body.client._id);
    const photographersIds = req.body.client.preWeddingDetails?.photographers?.map(user => user._id);
    const cinematographersIds = req.body.client.preWeddingDetails?.cinematographers?.map(user => user._id);
    const droneFlyersIds = req.body.client.preWeddingDetails?.droneFlyers?.map(user => user._id);
    const assistantsIds = req.body.client?.preWeddingDetails?.assistants?.map(user => user._id);
    client.preWeddingDetails = { ...req.body.client.preWeddingDetails, photographers: photographersIds, cinematographers: cinematographersIds, droneFlyers: droneFlyersIds, assistants: assistantsIds };
    console.log(client);
    await client.save();
    res.status(200).json('Pre-Wedding Added SucccessFully');
  } catch (error) {
    console.log(error);
    console.log(error, 'error');
  }
};


const updateClient = async (req, res) => {
  try {
    await ClientModel.findByIdAndUpdate(req.body.client._id, req.body.client);

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
        { path: 'shootDirectors', model: 'user' },
      ],
    }).populate({
      path: 'deliverables',
      model: 'Deliverable',
      populate: {
        path: 'editor',
        model: 'user'
      }
    }).populate('userID');

    res.status(200).json(clients);

  } catch (error) {
    res.status(404).json(error);
  }
};

const getPreWedClients = async (req, res) => {

  try {
    const clients = await ClientModel.find({ preWedding: true }).populate({
      path: 'deliverables',
      model: 'Deliverable',
      populate: {
        path: 'editor',
        model: 'user'
      }
    }).populate({
      path: 'preWeddingDetails',
      populate: [
        { path: 'photographers', model: 'user' },
        { path: 'cinematographers', model: 'user' },
        { path: 'droneFlyers', model: 'user' },
        { path: 'assistants', model: 'user' },
      ]
    }).populate('userID').populate('events');

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
        { path: 'shootDirectors', model: 'user' },
      ],
    }).populate({
      path: 'deliverables',
      model: 'Deliverable',
      populate: {
        path: 'editor',
        model: 'user'
      }
    });
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};



module.exports = {
  AddClientFunction,
  getAllClients, getClientById,
  getPreWedClients,
  updateClient,
  AddPreWedDetails
};
