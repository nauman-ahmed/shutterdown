import React, { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import Signup from "../signup/Signup";

const LoginWithGoogle = () => {
  const [isSignInWithGoogle, setIsSignInWithGoogle] = useState(false);
 
  useEffect(() => {
    setIsSignInWithGoogle(true);
  }, []);
  return (
    <>
      <Signup signInWithGoogle={isSignInWithGoogle} />
    </>
  );
};

export default LoginWithGoogle;
