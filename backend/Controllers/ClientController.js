const ClientModel = require("../models/ClientModel");
const deadlineDaysModel = require("../models/DeadlineDays");
const deliverableModel = require("../models/DeliverableModel");
const eventModel = require("../models/EventModel");
const EventModel = require("../models/EventModel");

const AddClientFunction = async (req, res) => {
  try {

    const deadlineDays = await deadlineDaysModel.find();
    let clientBody = req.body.data;
    clientBody.preWeddingPhotos = req.body.data?.deliverables?.preWeddingPhotos;
    clientBody.preWeddingVideos = req.body.data?.deliverables?.preWeddingVideos;
    const client = new ClientModel(clientBody);
    let deliverables = [];
    let longFilmDeadline = null;
    let reelDeadline = null;
    let promoDeadline = null;
    let albumDeadline = null;
    let photoDeadline = null;
    let preWedPhotoDeadline = null;
    let preWedVideoDeadline = null;
    const eventIds = await Promise.all(
      req.body?.data?.events.map(async (eventData) => {
        const event = new EventModel({ ...eventData, client: client._id });
        if (event.isWedding) {
          longFilmDeadline = new Date(event.eventDate.getTime());
          promoDeadline = new Date(event.eventDate.getTime());
          reelDeadline = new Date(event.eventDate.getTime());
          photoDeadline = new Date(event.eventDate.getTime());
          albumDeadline = new Date(event.eventDate.getTime());
          preWedPhotoDeadline = new Date(event.eventDate.getTime());
          preWedVideoDeadline = new Date(event.eventDate.getTime());

          longFilmDeadline.setDate(
            longFilmDeadline.getDate() + deadlineDays[0].longFilm
          );
          promoDeadline.setDate(
            promoDeadline.getDate() + deadlineDays[0].promo
          );
          reelDeadline.setDate(reelDeadline.getDate() + deadlineDays[0].reel);
          albumDeadline.setDate(
            albumDeadline.getDate() + deadlineDays[0].album
          );
          photoDeadline.setDate(
            photoDeadline.getDate() + deadlineDays[0].photo
          );
          preWedPhotoDeadline.setDate(
            preWedPhotoDeadline.getDate() + deadlineDays[0].preWedPhoto
          );
          preWedVideoDeadline.setDate(
            preWedVideoDeadline.getDate() + deadlineDays[0].preWedVideo
          );
        }
        if (
          longFilmDeadline === null &&
          reelDeadline === null &&
          promoDeadline === null &&
          photoDeadline === null &&
          preWedPhotoDeadline === null &&
          preWedVideoDeadline === null &&
          albumDeadline
        ) {
          longFilmDeadline = new Date(event.eventDate.getTime());
          promoDeadline = new Date(event.eventDate.getTime());
          reelDeadline = new Date(event.eventDate.getTime());
          photoDeadline = new Date(event.eventDate.getTime());
          albumDeadline = new Date(event.eventDate.getTime());
          preWedPhotoDeadline = new Date(event.eventDate.getTime());
          preWedVideoDeadline = new Date(event.eventDate.getTime());

          longFilmDeadline.setDate(
            longFilmDeadline.getDate() + deadlineDays[0].longFilm
          );
          promoDeadline.setDate(
            promoDeadline.getDate() + deadlineDays[0].promo
          );
          reelDeadline.setDate(reelDeadline.getDate() + deadlineDays[0].reel);
          albumDeadline.setDate(
            albumDeadline.getDate() + deadlineDays[0].album
          );
          photoDeadline.setDate(
            photoDeadline.getDate() + deadlineDays[0].photo
          );
          preWedPhotoDeadline.setDate(
            preWedPhotoDeadline.getDate() + deadlineDays[0].preWedPhoto
          );
          preWedVideoDeadline.setDate(
            preWedVideoDeadline.getDate() + deadlineDays[0].preWedVideo
          );
        }
        await event.save();
        return event._id;
      })
    );

    const photosDeliverable = new deliverableModel({
      client: client._id,
      deliverableName: "Photos",
      quantity: 1,
      photoDeadline,
    });
    await photosDeliverable.save().then(() => {
      deliverables.push(photosDeliverable._id);
    });
    if (req.body.data.promos > 0) {
      const promoDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Promo",
        quantity: req.body.data.promos,
        promoDeadline,
      });
      await promoDeliverable.save().then(() => {
        deliverables.push(promoDeliverable._id);
      });
    }
    if (req.body.data.longFilms > 0) {
      const longFilmDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Long Film",
        quantity: req.body.data.longFilms,
        longFilmDeadline,
      });
      await longFilmDeliverable.save().then(() => {
        deliverables.push(longFilmDeliverable._id);
      });
    }
    if (req.body.data.reels > 0) {
      const reelDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Reel",
        quantity: req.body.data.reels,
        reelDeadline,
      });
      await reelDeliverable.save().then(() => {
        deliverables.push(reelDeliverable._id);
      });
    }
    if (req.body.data?.deliverables?.preWeddingPhotos === true) {
      client.preWedding = true;
      const preWedPhotosDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Pre-Wedding Photos",
        quantity: req.body.data.reels,
        preWedPhotoDeadline,
      });
      await preWedPhotosDeliverable.save().then(() => {
        deliverables.push(preWedPhotosDeliverable._id);
      });
    }
    if (req.body.data?.deliverables?.preWeddingVideos === true) {
      client.preWedding = true;
      const preWedVideosDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Pre-Wedding Videos",
        quantity: req.body.data.reels,
        preWedVideoDeadline,
      });
      await preWedVideosDeliverable.save().then(() => {
        deliverables.push(preWedVideosDeliverable._id);
      });
    }

    const albumsDeliverables = await Promise.all(
      req.body.data.albums.map(async (album) => {
        const newAlbum = new deliverableModel({
          client: client._id,
          deliverableName: album,
          quantity: 1,
          albumDeadline,
        });
        await newAlbum.save();
        return newAlbum._id;
      })
    );

    client.events = eventIds;
    client.deliverables = [...deliverables, ...albumsDeliverables]
    await client.save()
    res.status(200).json(client);
  } catch (error) {
    console.log("Client Form Error", error);
  }
};

