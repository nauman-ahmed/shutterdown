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
        deliverable.albums.map(async (album, i) => {
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
    console.log(req.body);
    
    await ClientModel.findByIdAndUpdate(req.body.client._id, req.body.client);
    res.status(200).json("client Updated SucccessFully");
  } catch (error) {
    console.log(error, "error");
  }
};

const updateWholeClient = async (req, res) => {
  try {
    const reqClientData = { ...req.body.data };
    
    // Start a session for transaction if your MongoDB version supports it
    // const session = await mongoose.startSession();
    // session.startTransaction();
    
    // Fetch client with populated data
    let clientToEdit = await ClientModel.findById(req.body.data._id)
      .populate("events")
      .populate("deliverables");
      
    if (!clientToEdit) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    // Get all deliverable IDs
    let updatedDeliverablesIds = clientToEdit.deliverables.map(deliv => deliv._id);
    
    // Retrieve all deliverable types for this client
    let reelsDelivs = await deliverableModel.find({
      deliverableName: "Reel",
      client: clientToEdit._id
    });
    let promosDelivs = await deliverableModel.find({
      deliverableName: "Promo",
      client: clientToEdit._id
    });
    let longFilmsDelivs = await deliverableModel.find({
      deliverableName: "Long Film",
      client: clientToEdit._id
    });
    let performanceFilmsDelivs = await deliverableModel.find({
      deliverableName: "Performance Film",
      client: clientToEdit._id
    });
    let albumsDelivs = await deliverableModel.find({
      isAlbum: true,
      client: clientToEdit._id
    });

    // Calculate max numbers for each deliverable type
    let maxReelNumber = reelsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    let maxPromoNumber = promosDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    let maxLongFilmNumber = longFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    let maxPerformanceFilmNumber = performanceFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    let maxAlbumNumber = albumsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    
    // Handle potential missing data gracefully
    const latestDeliverableObj = clientToEdit.deliverablesArr[
      clientToEdit.deliverablesArr.length - 1
    ];
    
    if (!latestDeliverableObj || !latestDeliverableObj.forEvents || 
        !clientToEdit.events || clientToEdit.events.length === 0) {
      return res.status(400).json({ error: "Missing required client data" });
    }
    
    // Get latest event date
    const latestEventDate = latestDeliverableObj.forEvents
      .map(index => {
        const event = clientToEdit.events[index];
        return event ? event.eventDate : null;
      })
      .filter(Boolean)
      .reduce((max, current) => max > current ? max : current, new Date(0));
      
    // Get event IDs
    const forEvents = latestDeliverableObj.forEvents
      .map(index => {
        const event = clientToEdit.events[index];
        return event ? event._id : null;
      })
      .filter(Boolean);

    // Utility function to adjust deliverables
    async function adjustDeliverables(
      filteredDelivs,
      type,
      requiredCount,
      maxNumber,
      albums = []
    ) {
      try {
        if (!Array.isArray(filteredDelivs)) {
          console.error(`filteredDelivs is not an array for type: ${type}`);
          return;
        }
        
        // Convert to numbers to ensure proper comparison
        const currentCount = Number(filteredDelivs.length);
        const required = Number(requiredCount);
        let difference = currentCount - required;

        if (type === "Album") {
          if (difference > 0) {
            // Remove extra deliverables
            for (let i = 0; i < difference; i++) {
              if (filteredDelivs.length === 0) break;
              
              const delivToRemove = filteredDelivs.pop();
              
              if (!delivToRemove || !delivToRemove._id) continue;

              // Remove deliverable from the database
              await deliverableModel.findByIdAndDelete(delivToRemove._id);
              
              // Remove deliverable ID from the client's deliverables array
              updatedDeliverablesIds = updatedDeliverablesIds.filter(
                id => !id.equals(delivToRemove._id)
              );
            }
            
            // Update remaining deliverables' numbers
            for (let i = 0; i < filteredDelivs.length; i++) {
              if (!filteredDelivs[i] || !filteredDelivs[i]._id) continue;
              
              await deliverableModel.findByIdAndUpdate(filteredDelivs[i]._id, {
                delivNumber: i + 1
              });
            }
          } else if (difference < 0) {
            // Add missing album deliverables
            for (let i = 0; i < Math.abs(difference); i++) {
              // Check if there's a valid album name at this position
              const albumIndex = albums.length - (i + 1);
              if (albumIndex < 0 || !albums[albumIndex] || 
                  albums[albumIndex] === "Not included" || albums[albumIndex] === "") {
                continue;
              }
              
              const newDeliverable = await deliverableModel.create({
                client: clientToEdit._id,
                isAlbum: true,
                deliverableName: albums[albumIndex],
                delivNumber: maxNumber + i + 1, // Assign the next number
                date: latestEventDate,
                forEvents: forEvents,
                numberInDeliverables: currentCount > 0 && filteredDelivs[currentCount - 1]
                  ? filteredDelivs[currentCount - 1].numberInDeliverables
                  : latestDeliverableObj.number
              });

              // Add the new deliverable ID to the client's deliverables array
              updatedDeliverablesIds.push(newDeliverable._id);
            }
          }
        } else {
          // Handle non-album deliverable types
          if (difference > 0) {
            // Remove extra deliverables
            for (let i = 0; i < difference; i++) {
              if (filteredDelivs.length === 0) break;
              
              const delivToRemove = filteredDelivs.pop();
              
              if (!delivToRemove || !delivToRemove._id) continue;

              // Remove deliverable from the database
              await deliverableModel.findByIdAndDelete(delivToRemove._id);
              
              // Remove deliverable ID from the client's deliverables array
              updatedDeliverablesIds = updatedDeliverablesIds.filter(
                id => !id.equals(delivToRemove._id)
              );
            }
            
            // Update remaining deliverables' numbers
            for (let i = 0; i < filteredDelivs.length; i++) {
              if (!filteredDelivs[i] || !filteredDelivs[i]._id) continue;
              
              await deliverableModel.findByIdAndUpdate(filteredDelivs[i]._id, {
                delivNumber: i + 1
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
                numberInDeliverables: currentCount > 0 && filteredDelivs[currentCount - 1]
                  ? filteredDelivs[currentCount - 1].numberInDeliverables
                  : latestDeliverableObj.number
              });

              // Add the new deliverable ID to the client's deliverables array
              updatedDeliverablesIds.push(newDeliverable._id);
            }
          }
        }
      } catch (error) {
        console.error(`Error in adjustDeliverables for type ${type}:`, error);
      }
    }

    // Calculate total deliverables counts
    const totalReelsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.reels || 0) + total, 0
    ) || 0;
    
    const totalPromosNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.promos || 0) + total, 0
    ) || 0;
    
    const totalLongFilmsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.longFilms || 0) + total, 0
    ) || 0;
    
    const totalperformanceFilmsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => Number(delivObj.performanceFilms || 0) + total, 0
    ) || 0;
    
    const totalAlbumsNum = clientToEdit?.deliverablesArr?.reduce(
      (total, delivObj) => {
        if (!delivObj.albums) return total;
        return delivObj.albums.filter(
          album => album && album !== "Not included" && album !== ""
        ).length + total;
      }, 0
    ) || 0;
    
    // Collect album names
    let albumsNames = [];
    if (clientToEdit?.deliverablesArr) {
      clientToEdit.deliverablesArr.forEach(delivObj => {
        if (delivObj.albums) {
          delivObj.albums.forEach(album => {
            if (album && album !== "Not included" && album !== "") {
              albumsNames.push(album);
            }
          });
        }
      });
    }

    // Adjust all deliverable types
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
    
    // Update client's deliverables array
    clientToEdit.deliverables = updatedDeliverablesIds;
    
    // Save the updated client with the adjusted deliverables array
    await clientToEdit.save();
    console.log("Deliverables adjusted and saved.");
    
    // Re-fetch the client with updated data
    clientToEdit = await ClientModel.findById(req.body.data._id)
      .populate("events")
      .populate("deliverables");
      
    if (!clientToEdit) {
      return res.status(404).json({ error: "Client not found after update" });
    }
    
    // Re-populate variables with updated data
    updatedDeliverablesIds = clientToEdit.deliverables.map(deliv => deliv._id);
    
    reelsDelivs = clientToEdit.deliverables.filter(
      deliv => deliv.deliverableName === "Reel"
    );
    
    promosDelivs = clientToEdit.deliverables.filter(
      deliv => deliv.deliverableName === "Promo"
    );
    
    longFilmsDelivs = clientToEdit.deliverables.filter(
      deliv => deliv.deliverableName === "Long Film"
    );
    
    performanceFilmsDelivs = clientToEdit.deliverables.filter(
      deliv => deliv.deliverableName === "Performance Film"
    );
    
    albumsDelivs = clientToEdit.deliverables.filter(deliv => deliv.isAlbum);
    
    // Recalculate max numbers
    maxReelNumber = reelsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    
    maxPromoNumber = promosDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    
    maxLongFilmNumber = longFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    
    maxPerformanceFilmNumber = performanceFilmsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );
    
    maxAlbumNumber = albumsDelivs.reduce(
      (max, deliv) => Math.max(max, deliv.delivNumber || 0), 0
    );

    // Process requested deliverables array changes
    if (reqClientData?.deliverablesArr?.length >= clientToEdit?.deliverablesArr?.length) {
      // Handle adding or updating deliverables
      for (const deliverableObj of reqClientData?.deliverablesArr || []) {
        if (!deliverableObj) continue;
        
        const deliverableNumber = deliverableObj.number;
        
        // Skip if forEvents is missing or events array is empty
        if (!deliverableObj.forEvents || !Array.isArray(deliverableObj.forEvents) || 
            !clientToEdit.events || clientToEdit.events.length === 0) {
          continue;
        }
        
        // Find valid event dates
        const validEventDates = deliverableObj.forEvents
          .map(index => {
            const event = clientToEdit.events[index];
            return event ? event.eventDate : null;
          })
          .filter(Boolean);
          
        if (validEventDates.length === 0) continue;
        
        // Get latest event date
        const latestEventDate = validEventDates.reduce(
          (max, current) => max > current ? max : current, new Date(0)
        );
        
        // Get event IDs
        const forEvents = deliverableObj.forEvents
          .map(index => {
            if (!reqClientData.events || !reqClientData.events[index]) return null;
            return reqClientData.events[index]._id;
          })
          .filter(Boolean);
          
        if (forEvents.length === 0) continue;

        const savedDeliverableObj = clientToEdit?.deliverablesArr.find(
          delivobj => delivobj.number == deliverableNumber
        );

        if (!savedDeliverableObj) {
          // Handle creating new deliverable set
          try {
            // Create Photos deliverable
            const photosDeliverable = new deliverableModel({
              client: reqClientData._id,
              deliverableName: "Photos",
              date: latestEventDate,
              forEvents,
              numberInDeliverables: deliverableNumber,
            });
            
            await photosDeliverable.save();
            updatedDeliverablesIds.push(photosDeliverable._id);
            
            // Create Promo deliverables
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
            
            // Create Long Film deliverables
            if (deliverableObj.longFilms > 0) {
              for (let i = 0; i < deliverableObj.longFilms; i++) {
                const longFilmDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: "Long Film",
                  delivNumber: maxLongFilmNumber ? i + 1 + maxLongFilmNumber : i + 1,
                  date: latestEventDate,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });
                
                await longFilmDeliverable.save();
                updatedDeliverablesIds.push(longFilmDeliverable._id);
              }
            }
            
            // Create Performance Film deliverables
            if (deliverableObj.performanceFilms > 0) {
              for (let i = 0; i < deliverableObj.performanceFilms; i++) {
                const performanceFilmDeliverable = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: "Performance Film",
                  delivNumber: maxPerformanceFilmNumber ? i + 1 + maxPerformanceFilmNumber : i + 1,
                  date: latestEventDate,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });
                
                await performanceFilmDeliverable.save();
                updatedDeliverablesIds.push(performanceFilmDeliverable._id);
              }
            }
            
            // Create Reel deliverables
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
            
            // Create Album deliverables
            if (deliverableObj.albums && Array.isArray(deliverableObj.albums)) {
              const validAlbums = deliverableObj.albums.filter(
                album => album && album !== "Not included" && album !== ""
              );
              
              for (let i = 0; i < validAlbums.length; i++) {
                const newAlbum = new deliverableModel({
                  client: reqClientData._id,
                  deliverableName: validAlbums[i],
                  delivNumber: maxAlbumNumber ? i + 1 + maxAlbumNumber : i + 1,
                  date: latestEventDate,
                  isAlbum: true,
                  forEvents,
                  numberInDeliverables: deliverableNumber,
                });
                
                await newAlbum.save();
                updatedDeliverablesIds.push(newAlbum._id);
              }
            }
          } catch (error) {
            console.error("Error creating new deliverable set:", error);
          }
        } else {
          // Update existing deliverable set
          try {
            const photosDeliverable = reqClientData?.deliverables?.find(
              deliv => 
                deliv.deliverableName === "Photos" &&
                deliv.numberInDeliverables == deliverableNumber
            );

            if (photosDeliverable && photosDeliverable._id) {
              await deliverableModel.findByIdAndUpdate(photosDeliverable._id, {
                $set: { forEvents: forEvents, date: latestEventDate },
              });
            }
            
            // Handle Promo deliverables
            await handleDeliverableTypeUpdate(
              "Promo",
              deliverableNumber,
              deliverableObj.promos,
              savedDeliverableObj.promos,
              reqClientData,
              clientToEdit,
              maxPromoNumber,
              latestEventDate,
              forEvents,
              updatedDeliverablesIds
            );
            
            // Handle Long Film deliverables
            await handleDeliverableTypeUpdate(
              "Long Film",
              deliverableNumber,
              deliverableObj.longFilms,
              savedDeliverableObj.longFilms,
              reqClientData,
              clientToEdit,
              maxLongFilmNumber,
              latestEventDate,
              forEvents,
              updatedDeliverablesIds
            );
            
            // Handle Performance Film deliverables
            await handleDeliverableTypeUpdate(
              "Performance Film",
              deliverableNumber,
              deliverableObj.performanceFilms,
              savedDeliverableObj.performanceFilms,
              reqClientData,
              clientToEdit,
              maxPerformanceFilmNumber,
              latestEventDate,
              forEvents,
              updatedDeliverablesIds
            );
            
            // Handle Reel deliverables
            await handleDeliverableTypeUpdate(
              "Reel",
              deliverableNumber,
              deliverableObj.reels,
              savedDeliverableObj.reels,
              reqClientData,
              clientToEdit,
              maxReelNumber,
              latestEventDate,
              forEvents,
              updatedDeliverablesIds
            );
            
            // Handle Album deliverables
            await handleAlbumUpdate(
              deliverableNumber,
              deliverableObj.albums,
              savedDeliverableObj.albums,
              reqClientData,
              maxAlbumNumber,
              latestEventDate,
              forEvents,
              updatedDeliverablesIds
            );
          } catch (error) {
            console.error("Error updating existing deliverable set:", error);
          }
        }
      }
    } else {
      // Remove extra deliverable sets
      try {
        const decreasedDeliverableNumber =
          clientToEdit?.deliverablesArr?.length -
          reqClientData?.deliverablesArr?.length;
          
        if (decreasedDeliverableNumber > 0 && clientToEdit?.deliverablesArr) {
          const toRemoveDeliverable = clientToEdit.deliverablesArr.slice(
            -decreasedDeliverableNumber
          );
          
          for (let i = 0; i < toRemoveDeliverable?.length; i++) {
            const deliverableObjNumber = toRemoveDeliverable[i].number;
            
            if (!deliverableObjNumber) continue;
            
            // Find deliverables to remove
            const numberDeliverables = await deliverableModel.find({
              client: reqClientData?._id,
              numberInDeliverables: deliverableObjNumber,
            });
            
            const numberDeliverablesIds = numberDeliverables.map(deliv => deliv._id);
            
            // Update ID list
            updatedDeliverablesIds = updatedDeliverablesIds.filter(
              delivId => !numberDeliverablesIds.includes(delivId)
            );
            
            // Delete deliverables
            await deliverableModel.deleteMany({
              client: reqClientData?._id,
              numberInDeliverables: deliverableObjNumber,
            });
          }
        }
      } catch (error) {
        console.error("Error removing deliverable sets:", error);
      }
    }

    // Update client's deliverables array
    clientToEdit.deliverables = updatedDeliverablesIds;

    // Handle pre-wedding deliverables
    try {
      const dayjs = require('dayjs'); // Make sure dayjs is imported at the top
      
      // Find wedding event
      const weddingEvent = clientToEdit.events.find(
        event => event.isWedding === true
      );
      
      let updatedDate = null;
      if (weddingEvent) {
        updatedDate = dayjs(new Date(weddingEvent.eventDate)).format("YYYY-MM-DD");
      } else if (clientToEdit.events && clientToEdit.events.length > 0) {
        updatedDate = dayjs(new Date(clientToEdit.events[0]?.eventDate)).format("YYYY-MM-DD");
      } else {
        updatedDate = dayjs(new Date()).format("YYYY-MM-DD");
      }

      // Handle pre-wedding photos
      if (reqClientData?.preWeddingPhotos === true && clientToEdit?.preWeddingPhotos === true) {
        // Update existing
        const updatedDeliverable = await deliverableModel.findOne({
          deliverableName: "Pre-Wedding Photos",
          client: clientToEdit._id,
        });
        
        if (updatedDeliverable) {
          updatedDeliverable.date = updatedDate;
          await updatedDeliverable.save();
        }
      } else if (reqClientData?.preWeddingPhotos === true && clientToEdit?.preWeddingPhotos === false) {
        // Create new
        reqClientData.preWedding = true;
        const newPreWedPhotosDeliverable = new deliverableModel({
          client: clientToEdit._id,
          deliverableName: "Pre-Wedding Photos",
          quantity: reqClientData.reels,
          date: updatedDate,
        });
        
        await newPreWedPhotosDeliverable.save();
        clientToEdit.deliverables.push(newPreWedPhotosDeliverable._id);
      } else if (reqClientData?.preWeddingPhotos === false && clientToEdit?.preWeddingPhotos === true) {
        // Remove existing
        const deliverableToDelete = await deliverableModel.findOne({
          deliverableName: "Pre-Wedding Photos",
          client: clientToEdit._id,
        });
        
        if (deliverableToDelete) {
          await deliverableModel.findByIdAndDelete(deliverableToDelete._id);
          clientToEdit.deliverables = clientToEdit.deliverables.filter(
            deliverableId => !deliverableId.equals(deliverableToDelete._id)
          );
        }
      }

      // Handle pre-wedding videos
      if (reqClientData?.preWeddingVideos === true && clientToEdit?.preWeddingVideos === true) {
        // Update existing
        const updatedDeliverable = await deliverableModel.findOne({
          deliverableName: "Pre-Wedding Videos",
          client: clientToEdit._id,
        });
        
        if (updatedDeliverable) {
          updatedDeliverable.date = updatedDate;
          await updatedDeliverable.save();
        }
      } else if (reqClientData?.preWeddingVideos === true && clientToEdit?.preWeddingVideos === false) {
        // Create new
        reqClientData.preWedding = true;
        const newPreWedVideosDeliverable = new deliverableModel({
          client: clientToEdit._id,
          deliverableName: "Pre-Wedding Videos",
          quantity: reqClientData.reels,
          date: updatedDate,
        });
        
        await newPreWedVideosDeliverable.save();
        clientToEdit.deliverables.push(newPreWedVideosDeliverable._id);
      } else if (reqClientData?.preWeddingVideos === false && clientToEdit?.preWeddingVideos === true) {
        // Remove existing
        const deliverableToDelete = await deliverableModel.findOne({
          deliverableName: "Pre-Wedding Videos",
          client: clientToEdit._id,
        });
        
        if (deliverableToDelete) {
          await deliverableModel.findByIdAndDelete(deliverableToDelete._id);
          clientToEdit.deliverables = clientToEdit.deliverables.filter(
            deliverableId => !deliverableId.equals(deliverableToDelete._id)
          );
        }
      }

      // Reset pre-wedding fields if both options are false
      if (reqClientData.preWeddingPhotos === false && reqClientData.preWeddingVideos === false) {
        reqClientData.preWedding = false;
        reqClientData.preWeddingDetails = null;
        reqClientData.preWedphotographers = null;
        reqClientData.preWedcinematographers = null;
        reqClientData.preWedassistants = null;
        reqClientData.preWeddrones = null;
      }
    } catch (error) {
      console.error("Error handling pre-wedding deliverables:", error);
    }

    // Prepare data for final update
    try {
      reqClientData.events = clientToEdit.events.map(eventData => eventData._id);
      reqClientData.deliverables = clientToEdit.deliverables;
      
      // Handle userID properly
      if (reqClientData.userID && typeof reqClientData.userID === 'object') {
        reqClientData.userID = reqClientData.userID._id;
      }
      
      // Update client
      await ClientModel.findByIdAndUpdate(reqClientData._id, reqClientData);
      
      // If using transactions
      // await session.commitTransaction();
      // session.endSession();
      
      return res.status(200).json({ success: true, message: "Client updated successfully" });
    } catch (error) {
      // If using transactions
      // await session.abortTransaction();
      // session.endSession();
      
      console.error("Error in final client update:", error);
      return res.status(500).json({ error: "Failed to update client" });
    }
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Helper function for handling deliverable type updates
async function handleDeliverableTypeUpdate(
  deliverableType,
  deliverableNumber,
  requestedCount,
  savedCount,
  reqClientData,
  clientToEdit,
  maxNumber,
  latestEventDate,
  forEvents,
  updatedDeliverablesIds
) {
  try {
    requestedCount = Number(requestedCount || 0);
    savedCount = Number(savedCount || 0);
    
    if (requestedCount > savedCount) {
      // More deliverables added in this number deliverable
      const additionalCount = requestedCount - savedCount;
      for (let i = 0; i < additionalCount; i++) {
        const newDeliverable = new deliverableModel({
          client: reqClientData._id,
          deliverableName: deliverableType,
          delivNumber: maxNumber ? i + 1 + maxNumber : i + 1,
          date: latestEventDate,
          forEvents,
          numberInDeliverables: deliverableNumber,
        });

        await newDeliverable.save();
        updatedDeliverablesIds.push(newDeliverable._id);
      }
    } else if (requestedCount < savedCount) {
      // Deliverables are decreased in this number of deliverables
      const savedIds = reqClientData?.deliverables
        ?.filter(
          deliv =>
            deliv.deliverableName === deliverableType &&
            deliv.numberInDeliverables === deliverableNumber
        )
        ?.map(deliv => deliv._id)
        .filter(Boolean);
        
      if (!savedIds || savedIds.length === 0) return;
      
      const extraCount = savedCount - requestedCount;
      const toRemoveIds = savedIds.slice(-extraCount);
      const removeIdsSet = new Set(toRemoveIds);
      
      for (const id of toRemoveIds) {
        await deliverableModel.findByIdAndDelete(id);
      }
      
      // Update IDs list
      updatedDeliverablesIds = updatedDeliverablesIds.filter(
        delivId => !removeIdsSet.has(delivId)
      );
    } else {
      // Same count, just update existing
      const existingDeliverables = clientToEdit?.deliverables?.filter(
        deliv =>
          deliv.deliverableName === deliverableType &&
          deliv.numberInDeliverables == deliverableNumber
      );
      
      if (!existingDeliverables || existingDeliverables.length === 0) return;
      
      if (existingDeliverables.length < requestedCount) {
        const additionalCount = requestedCount - existingDeliverables.length;
        for (let i = 0; i < additionalCount; i++) {
          const newDeliverable = new deliverableModel({
            client: reqClientData._id,
            deliverableName: deliverableType,
            delivNumber: maxNumber ? i + 1 + maxNumber : i + 1,
            date: latestEventDate,
            forEvents,
            numberInDeliverables: deliverableNumber,
          });

          await newDeliverable.save();
          updatedDeliverablesIds.push(newDeliverable._id);
        }
      } else if (existingDeliverables.length > requestedCount) {
        const savedIds = existingDeliverables.map(deliv => deliv._id);
        const extraCount = existingDeliverables.length - requestedCount;
        const toRemoveIds = savedIds.slice(-extraCount);
        const removeIdsSet = new Set(toRemoveIds);
        
        for (const id of toRemoveIds) {
          await deliverableModel.findByIdAndDelete(id);
        }
        
        // Update IDs list
        updatedDeliverablesIds = updatedDeliverablesIds.filter(
          delivId => !removeIdsSet.has(delivId)
        );
      } else {
        // Just update existing
        for (let i = 0; i < existingDeliverables.length; i++) {
          if (!existingDeliverables[i] || !existingDeliverables[i]._id) continue;
          
          await deliverableModel.findByIdAndUpdate(
            existingDeliverables[i]._id,
            { $set: { forEvents: forEvents, date: latestEventDate } }
          );
        }
      }
    }
    
    return updatedDeliverablesIds;
  } catch (error) {
    console.error(`Error handling ${deliverableType} update:`, error);
    return updatedDeliverablesIds;
  }
}

