import { configureStore } from '@reduxjs/toolkit'
import clientData from './clientBookingForm';
import {allEventsReducer} from './eventsSlice';
import { eventsToShowReducer } from './eventsSlice';


export const store = configureStore({
  reducer: {
    clientData,
    allEvents : allEventsReducer,
    eventsToShow : eventsToShowReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})
