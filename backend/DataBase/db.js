const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { changeDateString } = require("../Controllers/EventController");
const { adddatesinClients } = require("../Controllers/ClientController");
const {
  addDateinDeliverales,
} = require("../Controllers/deliverableController");
dotenv.config({ path: "./config.env" });
// const DB = 'mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown';
const DB = "mongodb://127.0.0.1:27017/shutterDown";

mongoose
  .connect(DB)
  .then(() => {
    //     changeDateString()
    // adddatesinClients()
    // addDateinDeliverales()
    console.log("DataBase Connected");
  })
  .catch((error) => {
    console.log("DataBase not Connected", error);
  });
