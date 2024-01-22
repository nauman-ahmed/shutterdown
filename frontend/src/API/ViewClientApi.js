import axios from "axios"


export const getClientById = (clientId) => {
  try {
    const res = axios.get(global.BASEURL +
      `/Client/ClientInfo/${clientId}`, {
      "Content_Type": "application/json"
    }
    );
  } catch (error) {
    console.log(error);
  }
}