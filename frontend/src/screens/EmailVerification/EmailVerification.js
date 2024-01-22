import React, { useState } from 'react';
import { FormGroup, Input, Label, Button, Form } from 'reactstrap';
import '../../assets/css/common.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { verifyEmail } from '../../API/userApi';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState();
  const [inputData, setInputData] = useState();
  const [error, setError] = useState();
  const handleOnChangeFuntion = (e) => {
    setInputData(e.target.value);
    setError(false);
  };
  const handleSubmitFunction = async (e) => {
    e.preventDefault();
    if (!inputData) {
      setError(true);
    } else {
      await verifyEmail(inputData);
    }
  };
  const signin = () => {
    navigate('/');
  };

  return (
    <div className="row signup_mobile_container full_view_container">
      <div className="col-xl-5 col-lg-5 col-md-5 hide_img">
        <div className="reset_banner_img" />
      </div>
      <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12">
        <div className="padding_left_signup ">
          <div style={{ marginTop: 70 }}>
            <Logo />
          </div>
          <h4 className="heading" style={{ marginTop: 50 }}>
            Enter Your Email
          </h4>
          <p className="subheading" style={{ marginTop: -5 }}>
            The Verification mail will be sent to the mailbox. Please Check it.
          </p>
          <Form onSubmit={handleSubmitFunction}>
            <p className="input_lbl" style={{ marginTop: 10 }}>
              Email
            </p>
            <div
              className={
                error
                  ? 'reset_input_div border border-danger'
                  : 'reset_input_div'
              }
              style={{ marginTop: -10 }}
            >
              <input
                className="reset_input_field"
                type="email"
                placeholder="**********"
                name=""
                onChange={handleOnChangeFuntion}
              ></input>
            </div>
            <Button
              type="submit"
              className="submit_btn"
              style={{ marginTop: 40 }}
            >
              Submit
            </Button>{' '}
          </Form>
          <br />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
