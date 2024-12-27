const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { changeDateString } = require("../Controllers/EventController");
const { adddatesinClients } = require("../Controllers/ClientController");
const {
  addDateinDeliverales,
} = require("../Controllers/deliverableController");
const { backupDatabaseToGoogleDrive } = require("../utils/backup");
const ClientModel = require("../models/ClientModel");
dotenv.config({ path: "./config.env" });
const DB = 'mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown';
// const DB = "mongodb://127.0.0.1:27017/shutterDown";


const updateDeliverables = async ()=>{
  const allClients = await ClientModel.find();

  for(let client of allClients){
    await ClientModel.findByIdAndUpdate(client._id, {deliverablesArr : [{
      albums : client.albums,
      forEvents : client.events?.map((event, index) => index),
      photos : true,
      number : 1,
      promos : client.promos,
      longFilms : client.longFilms,
      reels : client.reels,
      performanecFilms : client.performanceFilms | 0,
    }]})
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