// Helper function for handling album updates
async function handleAlbumUpdate(
  deliverableNumber,
  requestedAlbums,
  savedAlbums,
  reqClientData,
  maxNumber,
  latestEventDate,
  forEvents,
  updatedDeliverablesIds
) {
  try {
    if (!requestedAlbums) requestedAlbums = [];
    if (!savedAlbums) savedAlbums = [];
    
    // Filter out invalid album names
    const validRequestedAlbums = requestedAlbums.filter(
      album => album && album !== "Not included" && album !== ""
    );
    
    const validSavedAlbums = savedAlbums.filter(
      album => album && album !== "Not included" && album !== ""
    );
    
    // Get existing album deliverables
    const savedAlbumsDeliverable = reqClientData?.deliverables?.filter(
      deliv =>
        deliv.isAlbum === true &&
        deliv.numberInDeliverables == deliverableNumber
    ) || [];
    
    if (validRequestedAlbums.length > validSavedAlbums.length) {
      // Handle albums that exist in both lists
      for (let i = 0; i < Math.min(savedAlbumsDeliverable.length, validRequestedAlbums.length); i++) {
        await deliverableModel.findByIdAndUpdate(
          savedAlbumsDeliverable[i]?._id,
          {
            $set: {
              forEvents: forEvents,
              date: latestEventDate,
              deliverableName: validRequestedAlbums[i],
            },
          }
        );
      }
      
      // Add new albums
      for (let i = savedAlbumsDeliverable.length; i < validRequestedAlbums.length; i++) {
        const albumDeliverable = new deliverableModel({
          client: reqClientData._id,
          deliverableName: validRequestedAlbums[i],
          delivNumber: maxNumber ? i + 1 + maxNumber : i + 1,
          date: latestEventDate,
          forEvents,
          isAlbum: true,
          numberInDeliverables: deliverableNumber,
        });

        await albumDeliverable.save();
        updatedDeliverablesIds.push(albumDeliverable._id);
      }
    } else if (validRequestedAlbums.length < validSavedAlbums.length) {
      // Need to remove some albums
      const savedAlbumsIds = savedAlbumsDeliverable.map(deliv => deliv._id);
      const extraAlbums = savedAlbumsDeliverable.length - validRequestedAlbums.length;
      const toRemoveIds = savedAlbumsIds.slice(-extraAlbums);
      const removeIdsSet = new Set(toRemoveIds);
      
      for (const albumId of toRemoveIds) {
        await deliverableModel.findByIdAndDelete(albumId);
      }
      
      updatedDeliverablesIds = updatedDeliverablesIds.filter(
        delivId => !removeIdsSet.has(delivId)
      );
      
      // Update remaining albums
      for (let i = 0; i < validRequestedAlbums.length; i++) {
        if (i >= savedAlbumsDeliverable.length - extraAlbums) break;
        
        await deliverableModel.findByIdAndUpdate(
          savedAlbumsDeliverable[i]?._id,
          {
            $set: {
              forEvents: forEvents,
              date: latestEventDate,
              deliverableName: validRequestedAlbums[i],
            },
          }
        );
      }
    } else {
      // Same number of albums, just update
      for (let i = 0; i < savedAlbumsDeliverable.length; i++) {
        if (i >= validRequestedAlbums.length) break;
        
        if (validRequestedAlbums[i]) {
          await deliverableModel.findByIdAndUpdate(
            savedAlbumsDeliverable[i]?._id,
            {
              $set: {
                forEvents: forEvents,
                date: latestEventDate,
                deliverableName: validRequestedAlbums[i],
              },
            }
          );
        } else {
          // If the album name is no longer valid, delete it
          await deliverableModel.findByIdAndDelete(savedAlbumsDeliverable[i]?._id);
          updatedDeliverablesIds = updatedDeliverablesIds.filter(
            delivId => !delivId.equals(savedAlbumsDeliverable[i]?._id)
          );
        }
      }
    }
    
    return updatedDeliverablesIds;
  } catch (error) {
    console.error("Error handling album update:", error);
    return updatedDeliverablesIds;
  }
}

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
      const hasMore = false;
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
