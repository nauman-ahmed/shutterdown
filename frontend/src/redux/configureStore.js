import { configureStore } from '@reduxjs/toolkit'
import clientData from './clientBookingForm';


export const store = configureStore({
  reducer: {
    clientData,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})
