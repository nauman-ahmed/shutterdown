import React, { useState } from 'react';
import { Button, Form } from 'reactstrap';
import '../../assets/css/common.css';
import Logo from '../../components/Logo';
import { verifyEmail } from '../../API/userApi';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [inputData, setInputData] = useState();
  const [sending, setSending] = useState(false)
  const [error, setError] = useState();
  const handleOnChangeFuntion = (e) => {
    setInputData(e.target.value);
    setError(false);
  };
  const navigate = useNavigate()
  const handleSubmitFunction = async (e) => {
    e.preventDefault();
    if (!inputData) {
      setError(true);
    } else {
      setSending(true)
      const sended = await verifyEmail(inputData);
      if (sended) {
        navigate('/')
      }
      setSending(false)
    }
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
            > {sending ? 'Mail Sending...' : 'Submit'}

            </Button>{' '}
          </Form>
          <br />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
