import React, { useState, useEffect } from "react";
import { Button, Form } from "reactstrap";
import "../../assets/css/common.css";
import Logo from "../../components/Logo";
import { newPass } from "../../API/userApi";
const ResetPassword = () => {
  const [emailData, setEmailData] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("email"));
    setEmailData(data);
  }, []);
  const [inputData, setInputData] = useState({
    newpassword: "",
    newConfirmPassword: "",
    email: emailData,
  });

  const [isMatch, setIsMatch] = useState(false);
  const [error, setError] = useState(false);
  const handleOnChangeFuntion = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    setError(false);
  };
  const { newpassword, newConfirmPassword } = inputData;
  const handleSubmitFunction = (e) => {
    e.preventDefault();
    if (!newpassword) {
      setError(true);
    }
    if (!newConfirmPassword) {
      setError(true);
    } else if (newpassword !== newConfirmPassword) {
      setError(true);
      setIsMatch(true);
    } else {
      newPass(inputData)
        .then(() => {
          alert("successFully Updated");
        })
        .catch(() => {
          alert("fail");
        });
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
            Reset your Password
          </h4>
          <p className="subheading" style={{ marginTop: -5 }}>
            The Verification mail will be sent to the mailbox. Please Check it.
          </p>
          <Form onSubmit={handleSubmitFunction}>
            <p className="input_lbl" style={{ marginTop: 10 }}>
              Enter new Password
            </p>
            <div
              className={
                error && newpassword.length < 1
                  ? "reset_input_div border border-danger"
                  : error && isMatch
                  ? "reset_input_div border border-danger"
                  : "reset_input_div "
              }
              style={{ marginTop: -10 }}
            >
              <input
                className="reset_input_field"
                type="password"
                placeholder="**********"
                name="newpassword"
                onChange={handleOnChangeFuntion}
                value={inputData.newpassword}
              ></input>
            </div>
            <p className="input_lbl" style={{ marginTop: 20 }}>
              Enter confirm Password
            </p>
            <div
              className={
                error && newpassword.length < 1
                  ? "reset_input_div border border-danger"
                  : error && isMatch
                  ? "reset_input_div border border-danger"
                  : "reset_input_div"
              }
              style={{ marginTop: -10 }}
            >
              <input
                className="reset_input_field"
                type="password"
                placeholder="**********"
                name="newConfirmPassword"
                onChange={handleOnChangeFuntion}
                value={inputData.newConfirmPassword}
              ></input>
            </div>
            <Button
              type="submit"
              className="submit_btn"
              style={{ marginTop: 40 }}
            >
              Submit
            </Button>{" "}
          </Form>
          <br />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
