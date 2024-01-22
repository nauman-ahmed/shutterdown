import React, { useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "./index"
import Cookies from 'js-cookie';
const currentUser = JSON.parse(Cookies.get('currentUser'));
export const SaveClientForm = async (data) => {
  try {
    const dataToSend = {...data, userID : currentUser._id}
    const res = await axios.post(BASE_URL +
      '/AddClient',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        data : dataToSend
      }
    );
  } catch (error) {
    console.log(error, "error")
  }
};
export const addCinematography = async (client) => {
  try {
    const res = await axios.post(BASE_URL +
      '/AddCinematography',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        client
      }
    ).then(()=>{window.notify('Cinematography details added successfully!', 'success')});
  } catch (error) {
    console.log(error, "error")
  }
};
export const updateClient = async (client) => {
  try {
    const res = await axios.post(BASE_URL +
      '/updateClientData',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        client
      }
    ).then(()=>{window.notify('Details added successfully!', 'success')});
  } catch (error) {
    console.log(error, "error")
  }
};

export const addPhotosDeliverables = async (client) => {
  try {
    const res = await axios.post(BASE_URL +
      '/AddPhotosDeliverables',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        client
      }
    ).then(()=>{window.notify('Photos Deliverables added successfully!', 'success')});
  } catch (error) {
    console.log(error, "error")
  }
};

export const addAlbumsDeliverables = async (client) => {
  try {
    const res = await axios.post(BASE_URL +
      '/AddAlbumsDeliverables',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        client
      }
    ).then(()=>{window.notify('Albums Deliverable added successfully!', 'success')});
  } catch (error) {
    console.log(error, "error")
  }
};

export const getClientBasicInfo = async () => {
  try {
    const res = await axios.get(BASE_URL + `/Client/ViewClient`,
      {
        Headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getClients = async () => {
  try {
    const res = await axios.get(BASE_URL + `/Client/getAllClients`,
      {
        Headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.data
  } catch (error) {
    console.log(error)
  }
}
export const getClientById = async (clientId) => {
  try {
    const res = await axios.get(BASE_URL + `/Client/getClientById/${clientId}`,
      {
        Headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.data
  } catch (error) {
    console.log(error);
  }
}

export const getClientAllInfo = async ({ clientId }) => {
  try {
    const res = await axios.post(BASE_URL + `/MyProfile/Client/ParticularClient/ClientInfo`,
      {
        Headers: { 'Content-Type': 'application/json' },
        clientId: clientId
      }
    );
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getClientAllShootDetails = async ({ clientId }) => {
  try {
    const res = await axios.post(BASE_URL + `/MyProfile/Client/ParticularClient/shootDetails`,
      {
        Headers: { 'Content-Type': 'application/json' },
        clientId: clientId
      }
    );
    return res.data
  } catch (error) {
    console.log(error)
  }
}