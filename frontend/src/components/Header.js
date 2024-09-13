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
import CalenderNoti from "../assets/Profile/CalenderNoti.svg";
import NotiSelect from "../assets/Profile/NotiSelect.svg";
import Cookies from "js-cookie";
import { updateUserData } from "../API/userApi";
import { toast } from "react-toastify";
import "../assets/css/Profile.css";
import io from "socket.io-client";
import BASE_URL from "../API";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications } from "../API/notifictions";
import { store } from "../redux/configureStore";
import { updateNotifications } from "../redux/notificationsSlice";
import dayjs from "dayjs";
import { updateAllEvents } from "../redux/eventsSlice";
import { getEvents } from "../API/Event";

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
    setShow(false);
  };
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  window.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded');
    console.log('connecting socket');
    const currentUser = JSON.parse(Cookies.get("currentUser"));
    if(currentUser){
      store.dispatch({ type: "SOCKET_CONNECT" });
    }
});
window.addEventListener('beforeunload', function (event) {
  console.log('Website about to be unloaded');
  console.log('disconnecting');
  
  store.dispatch({ type: "SOCKET_DISCONNECT" });
});

const getStoredEvents = async () => {
  const res = await getEvents();
  if (currentUser.rollSelect === 'Manager') {
    dispatch(updateAllEvents(res?.data));
  } else if (currentUser.rollSelect === 'Shooter' || currentUser.rollSelect === 'Editor') {
    const eventsToShow = res.data?.map(event => {

      if (event?.shootDirectors?.some(director => director._id === currentUser._id)) {
        return { ...event, userRole: 'Shoot Director' };
      } else if (event?.choosenPhotographers.some(photographer => photographer._id === currentUser._id)) {
        return { ...event, userRole: 'Photographer' };
      } else if (event?.choosenCinematographers.some(cinematographer => cinematographer._id === currentUser._id)) {
        return { ...event, userRole: 'Cinematographer' };
      } else if (event?.droneFlyers.some(flyer => flyer._id === currentUser._id)) {
        return { ...event, userRole: 'Drone Flyer' };
      } else if (event?.manager.some(manager => manager._id === currentUser._id)) {
        return { ...event, userRole: 'Manager' };
      } else if (event?.sameDayPhotoMakers.some(photoMaker => photoMaker._id === currentUser._id)) {
        return { ...event, userRole: 'Same Day Photos Maker' };
      } else if (event?.sameDayVideoMakers.some(videoMaker => videoMaker._id === currentUser._id)) {
        return { ...event, userRole: 'Same Day Video Maker' };
      } else if (event?.assistants.some(assistant => assistant._id === currentUser._id)) {
        return { ...event, userRole: 'Assistant' };
      } else {
        return null;
      }
    });
    dispatch(updateAllEvents(eventsToShow));
  }
};
  useEffect(() => {
    try {
      getUserData();
      getStoredEvents()
      store.dispatch({ type: "SOCKET_CONNECT" });

      return (()=>{
        store.dispatch({ type: "SOCKET_DISCONNECT" });
      })
     
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeId = (obj) => {
    const { _id, ...rest } = obj;
    return rest;
  };
  const getUserData = async () => {
    const currentUser = JSON.parse(Cookies.get("currentUser"));
    setUserData(currentUser);
    const data = await getUserNotifications();
    const uniqueData = data?.filter((item, index, self) =>
      index === self.findIndex((t) => JSON.stringify(removeId(t)) === JSON.stringify(removeId(item)))
    );

    const todayNotifications = uniqueData?.filter(
      (noti) =>
        dayjs(noti.date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
    );

    const previousNotifications = uniqueData?.filter(
      (noti) =>
        dayjs(noti.date).format("YYYY-MM-DD") !== dayjs().format("YYYY-MM-DD")
    );
    dispatch(
      updateNotifications({
        today: todayNotifications,
        previous: previousNotifications,
      })
    );
  };
  const notifications = useSelector((state) => state.notifications);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const currentUser = Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));

  function CheckPassword(submittedPassword) {
    if (submittedPassword?.length < 8) {
      setValidationMessage("Password must be at least 8 characters long.");
      return;
    }

    if (
      !/[a-z]/.test(submittedPassword) ||
      !/[A-Z]/.test(submittedPassword) ||
      !/[0-9]/.test(submittedPassword)
    ) {
      setValidationMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    // Password is valid
    setValidationMessage("Password is valid!");
  }

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
      setUpdating(true);
      await updateUserData(userData).finally(setUpdating(false));
      setModal(false);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
    }
  };



  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

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
                  CheckPassword(e.target.value);
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
            {updating ? (
              <div className="w-100">
                <div class="smallSpinner mx-auto"></div>
              </div>
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
              <div className="w-100 d-flex align-items-center justify-content-between">
                <h4 className="heading">{""}</h4>
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
                  <div className="name_div_flex mb-1">
                    <img
                      alt=""
                      src="/images/navbar/oval.png"
                      ref={target}
                      onClick={() => setShow(!show)}
                      width={70}
                      style={{ position: "absolute", cursor: "pointer" }}
                    />
                    <div className="name_div">
                      <p style={{ marginBottom: 0 }}>{`${currentUser?.firstName.charAt(0).toUpperCase() +
                        currentUser?.firstName.slice(1).toLowerCase()
                        } ${currentUser?.lastName.charAt(0).toUpperCase() +
                        currentUser?.lastName.slice(1).toLowerCase()
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
                    path === "/MyProfile"
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
                      path === "/MyProfile" ? "active_popover" : "popover_txt"
                    }
                    onClick={() => navigate("/MyProfile")}
                  >
                    Profile
                  </p>
                </div>

                <div
                  onClick={() => navigate("/MyProfile/Attendence")}
                  className={
                    path === "/MyProfile/Attendence"
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
                      path === "/MyProfile/Attendence"
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
                    Cookies.remove("currentUser");
                    navigate("/");
                  }}
                >
                  <img alt="" src="/images/navbar/logout.png" width={15}></img>
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
              <div style={{ width: "420px" }}>
                <div className="nav_Noti_popover Text18S white">
                  <div>Notifications</div>
                </div>
                <div className="R_A_Justify tabsNotiDay">
                  <div
                    className={
                      notiTab === "1"
                        ? "Text16N1 activeNotiTab point"
                        : "Text16N1 point"
                    }
                    onClick={() => setNotiTab("1")}
                  >
                    Today
                  </div>
                  <div
                    className={
                      notiTab === "2"
                        ? "Text16N1 activeNotiTab point"
                        : "Text16N1 point"
                    }
                    onClick={() => setNotiTab("2")}
                  >
                    Previous
                  </div>
                </div>
                <div className="line" />
                {notiTab === "1" && (
                  <>
                    {notifications?.today?.map((notification, index) => (
                      <div className="notificationsBox mt12 R_A_Justify">
                        {notification.forManager
                          ? !notification.readBy.includes(currentUser._id) && (
                            <div className="Circle" />
                          )
                          : !notification.read && <div className="Circle" />}

                        <div>
                          {/* <img alt="" src={CalenderNoti} /> */}
                          <p className="text-black my-auto">
                            {dayjs(notification.date).format("DD-MMM-YYYY")}
                          </p>
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div className="Text14Semi">
                            New {notification.notificationOf}
                            <br />
                            <text className="gray">
                              {(notification.notificationOf === "client" || notification.notificationOf === 'Pre-Wed Shoot')
                                ? notification.data.brideName +
                                " Weds " +
                                notification.data.groomName
                                : ""}
                              {notification.notificationOf === "event"
                                ? notification.data.client?.brideName +
                                " Weds " +
                                notification.data.client?.groomName
                                : ""}
                            </text>
                          </div>
                        </div>
                        <div className="line" style={{ height: "40px" }} />
                        {/* <div style={{ textAlign: "left" }}>
                          {notification.notificationOf === "client" && (
                            <div className="Text14Semi">
                              Location
                              <br />
                              <text className="gray">
                                {notification.notificationOf === "client"
                                  ? notification?.data?.events[0]?.location
                                  : ""}
                              </text>
                            </div>
                          )}
                        </div> */}
                        <img
                          className=" cursor-pointer"
                          onClick={() => {
                            if (notification.forManager) {
                              if (
                                !notification.readBy.includes(currentUser._id)
                              ) {
                                dispatch({
                                  type: "SOCKET_EMIT_EVENT",
                                  payload: {
                                    event: "read-notification",
                                    data: {
                                      ...notification,
                                      readBy: [
                                        ...notification.readBy,
                                        currentUser._id,
                                      ],
                                    },
                                  },
                                });
                              }
                            } else {
                              if (!notification.read) {
                                dispatch({
                                  type: "SOCKET_EMIT_EVENT",
                                  payload: {
                                    event: "read-notification",
                                    data: {
                                      ...notification,
                                      read: true,
                                    },
                                  },
                                });
                              }
                            }

                            notification.notificationOf === 'client' ? navigate('/MyProfile/Client/ViewClient') : notification.notificationOf === 'event' ? navigate(currentUser?.rollSelect === 'Manager' ? '/MyProfile/Calender/ListView' : '/MyProfile/Deliverables/Cinematography') : notification.notificationOf === 'Pre-Wed Shoot' ? navigate(currentUser?.rollSelect === 'Manager' ? '/MyProfile/PreWedShoot/PreWedShootScreen' : '/MyProfile/Deliverables/PreWed-Deliverables') : notification.notificationOf === 'Cinema Deliverable' ? navigate('/MyProfile/Deliverables/Cinematography') : notification.notificationOf === 'Photos Deliverable' ? navigate('/MyProfile/Deliverables/Photos') : notification.notificationOf === 'Albums Deliverable' ? navigate('/MyProfile/Deliverables/Albums') : notification.notificationOf === 'Pre-Wed Deliverable' ? navigate('/MyProfile/Deliverables/PreWed-Deliverables') : navigate("/")
                            setShowNoti(false)
                          }}
                          alt=""
                          src={NotiSelect}
                        />
                      </div>
                    ))}
                  </>
                )}
                {notiTab === "2" && (
                  <>
                    {notifications?.previous?.map((notification, index) => (
                      <div className="notificationsBox mt12 R_A_Justify">
                        {notification.forManager
                          ? !notification.readBy.includes(currentUser._id) && (
                            <div className="Circle" />
                          )
                          : !notification.read && <div className="Circle" />}

                        <div>
                          {/* <img alt="" src={CalenderNoti} /> */}
                          <p className="text-black my-auto">
                            {dayjs(notification.date).format("DD-MMM-YYYY")}
                          </p>
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <div className="Text14Semi">
                            New {notification.notificationOf}
                            <br />
                            <text className="gray">
                              {(notification.notificationOf === "client" || notification.notificationOf === 'Pre-Wed Shoot')
                                ? notification.data.brideName +
                                " Weds " +
                                notification.data.groomName
                                : ""}
                              {notification.notificationOf === "event"
                                ? notification.data.client?.brideName +
                                " Weds " +
                                notification.data.client?.groomName
                                : ""}
                            </text>
                          </div>
                        </div>
                        <div className="line" style={{ height: "40px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div className="Text14Semi">
                            Location
                            <br />
                            <text className="gray">
                              {notification?.notificationOf === "client"
                                ? notification?.data?.events[0]?.location
                                : ""}{" "}
                              {notification?.notificationOf === "event"
                                ? notification?.data?.location
                                : ""}{" "}
                            </text>
                          </div>
                        </div>
                        <img className="cursor-pointer" onClick={() => {
                          if (notification.forManager) {
                            if (
                              !notification.readBy.includes(currentUser._id)
                            ) {
                              dispatch({
                                type: "SOCKET_EMIT_EVENT",
                                payload: {
                                  event: "read-notification",
                                  data: {
                                    ...notification,
                                    readBy: [
                                      ...notification.readBy,
                                      currentUser._id,
                                    ],
                                  },
                                },
                              });
                            }
                          } else {
                            if (!notification.read) {
                              dispatch({
                                type: "SOCKET_EMIT_EVENT",
                                payload: {
                                  event: "read-notification",
                                  data: {
                                    ...notification,
                                    read: true,
                                  },
                                },
                              });
                            }
                          }

                          notification.notificationOf === 'client' ? navigate('/MyProfile/Client/ViewClient') : notification.notificationOf === 'event' ? navigate('/MyProfile/Calender/ListView') : notification.notificationOf === 'Pre-Wed Shoot' ? navigate('/MyProfile/PreWedShoot/PreWedShootScreen') : notification.notificationOf === 'Cinema Deliverable' ? navigate('/MyProfile/Deliverables/Cinematography') : notification.notificationOf === 'Photos Deliverable' ? navigate('/MyProfile/Deliverables/Photos') : notification.notificationOf === 'Albums Deliverable' ? navigate('/MyProfile/Deliverables/Albums') : notification.notificationOf === 'Pre-Wed Deliverable' ? navigate('/MyProfile/Deliverables/PreWed-Deliverables') : navigate("/")
                          setShowNoti(false)
                        }} alt="" src={NotiSelect} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Tooltip>
          )}
        </Overlay>
      </div>
    </>
  );
};
export default Header;
