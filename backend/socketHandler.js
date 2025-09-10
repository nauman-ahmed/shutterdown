const socketIo = require("socket.io");
const Notification = require("./models/notificationModel");
module.exports = (server) => {
  const io = socketIo(server, {
    cors: "*",
  });

  io.on("connection", (socket) => {
    console.log('user connected');
    

    socket.on("disconnect", () => {
      console.log("user disconnected!");
    });
    socket.on("add-notification", async (data) => {

      if (data.forManager) {
        const newNotification = new Notification(data);
        await newNotification.save();
        io.emit("receive-notification", newNotification);
      } else {
        const notificationExist = await Notification.findOne({
          forUser: data.forUser,
          dataId: data.dataId,
        });
        if (!notificationExist) {
          const newNotification = new Notification(data);
          await newNotification.save();
          io.emit("receive-notification", newNotification);
        }
      }
    });
    socket.on("updated-events", async (data) => {
      console.log("get events data", data);
      io.emit("received-updated-events", data);
    });
    socket.on("read-notification", async (data) => {
      console.log("read-request");
      await Notification.findByIdAndUpdate(data._id, data);
      socket.emit("update-read-notification", data);
    });
  });
};
