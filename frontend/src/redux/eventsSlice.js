import { createSlice } from '@reduxjs/toolkit'


const initialState = null;

const refreshInitialState = {
    refreshCounter: 0
};

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

const eventsRefresh = createSlice({
    name: 'eventsRefresh',
    initialState: refreshInitialState,
    reducers: {
        triggerEventsRefresh(state, action) {
            // Increment counter to trigger refresh
            console.log("triggerEventsRefresh", state.refreshCounter);
            return { ...state, refreshCounter: state.refreshCounter + 1 };
        },
    },
})

export const { updateAllEvents } = allEvents.actions
export const allEventsReducer = allEvents.reducer
export const { updateEventsToShow } = eventsToShow.actions
export const eventsToShowReducer = eventsToShow.reducer
export const { triggerEventsRefresh } = eventsRefresh.actions
export const eventsRefreshReducer = eventsRefresh.reducer