const AddPreWedDetails = async (req, res) => {
  try {
    const client = await ClientModel.findById(req.body.client._id);
    const photographersIds =
      req.body.client.preWeddingDetails?.photographers?.map((user) => user._id);
    const cinematographersIds =
      req.body.client.preWeddingDetails?.cinematographers?.map(
        (user) => user._id
      );
    const droneFlyersIds = req.body.client.preWeddingDetails?.droneFlyers?.map(
      (user) => user._id
    );
    const assistantsIds = req.body.client?.preWeddingDetails?.assistants?.map(
      (user) => user._id
    );
    client.preWeddingDetails = {
      ...req.body.client.preWeddingDetails,
      photographers: photographersIds,
      cinematographers: cinematographersIds,
      droneFlyers: droneFlyersIds,
      assistants: assistantsIds,
    };
    await client.save();
    res.status(200).json("Pre-Wedding Added SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const updateClient = async (req, res) => {
  try {
    await ClientModel.findByIdAndUpdate(req.body.client._id, req.body.client);

    res.status(200).json("client Updated SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
    const clients = await ClientModel.find().skip(skip).limit(10).populate({
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
    const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
    const clients = await ClientModel.find({ preWedding: true }).skip(skip).limit(10).populate({
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
    const client = await ClientModel.findById(req.params.clientId)
      .populate("userID")
      .populate({
        path: "events",
        model: "Event",
        populate: [
          { path: "choosenPhotographers", model: "user" },
          { path: "choosenCinematographers", model: "user" },
          { path: "droneFlyers", model: "user" },
          { path: "manager", model: "user" },
          { path: "assistants", model: "user" },
          { path: "sameDayPhotoMakers", model: "user" },
          { path: "sameDayVideoMakers", model: "user" },
          { path: "shootDirectors", model: "user" },
        ],
      })
      .populate({
        path: "deliverables",
        model: "Deliverable",
        populate: {
          path: "editor",
          model: "user",
        },
      });
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};


const DeleteClient = async (req, res) => {
  try {
      const clientToDelete = await ClientModel.findById(req.params.clientId);
      clientToDelete.events.forEach(async (client) => {
        await eventModel.findByIdAndDelete(client)
      })
      clientToDelete.deliverables.forEach(async (client) => {
        await deliverableModel.findByIdAndDelete(client)
      })
      
      await ClientModel.findByIdAndDelete(clientToDelete._id)
      res.status(200).json('Client Deleted Succcessfully!');
  } catch (error) {
      console.log(error, 'error');
  }
};

module.exports = {
  AddClientFunction,
  getAllClients,
  getClientById,
  getPreWedClients,
  updateClient,
  AddPreWedDetails,
  DeleteClient
};
