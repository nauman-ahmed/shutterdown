const { default: mongoose } = require("mongoose");
const Notification = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  try {
    let notificationsToSend;
    if (req.query.manager === "true") {
      notificationsToSend = await Notification.find({
        forManager: true,
      }).populate({
        path: "data",
        populate: {
          path: "events",
          model: "Event",
        },
      });
      const individualNotifications = await Notification.find({
        forUser: mongoose.Types.ObjectId(req.query.user),
      });
      notificationsToSend = [
        ...notificationsToSend,
        ...individualNotifications,
      ];

    } else {
      notificationsToSend = await Notification.find({
        forUser: mongoose.Types.ObjectId(req.query.user),
      }).populate("data.events");
    }
    res.status(200).json(notificationsToSend);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getNotifications };
