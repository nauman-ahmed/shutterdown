import React, { useState, useEffect } from "react";
import CommonDropText from "../../components/CommonDropText";
import { FormGroup, Label, Button, Form } from "reactstrap";
import "../../assets/css/common.css";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Logo from "../../components/Logo";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Cookies from "js-cookie";
import { useLoggedInUser } from "../../config/zStore";
import ButtonLoader from "../../components/common/buttonLoader";
import { useSignUpGoogleQuery, useSignUpQuery } from "../../hooks/authQueries";

const Signup = (props) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState();
  const [error, setError] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [rollSelect, setRollSelect] = useState("Select");
  const [rollOpen, setRollOpen] = useState(false);
  const [signInData, setSignInData] = useState();
  const { updateUserData } = useLoggedInUser()
  const { mutate: simpleSignUp, isPending: creatigAcc, isError, error: simpleSignUpError } = useSignUpQuery();
  const { mutate: googleSignUp, isPending: creatigAccbyGoogle, isgoogleError, error: googleSignUpError } = useSignUpGoogleQuery();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: phone,
  });
  let Roll = [
    {
      check: "roll",
      title: "Manager",
      id: 1,
    },
    {
      check: "roll",
      title: "Editor",
      id: 2,
    },
    {
      check: "roll",
      title: "Shooter",
      id: 3,
    },
  ];

  useEffect(() => {
    const signInWithGoogle = JSON.parse(
      localStorage.getItem("signInWithGoogle")
    );
    setSignInData(signInWithGoogle);
  }, []);
  const googleSignData = {
    firstName: signInData?.given_name,
    lastName: signInData?.family_name,
    email: signInData?.email,
  };

  const handleOnChangeFunction = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsMatch(false);
  };
  const { firstName, lastName, email, password, confirmPassword, roll } = formData;

  const FormRegisterData = { ...formData, rollSelect };
  const GoogleRegisterData = { ...googleSignData, rollSelect };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const fieldError = rollSelect === "Select" || firstName === "" || lastName === "" || email === "" || phone === "" || password === "" || confirmPassword === ""
    if (fieldError) {
      setError(true);
      return
    } else if (password !== confirmPassword) {
      setError(true);
      setIsMatch(true);
      toast.error('Confirm Password does not match!')
      return
    } else {
      try {
        setError(false);
        simpleSignUp({ ...FormRegisterData, phone: phone }, {
          onSuccess: (res) => {
            if (res.status === 200) {
              toast.success("You Are Registered Successfully");
              navigate("/");
            } else {
              toast.error("This Email is Already Exists");
            }
          },
          onError: (error) => {
            console.log(error);
            toast.error("Something went Wrong");
          }
        })
      } catch (error) {
        console.log(error);
        toast.error("Something went Wrong");
      }
    }
  };

  const handleSignInwithGoogleFunction = async (e) => {
    e.preventDefault();
    const fieldError = phone === "" || roll === "select";
    if (fieldError) {
      setError(true);
      return
    } else {
      setError(false);
      googleSignUp({ ...GoogleRegisterData, phone: phone }, {
        onSuccess: (response) => {
          if (response.status === 200) {
            Cookies.set('userKeys', JSON.stringify({ userToken: response.data.token }))
            Cookies.set("currentUser", JSON.stringify(response.data.User))
            updateUserData(response.data.User)
            toast.success("You Are Registered Successfully");
            navigate("/profile");
          } else {
            toast.error("Something went wrong");
          }
        },
        onError: (error) => {
          toast.error("Something went wrong");
        }
      })

    }
  };
  const signin = () => {
    navigate("/");
  };
  const handlePhoneNo = (e) => {
    setPhone(e);
  };

  return (
    <>
      <div className="row signup_mobile_container full_view_container">
        <div className="col-xl-5 col-lg-5 col-md-5 hide_img">
          <div className="signup_banner_img" />
        </div>
        <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12">
          <div className="padding_left_signup ">
            <div style={{ marginTop: 70 }}>
              <Logo />
            </div>
            <h4 className="heading" style={{ marginTop: 50 }}>
              Register
            </h4>
            <p className="subheading" style={{ marginTop: -5 }}>
              Welcome back! Please enter your details{" "}
            </p>
            <Form>
              <div className="row">
                {props.signInWithGoogle === true ? (
                  <>
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                      <p className="input_lbl" style={{ marginTop: 20 }}>
                        First Name
                      </p>
                      <div
                        className={
                          error && firstName.length < 1
                            ? "input_div_signup border border-danger"
                            : "input_div_signup"
                        }
                        style={{ marginTop: -10 }}
                      >
                        <input
                          className="input_field_signup "
                          type="text"
                          placeholder="Enter your Name"
                          name="firstName"
                          onChange={handleOnChangeFunction}
                          value={
                            props.signInWithGoogle
                              ? signInData?.given_name
                              : firstName
                          }
                        ></input>
                      </div>
                    </div>

                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 space_between ">
                      <p className="input_lbl" style={{ marginTop: 20 }}>
                        Last Name
                      </p>
                      <div
                        className={
                          error && lastName.length < 1
                            ? "input_div_signup border border-danger "
                            : "input_div_signup "
                        }
                        style={{ marginTop: -10 }}
                      >
                        <input
                          className="input_field_signup "
                          type="text"
                          placeholder="Enter your last Name"
                          name="lastName"
                          onChange={handleOnChangeFunction}
                          value={
                            props.signInWithGoogle
                              ? signInData.family_name
                              : lastName
                          }
                        ></input>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                        <p className="input_lbl" style={{ marginTop: 10 }}>
                          Email Id
                        </p>
                        <div
                          className={
                            error && email.length < 1
                              ? "input_div_signup border border-danger"
                              : "input_div_signup"
                          }
                          style={{ marginTop: -10 }}
                        >
                          <input
                            className="input_field_signup "
                            type="email"
                            placeholder="Enter your Email id"
                            name="email"
                            pattern="[^ @]*@[^ @]*"
                            onChange={handleOnChangeFunction}
                            value={
                              props.signInWithGoogle ? signInData?.email : email
                            }
                          ></input>
                        </div>
                      </div>

                      <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 space_between ">
                        <p className="input_lbl" style={{ marginTop: 10 }}>
                          Phone
                        </p>
                        <div
                          className={
                            error && !phone
                              ? "input_div_signup border border-danger "
                              : "input_div_signup "
                          }
                          style={{ marginTop: -10 }}
                        >
                          <PhoneInput
                            defaultCountry="IN"
                            placeholder="Enter phone number"
                            name="phoneNo"
                            onChange={handlePhoneNo}
                            value={phone}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                      <p className="input_lbl" style={{ marginTop: 20 }}>
                        First Name
                      </p>
                      <div
                        className={
                          error && firstName.length < 1
                            ? "input_div_signup border border-danger"
                            : "input_div_signup"
                        }
                        style={{ marginTop: -10 }}
                      >
                        <input
                          className="input_field_signup "
                          type="text"
                          placeholder="Enter your Name"
                          name="firstName"
                          onChange={handleOnChangeFunction}
                          value={firstName}
                        ></input>
                      </div>
                    </div>

                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 space_between ">
                      <p className="input_lbl" style={{ marginTop: 20 }}>
                        Last Name
                      </p>
                      <div
                        className={
                          error && lastName.length < 1
                            ? "input_div_signup border border-danger "
                            : "input_div_signup "
                        }
                        style={{ marginTop: -10 }}
                      >
                        <input
                          className="input_field_signup "
                          type="text"
                          placeholder="Enter your last Name"
                          name="lastName"
                          onChange={handleOnChangeFunction}
                          value={lastName}
                        ></input>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                        <p className="input_lbl" style={{ marginTop: 10 }}>
                          Email Id
                        </p>
                        <div
                          className={
                            error && email.length < 1
                              ? "input_div_signup border border-danger"
                              : "input_div_signup"
                          }
                          style={{ marginTop: -10 }}
                        >
                          <input
                            className="input_field_signup "
                            type="email"
                            placeholder="Enter your Email id"
                            name="email"
                            pattern="[^ @]*@[^ @]*"
                            onChange={handleOnChangeFunction}
                            value={email}
                          ></input>
                        </div>
                      </div>

                      <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 space_between ">
                        <p className="input_lbl" style={{ marginTop: 10 }}>
                          Phone
                        </p>
                        <div
                          className={
                            error && !phone
                              ? "input_div_signup border border-danger "
                              : "input_div_signup "
                          }
                          style={{ marginTop: -10 }}
                        >
                          <PhoneInput
                            defaultCountry="IN"
                            placeholder="Enter phone number"
                            name="phoneNo"
                            onChange={handlePhoneNo}
                            value={phone}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {props.signInWithGoogle === true ? (
                  ""
                ) : (
                  <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                      <p className="input_lbl" style={{ marginTop: 10 }}>
                        Password
                      </p>
                      <div
                        className={
                          isMatch || (error && password.length < 1)
                            ? "input_div_signup border border-danger"
                            : "input_div_signup"
                        }
                        style={{ marginTop: -10 }}
                      >
                        <input
                          className="input_field_signup "
                          type="password"
                          placeholder="**********"
                          name="password"
                          onChange={handleOnChangeFunction}
                          value={password}
                        ></input>
                      </div>
                    </div>

                    <div className="col-xl-5 col-lg-5 col-md-5 space_between col-sm-12 ">
                      <p className="input_lbl" style={{ marginTop: 10 }}>
                        Confirm Password
                      </p>
                      <div
                        className={
                          isMatch || (error && confirmPassword.length < 1)
                            ? "input_div_signup border border-danger"
                            : "input_div_signup"
                        }
                        style={{ marginTop: -10 }}
                      >
                        <input
                          className="input_field_signup "
                          type="password"
                          placeholder="*********"
                          name="confirmPassword"
                          onChange={handleOnChangeFunction}
                          value={confirmPassword}
                        ></input>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row pb-3">
                  <div className="col">
                    <CommonDropText
                      divstyle="mt25"
                      name="Role"
                      className={
                        error && !rollSelect
                          ? "input_div_signup border border-danger "
                          : "input_div_signup "
                      }
                      data={Roll}
                      rollSelect={rollSelect}
                      setRollSelect={setRollSelect}
                      rollOpen={rollOpen}
                      setRollOpen={setRollOpen}
                      setError={setError}
                      error={error}
                    />
                  </div>
                </div>
              </div>
              <FormGroup style={{ marginTop: 5 }}>
                <Label>
                  <span className="grey_color">
                    By Sign Up, You agree with the
                  </span>
                  Terms & Privacy Policy
                </Label>
              </FormGroup>
              <Button
                type="submit"
                className="submit_btn signup_submit_btn"
                onClick={props.signInWithGoogle === true ? handleSignInwithGoogleFunction : handleSubmitForm}
              >{creatigAcc || creatigAccbyGoogle ? <ButtonLoader /> : "Sign Up"}
              </Button>
            </Form>
            <br />
            <div className="d-flex align-items-center justify-content-center bottom_width_signup mt-3">
              <p className="subheading">Already have an account?</p>
              <p
                className="transparent_btn"
                style={{
                  fontSize: 13,
                  marginTop: 0,
                  marginLeft: 5,
                  cursor: "pointer",
                }}
                onClick={() => signin()}
              >
                Sign in
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
