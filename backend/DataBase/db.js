const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { changeDateString } = require("../Controllers/EventController");
const { adddatesinClients } = require("../Controllers/ClientController");
const {
  addDateinDeliverales,
} = require("../Controllers/deliverableController");
const { backupDatabaseToGoogleDrive } = require("../utils/backup");
const ClientModel = require("../models/ClientModel");
const deliverableModel = require("../models/DeliverableModel");
dotenv.config({ path: "./config.env" });
// const DB = 'mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown';
const DB = "mongodb://127.0.0.1:27017/shutterDown";





const updateDeliverables = async () => {
  const allClients = await ClientModel.find().populate('events').populate('deliverables');
  // const albumDelivs = await deliverableModel.find({ deliverableName: { $in: ['Classic', 'Premium'] } })
  // for(let deliv of albumDelivs){

  //   await deliverableModel.findByIdAndUpdate(deliv._id, {isAlbum : true})
  // }

  for (let clientToEdit of allClients) {

    let updatedDeliverablesIds = clientToEdit.deliverables.map(deliv => deliv._id);
    let reelsDelivs = await deliverableModel.find({ deliverableName: 'Reel', client: clientToEdit._id })
    let promosDelivs = await deliverableModel.find({ deliverableName: 'Promo', client: clientToEdit._id })
    let longFilmsDelivs = await deliverableModel.find({ deliverableName: 'Long Film', client: clientToEdit._id })
    let performanceFilmsDelivs = await deliverableModel.find({ deliverableName: 'Performance Film', client: clientToEdit._id })
    let albumsDelivs = await deliverableModel.find({ isAlbum: true, client: clientToEdit._id })


    let maxReelNumber = reelsDelivs.reduce((max, deliv) => Math.max(max, deliv.delivNumber), 0);
    let maxPromoNumber = promosDelivs.reduce((max, deliv) => Math.max(max, deliv.delivNumber), 0);
    let maxLongFilmNumber = longFilmsDelivs.reduce((max, deliv) => Math.max(max, deliv.delivNumber), 0);
    let maxPerformanceFilmNumber = performanceFilmsDelivs.reduce((max, deliv) => Math.max(max, deliv.delivNumber), 0);
    let maxAlbumNumber = albumsDelivs.reduce((max, deliv) => Math.max(max, deliv.delivNumber), 0);

    const latestEventDate = clientToEdit.deliverablesArr[clientToEdit.deliverablesArr.length - 1].forEvents
      .map(index => clientToEdit.events[index].eventDate)
      .reduce((max, current) => (max > current ? max : current));

    const forEvents = clientToEdit.deliverablesArr[clientToEdit.deliverablesArr.length - 1].forEvents
      .map(index => clientToEdit.events[index]._id)
    // Utility function to adjust deliverables
    async function adjustDeliverables(filteredDelivs, type, requiredCount, maxNumber, albums) {
      const currentCount = filteredDelivs.length;
      const difference = Number(currentCount) - Number(requiredCount);
      


      if (type === 'Album') {

        if (difference > 0) {
          // Remove extra deliverables
          for (let i = 0; i < difference; i++) {
            const delivToRemove = filteredDelivs.pop();

            // Remove deliverable from the database
            await deliverableModel.findByIdAndDelete(delivToRemove._id);
            // Remove deliverable ID from the client's deliverables array
            updatedDeliverablesIds = updatedDeliverablesIds.filter(id => id !== delivToRemove._id);
          }
          for (let i = 0; i < filteredDelivs.length; i++) {
            await deliverableModel.findByIdAndUpdate(filteredDelivs[i]._id, { delivNumber: i + 1 })

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
              numberInDeliverables: currentCount > 0 ? filteredDelivs[currentCount - 1].numberInDeliverables : clientToEdit.deliverablesArr[clientToEdit.deliverablesArr.length - 1].number
              // Add any additional fields required for a new deliverable
            });

            // Add the new deliverable ID to the client's deliverables array
            updatedDeliverablesIds.push(newDeliverable._id);
          }
        }

      } else {
        if (difference > 0) {
          console.log('difference', difference);

          // Remove extra deliverables
          for (let i = 0; i < difference; i++) {
            const delivToRemove = filteredDelivs.pop();

            // Remove deliverable from the database
            await deliverableModel.findByIdAndDelete(delivToRemove._id);
            // Remove deliverable ID from the client's deliverables array
            updatedDeliverablesIds = updatedDeliverablesIds.filter(id => id !== delivToRemove._id);
          }
          for (let i = 0; i < filteredDelivs.length; i++) {
            await deliverableModel.findByIdAndUpdate(filteredDelivs[i]._id, { delivNumber: i + 1 })

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
              numberInDeliverables: currentCount > 0 ? filteredDelivs[currentCount - 1].numberInDeliverables : clientToEdit.deliverablesArr[clientToEdit.deliverablesArr.length - 1].number
              // Add any additional fields required for a new deliverable
            });

            // Add the new deliverable ID to the client's deliverables array
            updatedDeliverablesIds.push(newDeliverable._id);
          }
        }
      }

    }

    const totalReelsNum = clientToEdit?.deliverablesArr?.reduce((total, delivObj) => Number(delivObj.reels) + total, 0)
    const totalPromosNum = clientToEdit?.deliverablesArr?.reduce((total, delivObj) => Number(delivObj.promos) + total, 0)
    const totalLongFilmsNum = clientToEdit?.deliverablesArr?.reduce((total, delivObj) => Number(delivObj.longFilms) + total, 0)
    const totalperformanceFilmsNum = clientToEdit?.deliverablesArr?.reduce((total, delivObj) => Number(delivObj.performanceFilms) + total, 0)
    const totalAlbumsNum = clientToEdit?.deliverablesArr?.reduce((total, delivObj) => delivObj.albums?.filter(album => album !== 'Not included' && album !== '' && album !== undefined)?.length + total, 0)
    let albumsNames = [];
    clientToEdit?.deliverablesArr?.forEach(delivObj => delivObj.albums?.forEach(album => album !== 'Not included' && albumsNames.push(album)))
    await adjustDeliverables(reelsDelivs || [], "Reel", totalReelsNum, maxReelNumber);
    await adjustDeliverables(promosDelivs || [], "Promo", totalPromosNum, maxPromoNumber);
    await adjustDeliverables(longFilmsDelivs || [], "Long Film", totalLongFilmsNum, maxLongFilmNumber);
    await adjustDeliverables(performanceFilmsDelivs || [], "Performance Film", totalperformanceFilmsNum, maxPerformanceFilmNumber);
    await adjustDeliverables(albumsDelivs || [], "Album", totalAlbumsNum, maxAlbumNumber, albumsNames);
    clientToEdit.deliverables = updatedDeliverablesIds;
    // Save the updated client with the adjusted deliverables array
    await clientToEdit.save();
    // const latestEventDate = client.events
    //   .map(event => event.eventDate)
    //   .reduce((max, current) => (max > current ? max : current));

    // const updatedDeliverablesIds = client.deliverables?.map(async (deliv, i) => {
    //   deliverableModel.findByIdAndUpdate(deliv._id, { delivNumber : i + 1})
    // })
    // if (client.promos > 1) {
    //   for (let i = 0; i < client.promos - 1; i++) {
    //     const promoDeliverable = new deliverableModel({
    //       client: client._id,
    //       deliverableName: "Promo",
    //       quantity: 1,
    //       date: latestEventDate,
    //       forEvents: client.events,
    //       numberInDeliverables: 1
    //     });

    //     await promoDeliverable.save();
    //     updatedDeliverablesIds.push(promoDeliverable._id);
    //   }
    // }

    // if (client.longFilms > 1) {
    //   for (let i = 0; i < client.longFilms - 1; i++) {
    //     const longFilmDeliverable = new deliverableModel({
    //       client: client._id,
    //       deliverableName: "Long Film",
    //       quantity: 1,
    //       date: latestEventDate,
    //       forEvents: client.events,
    //       numberInDeliverables: 1
    //     });

    //     await longFilmDeliverable.save();
    //     updatedDeliverablesIds.push(longFilmDeliverable._id);
    //   }
    // }

    // if (client.performanceFilms > 1) {
    //   for (let i = 0; i < client.performanceFilms - 1; i++) {
    //     const performanceFilmDeliverable = new deliverableModel({
    //       client: client._id,
    //       deliverableName: "Performance Film",
    //       quantity: 1,
    //       date: latestEventDate,
    //       forEvents: client.events,
    //       numberInDeliverables: 1
    //     });

    //     await performanceFilmDeliverable.save();
    //     updatedDeliverablesIds.push(performanceFilmDeliverable._id);
    //   }
    // }

    // if (client.reels > 1) {
    //   for (let i = 0; i < client.reels - 1; i++) {
    //     const reelDeliverable = new deliverableModel({
    //       client: client._id,
    //       deliverableName: "Reel",
    //       quantity: 1,
    //       date: latestEventDate,
    //       forEvents: client.events,
    //       numberInDeliverables: 1
    //     });

    //     await reelDeliverable.save();
    //     updatedDeliverablesIds.push(reelDeliverable._id);
    //   }
    // }
    // for (let deliv of client.deliverables) {
    //   await deliverableModel.findByIdAndUpdate(deliv._id, { date: latestEventDate, numberInDeliverables: 1 })
    // }
    // await ClientModel.findByIdAndUpdate(client._id, {
    //   deliverables: updatedDeliverablesIds
    // })
  }
  console.log('loop done');


}
mongoose
  .connect(DB)
  .then(async () => {
    console.log("DataBase Connected");
    // await updateDeliverables()
  })
  .catch((error) => {
    console.log("DataBase not Connected", error);
  });
