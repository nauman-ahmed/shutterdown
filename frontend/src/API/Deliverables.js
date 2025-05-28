import React, { useEffect } from "react";
import axios from "axios";
import BASE_URL from "./index";
import Cookies from "js-cookie";
const currentUser =
  Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));

export const getCinematography = async (
  startDate,
  endDate,
) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/get-Cinematography`,
      {
        headers: { "Content-Type": "application/json" },
        params: {
          startDate,
          endDate
        }
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAlbums = async (
  startDate,
  endDate
) => {
  try {
    const res = await axios.get(
      BASE_URL +
      `/get-Albums`,
      {
        Headers: { "Content-Type": "application/json" },
        params: {
          startDate,
          endDate
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPhotos = async (
  startDate,
  endDate,
) => {
  try {
    const res = await axios.get(
      BASE_URL +
      `/get-Photos`,
      {
        Headers: { "Content-Type": "application/json" },
        params: {
          startDate,
          endDate
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};



export const getPreWeds = async (
  startDate,
  endDate
) => {
  try {
    const res = await axios.get(
      BASE_URL +
      `/get-Pre-Weds`,
      {
        Headers: { "Content-Type": "application/json" },
        params: {
          startDate,
          endDate
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTheDeadline = async (page) => {
  try {
    const res = await axios.get(
      BASE_URL + `/deliverableOptions/getAllDeliverableDays`,
      {
        Headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateDeliverable = async (deliverable) => {
  try {
    await axios
      .post(BASE_URL + "/update-Deliverable", {
        Headers: {
          "Content-Type": "application/json",
        },
        deliverable,
      })
      .then(() => {
        window.notify("Deliverable updated successfully!", "success");
      });
  } catch (error) {
    console.log(error);
  }
};


export const getEditorsData = async (
  page,
  editorId,
) => {
  try {
    const res = await axios.get(
      BASE_URL +
      `/get-editorsdata`,
      {
        Headers: { "Content-Type": "application/json" },
        params: {
          page,
          editorId
        }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getEditorsList = async () => {
  try {
    const res = await axios.get(
      BASE_URL +
      `/all-editors`,
      {
        Headers: { "Content-Type": "application/json" }
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};