import { createSlice } from '@reduxjs/toolkit'


const initialState = null;

const allEvents = createSlice({
    name: 'allEvents',
    initialState,
    reducers: {
        updateAllEvents(state,action) {
            return action.payload;
        },
    },
})
const eventsToShow = createSlice({
    name: 'eventsToshow',
    initialState,
    reducers: {
        updateEventsToShow(state,action) {
            return action.payload;
        },
    },
})

export const { updateAllEvents } = allEvents.actions
export const allEventsReducer = allEvents.reducer
export const { updateEventsToShow } = eventsToShow.actions
export const eventsToShowReducer = eventsToShow.reducer

