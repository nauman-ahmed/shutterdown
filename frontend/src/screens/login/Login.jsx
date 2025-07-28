import React, { useState } from "react";
import { Button, Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../components/Logo";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { checkExistEmail } from "../../API/userApi";
import axios from "axios";
import { signIn, useSignInQuery } from "../../hooks/authQueries";
import { toast } from "react-toastify";
import { useLoggedInUser } from "../../config/zStore";
import ButtonLoader from "../../components/common/buttonLoader";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const { email, password } = inputData;
  const { updateUserData } = useLoggedInUser()
  const { mutate, isPending } = useMutation({
    mutationFn : signIn,
    onSuccess: (data) => {
      console.log(data);

      // Set cookies with appropriate expiration based on remember me
      const cookieOptions = remember ? { expires: 365 } : { expires: 365 };
      Cookies.set("userKeys", JSON.stringify({ userToken: data?.token }), cookieOptions)
      updateUserData(data.user)
      Cookies.set("currentUser", JSON.stringify(data.user), cookieOptions)
      toast.success("Logged in successfully!");
      navigate("/profile/info");
    },
    onError: (error) => {
      console.log(error);
      
      if (error.response.status === 403) {
        toast.error(error.response.data.message)
      } else { 
        toast.error("Invalid credentials");
      }
    },

  });
  const [fieldError, setFieldError] = useState(false)
  const [remember, setRemember] = useState(false)
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e?.preventDefault();
    const noField = !email || !password
    if (noField) {
      setFieldError(true)

      return;
    }
    console.log('mutatijng');
    
    mutate({ ...inputData, remember });
  }

  const signup = () => navigate("sign-up");
  const loginByGoogle = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const accountExist = await checkExistEmail(res.data.email);
        if (res.status === 200) {
          if (accountExist?.email) {
            updateUserData(accountExist)
            // Set cookies with 30-day expiration for Google login (treated as "remember me")
            Cookies.set("currentUser", JSON.stringify(accountExist), { expires: 30 })
            toast.success("Logged in successfully!");
            navigate("/profile");
          } else {
            localStorage.setItem("signInWithGoogle", JSON.stringify({ ...res.data, googleToken: tokenResponse.access_token }));

            navigate("/signIn-with-google");
          }
        }
      } catch (error) {
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: () => {
      toast.error("Google login was unsuccessful.");
    },
  });

  return (
    <div className="row" style={{ maxWidth: "100%" }}>
      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <div className="padding_left">
          <div style={{ marginTop: 70 }}>
            <Logo />
          </div>
          <h4 className="heading" style={{ marginTop: 50 }}>
            Welcome back
          </h4>
          <p className="subheading" style={{ marginTop: -5 }}>
            Welcome back! Please enter your credentials
          </p>
          <Form onSubmit={handleSubmitForm}>
            <p className="input_lbl" style={{ marginTop: 30 }}>
              Email
            </p>
            <div className={`input_div border ${(fieldError && !email) && "border-danger"}`} style={{ marginTop: -10 }}>
              <input
                className={`input_field w-100`}
                type="email"
                placeholder="Enter your email"
                onChange={handleOnChange}
                value={email}
                name="email"
              />
            </div>
            <p className="input_lbl" style={{ marginTop: 20 }}>
              Password
            </p>
            <div
              className={`input_div border ${(fieldError && !password) && "border-danger"}`}
              style={{ marginTop: -10 }}
            >
              <input
                className="input_field w-100"
                name="password"
                type="password"
                placeholder="**********"
                onChange={handleOnChange}
                value={password}
              />
            </div>
            <div className="d-flex mt-2 justify-content-between align-items-center full_view_login">
              <button
                type="button"
                className="transparent_btn mt-1"
                onClick={() => navigate("/email-verify")}
              >
                Forgot Password
              </button>
              <label className=" d-flex align-items-center">
                <input checked={remember} onChange={() => setRemember(!remember)} className="cursor-pointer" type="checkbox" /> &nbsp;Remember Me
              </label>
            </div>
            <Button type="submit" className="submit_btn" style={{ marginTop: 10 }}>
              {isPending ? <ButtonLoader /> : "Sign In"}
            </Button>
          </Form>
          <br />
          <Button
            outline
            color="secondary"
            className="submit_btn"
            style={{ marginTop: 10 }}
            onClick={loginByGoogle}
          >
            <img
              alt=""
              src="/images/google.png"
              width={20}
              style={{ marginRight: 10, marginTop: -3 }}
            />
            Sign in with Google
          </Button>
          <div className="d-flex align-items-center justify-content-center bottom_width mt-3">
            <p className="subheading">Don’t have an account?</p>
            <p
              className="transparent_btn"
              style={{
                fontSize: 13,
                marginTop: 0,
                marginLeft: 5,
                cursor: "pointer",
              }}
              onClick={signup}
            >
              Sign up
            </p>
          </div>
        </div>
      </div>
      <div className="col-xl-6 col-lg-6 col-md-6 hide_img">
        <div className="input_banner_img" />
      </div>
    </div>
  );
};

export default Login;
