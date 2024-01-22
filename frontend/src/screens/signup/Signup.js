import React, { useState, useEffect } from 'react';
import CommonDropText from '../../components/CommonDropText';

import { FormGroup, Input, Label, Button, Form } from 'reactstrap';
import '../../assets/css/common.css';
import { useNavigate,useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Logo from '../../components/Logo';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { GetsignUPData } from '../../API/userApi';
import { GetSignInWithGoogleData } from '../../API/userApi';
import { checkExistEmail } from '../../API/userApi';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Signup = (props) => {
  const navigate = useNavigate();
  const location=useLocation()
  const [successToast, setSuccessToast] = useState(false)
  const [StatusCode, setStatusCode] = useState()
  const [phone, setPhone] = useState();
  const [error, setError] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [rollSelect, setRollSelect] = useState("Select")
  const [rollOpen, setRollOpen] = useState(false)
  const [signInData,setSignInData]=useState()

  const [inputData, setInputData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: phone,
  });
// console.log(`This is Roll ${inputData.rollSelect}`)
  let Roll = [
    {
      check: 'roll',
      title: "Manager",
      id: 1,
    },
    {
      check: 'roll',
      title: "Shooter",
      id: 2,
    },
    {
      check: 'roll',
      title: "Editor",
      id: 3,
    },
  ];

useEffect(()=>{
  const response=JSON.parse(localStorage.getItem('res'))

    const signInWithGoogle = JSON.parse(
      localStorage.getItem('signInWithGoogle')
    );
    // if (response?.status===200) {
    //   navigate("/MyProfile")
    // }
    setSignInData(signInWithGoogle)


},[])
const inputData1={
  firstName:signInData?.data?.given_name,
  lastName:signInData?.data?.family_name,
  email:signInData?.data?.email,
  
}
  let registerData = {...inputData,rollSelect}

  const handleOnChangeFunction = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    setError(false);
    setIsMatch(false);
  };
  const { firstName, lastName, email, password, confirmPassword,roll  } = inputData;
  
const RegisterData={...inputData,rollSelect}
const RegisterData2={...inputData1,rollSelect}

  const handleSubmitForm = async (e) => {
    e.preventDefault();
  
    if(roll === 'Select'){
      setError(true);
    }
    if (firstName === '') {
      setError(true);
    }
    if (lastName === '') {
      setError(true);
    }
    if (email === '') {
      setError(true);
    }
    if (phone === '') {
      setError(true);
    }
    if (password === '') {
      setError(true);
    }
    if (confirmPassword === '') {
      setError(true);
    } else if (password !== confirmPassword) {
      setError(true);
      setIsMatch(true);
    } else {

        
      try {
          setError(false);
        await GetsignUPData(RegisterData, phone);

        const res = JSON.parse(localStorage.getItem("res"))
        if (res.status === 200) {
          setSuccessToast(true)
          toast.success("You Are Registered Successfully")
          navigate("/")
        }
        else {
          toast.error("This Email is Already Exists")
        }
      } catch (error) {
        toast.error('This Email is Already Exists');

      }

    }
  };
  const handleSignInwithGoogleFunction=async(e)=>{
    if (phone==='') {
      setError(true)
    }
    if (roll==="select") {
      setError(true)
    }
    else{
      e.preventDefault()
      setError(false)
      await GetSignInWithGoogleData(RegisterData2,phone)
        const response = JSON.parse(localStorage.getItem('loginUser'));
        if (response.status === 200) {
        
          localStorage.setItem(
            'userEmail',
            JSON.stringify(response?.data?.User._id)
          );
          const shooter = JSON.parse(localStorage.getItem('loginUser'));
          if (shooter.data.User.rollSelect === 'Shooter') {
            navigate('/photographer-CalenderView/View');
          } else {
            navigate('/MyProfile');
          }
        } else {
          toast.error('Invalid Credentials');
        }
     
    }
  }
  const signin = () => {
    navigate('/');
  };
  const handlePhoneNo = (e) => {
    setPhone(e);
    setError(false);
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
              Welcome back! Please enter your details{' '}
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
                            ? 'input_div_signup border border-danger'
                            : 'input_div_signup'
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
                              ? signInData?.data.given_name
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
                            ? 'input_div_signup border border-danger '
                            : 'input_div_signup '
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
                              ? signInData.data.family_name
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
                              ? 'input_div_signup border border-danger'
                              : 'input_div_signup'
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
                              props.signInWithGoogle
                                ? signInData?.data?.email
                                : email
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
                              ? 'input_div_signup border border-danger '
                              : 'input_div_signup '
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
                            ? 'input_div_signup border border-danger'
                            : 'input_div_signup'
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
                            ? 'input_div_signup border border-danger '
                            : 'input_div_signup '
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
                              ? 'input_div_signup border border-danger'
                              : 'input_div_signup'
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
                              ? 'input_div_signup border border-danger '
                              : 'input_div_signup '
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
                  ''
                ) : (
                  <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                      <p className="input_lbl" style={{ marginTop: 10 }}>
                        Password
                      </p>
                      <div
                        className={
                          isMatch || (error && password.length < 1)
                            ? 'input_div_signup border border-danger'
                            : 'input_div_signup'
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
                            ? 'input_div_signup border border-danger'
                            : 'input_div_signup'
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
                          ? 'input_div_signup border border-danger '
                          : 'input_div_signup '
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
                  <Input type="checkbox" />{' '}
                  <span className="grey_color">I agree with the </span> Terms &
                  Privacy Policy
                </Label>
              </FormGroup>
              {props.signInWithGoogle === true ? (
                <>
                  <Button
                    type="submit"
                    className="submit_btn signup_submit_btn"
                    onClick={handleSignInwithGoogleFunction}
                  >
                    Sign Up
                  </Button>{' '}
                </>
              ) : (
                <>
                  <Button
                    type="submit"
                    className="submit_btn signup_submit_btn"
                    onClick={handleSubmitForm}
                  >
                    Sign Up
                  </Button>{' '}
                </>
              )}
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
                  cursor: 'pointer',
                }}
                onClick={() => signin()}
              >
                Sign in
              </p>
            </div>
          </div>
        </div>
      </div>
      {successToast ? (
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      ) : null}
    </>
  );
};

export default Signup;
