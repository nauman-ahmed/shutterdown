import axios from "axios";
import BASE_URL from "./index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useLoggedInUser } from "../config/zStore";

export const postAttendenceData = async (data) => {
  try {
    const res = await axios.post(BASE_URL + "/MyProfile/AttendenceSettings", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  } catch (error) {}
};

export const checkInUser = async (data = null) => {
  try {
    const user = JSON.parse(Cookies.get("currentUser"));
    await axios
      .post(BASE_URL + "/MyProfile/Attendence/checkIn/" + user._id, {
        Headers: {
          "Content-Type": "application/json",
        },
        data,
      })
      .then((res) => {
        toast.success(res.data.message);
      });
  } catch (error) {
    if (error.response?.status == 303) {
      toast.error(error.response.data.message);
    }
  }
};

export const checkOutUser = async (data) => {
  try {
    const user = JSON.parse(Cookies.get("currentUser"));
    await axios
      .post(BASE_URL + "/MyProfile/Attendence/checkOut/" + user._id, {
        Headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.success(res.data.message);
      });
  } catch (error) {
    if (error.response.status == 303) {
      toast.error(error.response.data.message);
    }
  }
};

export const getUserAttendence = async (Id) => {
  try {
    const res = await axios.get(
      BASE_URL + "/MyProfile/Attendence/userAttendace/" + Id,
      {
        Headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
