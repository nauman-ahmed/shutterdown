import React, { useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "./index"

export const addEvent = async (data) => {
    try {
        await axios.post(BASE_URL +
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
        await axios.patch(BASE_URL +
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

export const updateEventData = async (data) => {
    try {
        await axios.patch(BASE_URL +
            '/updateEvent',
            {
                Headers: {
                    'Content-Type': 'application/json',
                },
                data
            }
        ).then(()=>{
            window.notify('Details updated Successfully!', 'success')
        });
    } catch (error) {
        console.log(error);
    }
}

export const getEvents = async (clientId, page) => { 
    try {
        const res = await axios.post(BASE_URL +
            `/getAllEvents?page=${page}`,
            {
                Headers: {
                    'Content-Type': 'application/json',
                },
                clientId
            },
        );
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getEventsByMonths = async (currentMonth) => { 
    try {
        console.log("CURRENT",currentMonth)
        const res = await axios.post(BASE_URL +
            '/getAllEvents/byMonths',
            {
                Headers: {
                    'Content-Type': 'application/json',
                },
                currentMonth
            },
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