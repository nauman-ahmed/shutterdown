import React, { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  ModalFooter,
  Button,
} from "react-bootstrap";
import "../assets/css/navbar.css";
import "../assets/css/common.css";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NotiSelect from "../assets/Profile/NotiSelect.svg";
import Cookies from "js-cookie";
import { updateUserDataAPI, updateUserG } from "../API/userApi";
import { toast } from "react-toastify";
import "../assets/css/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications } from "../API/notifictions";
import { store } from "../redux/configureStore";
import { updateNotifications } from "../redux/notificationsSlice";
import dayjs from "dayjs";
import { updateAllEvents } from "../redux/eventsSlice";
import { useLoggedInUser, useOpenedMenu } from "../config/zStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckPassword } from "../functions/authFns/passwordFn";
import ButtonLoader from "./common/buttonLoader";
import NotificationsOverlay from "./layoutComps/NotificationsOverlay";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Header = (args) => {
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [path, setCurrentPath] = useState("");
  const location = useLocation(); // React Hook
  const target = useRef(null);
  const targetNoti = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = async () => {
    setUpdating(false);
    setModal(!modal);
    setShow(false);
  };
  const { userData: currentUser, updateUserData } = useLoggedInUser();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(currentUser);
  const { openedMenu, setOpenedMenu } = useOpenedMenu()
  const { data: updatedUserData, mutate, isPending, error: userAPIError, } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: updateUserDataAPI,
    retry: 1
  })
  window.addEventListener('DOMContentLoaded', function () {
    if (currentUser) {
      store.dispatch({ type: "SOCKET_CONNECT" });
    }
  });
  window.addEventListener('beforeunload', function (event) {
    store.dispatch({ type: "SOCKET_DISCONNECT" });
  });

  useEffect(() => {
    try {

      // getStoredEvents()
      store.dispatch({ type: "SOCKET_CONNECT" });
      return (() => {
        store.dispatch({ type: "SOCKET_DISCONNECT" });
      })
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [confirmPassword, setConfirmPassword] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdateUserData = async (e) => {
    try {
      e.preventDefault();
      if (validationMessage !== "Password is valid!") {
        toast.error(validationMessage);
        return;
      }
      if (
        userData?.password.length === 0 ||
        userData?.password !== confirmPassword
      ) {
        toast.error("Confirm Password not matched!");
        return;
      }
      // setUpdating(true);
      mutate(userData)
      // await updateUserData(userData).finally(setUpdating(false));
      setModal(false);
      // setUpdating(false);
    } catch (error) {
      setUpdating(false);
    }
  };


  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const loginByGoogle = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events', 
    onSuccess: async (tokenResponse) => {
      try {

        console.log(tokenResponse);
        const updatedUser = await updateUserG({ ...currentUser, googleToken: tokenResponse.access_token })
        updateUserData(updatedUser)

      } catch (error) {
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: () => {
      toast.error("Google login was unsuccessful.");
    },
  });

  return (
    <>
      <Modal
        show={modal}
        onHide={toggle}
        centered={true}
        fullscreen="lg"
        size="md"
      >
        <ModalHeader>
          <b>Change Password</b>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="10" sm="10" className="p-2">
              <div className="label">New Password</div>
              <input
                type="password"
                name="password"
                placeholder="New_Password"
                className="JobInput"
                onChange={(e) => {
                  const message = CheckPassword(e.target.value);
                  setValidationMessage(message)
                  handleChange(e);
                }}
              />
              {validationMessage && (
                <p
                  className={`${validationMessage === "Password is valid!"
                    ? "text-success"
                    : "text-danger"
                    } `}
                >
                  {validationMessage}
                </p>
              )}
            </Col>
            <Col xl="10" sm="10" className="p-2">
              <div className="label">Confirm New Password</div>
              <input
                type="password"
                className="JobInput"
                placeholder="Confirm Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="Update_btn btnWidth Update"
            onClick={!updating && handleUpdateUserData}
          >
            {isPending ? (
              <ButtonLoader />
            ) : (
              "Update"
            )}
          </Button>
          <Button color="btn-danger btn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <div className="set_header_width">
        <div className="navbar_container">
          <Navbar expand="lg" fixed="top" style={{ left: "7px" }}>
            <div className="w-100 hide_nav_profile">
              <div className="w-100 d-flex align-items-center justify-content-end">

                <div className="d-flex align-items-center">
                  {(!currentUser.googleConnected && (currentUser.rollSelect == 'Shooter' || currentUser.rollSelect === 'Editor')) ? (
                    <div onClick={loginByGoogle} className=" mx-3 d-flex align-items-center cursor-pointer  connectGBtn ">
                      Connect <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google Calendar" role="img" viewBox="0 0 512 512" width="40px" height="40px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#ffffff"></rect><path d="M100 340h74V174H340v-74H137Q100 100 100 135" fill="#4285f4"></path><path d="M338 100v76h74v-41q0-35-35-35" fill="#1967d2"></path><path d="M338 174h74V338h-74" fill="#fbbc04"></path><path d="M100 338v39q0 35 35 35h41v-74" fill="#188038"></path><path d="M174 338H338v74H174" fill="#34a853"></path><path d="M338 412v-74h74" fill="#ea4335"></path><path d="M204 229a25 22 1 1 1 25 27h-9h9a25 22 1 1 1-25 27M270 231l27-19h4v-7V308" stroke="#4285f4" stroke-width="15" stroke-linejoin="bevel" fill="none"></path></g></svg>
                    </div>
                  ) : (currentUser.googleConnected &&
                    <div  className=" mx-3 d-flex align-items-center   connectGBtn ">
                      Connected <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google Calendar" role="img" viewBox="0 0 512 512" width="40px" height="40px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#ffffff"></rect><path d="M100 340h74V174H340v-74H137Q100 100 100 135" fill="#4285f4"></path><path d="M338 100v76h74v-41q0-35-35-35" fill="#1967d2"></path><path d="M338 174h74V338h-74" fill="#fbbc04"></path><path d="M100 338v39q0 35 35 35h41v-74" fill="#188038"></path><path d="M174 338H338v74H174" fill="#34a853"></path><path d="M338 412v-74h74" fill="#ea4335"></path><path d="M204 229a25 22 1 1 1 25 27h-9h9a25 22 1 1 1-25 27M270 231l27-19h4v-7V308" stroke="#4285f4" stroke-width="15" stroke-linejoin="bevel" fill="none"></path></g></svg>
                    </div>
                  )}
                  <img
                    ref={targetNoti}
                    alt="notification"
                    onClick={() => setShowNoti(!showNoti)}
                    src="/images/navbar/noti.png"
                    style={{
                      marginTop: -10,
                      cursor: "pointer",
                    }}
                    width={25}
                    height={25}
                  />
                  <div className="name_div_flex align-items-center">
                    <img
                      alt=""
                      src="/images/navbar/oval.png"
                      ref={target}
                      onClick={() => setShow(!show)}
                      width={70}
                      style={{ position: "absolute", cursor: "pointer" }}
                    />
                    <div className="name_div">
                      <p style={{ marginBottom: 0 }}>{`${currentUser?.firstName?.charAt(0).toUpperCase() +
                        currentUser?.firstName?.slice(1).toLowerCase()
                        } ${currentUser?.lastName?.charAt(0).toUpperCase() +
                        currentUser?.lastName?.slice(1).toLowerCase()
                        }`}</p>
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
              <div >
                <div
                  className={
                    path === "/profile"
                      ? "d-flex flex-row align-items-center cursor-pointer  active_path"
                      : "d-flex flex-row align-items-center cursor-pointer mt-1 non_active_path"
                  }
                >
                  <img
                    alt=""
                    style={{
                      filter: "brightness(0)",
                    }}
                    src="/images/navbar/profile_active.png"
                    width={15}
                  ></img>
                  <p
                    className={
                      path === "/profile" ? "active_popover" : "popover_txt"
                    }
                    onClick={() => {
                      navigate("/profile")
                      setOpenedMenu(null)
                      Cookies.set('currentTab', null)
                    }}
                  >
                    Profile
                  </p>
                </div>

                <div
                  onClick={() => {
                    navigate("/attendance")
                    setOpenedMenu(null)
                    Cookies.set('currentTab', 'Attendance')
                  }}
                  className={
                    path === "/attendance"
                      ? "d-flex flex-row align-items-center cursor-pointer active_path"
                      : "d-flex flex-row align-items-center cursor-pointer mt-1 non_active_path"
                  }
                >
                  <img
                    alt=""
                    src="/images/navbar/attendence.png"
                    width={15}
                  ></img>
                  <p
                    className={
                      path === "/attendance"
                        ? "active_popover"
                        : "popover_txt"
                    }
                  >
                    Attendence
                  </p>
                </div>

                <div
                  onClick={toggle}
                  className="d-flex align-items-center cursor-pointer mt-2 non_active_path"
                >
                  <img
                    alt=""
                    src="/images/navbar/change_password.png"
                    width={15}
                  ></img>
                  <p className="popover_txt">Change Password</p>
                </div>

                <div
                  className="d-flex align-items-center cursor-pointer mt-2 mb-1 non_active_path"
                  onClick={() => {
                    dispatch(updateAllEvents([]))
                    Cookies.remove("userKeys");
                    Cookies.remove("currentUser");
                    Cookies.remove('currentTab')
                    window.location.reload();
                  }}
                >
                  <img alt="" src="/images/navbar/logout.png" width={15}></img>
                  <p className="popover_txt">Logout</p>
                </div>
              </div>
            </Tooltip>
          )}
        </Overlay>
        <NotificationsOverlay showNoti={showNoti} setShowNoti={setShowNoti} targetNoti={targetNoti} />
      </div>
    </>
  );
};
export default Header;
