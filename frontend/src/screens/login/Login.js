import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'reactstrap';
import '../../assets/css/common.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Logo from '../../components/Logo';
import { GetSignInApi } from '../../API/userApi';
import { useGoogleLogin } from '@react-oauth/google';
import { checkExistEmail } from '../../API/userApi';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logingIn, setLoginIn] = useState(false)
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    setError(false);
  };

  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === "Enter") {
        handleSubmitForm()
      }
    };
  
    window.addEventListener("keydown", handleEnterKey);
  
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, []);

  const handleSubmitForm = async (e) => {
    e?.preventDefault();
    if (inputData.email.length === 0) {
      setError(true);
    }
    if (inputData.password.length === 0) {
      setError(true);
    } else {
      try {
        setLoginIn(true)
        await GetSignInApi(inputData);
        setLoginIn(false)
        const user = Cookies.get('currentUser');
        if (user) {
          setSuccess(true);

          navigate('/MyProfile');

        }
      } catch (error) {
        toast.error('Invalid Credentials');
      }
    }
  };
  const signup = () => {
    navigate('Signup');
  };

  const { email, password } = inputData;
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          "Authorization": `Bearer ${tokenResponse.access_token}`
        }
      })
      console.log(res);

      const accountExist = await checkExistEmail(res.data.email)
      console.log(accountExist);

      if (res.status === 200) {
        if (accountExist?.email) {
          Cookies.set('currentUser', JSON.stringify(accountExist));
          toast.success('Logged in successfully!')
          navigate('/MyProfile');
        } else {
          localStorage.setItem("signInWithGoogle", JSON.stringify(res.data))
          navigate("/signInWithGoogle")
        }
       
      }


    },

  });
  return (
    <>
      <div className="row" style={{ maxWidth: '100%' }}>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="padding_left">
            <div style={{ marginTop: 70 }}>
              <Logo />
            </div>
            <h4 className="heading" style={{ marginTop: 50 }}>
              Welcome back
            </h4>
            <p className="subheading" style={{ marginTop: -5 }}>
              Welcome back! Please enter your details{' '}
            </p>
            <Form onSubmit={handleSubmitForm}>
              <p className="input_lbl" style={{ marginTop: 30 }}>
                Email
              </p>
              <div className="input_div" style={{ marginTop: -10 }}>
                <input
                  className={
                    error && email.length < 1
                      ? 'input_field border w-100 border-danger'
                      : 'input_field w-100'
                  }
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleOnChange}
                  value={email}
                  name="email"
                ></input>
              </div>
              <p className="input_lbl" style={{ marginTop: 20 }}>
                Password
              </p>
              <div
                className={
                  error ? 'input_div border border-danger' : 'input_div'
                }
                style={{ marginTop: -10 }}
              >
                <input
                  className={'input_field w-100'}
                  name="password"
                  type="password"
                  placeholder="**********"
                  onChange={handleOnChange}
                  value={password}
                ></input>
              </div>
              <div className="d-flex justify-content-between align-items-center full_view_login">
                {/* <FormGroup style={{ marginTop: 5 }}>
                  <Label>
                    <Input type="checkbox" /> &nbsp;Remember Password
                  </Label>
                </FormGroup> */}
                <button
                  type="button"
                  className="transparent_btn mt-1"
                  onClick={() => navigate('/emailVerify')}
                >
                  Forgot Password
                </button>
              </div>
              <Button
                type="submit"
                className="submit_btn"
                style={{ marginTop: 10 }}
              >
                {logingIn ? <div className='w-100'>
                  <div class="smallSpinner mx-auto"></div>
                </div> : "Sign In"}
              </Button>{' '}
            </Form>
            <br />
            <Button
              outline
              color="secondary"
              className="submit_btn"
              style={{ marginTop: 10 }}
              onClick={login}
            >
              <img alt=''
                src="/images/google.png"
                width={20}
                style={{ marginRight: 10, marginTop: -3 }}
                onClick={login}
              />
              Sign in with Google
            </Button>
            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
               const decode=jwt_decode(credentialResponse.credential);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            /> */}

            <div className="d-flex align-items-center justify-content-center bottom_width mt-3">
              <p className="subheading">Don’t have an account?</p>
              <p
                className="transparent_btn"
                style={{
                  fontSize: 13,
                  marginTop: 0,
                  marginLeft: 5,
                  cursor: 'pointer',
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
      {success && <ToastContainer />}
    </>
  );
};

export default Login;
