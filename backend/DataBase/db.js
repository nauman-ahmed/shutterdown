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
const DB = 'mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown';
// const DB = "mongodb://127.0.0.1:27017/shutterDown";


const updateDeliverables = async () => {
  // const allClients = await ClientModel.find().populate('events').populate('deliverables');
  const albumDelivs = await deliverableModel.find({ deliverableName: { $in: ['Classic', 'Premium'] } })
  for(let deliv of albumDelivs){
  
    await deliverableModel.findByIdAndUpdate(deliv._id, {isAlbum : true})
  }

  // for (let client of allClients) {
  //   console.log('running');
    
  //   const latestEventDate = client.events
  //     .map(event => event.eventDate)
  //     .reduce((max, current) => (max > current ? max : current));

  //   const updatedDeliverablesIds = client.deliverables?.map(deliv => deliv._id)
  //   if (client.promos > 1) {
  //     for (let i = 0; i < client.promos - 1; i++) {
  //       const promoDeliverable = new deliverableModel({
  //         client: client._id,
  //         deliverableName: "Promo",
  //         quantity: 1,
  //         date: latestEventDate,
  //         forEvents: client.events,
  //         numberInDeliverables: 1
  //       });

  //       await promoDeliverable.save();
  //       updatedDeliverablesIds.push(promoDeliverable._id);
  //     }
  //   }

  //   if (client.longFilms > 1) {
  //     for (let i = 0; i < client.longFilms - 1; i++) {
  //       const longFilmDeliverable = new deliverableModel({
  //         client: client._id,
  //         deliverableName: "Long Film",
  //         quantity: 1,
  //         date: latestEventDate,
  //         forEvents: client.events,
  //         numberInDeliverables: 1
  //       });

  //       await longFilmDeliverable.save();
  //       updatedDeliverablesIds.push(longFilmDeliverable._id);
  //     }
  //   }

  //   if (client.performanceFilms > 1) {
  //     for (let i = 0; i < client.performanceFilms - 1; i++) {
  //       const performanceFilmDeliverable = new deliverableModel({
  //         client: client._id,
  //         deliverableName: "Performance Film",
  //         quantity: 1,
  //         date: latestEventDate,
  //         forEvents: client.events,
  //         numberInDeliverables: 1
  //       });

  //       await performanceFilmDeliverable.save();
  //       updatedDeliverablesIds.push(performanceFilmDeliverable._id);
  //     }
  //   }

  //   if (client.reels > 1) {
  //     for (let i = 0; i < client.reels - 1; i++) {
  //       const reelDeliverable = new deliverableModel({
  //         client: client._id,
  //         deliverableName: "Reel",
  //         quantity: 1,
  //         date: latestEventDate,
  //         forEvents: client.events,
  //         numberInDeliverables: 1
  //       });

  //       await reelDeliverable.save();
  //       updatedDeliverablesIds.push(reelDeliverable._id);
  //     }
  //   }
  //   for (let deliv of client.deliverables) {
  //     await deliverableModel.findByIdAndUpdate(deliv._id, { date: latestEventDate, numberInDeliverables: 1 })
  //   }
  //   await ClientModel.findByIdAndUpdate(client._id, {
  //     deliverables: updatedDeliverablesIds
  //   })
  // }
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
