import { createSlice } from '@reduxjs/toolkit'


const initialState = { albums: [""], deliverables: { photos: true } };

const ClientBookingForm = createSlice({
    name: 'ClientBookingData',
    initialState,
    reducers: {
        updateClintData(state, action) {
            return action.payload;
        },
    },
})

export const { updateClintData } = ClientBookingForm.actions
export default ClientBookingForm.reducer

