const mongoose = require("mongoose");

const deadlineDaysSchema = mongoose.Schema({
  longFilm: {
    type: Number,
    required: true,
  },
  reel: {
    type: Number,
    required: true,
  },
  promo: {
    type: Number,
    required: true,
  },
  photo: {
    type: Number,
    required: true,
  },
  album: {
    type: Number,
    required: true,
  },
  preWedPhoto: {
    type: Number,
    required: true,
  },
  preWedVideo: {
    type: Number,
    required: true,
  },
  performanceFilms: {
    type: Number,
    required: true,
  },
});

const deadlineDaysModel = new mongoose.model("DeadlineDays", deadlineDaysSchema);
module.exports = deadlineDaysModel;
