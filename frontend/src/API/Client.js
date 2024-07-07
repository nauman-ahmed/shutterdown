import axios from "axios";
import BASE_URL from "./index";
import Cookies from "js-cookie";
const currentUser = Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));

export const SaveClientForm = async (data) => { 
  try {
    const dataToSend = { ...data, userID: currentUser._id };
    const result = await axios
      .post(BASE_URL + "/AddClient", {
        data: dataToSend,
      })
      .then((res) => {

        return {result :true, data : res.data};
      })
      .catch((err) => console.log(err));
      return result

  } catch (error) {
    console.log(error, "error");
    return false;
  }
};
export const addCinematography = async (client) => {
  try {
    await axios
      .post(BASE_URL + "/AddCinematography", {
        Headers: {
          "Content-Type": "application/json",
        },
        client,
      })
      .then(() => {
        window.notify("Cinematography details added successfully!", "success");
      });
  } catch (error) {
    console.log(error, "error");
  }
};
export const updateClient = async (client) => {
  try {
    await axios
      .post(BASE_URL + "/updateClientData", {
        Headers: {
          "Content-Type": "application/json",
        },
        client,
      })
      .then(() => {
        window.notify("Details added successfully!", "success");
      });
  } catch (error) {
    console.log(error, "error");
  }
};

export const addPhotosDeliverables = async (client) => {
  try {
   await axios
      .post(BASE_URL + "/AddPhotosDeliverables", {
        Headers: {
          "Content-Type": "application/json",
        },
        client,
      })
      .then(() => {
        window.notify("Photos Deliverables added successfully!", "success");
      });
  } catch (error) {
    console.log(error, "error");
  }
};

export const addAlbumsDeliverables = async (client) => {
  try {
    await axios
      .post(BASE_URL + "/AddAlbumsDeliverables", {
        Headers: {
          "Content-Type": "application/json",
        },
        client,
      })
      .then(() => {
        window.notify("Albums Deliverable added successfully!", "success");
      });
  } catch (error) {
    console.log(error, "error");
    return;
  }
};

export const getClients = async (page) => {
  try {
    const res = await axios.get(BASE_URL + `/Client/getAllClients?page=${page}`, {
      Headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPreWedClients = async (page) => {
  try {
    const res = await axios.get(BASE_URL + `/Client/getPreWedClients?page=${page}`, {
      Headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
export const getClientById = async (clientId) => {
  try {
    const res = await axios.get(
      BASE_URL + `/Client/getClientById/${clientId}`,
      {
        Headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const addPreWedData = async (client) => {
  try {
    await axios.post(BASE_URL + "/add-PreWedData", {
      Headers: {
        "Content-Type": "application/json",
      },
      client,
    });
    window.notify("Pre-Wedding Assigned successfully!", "success");
  } catch (error) {
    console.log(error);
  }
};
