import { createSlice } from '@reduxjs/toolkit'


const initialState = {  };

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

