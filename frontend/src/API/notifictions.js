import axios from "axios";
import BASE_URL from "./index";

export const getUserNotifications = async (currentUser) => { 
  try {
    const res = await axios.get(BASE_URL + `/get-notifications`, {
      params: {
        manager: currentUser?.rollSelect === "Manager" ? true : false,
        user: currentUser?._id,
      },
      Headers: { "Content-Type": "application/json" },
    });
   console.log(res.data);
   
    
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
