import React, { useEffect, useState } from "react";
import "../../assets/css/common.css";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-number-input/style.css";
import Signup from "../signup/Signup";
import { checkExistEmail } from "../../API/userApi";
const LoginWithGoogle = () => {
  const location = useLocation();
  let array = [];
  array.push(location?.state?.data);
  const [isSignInWithGoogle, setIsSignInWithGoogle] = useState(false);
  const getExistEmaiData = async () => {
    try {
      const email = JSON.parse(localStorage.getItem("signInWithGoogle"));
      const email1 = email.data.email;
      await checkExistEmail(email1);
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    setIsSignInWithGoogle(true);
    getExistEmaiData();
  }, []);
  return (
    <>
      <Signup signInWithGoogle={isSignInWithGoogle} />
    </>
  );
};

export default LoginWithGoogle;
