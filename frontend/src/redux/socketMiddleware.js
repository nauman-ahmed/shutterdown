import BASE_URL from "../API";
import { io } from "socket.io-client";
import {
  addNewNotification,
  updateReadNotification,
} from "./notificationsSlice";

const socketMiddleware = (store) => (next) => (action) => {
  let socketInstance = io(BASE_URL); // Declare socket instance outside

  if (action.type === "SOCKET_DISCONNECT") {
    if (socketInstance) {
      socketInstance.disconnect();
    }
  }
  socketInstance.on("update-read-notification", (notification) => {
    store.dispatch(updateReadNotification(notification));
  });

  socketInstance.on("receive-notification", (notification) => {
    store.dispatch(addNewNotification(notification));
  });

  if (action.type === "SOCKET_EMIT_EVENT") {
    const { event, data } = action.payload;
    if (socketInstance) {
      socketInstance.emit(event, data);
    } else {
      console.log("Socket not connected, cannot emit event");
    }
  }

  return next(action);
};

export default socketMiddleware;
