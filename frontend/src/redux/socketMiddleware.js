import BASE_URL from "../API";
import { io } from "socket.io-client";
import { addNewNotification, updateReadNotification } from "./notificationsSlice";
import { triggerEventsRefresh } from "./eventsSlice";

let socketInstance = null; // Socket instance initialized as null

const socketMiddleware = (store) => (next) => (action) => {
  // Handle socket connection
  if (action.type === "SOCKET_CONNECT") {
    if (!socketInstance) {
      socketInstance = io(BASE_URL);

      // Handle socket events inside the connection block
      socketInstance.on("update-read-notification", (notification) => {
        store.dispatch(updateReadNotification(notification));
      });

      socketInstance.on("receive-notification", (notification) => {
        store.dispatch(addNewNotification(notification));
      });
      socketInstance.on("received-updated-events", (data) => {
        console.log("received-updated-events and dispatching", data);
        // Dispatch action to trigger events refresh
        store.dispatch(triggerEventsRefresh());
      });
    } else {
      console.log("Socket already connected");
    }
  }

  // Handle socket disconnection
  if (action.type === "SOCKET_DISCONNECT") { 
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null; // Reset the socket instance
    }
  }

  // Handle socket event emission
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
