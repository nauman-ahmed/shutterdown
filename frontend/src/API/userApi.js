import axios from "axios";
import BASE_URL from ".";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const getAllUserAccountDetails = async () => {
  try {
    const res = await axios.get(BASE_URL + "/getAllUserAccountDetails", {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    alert(error.toString());
  }
};

export const getUserAccountApproved = async (data) => {
  try {
    const res = await axios.post(BASE_URL + "/getUserAccountApproved", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    return res;
  } catch (error) {
    alert(error.toString());
  }
};

export const getUserAccountbanned = async (data) => {
  try {
    const res = await axios.post(BASE_URL + "/getUserAccountbanned", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    return res;
  } catch (error) {
    alert(error.toString());
  }
};

export const getUserAccountUnbanned = async (data) => {
  try {
    const res = await axios.post(BASE_URL + "/getUserAccountUnbanned", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    return res;
  } catch (error) {
    alert(error.toString());
  }
};

export const getAllUserAccountRequestCount = async () => {
  try {
    const res = await axios.get(BASE_URL + "/getAllUserAccountRequestCount", {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    alert(error.toString());
  }
};

export const SignUpAPI = async (data) => {
  const {
    firstName,
    lastName,
    email,
    phoneNo,
    password,
    confirmPassword,
    rollSelect,
  } = data;

  const res = await axios.post(BASE_URL + "/Signup", {
    Headers: {
      "Content-Type": "application/json",
    },

    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNo: phoneNo,
    password: password,
    confirmPassword: confirmPassword,
    rollSelect: rollSelect,
  });
  return res
  // localStorage.setItem("res", JSON.stringify(res));
};
export const SignInWithGoogleDataAPI = async (data) => {
  const { firstName, lastName, email, rollSelect, phoneNo } = data;

  const res = await axios.post(BASE_URL + "/signInWithGoogle", {
    Headers: {
      "Content-Type": "application/json",
    },
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNo: phoneNo,
    rollSelect: rollSelect,
  });
  return res
};

export const checkExistEmail = async (data) => {
  try {
    const res = await axios.post(BASE_URL + "/check-exist-email", {
      Headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    return res.data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const GetSignInApi = async (data) => {
  const { email, password } = data;
  await axios
    .post(BASE_URL, {
      Headers: {
        "Content-Type": "application/json",
      },
      email: email,
      password: password,
    })
    .then((res) => {
      Cookies.set("currentUser", JSON.stringify(res.data.User), { expires: 7 });
      toast.success("Logged in successfully!");
    })
    .catch((err) => {
      if (err.response?.status === 404) {
        window.notify(err.response.data.message, "error");
      }
      Cookies.remove("currentUser");
    });
};

export const GetUserData = async () => {
  const user = JSON.parse(Cookies.get("currentUser"));
  const { email, password } = user;
  await axios
    .post(BASE_URL, {
      Headers: {
        "Content-Type": "application/json",
      },
      email: email,
      password: password,
    })
    .then((res) => {
      Cookies.remove("currentUser");
      Cookies.set("currentUser", JSON.stringify(res.data.User), { expires: 7 });
    });
};

export const verifyEmail = async (email) => {
  try {
    const res = await axios.post(BASE_URL + "/emailVerify", {
      headers: {
        "Content-Type": "application/json",
      },
      email: email,
    });

    if (res.status === 200) {
      window.notify("Email sent for further action!", "success");
      return true;
    } else if (res.status === 203) {
      window.notify("Email not Exist!", "error");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    window.notify("Server Error", "error");
    return false;
  }
};

export const newPass = async (data) => {
  const { password } = data;
  try {
    const res = await axios.put(BASE_URL + "/ResetPassword", {
      Headers: {
        "Content-Type": "application/json",
      },
      password: password,
    });
    if (res.status === 200) {
      alert("Email Is Verified");
    }
  } catch (error) {
    alert(error.toString());
  }
};

export const updateUserDataAPI = async (userData) => {
  try {
    const res = await axios.post(`${BASE_URL}/update-userInfo`, userData);
    toast.success("Details Updated Successfully!");
    return res.data.updatedUser; // Return the response data
  } catch (error) {
    toast.error("Error in updating Details");
    throw error; // Ensure the error is propagated to the mutation's `onError` handler
  }
};


export const updateUserData = async (userData) => {
  try {
    await axios
      .post(BASE_URL + "/update-userInfo", userData)
      .then(async (res) => {
        
        toast.success("Details Updated Successfully!");
        return res.data.updatedUser
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    toast.error("Error in updating Details");
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(BASE_URL + "/getAllUsers", {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    alert(error.toString());
  }
};

export const getEditors = async () => {
  try {
    const res = await axios.get(BASE_URL + "/getEditors", {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    alert(error.toString());
  }
};
export const getShooters = async () => {
  try {
    const res = await axios.get(BASE_URL + "/getShooters", {
      Headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    alert(error.toString());
  }
};
