import React, { useState, useRef, useEffect } from "react";
import { Nav, Navbar, Form, FormControl, Modal, ModalHeader, ModalBody, Row, Col, ModalFooter, Button } from "react-bootstrap";
import "../assets/css/navbar.css";
import "../assets/css/common.css";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import CalenderNoti from "../assets/Profile/CalenderNoti.svg";
import NotiSelect from "../assets/Profile/NotiSelect.svg";
import { useAuthContext } from "../config/context";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateUserData } from "../API/userApi";
import { toast } from "react-toastify";
import "../assets/css/Profile.css";


const Header = (args) => {
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [path, setCurrentPath] = useState("");
  const [notiTab, setNotiTab] = useState("1");
  const location = useLocation(); // React Hook
  const target = useRef(null);
  const targetNoti = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = async () => {
    setUpdating(false);
    setModal(!modal);
    setShow(false)
  }
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    getUserData();
  }, [])
  const getUserData = async () => {
    const currentUser = JSON.parse(Cookies.get('currentUser'));
    setUserData(currentUser);
  }
  const [confirmPassword, setConfirmPassword] = useState(null);
  const currentUser = Cookies.get('currentUser') && JSON.parse(Cookies.get('currentUser'));
  const dispatch = useDispatch();


  function CheckPassword(submittedPassword) {
    if (submittedPassword?.length < 8) {
      setValidationMessage('Password must be at least 8 characters long.');
      return;
    }

    if (
      !/[a-z]/.test(submittedPassword) ||
      !/[A-Z]/.test(submittedPassword) ||
      !/[0-9]/.test(submittedPassword)
    ) {
      setValidationMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    // Password is valid
    setValidationMessage('Password is valid!');
  }

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleUpdateUserData = async (e) => {
    try {
      e.preventDefault();
      if (validationMessage != 'Password is valid!') {
        toast.error(validationMessage);
        return
      }
      if (userData?.password.length == 0 || userData?.password !== confirmPassword) {
        toast.error('Confirm Password not matched!');
        return
      }
      setUpdating(true);
      await updateUserData(userData).finally(setUpdating(false));
      setModal(false);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
    }
  }

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);
  return (
    <>
      <Modal show={modal} onHide={toggle} centered={true} fullscreen="lg" size="md">
        <ModalHeader ><b>Change Password</b></ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="10" sm="10" className="p-2">
              <div className="label">New Password</div>
              <input type="password" name="password" placeholder="New_Password" className="JobInput" onChange={(e) => {
                CheckPassword(e.target.value);
                handleChange(e);
              }} />
              {validationMessage && (
                <p className={`${validationMessage === 'Password is valid!' ? 'text-success' : 'text-danger'} `}>{validationMessage}</p>
              )}
            </Col>
            <Col xl="10" sm="10" className="p-2">
              <div className="label">Confirm New Password</div>
              <input type="password" className="JobInput" placeholder="Confirm Password" onChange={(e) => {
                setConfirmPassword(e.target.value);
              }} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn btnWidth Update" onClick={!updating && handleUpdateUserData}>
            {updating ? (
              <div className='w-100'>
                <div class="smallSpinner mx-auto"></div>
              </div>
            ) : (
              'Update'
            )}
          </Button>
          <Button color="btn-danger btn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <div className="set_header_width">
        <div className="navbar_container">
          <Navbar expand="lg" fixed="top" style={{left : '7px'}}>
            <div className="w-100 hide_nav_profile">
              <div className="w-100 d-flex align-items-center justify-content-between">
                <h4 className="heading"></h4>
                {/* <div className="search_div d-flex align-items-center justify-content-between">
                  <input
                    className="input_search"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <img src="/images/navbar/search.png" width={25}></img>
                </div> */}
                <div className="d-flex align-items-center">
                  {/* <img
                    ref={targetNoti}
                    onClick={() => setShowNoti(!showNoti)}
                    src="/images/navbar/noti.png"
                    style={{
                      marginTop: -10,
                      cursor: "pointer",
                    }}
                    width={25}
                    height={25}
                  /> */}
                  <div className="name_div_flex mb-1">
                    <img
                      src="/images/navbar/oval.png"
                      ref={target}
                      onClick={() => setShow(!show)}
                      width={70}
                      style={{ position: "absolute", cursor: "pointer" }}
                    />
                    <div className="name_div">
                      <p style={{ marginBottom: 0 }}>{`${currentUser?.firstName.charAt(0).toUpperCase() + currentUser?.firstName.slice(1).toLowerCase()} ${currentUser?.lastName.charAt(0).toUpperCase() + currentUser?.lastName.slice(1).toLowerCase()}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Navbar>

        </div>

        <Overlay
          rootClose={true}
          onHide={() => setShow(false)}
          target={target.current}
          show={show}
          placement="bottom"
        >
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              <div className="nav_popover">
                <div
                  className={
                    path == "/MyProfile"
                      ? "d-flex flex-row align-items-center  active_path"
                      : "d-flex flex-row align-items-center mt-1 non_active_path"
                  }
                >
                  <img style={{
                    filter : 'brightness(0)'
                  }} src="/images/navbar/profile_active.png" width={15}></img>
                  <p
                    className={
                      path == "/MyProfile" ? "active_popover" : "popover_txt"
                    }

                    onClick={() => navigate('/MyProfile')}
                  >
                    Profile
                  </p>
                </div>

                <div onClick={() => navigate('/MyProfile/Attendence')} className={
                    path == "/MyProfile/Attendence"
                      ? "d-flex flex-row align-items-center  active_path"
                      : "d-flex flex-row align-items-center mt-1 non_active_path"
                  }>
                  <img src="/images/navbar/attendence.png" width={15}></img>
                  <p className={
                      path == "/MyProfile/Attendence" ? "active_popover" : "popover_txt"
                    }>Attendence</p>
                </div>

                <div onClick={toggle} className="d-flex align-items-center mt-2 non_active_path">
                  <img
                    src="/images/navbar/change_password.png"
                    width={15}
                  ></img>
                  <p className="popover_txt">Change Password</p>
                </div>

                <div
                  className="d-flex align-items-center mt-2 mb-1 non_active_path"
                  onClick={() => {
                    Cookies.remove('currentUser');
                    navigate("/")
                  }}
                >
                  <img src="/images/navbar/logout.png" width={15}></img>
                  <p className="popover_txt">Logout</p>
                </div>
              </div>
            </Tooltip>
          )}
        </Overlay>
        <Overlay
          rootClose={true}
          onHide={() => setShowNoti(false)}
          target={targetNoti.current}
          show={showNoti}
          placement="bottom"
        >
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              <div className="nav_Noti_popover Text18S white">
                <div>Notifications</div>
              </div>
              <div className="R_A_Justify tabsNotiDay">
                <div
                  className={
                    notiTab == "1"
                      ? "Text16N1 activeNotiTab point"
                      : "Text16N1 point"
                  }
                  onClick={() => setNotiTab("1")}
                >
                  Today
                </div>
                <div
                  className={
                    notiTab == "2"
                      ? "Text16N1 activeNotiTab point"
                      : "Text16N1 point"
                  }
                  onClick={() => setNotiTab("2")}
                >
                  Previous
                </div>
              </div>
              <div className="line" />
              {[1, 2, 3].map(() => (
                <div className="notificationsBox mt12 R_A_Justify">
                  <div className="Circle" />
                  <div>
                    <img src={CalenderNoti} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div className="Text14Semi">
                      Event
                      <br />
                      <text className="gray">Simrat Weds Angad</text>
                    </div>
                  </div>
                  <div className="line" style={{ height: "40px" }} />
                  <div style={{ textAlign: "left" }}>
                    <div className="Text14Semi">
                      Location
                      <br />
                      <text className="gray">Mussorie </text>
                    </div>
                  </div>
                  <img src={NotiSelect} />
                </div>
              ))}
            </Tooltip>
          )}
        </Overlay>


      </div>
    </>
  );
};
export default Header;
