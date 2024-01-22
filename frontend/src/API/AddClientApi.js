import React, { useEffect } from 'react';
import axios from 'axios';

export const GetDataFormTwo = async (data) => {

  try {
    const res = await axios.post(global.BASEURL+
      '/MyProfile/AddClient/Form-II',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        data,
      }
    );
    if (res) {
      localStorage.setItem('ResponsiveData', JSON.stringify([res.data]));
      localStorage.setItem('AllData', JSON.stringify(res.data.allData));
      localStorage.setItem('IDofEvent', JSON.stringify(res.data.data._id));
    }
  } catch (error) {
    console.log(error, 'error');
  }
};

export const SendIDofEvent = async (data) => {
  try {
    const res = await axios.post(global.BASEURL+
      '/MyProfile/AddClient/Preview',
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        data,
      }
    );
    localStorage.setItem('idData', JSON.stringify(res.data.data));
  } catch (error) {
    console.log(error, 'error');
  }
};
export const UpdatePreviewEvent = async (data) => {

};
export const UpdateForm2Event = async (data) => {
  try {
    const res = await axios.put(global.BASEURL+
      `/MyProfile/AddClient/Form-II/:${data.id}`,
      {
        Headers: {
          'Content-Type': 'application/json',
        },
        data,
      }
    );

  } catch (error) {
    console.log(error, 'error');
  }
};
export const EventDelete = async (data) => {
  console.log(data, 'body');
};
