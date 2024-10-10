import axios from "axios";
import BASE_URL from "./index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const getAllEventOptions = async (data) => {
  try {
    const res = await axios.get(BASE_URL + "/eventOptions/getAll", {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data[0];
  } catch (error) {}
};

export const updateAllEventOptions = async (data) => {
  try {
    const res = await axios.post(BASE_URL + "/eventOptions/updateAll", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    return res;
  } catch (error) {}
};
