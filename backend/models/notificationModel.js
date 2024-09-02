const mongoose = require("mongoose");
const notificationSchema = mongoose.Schema({
  notificationOf: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required : true,
    default : new Date()
  },
  data: {
    type: Object,
    required: true,
  },
  dataId :{
    type: mongoose.Types.ObjectId,
  },
  forManager: {
    type: Boolean,
    required: true,
  },
  forUser: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  read: {
    type: Boolean,
    default: false,
  },
  readBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  ],
});

const notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;
