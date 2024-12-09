const ClientModel = require("../models/ClientModel");
const deadlineDaysModel = require("../models/DeadlineDays");
const deliverableModel = require("../models/DeliverableModel");
const eventModel = require("../models/EventModel");
const EventModel = require("../models/EventModel");
const TaskModel = require("../models/TaskSchema");
const dayjs = require("dayjs");

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
    let performanceFilmDeadline = null;
    let datesOfClient = [];
    let dateforDeliverable = null;
    const eventIds = await Promise.all(
      req.body?.data?.events.map(async (eventData, i) => {
        const event = new EventModel({
          ...eventData,
          client: client._id,
          eventDate: dayjs(eventData.eventDate).format("YYYY-MM-DD"),
        });
        if (event.isWedding) {
          longFilmDeadline = new Date(event.eventDate);
          promoDeadline = new Date(event.eventDate);
          reelDeadline = new Date(event.eventDate);
          photoDeadline = new Date(event.eventDate);
          albumDeadline = new Date(event.eventDate);
          preWedPhotoDeadline = new Date(event.eventDate);
          preWedVideoDeadline = new Date(event.eventDate);
          performanceFilmDeadline = new Date(event.eventData)
          longFilmDeadline.setDate(
            longFilmDeadline.getDate() + deadlineDays[0].longFilm
          );
          performanceFilmDeadline.setDate(
            longFilmDeadline.getDate() + deadlineDays[0].performanceFilm
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
          dateforDeliverable = dayjs(new Date(event.eventDate)).format(
            "YYYY-MM-DD"
          );
        }
        if (
          longFilmDeadline === null &&
          reelDeadline === null &&
          promoDeadline === null &&
          photoDeadline === null &&
          preWedPhotoDeadline === null &&
          preWedVideoDeadline === null &&
          performanceFilmDeadline === null &&
          albumDeadline === null
        ) {
          longFilmDeadline = new Date(event.eventDate);
          performanceFilmDeadline = new Date(event.eventDate);
          promoDeadline = new Date(event.eventDate);
          reelDeadline = new Date(event.eventDate);
          photoDeadline = new Date(event.eventDate);
          albumDeadline = new Date(event.eventDate);
          preWedPhotoDeadline = new Date(event.eventDate);
          preWedVideoDeadline = new Date(event.eventDate);
          longFilmDeadline.setDate(
            longFilmDeadline.getDate() + deadlineDays[0].longFilm
          );
          performanceFilmDeadline.setDate(
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
        if (dateforDeliverable == null && i == 0) {
          dateforDeliverable = dayjs(new Date(event.eventDate)).format(
            "YYYY-MM-DD"
          );
        }
        await event.save();
        datesOfClient.push(
          dayjs(new Date(event.eventDate)).format("YYYY-MM-DD")
        );
        return event._id;
      })
    );


    const photosDeliverable = new deliverableModel({
      client: client._id,
      deliverableName: "Photos",
      quantity: 1,
      date: dateforDeliverable,
      photoDeadline,
    });

    await photosDeliverable.save().then(() => {

      deliverables.push(photosDeliverable._id);
    });
    if (req.body.data.promos > 0) {
      for (let i = 0; i < req.body.data.promos; i++) {
        const promoDeliverable = new deliverableModel({
          client: client._id,
          deliverableName: "Promo",
          quantity: 1,
          date: dateforDeliverable,
          promoDeadline,
        });
        
        await promoDeliverable.save().then(() => {
          deliverables.push(promoDeliverable._id);
        });
      }
    }
    if (req.body.data.longFilms > 0) {
      for (let i = 0; i < req.body.data.longFilms; i++) {

        const longFilmDeliverable = new deliverableModel({
          client: client._id,
          deliverableName: "Long Film",
          quantity: 1,
          date: dateforDeliverable,
          longFilmDeadline,
        });
        
        await longFilmDeliverable.save().then(() => {
          deliverables.push(longFilmDeliverable._id);
        });
      }
    }
    if (req.body.data.performanceFilms > 0) {
      for (let i = 0; i < req.body.data.performanceFilms; i++) {

        const performanceFilmDeliverable = new deliverableModel({
          client: client._id,
          deliverableName: "Performance Film",
          quantity: 1,
          date: dateforDeliverable,
          performanceFilmDeadline,
        });
        
        await performanceFilmDeliverable.save().then(() => {
          deliverables.push(performanceFilmDeliverable._id);
        });
      }
    }
    if (req.body.data.reels > 0) {
      for (let i = 0; i < req.body.data.reels; i++) {

        const reelDeliverable = new deliverableModel({
          client: client._id,
          deliverableName: "Reel",
          quantity: 1,
          date: dateforDeliverable,
          reelDeadline,
        });
        
        await reelDeliverable.save().then(() => {
          deliverables.push(reelDeliverable._id);
        });
      }
    }
    if (req.body.data?.deliverables?.preWeddingPhotos === true) {
      client.preWedding = true;
      const preWedPhotosDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Pre-Wedding Photos",
        quantity: req.body.data.reels,
        date: dateforDeliverable,
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
        date: dateforDeliverable,
      });

      await preWedVideosDeliverable.save().then(() => {
        deliverables.push(preWedVideosDeliverable._id);
      });
    }

    const albumsDeliverables = await Promise.all(
      req.body.data.albums.map(async (album) => {
        if (album !== "Not included") {
          const newAlbum = new deliverableModel({
            client: client._id,
            deliverableName: album,
            quantity: 1,
            albumDeadline,
            date: dateforDeliverable,
          });
          await newAlbum.save();
          return newAlbum._id;
        } else {
          return null;
        }
      })
    );

    client.events = eventIds;
    client.deliverables = [...deliverables, ...albumsDeliverables];
    client.dates = datesOfClient;
    await client.save();
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

const updateWholeClient = async (req, res) => {
  try {
    const reqClientData = { ...req.body.data };
    const deadlineDays = await deadlineDaysModel.find();
    const clientToEdit = await ClientModel.findById(req.body.data._id).populate(
      "events"
    );
    let preWedPhotoDeadline = null;
    let preWedVideoDeadline = null;
    const weddingEvent = clientToEdit.events.find(
      (event) => event.isWedding === true
    );
    let updatedDate = null;
    if (weddingEvent) {
      preWedPhotoDeadline = new Date(weddingEvent.eventDate);
      preWedVideoDeadline = new Date(weddingEvent.eventDate);
      preWedPhotoDeadline.setDate(
        preWedPhotoDeadline.getDate() + deadlineDays[0].preWedPhoto
      );
      preWedVideoDeadline.setDate(
        preWedVideoDeadline.getDate() + deadlineDays[0].preWedVideo
      );
      updatedDate = dayjs(new Date(weddingEvent.eventDate)).format(
        "YYYY-MM-DD"
      );
    } else {
      preWedPhotoDeadline = new Date(clientToEdit.events[0]?.eventDate);
      preWedVideoDeadline = new Date(clientToEdit.events[0]?.eventDate);
      preWedPhotoDeadline.setDate(
        preWedPhotoDeadline.getDate() + deadlineDays[0].preWedPhoto
      );
      preWedVideoDeadline.setDate(
        preWedVideoDeadline.getDate() + deadlineDays[0].preWedVideo
      );
      updatedDate = dayjs(new Date(clientToEdit.events[0]?.eventDate)).format(
        "YYYY-MM-DD"
      );
    }
    await Promise.all(
      reqClientData.deliverables.map(async (deliverableData) => {
        if (deliverableData.quantity > 0) {
          const updatedDeliverable = await deliverableModel.findById(
            deliverableData._id
          );
          updatedDeliverable.quantity = deliverableData.quantity;
          updatedDeliverable.date = updatedDate;
          await updatedDeliverable.save();
        } else {
          await deliverableModel.findByIdAndDelete(deliverableData._id);
          clientToEdit.deliverables = clientToEdit.deliverables.filter(
            (deliverableId) => !deliverableId.equals(deliverableData._id)
          );
        }
      })
    );

    if (
      reqClientData?.preWeddingPhotos === true &&
      clientToEdit?.preWeddingPhotos === true
    ) {
      const updatedDeliverable = await deliverableModel.findOne({
        deliverableName: "Pre-Wedding Photos",
        client: clientToEdit._id,
      });
      updatedDeliverable.quantity = reqClientData.reels;
      updatedDeliverable.date = updatedDate;
      await updatedDeliverable.save();
    } else if (
      reqClientData?.preWeddingPhotos === true &&
      clientToEdit?.preWeddingPhotos === false
    ) {
      reqClientData.preWedding = true;
      const newPreWedPhotosDeliverable = new deliverableModel({
        client: clientToEdit._id,
        deliverableName: "Pre-Wedding Photos",
        quantity: reqClientData.reels,
        date: updatedDate,
        preWedPhotoDeadline,
      });
      await newPreWedPhotosDeliverable.save().then(() => {
        clientToEdit.deliverables = [
          ...clientToEdit.deliverables,
          newPreWedPhotosDeliverable._id,
        ];
      });
    } else if (
      reqClientData?.preWeddingPhotos === false &&
      clientToEdit?.preWeddingPhotos === true
    ) {
      const deliverableToDelete = await deliverableModel.findOne({
        deliverableName: "Pre-Wedding Photos",
        client: clientToEdit._id,
      });
      await deliverableModel.findByIdAndDelete(deliverableToDelete._id);
      clientToEdit.deliverables = clientToEdit.deliverables.filter(
        (deliverableId) => !deliverableId.equals(deliverableToDelete._id)
      );
    }

    if (
      reqClientData?.preWeddingVideos === true &&
      clientToEdit?.preWeddingVideos === true
    ) {
      const updatedDeliverable = await deliverableModel.findOne({
        deliverableName: "Pre-Wedding Videos",
        client: clientToEdit._id,
      });
      updatedDeliverable.quantity = reqClientData.reels;
      updatedDeliverable.date = updatedDate;
      await updatedDeliverable.save();
    } else if (
      reqClientData?.preWeddingVideos === true &&
      clientToEdit?.preWeddingVideos === false
    ) {
      reqClientData.preWedding = true;
      const newPreWedVideosDeliverable = new deliverableModel({
        client: clientToEdit._id,
        deliverableName: "Pre-Wedding Videos",
        quantity: reqClientData.reels,
        date: updatedDate,
        preWedPhotoDeadline,
      });
      await newPreWedVideosDeliverable.save().then(() => {
        clientToEdit.deliverables = [
          ...clientToEdit.deliverables,
          newPreWedVideosDeliverable._id,
        ];
      });
    } else if (
      reqClientData?.preWeddingVideos === false &&
      clientToEdit?.preWeddingVideos === true
    ) {
      const deliverableToDelete = await deliverableModel.findOne({
        deliverableName: "Pre-Wedding Videos",
        client: clientToEdit._id,
      });
      await deliverableModel.findByIdAndDelete(deliverableToDelete._id);
      clientToEdit.deliverables = clientToEdit.deliverables.filter(
        (deliverableId) => !deliverableId.equals(deliverableToDelete._id)
      );
    }

    if (
      reqClientData.preWeddingPhotos === false &&
      reqClientData.preWeddingVideos === false
    ) {
      reqClientData.preWedding = false;
      reqClientData.preWeddingDetails = null;
      reqClientData.preWedphotographers = null;
      reqClientData.preWedcinematographers = null;
      reqClientData.preWedassistants = null;
      reqClientData.preWeddrones = null;
    }

    await Promise.all(
      reqClientData.albums.map(async (album) => {
        if (album !== "Not inlcuded") {
          const existAlbum = await deliverableModel.findOne({
            deliverableName: album,
            client: clientToEdit._id,
          });
          if (!existAlbum) {
            const newAlbum = new deliverableModel({
              client: clientToEdit._id,
              deliverableName: album,
              quantity: 1,
              date: updatedDate,
              // albumDeadline,
            });
            await newAlbum.save();
            clientToEdit.deliverables = [
              ...clientToEdit.deliverables,
              newAlbum._id,
            ];
          }
        }
      })
    );

    reqClientData.events = clientToEdit.events.map(
      (eventData) => eventData._id
    );
    reqClientData.deliverables = clientToEdit.deliverables;
    reqClientData.userID = reqClientData.userID._id;
    await ClientModel.findByIdAndUpdate(reqClientData._id, reqClientData);

    res.status(200).json("client Updated SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const getClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;

    const { startDate, endDate, filterClient } = req.query;
    console.log("Get Client", startDate, endDate, filterClient)
    if (
      filterClient !== "null" &&
      filterClient !== "undefined" &&
      filterClient !== "Reset" &&
      filterClient?.length > 0
    ) {
      const client = await ClientModel.findById(filterClient)
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
        })
        .populate("userID");
        console.log(client);
        
      res.status(200).json({ hasMore: false, data: [client] });
    } else {


      const clients = await ClientModel.find({
        dates: {
          $elemMatch: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      })
        .skip(skip)
        .limit(10)
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
        })
        .populate("userID");

      // Determine if there are more objects to fetch
      const hasMore = clients.length === 10;
      res.status(200).json({ hasMore, data: clients });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await ClientModel.find()
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
      })
      .populate("userID");
    res.status(200).json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPreWedClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;

    const { startDate, endDate, } = req.query;



    const clients = await ClientModel.find({
      preWedding: true,
      dates: {
        $elemMatch: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    })
      .skip(skip)
      .limit(10)
      .populate({
        path: "deliverables",
        model: "Deliverable",
        populate: {
          path: "editor",
          model: "user",
        },
      })
      .populate({
        path: "preWeddingDetails",
        populate: [
          { path: "photographers", model: "user" },
          { path: "cinematographers", model: "user" },
          { path: "droneFlyers", model: "user" },
          { path: "assistants", model: "user" },
        ],
      })
      .populate("userID")
      .populate("events");

    // Determine if there are more objects to fetch
    const hasMore = clients.length === 10;
    res.status(200).json({ hasMore, data: clients });
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
    clientToDelete.events.forEach(async (eventId) => {
      await eventModel.findByIdAndDelete(eventId);
    });
    clientToDelete.deliverables.forEach(async (deliverableId) => {
      await deliverableModel.findByIdAndDelete(deliverableId);
    });
    await ClientModel.findByIdAndDelete(clientToDelete._id);
    await TaskModel.deleteMany({ client: clientToDelete._id });

    res.status(200).json("Client Deleted Succcessfully!");
  } catch (error) {
    console.log(error, "error");
  }
};

const adddatesinClients = async () => {
  const allClients = await ClientModel.find().populate("events");
  allClients.forEach(async (client) => {
    let clientDates = [];
    client.events.forEach((event) => {
      clientDates.push(dayjs(event.eventDate).format("YYYY-MM-DD"));
    });
    client.dates = clientDates;
    await ClientModel.findByIdAndUpdate(client._id, client);
  });
  console.log("added dates in clients");
};

module.exports = {
  AddClientFunction,
  getClients,
  getAllClients,
  getClientById,
  getPreWedClients,
  updateClient,
  AddPreWedDetails,
  DeleteClient,
  updateWholeClient,
  adddatesinClients,
};
