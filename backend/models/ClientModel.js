const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema({
  brideName: {
    type: String,
    required: true,
  },
  groomName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  deliverables: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Deliverable",
    },
  ],
  albums: [{ type: String }],
  hardDrives: {
    type: Number,
  },
  email: {
    type: String,
  },
  bookingStatus: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  pendingAmount: {
    type: String
  },
  projectStatus: {
    type: String,
    default : 'Open'
  },
  suggestion: {
    type: String,
  },
  preWedding: {
    type: Boolean,
  },
  preWeddingPhotos: {
    type: Boolean,
    default: false,
  },
  preWeddingVideos: {
    type: Boolean,
    default: false,
  },
  preWedphotographers: {
    type: Number,
  },
  promos: {
    type: String,
  },
  longFilms: {
    type: Number
  },
  reels: {
    type: Number
  },
  preWedcinematographers: {
    type: Number,
  },
  preWedassistants: {
    type: Number,
  },
  preWeddrones: {
    type: Number,
  },
  preWeddingDetails: {
    type: Object,
  },
  dates: {
    type: Array,
    required: true
  },
  checklistDetails: {
    type: Object,
  },
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
  ],
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
});

const ClientModel = mongoose.model("Client", ClientSchema);
module.exports = ClientModel;
