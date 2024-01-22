import React, { useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "./index"

export const addEvent = async (data) => {
    try {
        const res = await axios.post(BASE_URL +
            '/AddEvent',
            {
                Headers: {
                    'Content-Type': 'application/json',
                },
                data
            }
        );
    } catch (error) {
        console.log(error);
    }
}

export const assignEventTeam = async (data) => {
    try {
        const res = await axios.patch(BASE_URL +
            '/assignEventTeam',
            {
                Headers: {
                    'Content-Type': 'application/json',
                },
                data
            }
        ).then(()=>{
            window.notify('Team Assigned Successfully!', 'success')
        });
    } catch (error) {
        console.log(error);
    }
}

export const getEvents = async () => {
    try {
        const res = await axios.get(BASE_URL +
            '/getAllEvents',
            {
                Headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const deleteEvent = async (eventId) => {
    try {
        const res = await axios.delete(BASE_URL +
            `/DeleteEvent/${eventId}`,
            {
                Headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then(()=>{
            window.notify('Event Deleted!', 'success')
        });
    } catch (error) {
        console.log(error);
    }
}