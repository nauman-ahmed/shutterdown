const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = 'mongodb+srv://developersafdar:shutterDown@cluster0.zein9x3.mongodb.net/shutterDown';
// const DB = 'mongodb://localhost:27017/shutterDown';

const connection = mongoose
  .connect(DB, {
    useNewURlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DataBase Connected');
  })
  .catch((error) => {
    console.log('DataBase not Connected', error);
  });
  
  module.exports = {connection}