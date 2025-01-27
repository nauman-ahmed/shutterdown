const ClientModel = require("../models/ClientModel");
const deadlineDaysModel = require("../models/DeadlineDays");
const deliverableModel = require("../models/DeliverableModel");
const eventModel = require("../models/EventModel");
const EventModel = require("../models/EventModel");
const TaskModel = require("../models/TaskSchema");
const dayjs = require("dayjs");

const AddClientFunction = async (req, res) => {
  try {
    let clientBody = req.body.data;
    const client = new ClientModel(clientBody);
    let deliverables = [];

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
          dateforDeliverable = dayjs(new Date(event.eventDate)).format(
            "YYYY-MM-DD"
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
    for (const deliverable of req.body.data?.deliverables || []) {
      const latestEventDate = deliverable.forEvents
        .map((index) => req.body.data.events[index].eventDate)
        .reduce((max, current) => (max > current ? max : current));
      const forEvents = deliverable.forEvents.map((index) => eventIds[index]);
      const numberInDeliverables = deliverable.number;
      console.log(latestEventDate);

      const photosDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Photos",
        date: latestEventDate,
        forEvents,
        numberInDeliverables,
      });

      await photosDeliverable.save();
      deliverables.push(photosDeliverable._id);

      if (deliverable.promos > 0) {
        for (let i = 0; i < deliverable.promos; i++) {
          const promoDeliverable = new deliverableModel({
            client: client._id,
            deliverableName: "Promo",
            delivNumber: i + 1,
            date: latestEventDate,
            forEvents,
            numberInDeliverables,
          });

          await promoDeliverable.save();
          deliverables.push(promoDeliverable._id);
        }
      }

      if (deliverable.longFilms > 0) {
        for (let i = 0; i < deliverable.longFilms; i++) {
          const longFilmDeliverable = new deliverableModel({
            client: client._id,
            deliverableName: "Long Film",
            delivNumber: i + 1,
            date: latestEventDate,
            forEvents,
            numberInDeliverables,
          });

          await longFilmDeliverable.save();
          deliverables.push(longFilmDeliverable._id);
        }
      }

      if (deliverable.performanceFilms > 0) {
        for (let i = 0; i < deliverable.performanceFilms; i++) {
          const performanceFilmDeliverable = new deliverableModel({
            client: client._id,
            deliverableName: "Performance Film",
            delivNumber: i + 1,
            date: latestEventDate,
            forEvents,
            numberInDeliverables,
          });

          await performanceFilmDeliverable.save();
          deliverables.push(performanceFilmDeliverable._id);
        }
      }

      if (deliverable.reels > 0) {
        for (let i = 0; i < deliverable.reels; i++) {
          const reelDeliverable = new deliverableModel({
            client: client._id,
            deliverableName: "Reel",
            delivNumber: i + 1,
            date: latestEventDate,
            forEvents,
            numberInDeliverables,
          });

          await reelDeliverable.save();
          deliverables.push(reelDeliverable._id);
        }
      }

      const albumsDeliverables = await Promise.all(
        deliverable.albums.map(async (album) => {
          if (album !== "Not included" && album !== "") {
            const newAlbum = new deliverableModel({
              client: client._id,
              deliverableName: album,
              delivNumber: i + 1,
              date: latestEventDate,
              isAlbum: true,
              forEvents,
              numberInDeliverables,
            });
            await newAlbum.save();
            return newAlbum._id;
          } else {
            return null;
          }
        })
      );

      deliverables = [...deliverables, ...albumsDeliverables];
    }

    if (req.body.data?.preWeddingPhotos === true) {
      client.preWedding = true;
      const preWedPhotosDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Pre-Wedding Photos",
        date: dateforDeliverable,
      });

      await preWedPhotosDeliverable.save().then(() => {
        deliverables.push(preWedPhotosDeliverable._id);
      });
    }
    if (req.body.data?.preWeddingVideos === true) {
      client.preWedding = true;
      const preWedVideosDeliverable = new deliverableModel({
        client: client._id,
        deliverableName: "Pre-Wedding Videos",
        date: dateforDeliverable,
      });

      await preWedVideosDeliverable.save().then(() => {
        deliverables.push(preWedVideosDeliverable._id);
      });
    }

    client.events = eventIds;
    client.deliverables = deliverables;
    client.dates = datesOfClient;
    client.deliverablesArr = req.body.data?.deliverables;
    await client.save();
    res.status(200).json(client);
  } catch (error) {
    console.log("Client Form Error", error);
  }
};

