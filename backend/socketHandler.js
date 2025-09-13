const socketIo = require("socket.io");
const Notification = require("./models/notificationModel");
module.exports = (server) => {
  const io = socketIo(server, {
    cors: "*",
  });

  // Track connected users
  let connectedUsers = 0;

  io.on("connection", (socket) => {
    connectedUsers++;
    console.log(`User connected. Total connected users: ${connectedUsers}`);
    
    // Broadcast updated connection count to all clients
    io.emit("connection-count-update", { count: connectedUsers });

    socket.on("disconnect", () => {
      connectedUsers--;
      console.log(`User disconnected. Total connected users: ${connectedUsers}`);
      
      // Broadcast updated connection count to all clients
      io.emit("connection-count-update", { count: connectedUsers });
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

    // Handle request for current connection count
    socket.on("get-connection-count", () => {
      socket.emit("connection-count", { count: connectedUsers });
    });
  });

  // Return the io instance and connection count for external access
  return { io, getConnectionCount: () => connectedUsers };
};
