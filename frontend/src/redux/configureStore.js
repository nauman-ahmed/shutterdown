import { configureStore } from "@reduxjs/toolkit";
import clientData from "./clientBookingForm";
import { allEventsReducer } from "./eventsSlice";
import { eventsToShowReducer } from "./eventsSlice";
import notificationsReducer from "./notificationsSlice";
import socketMiddleware from "./socketMiddleware";

export const store = configureStore({
  reducer: {
    clientData,
    allEvents: allEventsReducer,
    eventsToShow: eventsToShowReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});
