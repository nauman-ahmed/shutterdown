import axios from "axios";
import BASE_URL from "./index";
import Cookies from "js-cookie";
const currentUser =
  Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));

export const getUserNotifications = async () => {
  try {
    const res = await axios.get(BASE_URL + `/get-notifications`, {
      params: {
        manager: currentUser?.rollSelect === "Manager" ? true : false,
        user: currentUser?._id,
      },
      Headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
