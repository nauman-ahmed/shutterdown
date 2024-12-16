import React, { useState } from "react";
import { Button, Form } from "reactstrap";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordQuery } from "../../hooks/authQueries";
import ButtonLoader from "../../components/common/buttonLoader";

const EmailVerification = () => {
  const [userMail, setUserMail] = useState("");
  const [error, setError] = useState();
  const handleOnChangeFuntion = (e) => {
    setUserMail(e.target.value);
  };
  const navigate = useNavigate();
  const {
    data: success,
    mutate,
    isLoading,
    error: queryError,
  } = useForgotPasswordQuery();

  const handleSubmitFunction = async (e) => {
    e.preventDefault();
    if (!userMail) {
      setError(true);
    } else {
      mutate(userMail, {
        onSuccess: () => {
          if (success) {
            navigate("/");
          }
        },
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
                error && userMail?.length < 1
                  ? "reset_input_div border border-danger"
                  : "reset_input_div"
              }
              style={{ marginTop: -10 }}
            >
              <input
                className="reset_input_field"
                type="email"
                placeholder="Enter You rEmail"
                name=""
                onChange={handleOnChangeFuntion}
              ></input>
            </div>
            <Button
              type="submit"
              className="submit_btn"
              style={{ marginTop: 40 }}
            >
              {isLoading ? <ButtonLoader /> : "Submit"}
            </Button>
          </Form>
          <br />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