const AddPreWedDetails = async (req, res) => {
  try {
    const client = await ClientModel.findById(req.body.client._id)
      .populate("events")
      .populate("deliverables");
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
    const preWedEvent = client.events.find(
      (ev) => ev.eventType === "Pre-Wedding"
    );
    const preWedDeliverables = client.deliverables.filter(
      (deliv) =>
        deliv.deliverableName === "Pre-Wedding Videos" ||
        deliv.deliverableName === "Pre-Wedding Photos"
    );
    if (preWedEvent) {
      await eventModel.findByIdAndUpdate(preWedEvent._id, {
        eventDate: req.body.client.preWeddingDetails.shootStartDate,
        location: client.events.find((ev) => ev.isWedding).location,
        travelBy: client.events.find((ev) => ev.isWedding).travelBy,
        isWedding: false,
        photographers: client.preWedphotographers,
        cinematographers: client.preWedcinematographers,
        drones: client.preWeddrones,
        choosenPhotographers: photographersIds,
        choosenPhotographers: cinematographersIds,
        assistants: assistantsIds,
        droneFlyers: droneFlyersIds,
      });
    } else if (req.body.client.preWeddingDetails.shootStartDate) {
      const preWedEvent = new eventModel({
        client: client._id,
        eventDate: req.body.client.preWeddingDetails.shootStartDate,
        eventType: "Pre-Wedding",
        location: client.events.find((ev) => ev.isWedding).location,
        travelBy: client.events.find((ev) => ev.isWedding).travelBy,
        isWedding: false,
        photographers: client.preWedphotographers,
        cinematographers: client.preWedcinematographers,
        drones: client.preWeddrones,
        choosenPhotographers: photographersIds,
        choosenPhotographers: cinematographersIds,
        assistants: assistantsIds,
        droneFlyers: droneFlyersIds,
      });
      await preWedEvent.save();
    }
    if (req.body.client.preWeddingDetails.shootEndDate) {
      for (const deliv of preWedDeliverables) {
        await deliverableModel.findByIdAndUpdate(deliv._id, {
          date: req.body.client.preWeddingDetails.shootEndDate,
        });
      }
    }
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
    let clientToEdit = await ClientModel.findById(req.body.data._id)
      .populate("events")
      .populate("deliverables");
    let updatedDeliverablesIds = clientToEdit.deliverables.map(
      (deliv) => deliv._id
    );
    let reelsDelivs = await deliverableModel.find({
      deliverableName: "Reel",
      client: clientToEdit._id,
    });
    let promosDelivs = await deliverableModel.find({
      deliverableName: "Promo",
      client: clientToEdit._id,
    });
    let longFilmsDelivs = await deliverableModel.find({
      deliverableName: "Long Film",
      client: clientToEdit._id,
    });
    let performanceFilmsDelivs = await deliverableModel.find({
      deliverableName: "Performance Film",
      client: clientToEdit._id,
    });
    let albumsDelivs = await deliverableModel.find({
      isAlbum: true,
      client: clientToEdit._id,
    });

    let maxReelNumber = reelsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    let maxPromoNumber = promosDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    let maxLongFilmNumber = longFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    let maxPerformanceFilmNumber = performanceFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    let maxAlbumNumber = albumsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    const latestEventDate = clientToEdit.deliverablesArr[
      clientToEdit.deliverablesArr.length - 1
    ].forEvents
      .map((index) => clientToEdit.events[index].eventDate)
      .reduce((max, current) => (max > current ? max : current));

    const forEvents = clientToEdit.deliverablesArr[
      clientToEdit.deliverablesArr.length - 1
    ].forEvents.map((index) => clientToEdit.events[index]._id);

    // Utility function to adjust deliverables
    async function adjustDeliverables(
      filteredDelivs,
      type,
      requiredCount,
      maxNumber,
      albums
    ) {
      const currentCount = filteredDelivs.length;
      const difference = Number(currentCount) - Number(requiredCount);

      if (type === "Album") {
        if (difference > 0) {
          // Remove extra deliverables
          for (let i = 0; i < difference; i++) {
            const delivToRemove = filteredDelivs.pop();

            // Remove deliverable from the database
            await deliverableModel.findByIdAndDelete(delivToRemove._id);
            // Remove deliverable ID from the client's deliverables array
            updatedDeliverablesIds = updatedDeliverablesIds.filter(
              (id) => id !== delivToRemove._id
            );
          }
          for (let i = 0; i < filteredDelivs.length; i++) {
            await deliverableModel.findByIdAndUpdate(filteredDelivs[i]._id, {
              delivNumber: i + 1,
            });
          }
        } else if (difference < 0) {
          for (let i = 0; i < Math.abs(difference); i++) {
            const newDeliverable = await deliverableModel.create({
              client: clientToEdit._id,
              isAlbum: true,
              deliverableName: albums[albums.length - (i + 1)],
              delivNumber: maxNumber + i + 1, // Assign the next number
              date: latestEventDate,
              forEvents: forEvents,
              numberInDeliverables:
                currentCount > 0
                  ? filteredDelivs[currentCount - 1].numberInDeliverables
                  : clientToEdit.deliverablesArr[
                      clientToEdit.deliverablesArr.length - 1
                    ].number,
              // Add any additional fields required for a new deliverable
            });

            // Add the new deliverable ID to the client's deliverables array
            updatedDeliverablesIds.push(newDeliverable._id);
          }
        }
      } else {
        if (difference > 0) {
          console.log("difference", difference);

          // Remove extra deliverables
          for (let i = 0; i < difference; i++) {
            const delivToRemove = filteredDelivs.pop();

            // Remove deliverable from the database
            await deliverableModel.findByIdAndDelete(delivToRemove._id);
            // Remove deliverable ID from the client's deliverables array
            updatedDeliverablesIds = updatedDeliverablesIds.filter(
              (id) => id !== delivToRemove._id
            );
          }
          for (let i = 0; i < filteredDelivs.length; i++) {
            await deliverableModel.findByIdAndUpdate(filteredDelivs[i]._id, {
              delivNumber: i + 1,
            });
          }
        } else if (difference < 0) {
          // Add missing deliverables
          for (let i = 0; i < Math.abs(difference); i++) {
            const newDeliverable = await deliverableModel.create({
              client: clientToEdit._id,
              deliverableName: type,
              delivNumber: maxNumber + i + 1, // Assign the next number
              date: latestEventDate,
              forEvents: forEvents,
              numberInDeliverables:
                currentCount > 0
                  ? filteredDelivs[currentCount - 1].numberInDeliverables
                  : clientToEdit.deliverablesArr[
                      clientToEdit.deliverablesArr.length - 1
                    ].number,
              // Add any additional fields required for a new deliverable
            });

            // Add the new deliverable ID to the client's deliverables array
            updatedDeliverablesIds.push(newDeliverable._id);
          }
        }
      }
    }

    const totalReelsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.reels) + total,
      0
    );
    const totalPromosNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.promos) + total,
      0
    );
    const totalLongFilmsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.longFilms) + total,
      0
    );
    const totalperformanceFilmsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.performanceFilms) + total,
      0
    );
    const totalAlbumsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) =>
        delivObj.albums?.filter(
          (album) =>
            album !== "Not included" && album !== "" && album !== undefined
        )?.length + total,
      0
    );
    let albumsNames = [];
    clientToEdit?.deliverablesArr?.forEach((delivObj) =>
      delivObj.albums?.forEach(
        (album) => album !== "Not included" && albumsNames.push(album)
      )
    );
    await adjustDeliverables(
      reelsDelivs || [],
      "Reel",
      totalReelsNum,
      maxReelNumber
    );
    await adjustDeliverables(
      promosDelivs || [],
      "Promo",
      totalPromosNum,
      maxPromoNumber
    );
    await adjustDeliverables(
      longFilmsDelivs || [],
      "Long Film",
      totalLongFilmsNum,
      maxLongFilmNumber
    );
    await adjustDeliverables(
      performanceFilmsDelivs || [],
      "Performance Film",
      totalperformanceFilmsNum,
      maxPerformanceFilmNumber
    );
    await adjustDeliverables(
      albumsDelivs || [],
      "Album",
      totalAlbumsNum,
      maxAlbumNumber,
      albumsNames
    );
    clientToEdit.deliverables = updatedDeliverablesIds;
    // Save the updated client with the adjusted deliverables array
    await clientToEdit.save();

    console.log("Deliverables adjusted and saved.");
    clientToEdit = await ClientModel.findById(req.body.data._id)
      .populate("events")
      .populate("deliverables");
    updatedDeliverablesIds = clientToEdit.deliverables.map(
      (deliv) => deliv._id
    );
    reelsDelivs = clientToEdit.deliverables.filter(
      (deliv) => deliv.deliverableName === "Reel"
    );
    promosDelivs = clientToEdit.deliverables.filter(
      (deliv) => deliv.deliverableName === "Promo"
    );
    longFilmsDelivs = clientToEdit.deliverables.filter(
      (deliv) => deliv.deliverableName === "Long Film"
    );
    performanceFilmsDelivs = clientToEdit.deliverables.filter(
      (deliv) => deliv.deliverableName === "Performance Film"
    );
    albumsDelivs = clientToEdit.deliverables.filter((deliv) => deliv.isAlbum);
    maxReelNumber = reelsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    maxPromoNumber = promosDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    maxLongFilmNumber = longFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    maxPerformanceFilmNumber = performanceFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );
    maxAlbumNumber = albumsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber),
      0
    );

    if (
      reqClientData?.deliverablesArr?.length >=
      clientToEdit?.deliverablesArr?.length
    ) {
      for (const deliverableObj of reqClientData?.deliverablesArr || []) {
        const deliverableNumber = deliverableObj.number;
        const latestEventDate = deliverableObj.forEvents
          .map((index) => clientToEdit.events[index].eventDate)
          .reduce((max, current) => (max > current ? max : current));
        const forEvents = deliverableObj.forEvents.map(
          (index) => reqClientData.events[index]._id
        );

        const savedDeliverableObj = clientToEdit?.deliverablesArr.find(
          (delivobj) => delivobj.number == deliverableNumber
        );

        if (!savedDeliverableObj) {
          // New Deliverables Added
          const photosDeliverable = new deliverableModel({
            client: reqClientData._id,
            deliverableName: "Photos",
            date: latestEventDate,
            forEvents,
            numberInDeliverables: deliverableNumber,
          });

          await photosDeliverable.save();
          updatedDeliverablesIds.push(photosDeliverable._id);

          if (deliverableObj.promos > 0) {
            for (let i = 0; i < deliverableObj.promos; i++) {
              const promoDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Promo",
                delivNumber: maxPromoNumber ? i + 1 + maxPromoNumber : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await promoDeliverable.save();
              updatedDeliverablesIds.push(promoDeliverable._id);
            }
          }

          if (deliverableObj.longFilms > 0) {
            for (let i = 0; i < deliverableObj.longFilms; i++) {
              const longFilmDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Long Film",
                delivNumber: maxLongFilmNumber
                  ? i + 1 + maxLongFilmNumber
                  : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await longFilmDeliverable.save();
              updatedDeliverablesIds.push(longFilmDeliverable._id);
            }
          }

          if (deliverableObj.performanceFilms > 0) {
            for (let i = 0; i < deliverableObj.performanceFilms; i++) {
              const performanceFilmDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Performance Film",
                delivNumber: maxPerformanceFilmNumber
                  ? i + 1 + maxPerformanceFilmNumber
                  : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await performanceFilmDeliverable.save();
              updatedDeliverablesIds.push(performanceFilmDeliverable._id);
            }
          }

          if (deliverableObj.reels > 0) {
            for (let i = 0; i < deliverableObj.reels; i++) {
              const reelDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Reel",
                delivNumber: maxReelNumber ? i + 1 + maxReelNumber : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await reelDeliverable.save();
              updatedDeliverablesIds.push(reelDeliverable._id);
            }
          }

          const albumsDeliverablesIds = await Promise.all(
            deliverableObj.albums.map(async (album) => {
              if (album !== "Not included") {
                const newAlbum = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: album,
                  delivNumber: maxAlbumNumber ? i + 1 + maxAlbumNumber : i + 1,
                  date: latestEventDate,
                  isAlbum: true,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });
                await newAlbum.save();
                return newAlbum._id;
              } else {
                return null;
              }
            })
          );

          updatedDeliverablesIds = [
            ...updatedDeliverablesIds,
            albumsDeliverablesIds,
          ];
        } else {
          const photosDeliverable = reqClientData?.deliverables?.find(
            (deliv) =>
              deliv.deliverableName === "Photos" &&
              deliv.numberInDeliverables == deliverableNumber
          );

          await deliverableModel.findByIdAndUpdate(photosDeliverable._id, {
            $set: { forEvents: forEvents, date: latestEventDate },
          });
          if (
            Number(deliverableObj.promos) > Number(savedDeliverableObj.promos)
          ) {
            // More promos added in this number deliverable
            const moreAddedPromo =
              deliverableObj.promos - savedDeliverableObj.promos;
            for (let i = 0; i < moreAddedPromo; i++) {
              const promoDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Promo",
                delivNumber: maxPromoNumber ? i + 1 + maxPromoNumber : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await promoDeliverable.save();
              updatedDeliverablesIds.push(promoDeliverable._id);
            }
          } else if (
            Number(deliverableObj.promos) < Number(savedDeliverableObj.promos)
          ) {
            // Promos are decreaded in this numbe of deliverables
            const savedPromosIds = reqClientData?.deliverables
              ?.filter(
                (deliv) =>
                  deliv.deliverableName === "Promo" &&
                  deliv.numberInDeliverables === deliverableNumber
              )
              ?.map((deliv) => deliv._id);
            const extraPromos =
              savedDeliverableObj.promos - deliverableObj.promos;
            const toRemoveIds = savedPromosIds.slice(-extraPromos);
            const removeIdsSet = new Set(toRemoveIds);
            for (const promoId of toRemoveIds) {
              await deliverableModel.findByIdAndDelete(promoId);
            }
            updatedDeliverablesIds = updatedDeliverablesIds?.filter(
              (delivId) => !removeIdsSet.has(delivId)
            );
          } else {
            const promoDeliverables = clientToEdit?.deliverables?.filter(
              (deliv) =>
                deliv.deliverableName === "Promo" &&
                deliv.numberInDeliverables == deliverableNumber
            );
            if (promoDeliverables?.length < deliverableObj.promos) {
              const moreAddedPromo =
                deliverableObj.promos - promoDeliverables?.length;
              for (let i = 0; i < moreAddedPromo; i++) {
                const promoDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: "Promo",
                  delivNumber: maxPromoNumber ? i + 1 + maxPromoNumber : i + 1,
                  date: latestEventDate,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });

                await promoDeliverable.save();
                updatedDeliverablesIds.push(promoDeliverable._id);
              }
            } else if (promoDeliverables?.length > deliverableObj.promos) {
              const savedPromosIds = promoDeliverables?.map(
                (deliv) => deliv._id
              );
              const extraPromos =
                promoDeliverables?.length - deliverableObj.promos;
              const toRemoveIds = savedPromosIds.slice(-extraPromos);
              const removeIdsSet = new Set(toRemoveIds);
              for (const promoId of toRemoveIds) {
                await deliverableModel.findByIdAndDelete(promoId);
              }
              updatedDeliverablesIds = updatedDeliverablesIds?.filter(
                (delivId) => !removeIdsSet.has(delivId)
              );
            } else {
              for (let i = 0; i < promoDeliverables?.length; i++) {
                // console.log(LPPPRDeliverables[i]);

                await deliverableModel.findByIdAndUpdate(
                  promoDeliverables[i]?._id,
                  { $set: { forEvents: forEvents, date: latestEventDate } }
                );
              }
            }
          }

          if (deliverableObj.longFilms > savedDeliverableObj.longFilms) {
            // More long films added in this number deliverable
            const moreAddedLongFilms =
              deliverableObj.longFilms - savedDeliverableObj.longFilms;
            for (let i = 0; i < moreAddedLongFilms; i++) {
              const longFilmDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Long Film",
                delivNumber: maxLongFilmNumber
                  ? i + 1 + maxLongFilmNumber
                  : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await longFilmDeliverable.save();
              updatedDeliverablesIds.push(longFilmDeliverable._id);
            }
          } else if (deliverableObj.longFilms < savedDeliverableObj.longFilms) {
            // Long Films are decreaded in this numbe of deliverables
            const savedLongFilmsIds = reqClientData?.deliverables
              ?.filter(
                (deliv) =>
                  deliv.deliverableName === "Long Film" &&
                  deliv.numberInDeliverables === deliverableNumber
              )
              ?.map((deliv) => deliv._id);
            const extraLongFilms =
              savedDeliverableObj.longFilms - deliverableObj.longFilms;
            const toRemoveIds = savedLongFilmsIds.slice(-extraLongFilms);
            const removeIdsSet = new Set(toRemoveIds);
            for (const longFilmId of toRemoveIds) {
              await deliverableModel.findByIdAndDelete(longFilmId);
            }
            updatedDeliverablesIds = updatedDeliverablesIds?.filter(
              (delivId) => !removeIdsSet.has(delivId)
            );
          } else {
            const longFilmDeliverables = clientToEdit?.deliverables?.filter(
              (deliv) =>
                deliv.deliverableName === "Long Film" &&
                deliv.numberInDeliverables == deliverableNumber
            );
            if (longFilmDeliverables?.length < deliverableObj.longFilms) {
              const moreAddedLongFilms =
                deliverableObj.longFilms - longFilmDeliverables?.length;
              for (let i = 0; i < moreAddedLongFilms; i++) {
                const longFilmDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: "Long Film",
                  delivNumber: maxLongFilmNumber
                    ? i + 1 + maxLongFilmNumber
                    : i + 1,
                  date: latestEventDate,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });

                await longFilmDeliverable.save();
                updatedDeliverablesIds.push(longFilmDeliverable._id);
              }
            } else if (
              longFilmDeliverables?.length > deliverableObj.longFilms
            ) {
              const savedIds = longFilmDeliverables?.map((deliv) => deliv._id);
              const extraLongFilms =
                longFilmDeliverables?.length - deliverableObj.longFilms;
              const toRemoveIds = savedIds.slice(-extraLongFilms);
              const removeIdsSet = new Set(toRemoveIds);
              for (const longFilmId of toRemoveIds) {
                await deliverableModel.findByIdAndDelete(longFilmId);
              }
              updatedDeliverablesIds = updatedDeliverablesIds?.filter(
                (delivId) => !removeIdsSet.has(delivId)
              );
            } else {
              for (let i = 0; i < longFilmDeliverables?.length; i++) {
                await deliverableModel.findByIdAndUpdate(
                  longFilmDeliverables[i]?._id,
                  { $set: { forEvents: forEvents, date: latestEventDate } }
                );
              }
            }
          }

          if (
            deliverableObj.performanceFilms >
            savedDeliverableObj.performanceFilms
          ) {
            // More Performance films added in this number deliverable
            const moreAddedPerformanceFilms =
              deliverableObj.performanceFilms -
              savedDeliverableObj.performanceFilms;
            for (let i = 0; i < moreAddedPerformanceFilms; i++) {
              const performanceFilmDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Performance Film",
                delivNumber: maxPerformanceFilmNumber
                  ? i + 1 + maxPerformanceFilmNumber
                  : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await performanceFilmDeliverable.save();
              updatedDeliverablesIds.push(performanceFilmDeliverable._id);
            }
          } else if (
            deliverableObj.performanceFilms <
            savedDeliverableObj.performanceFilms
          ) {
            // Performance Films are decreaded in this numbe of deliverables
            const savedPerformanceFilmsIds = reqClientData?.deliverables
              ?.filter(
                (deliv) =>
                  deliv.deliverableName === "Performance Film" &&
                  deliv.numberInDeliverables === deliverableNumber
              )
              ?.map((deliv) => deliv._id);
            const extraPerformanceFilms =
              savedDeliverableObj.performanceFilms -
              deliverableObj.performanceFilms;
            const toRemoveIds = savedPerformanceFilmsIds.slice(
              -extraPerformanceFilms
            );
            const removeIdsSet = new Set(toRemoveIds);
            for (const performanceFilmId of toRemoveIds) {
              await deliverableModel.findByIdAndDelete(performanceFilmId);
            }
            updatedDeliverablesIds = updatedDeliverablesIds?.filter(
              (delivId) => !removeIdsSet.has(delivId)
            );
          } else {
            const performanceFilmDeliverables =
              clientToEdit?.deliverables?.filter(
                (deliv) =>
                  deliv.deliverableName === "Performance Film" &&
                  deliv.numberInDeliverables == deliverableNumber
              );
            if (
              performanceFilmDeliverables?.length <
              deliverableObj.performanceFilms
            ) {
              const moreAddedPerformanceFilms =
                deliverableObj.performanceFilms -
                performanceFilmDeliverables?.length;
              for (let i = 0; i < moreAddedPerformanceFilms; i++) {
                const performanceFilmDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: "Performance Film",
                  delivNumber: maxPerformanceFilmNumber
                    ? i + 1 + maxPerformanceFilmNumber
                    : i + 1,
                  date: latestEventDate,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });

                await performanceFilmDeliverable.save();
                updatedDeliverablesIds.push(performanceFilmDeliverable._id);
              }
            } else if (
              performanceFilmDeliverables?.length >
              deliverableObj.performanceFilms
            ) {
              const savedIds = performanceFilmDeliverables?.map(
                (deliv) => deliv._id
              );
              const extraPerformanceFilms =
                performanceFilmDeliverables?.length -
                deliverableObj.performanceFilms;
              const toRemoveIds = savedIds.slice(-extraPerformanceFilms);
              const removeIdsSet = new Set(toRemoveIds);
              for (const performanceFilmId of toRemoveIds) {
                await deliverableModel.findByIdAndDelete(performanceFilmId);
              }
              updatedDeliverablesIds = updatedDeliverablesIds?.filter(
                (delivId) => !removeIdsSet.has(delivId)
              );
            } else {
              for (let i = 0; i < performanceFilmDeliverables?.length; i++) {
                await deliverableModel.findByIdAndUpdate(
                  performanceFilmDeliverables[i]?._id,
                  { $set: { forEvents: forEvents, date: latestEventDate } }
                );
              }
            }
          }

          if (deliverableObj.reels > savedDeliverableObj.reels) {
            // More Reels added in this number deliverable
            const moreAddedReels =
              deliverableObj.reels - savedDeliverableObj.reels;
            for (let i = 0; i < moreAddedReels; i++) {
              const reelDeliverable = new deliverableModel({
                client: reqClientData._id,
                deliverableName: "Reel",
                delivNumber: maxReelNumber ? i + 1 + maxReelNumber : i + 1,
                date: latestEventDate,
                forEvents,
                numberInDeliverables: deliverableNumber,
              });

              await reelDeliverable.save();
              updatedDeliverablesIds.push(reelDeliverable._id);
            }
          } else if (deliverableObj.reels < savedDeliverableObj.reels) {
            // Reels are decreaded in this numbe of deliverables
            const savedReelsIds = reqClientData?.deliverables
              ?.filter(
                (deliv) =>
                  deliv.deliverableName === "Reel" &&
                  deliv.numberInDeliverables === deliverableNumber
              )
              ?.map((deliv) => deliv._id);
            const extraReels = savedDeliverableObj.reels - deliverableObj.reels;
            const toRemoveIds = savedReelsIds.slice(-extraReels);
            const removeIdsSet = new Set(toRemoveIds);
            for (const reelId of toRemoveIds) {
              await deliverableModel.findByIdAndDelete(reelId);
            }
            updatedDeliverablesIds = updatedDeliverablesIds?.filter(
              (delivId) => !removeIdsSet.has(delivId)
            );
          } else {
            const reelDeliverables = clientToEdit?.deliverables?.filter(
              (deliv) =>
                deliv.deliverableName === "Reel" &&
                deliv.numberInDeliverables == deliverableNumber
            );
            if (reelDeliverables?.length < deliverableObj.reels) {
              const moreAddedReels =
                deliverableObj.reels - reelDeliverables?.length;
              for (let i = 0; i < moreAddedReels; i++) {
                const reelDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: "Reel",
                  delivNumber: maxReelNumber ? i + 1 + maxReelNumber : i + 1,
                  date: latestEventDate,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });

                await reelDeliverable.save();
                updatedDeliverablesIds.push(reelDeliverable._id);
              }
            } else if (reelDeliverables?.length > deliverableObj.reels) {
              const savedIds = reelDeliverables?.map((deliv) => deliv._id);
              const extraReels =
                reelDeliverables?.length - deliverableObj.reels;
              const toRemoveIds = savedIds.slice(-extraReels);
              const removeIdsSet = new Set(toRemoveIds);
              for (const reelId of toRemoveIds) {
                await deliverableModel.findByIdAndDelete(reelId);
              }
              updatedDeliverablesIds = updatedDeliverablesIds?.filter(
                (delivId) => !removeIdsSet.has(delivId)
              );
            } else {
              for (let i = 0; i < reelDeliverables?.length; i++) {
                await deliverableModel.findByIdAndUpdate(
                  reelDeliverables[i]?._id,
                  { $set: { forEvents: forEvents, date: latestEventDate } }
                );
              }
            }
          }

          if (
            deliverableObj.albums?.length > savedDeliverableObj.albums?.length
          ) {
            const savedAlbumsDeliverable = reqClientData?.deliverables?.filter(
              (deliv) =>
                deliv.isAlbum === true &&
                deliv.numberInDeliverables == deliverableNumber
            );
            // loop til already added albums
            for (let i = 0; i < savedDeliverableObj.albums?.length; i++) {
              if (
                deliverableObj.albums[i] === "" ||
                deliverableObj.albums[i] === "Not included"
              ) {
                await deliverableModel.findByIdAndDelete(
                  savedAlbumsDeliverable[i]?._id
                );
              } else {
                await deliverableModel.findByIdAndUpdate(
                  savedAlbumsDeliverable[i]?._id,
                  {
                    $set: {
                      forEvents: forEvents,
                      date: latestEventDate,
                      deliverableName: deliverableObj?.albums[i],
                    },
                  }
                );
              }
            }
            // loop for new added albums
            for (
              let i = savedDeliverableObj.albums?.length;
              i < deliverableObj.albums?.length;
              i++
            ) {
              if (
                deliverableObj?.albums[i] !== "Not included" &&
                deliverableObj?.albums[i] !== ""
              ) {
                const albumDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: deliverableObj?.albums[i],
                  delivNumber: maxAlbumNumber ? i + 1 + maxAlbumNumber : i + 1,
                  date: latestEventDate,
                  forEvents,
                  isAlbum: true,
                  numberInDeliverables: deliverableNumber,
                });

                await albumDeliverable.save();
                updatedDeliverablesIds.push(albumDeliverable._id);
              }
            }
          } else if (
            deliverableObj.albums?.length < savedDeliverableObj.albums?.length
          ) {
            // albums are decreaded in this numbe of deliverables
            const savedAlbumsDeliverable = reqClientData?.deliverables?.filter(
              (deliv) =>
                deliv.isAlbum === true &&
                deliv.numberInDeliverables == deliverableNumber
            );
            const savedAlbumsIds = savedAlbumsDeliverable?.map(
              (deliv) => deliv._id
            );
            const extraAlbums =
              savedDeliverableObj?.albums?.length -
              deliverableObj?.albums?.length;
            const toRemoveIds = savedAlbumsIds.slice(-extraAlbums);
            const removeIdsSet = new Set(toRemoveIds);
            for (const albumId of toRemoveIds) {
              await deliverableModel.findByIdAndDelete(albumId);
            }
            updatedDeliverablesIds = updatedDeliverablesIds?.filter(
              (delivId) => !removeIdsSet.has(delivId)
            );
            for (let i = 0; i < deliverableObj.albums?.length; i++) {
              if (
                deliverableObj.albums[i] === "" ||
                deliverableObj.albums[i] === "Not included"
              ) {
                await deliverableModel.findByIdAndDelete(
                  savedAlbumsDeliverable[i]?._id
                );
              } else {
                await deliverableModel.findByIdAndUpdate(
                  savedAlbumsDeliverable[i]?._id,
                  {
                    $set: {
                      forEvents: forEvents,
                      date: latestEventDate,
                      deliverableName: deliverableObj?.albums[i],
                    },
                  }
                );
              }
            }
          } else if (
            deliverableObj.albums?.length === savedDeliverableObj.albums?.length
          ) {
            const savedAlbumsDeliverable = reqClientData?.deliverables?.filter(
              (deliv) =>
                deliv.isAlbum === true &&
                deliv.numberInDeliverables == deliverableNumber
            );

            for (let i = 0; i < deliverableObj.albums?.length; i++) {
              if (
                deliverableObj.albums[i] === "" ||
                deliverableObj.albums[i] === "Not included"
              ) {
                await deliverableModel.findByIdAndDelete(
                  savedAlbumsDeliverable[i]?._id
                );
              } else {
                await deliverableModel.findByIdAndUpdate(
                  savedAlbumsDeliverable[i]?._id,
                  {
                    $set: {
                      forEvents: forEvents,
                      date: latestEventDate,
                      deliverableName: deliverableObj?.albums[i],
                    },
                  }
                );
              }
            }
          }
        }
      }
    } else {
      const decreasedDeliverableNumber =
        clientToEdit?.deliverablesArr?.length -
        reqClientData?.deliverablesArr?.length;
      const toRemoveDeliverable = clientToEdit?.deliverablesArr.slice(
        -decreasedDeliverableNumber
      );
      for (let i = 0; i < toRemoveDeliverable?.length; i++) {
        const deliverableObjNumber = toRemoveDeliverable[i].number;
        const numberDeliverables = await deliverableModel.find({
          client: reqClientData?._id,
          numberInDeliverables: deliverableObjNumber,
        });
        const numberDeliverablesIds = numberDeliverables.map(
          (deliv) => deliv._id
        );
        updatedDeliverablesIds = updatedDeliverablesIds.filter(
          (deliv) => !numberDeliverablesIds.includes(deliv._id)
        );
        await deliverableModel.deleteMany({
          client: reqClientData?._id,
          numberInDeliverables: deliverableObjNumber,
        });
      }
    }

    clientToEdit.deliverables = updatedDeliverablesIds;

    const weddingEvent = clientToEdit.events.find(
      (event) => event.isWedding === true
    );
    let updatedDate = null;
    if (weddingEvent) {
      updatedDate = dayjs(new Date(weddingEvent.eventDate)).format(
        "YYYY-MM-DD"
      );
    } else {
      updatedDate = dayjs(new Date(clientToEdit.events[0]?.eventDate)).format(
        "YYYY-MM-DD"
      );
    }

    if (
      reqClientData?.preWeddingPhotos === true &&
      clientToEdit?.preWeddingPhotos === true
    ) {
      const updatedDeliverable = await deliverableModel.findOne({
        deliverableName: "Pre-Wedding Photos",
        client: clientToEdit._id,
      });
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
    const { startDate, endDate, filterClient } = req.query;
    console.log("Get Client", startDate, endDate, filterClient);
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
    const { startDate, endDate } = req.query;
    const clients = await ClientModel.find({
      preWedding: true,
      dates: {
        $elemMatch: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    })
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

    res.status(200).json({ data: clients });
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
