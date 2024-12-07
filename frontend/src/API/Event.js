import React, { useEffect } from "react";
import axios from "axios";
import BASE_URL from "./index";
import dayjs from "dayjs";

export const addEvent = async (data) => {
  try {
    await axios.post(BASE_URL + "/AddEvent", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const assignEventTeam = async (data) => {
  try {
    await axios
      .patch(BASE_URL + "/assignEventTeam", {
        Headers: {
          "Content-Type": "application/json",
        },
        data,
      })
      .then(() => {
        window.notify("Team Assigned Successfully!", "success");
      });
  } catch (error) {
    console.log(error);
  }
};

export const updateEventData = async (data) => {
  try {
    await axios
      .patch(BASE_URL + "/updateEvent", {
        Headers: {
          "Content-Type": "application/json",
        },
        data,
      })
      .then(() => {
        window.notify("Details updated Successfully!", "success");
      });
  } catch (error) {
    console.log(error);
  }
};

export const updateClientData = async (data) => {
  try {
    await axios
      .patch(BASE_URL + "/updateClient", {
        Headers: {
          "Content-Type": "application/json",
        },
        data,
      })
      .then(() => {
        window.notify("Details updated Successfully!", "success");
      });
  } catch (error) {
    console.log(error);
  }
};

export const getEvents = async (
  clientId,
  startDate,
  endDate,
) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/getAllEvents`,
      {
        clientId,
        startDate, 
        endDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllEvents = async () => {
  try {
    const res = await axios.get(BASE_URL + `/get-All-Events`, {
      Headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const res = await axios
      .delete(BASE_URL + `/DeleteEvent/${eventId}`, {
        Headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        window.notify("Event Deleted!", "success");
      });
  } catch (error) {
    console.log(error);
  }
};

export const deleteClient = async (clientId) => {
  try {
    const res = await axios
      .delete(BASE_URL + `/DeleteClient/${clientId}`, {
        Headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        window.notify("Client Deleted!", "success");
      });
  } catch (error) {
    console.log(error);
  }
};
