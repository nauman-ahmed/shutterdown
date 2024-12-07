import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SubMenu,
  SidebarContent,
  // useProSidebar,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import Logo from "./Logo";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import NotiSelect from "../assets/Profile/NotiSelect.svg";
import "../assets/css/sidebar.css";
import { Modal, Tooltip } from "reactstrap";
import Checklist from "../assets/Profile/Checklist.svg";
import ActiveTask from "../assets/Profile/ActiveTask.svg";
import ActiveReport from "../assets/Profile/ActiveReport.svg";
import UnActiveChecklist from "../assets/Profile/UnActiveChecklist.svg";
import ActiveTeam from "../assets/Profile/ActiveTeam.png";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateAllEvents } from "../redux/eventsSlice";
import { store } from "../redux/configureStore";
import { updateNotifications } from "../redux/notificationsSlice";
import { getUserNotifications } from "../API/notifictions";
import dayjs from "dayjs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuFormInput } from "react-icons/lu";
import { BsCalendar4Range } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import {
  adminMenuOptions,
  editorMenuOptions,
  managerMenuOptions,
  shooterMenuOptions,
} from "../utils/menuOptions";
import MenuOption from "./layoutComps/MenuOption";
import { useLoggedInUser } from "../config/zStore";

const SideBar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(15);
  const [currentSubMenuIndex, setCurrentSubMenuIndex] = useState(15);
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [notiTab, setNotiTab] = useState("1");
  const location = useLocation();
  const toggle = () => {
    setMobileSideBar(false);
  };
  const [currentTab, setCurrentTab] = useState(null);
  const targetNoti = useRef(null);
  const [showNoti, setShowNoti] = useState(false);
  const removeId = (obj) => {
    const { _id, ...rest } = obj;
    return rest;
  };

  useEffect(() => {
    try {
      getUserData();
      // getStoredEvents();
      store.dispatch({ type: "SOCKET_CONNECT" });

      return () => {
        store.dispatch({ type: "SOCKET_DISCONNECT" });
      };
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { userData: currentUser, updateUserData } = useLoggedInUser();
  const getUserData = async () => {
    const data = await getUserNotifications();
    const uniqueData = data?.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => JSON.stringify(removeId(t)) === JSON.stringify(removeId(item))
        )
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
  const dispatch = useDispatch();

  return (
    <>
      <div
        className="mobile_hide"
        style={{ display: "flex", height: "100%", position: "absolute" }}
      >
        <ProSidebar style={{ marginRight: "-20px" }}>
          <SidebarHeader>
            <div
              className="logotext drawerLogo"
              onClick={() => navigate("/MyProfile")}
            >
              <span className="">
                <Logo />
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <>
              <Menu>
                {currentUser?.rollSelect === "Admin" && (
                  <>
                    {adminMenuOptions.map((option) => (
                      <MenuOption option={option} />
                    ))}
                  </>
                )}
                {currentUser?.rollSelect === "Manager" && (
                  <>
                    {managerMenuOptions.map((option) => (
                      <MenuOption option={option} />
                    ))}
                  </>
                )}
                {currentUser?.rollSelect === "Shooter" && (
                  <>
                    {shooterMenuOptions.map((option) => (
                      <MenuOption option={option} />
                    ))}
                  </>
                )}

                {currentUser?.rollSelect === "Editor" && (
                  <>
                    {editorMenuOptions.map((option) => (
                      <MenuOption option={option} />
                    ))}
                  </>
                )}

                <MenuItem
                  icon={
                    <img alt="" src="/images/sidebar/logout.png" width={20} />
                  }
                  onClick={() => {
                    dispatch(updateAllEvents([]));
                    Cookies.remove("userKeys");
                    window.location.reload();
                    // navigate("/");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          </SidebarContent>
        </ProSidebar>
      </div>

      <div className="mobile_header">
        <div
          className="d-flex justify-content-center align-items-center ps-3"
          onClick={() => setMobileSideBar(true)}
        >
          <img
            alt=""
            src="/images/navbar/oval.png"
            width={70}
            style={{
              position: "absolute",
              cursor: "pointer",
              top: "-3px",
              left: "10px",
            }}
          />
          <img
            alt=""
            src="/images/navbar/verticle_lines.png"
            className="mt-2"
            style={{ cursor: "pointer", width: "20px", zIndex: "10" }}
          />
        </div>
        <div className=" d-flex justify-content-end align-items-center gap-3 position-relative">
          <img
            ref={targetNoti}
            alt="notification"
            onClick={() => setShowNoti(!showNoti)}
            src="/images/navbar/noti.png"
            style={{
              cursor: "pointer",
            }}
            width={25}
            height={25}
          />
          <img
            alt=""
            src="/images/Logo.png"
            width={45}
            height={35}
            style={{ background: "red" }}
          />

          {showNoti && (
            <div
              style={{
                top: "40px",
                backgroundColor: "#edeef7",
                boxShadow: "0px 2px 4px  #d5d5d5",
                borderRadius: "10px",
                zIndex: 200,
              }}
              className="position-absolute p-2 "
            >
              <div style={{ width: "320px" }}>
                <div className="nav_Noti_popover Text18S white">
                  <div>Notifications</div>
                </div>
                <div className="R_A_Justify tabsNotiDay gap-4">
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
                    <div
                      style={{
                        minWidth: "310px",
                        overflowX: "scroll",
                      }}
                    >
                      {notifications?.today?.map((notification, index) => (
                        <div className="notificationsBox mt12 R_A_Justify">
                          {notification.forManager
                            ? !notification.readBy.includes(
                                currentUser?._id
                              ) && <div className="Circle" />
                            : !notification.read && <div className="Circle" />}

                          <div>
                            <p className="text-black my-auto ">
                              {dayjs(notification.date).format("DD-MMM-YYYY")}
                            </p>
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <div className="Text14Semi">
                              New {notification.notificationOf}
                              <br />
                              <text className="gray">
                                {notification.notificationOf === "client" ||
                                notification.notificationOf === "Pre-Wed Shoot"
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

                          <img
                            className=" cursor-pointer"
                            onClick={() => {
                              if (notification.forManager) {
                                if (
                                  !notification.readBy.includes(
                                    currentUser?._id
                                  )
                                ) {
                                  dispatch({
                                    type: "SOCKET_EMIT_EVENT",
                                    payload: {
                                      event: "read-notification",
                                      data: {
                                        ...notification,
                                        readBy: [
                                          ...notification.readBy,
                                          currentUser?._id,
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

                              notification.notificationOf === "client"
                                ? navigate("/MyProfile/Client/ViewClient")
                                : notification.notificationOf === "event"
                                ? navigate(
                                    currentUser?.rollSelect === "Manager"
                                      ? "/MyProfile/Calender/ListView"
                                      : "/MyProfile/Deliverables/Cinematography"
                                  )
                                : notification.notificationOf ===
                                  "Pre-Wed Shoot"
                                ? navigate(
                                    currentUser?.rollSelect === "Manager"
                                      ? "/MyProfile/PreWedShoot/PreWedShootScreen"
                                      : "/MyProfile/Deliverables/PreWed-Deliverables"
                                  )
                                : notification.notificationOf ===
                                  "Cinema Deliverable"
                                ? navigate(
                                    "/MyProfile/Deliverables/Cinematography"
                                  )
                                : notification.notificationOf ===
                                  "Photos Deliverable"
                                ? navigate("/MyProfile/Deliverables/Photos")
                                : notification.notificationOf ===
                                  "Albums Deliverable"
                                ? navigate("/MyProfile/Deliverables/Albums")
                                : notification.notificationOf ===
                                  "Pre-Wed Deliverable"
                                ? navigate(
                                    "/MyProfile/Deliverables/PreWed-Deliverables"
                                  )
                                : navigate("/");
                              setShowNoti(false);
                            }}
                            alt=""
                            src={NotiSelect}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {notiTab === "2" && (
                  <>
                    <div
                      style={{
                        minWidth: "310px",
                        overflowX: "scroll",
                      }}
                    >
                      {notifications?.previous?.map((notification, index) => (
                        <div className="notificationsBox mt12 R_A_Justify">
                          {notification.forManager
                            ? !notification.readBy.includes(
                                currentUser?._id
                              ) && <div className="Circle" />
                            : !notification.read && <div className="Circle" />}

                          <div>
                            <p className="text-black my-auto">
                              {dayjs(notification.date).format("DD-MMM-YYYY")}
                            </p>
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <div className="Text14Semi">
                              New {notification.notificationOf}
                              <br />
                              <text className="gray">
                                {notification.notificationOf === "client" ||
                                notification.notificationOf === "Pre-Wed Shoot"
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
                          <img
                            className="cursor-pointer"
                            onClick={() => {
                              if (notification.forManager) {
                                if (
                                  !notification.readBy.includes(
                                    currentUser?._id
                                  )
                                ) {
                                  dispatch({
                                    type: "SOCKET_EMIT_EVENT",
                                    payload: {
                                      event: "read-notification",
                                      data: {
                                        ...notification,
                                        readBy: [
                                          ...notification.readBy,
                                          currentUser?._id,
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

                              notification.notificationOf === "client"
                                ? navigate("/MyProfile/Client/ViewClient")
                                : notification.notificationOf === "event"
                                ? navigate("/MyProfile/Calender/ListView")
                                : notification.notificationOf ===
                                  "Pre-Wed Shoot"
                                ? navigate(
                                    "/MyProfile/PreWedShoot/PreWedShootScreen"
                                  )
                                : notification.notificationOf ===
                                  "Cinema Deliverable"
                                ? navigate(
                                    "/MyProfile/Deliverables/Cinematography"
                                  )
                                : notification.notificationOf ===
                                  "Photos Deliverable"
                                ? navigate("/MyProfile/Deliverables/Photos")
                                : notification.notificationOf ===
                                  "Albums Deliverable"
                                ? navigate("/MyProfile/Deliverables/Albums")
                                : notification.notificationOf ===
                                  "Pre-Wed Deliverable"
                                ? navigate(
                                    "/MyProfile/Deliverables/PreWed-Deliverables"
                                  )
                                : navigate("/");
                              setShowNoti(false);
                            }}
                            alt=""
                            src={NotiSelect}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={mobileSideBar}
        toggle={toggle}
        backdrop={true}
        className="ModalBox"
        contentClassName="modalContent"
      >
        <ProSidebar className="SideBarMobile">
          <SidebarHeader>
            <div
              className="logotext sideBarHeader"
              onClick={() => {
                toggle();
                navigate("/profile");
              }}
            >
              <div className="d-flex align-items-center">
                <div className="name_div_side">
                  <img
                    alt=""
                    src="/images/navbar/oval.png"
                    width={90}
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      marginTop: "-30px",
                    }}
                  />
                  <div className="name_div_Text">
                    <p style={{ marginBottom: 0, paddingLeft: 20 }}>
                      {currentUser?.firstName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="h-100">
            <Menu>
              {currentUser?.rollSelect === "Admin" && (
                <>
                  {adminMenuOptions.map((option) => (
                    <MenuOption option={option} />
                  ))}
                </>
              )}
              {currentUser?.rollSelect === "Manager" && (
                <>
                  {managerMenuOptions.map((option) => (
                    <MenuOption option={option} />
                  ))}
                </>
              )}
              {currentUser?.rollSelect === "Shooter" && (
                <>
                  {shooterMenuOptions.map((option) => (
                    <MenuOption option={option} />
                  ))}
                </>
              )}

              {currentUser?.rollSelect === "Editor" && (
                <>
                  {editorMenuOptions.map((option) => (
                    <MenuOption option={option} />
                  ))}
                </>
              )}

              <MenuItem
                icon={
                  <img alt="" src="/images/sidebar/logout.png" width={20} />
                }
                onClick={() => {
                  dispatch(updateAllEvents([]));
                  Cookies.remove("userKeys");
                  window.location.reload();
                  // navigate("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </SidebarContent>
        </ProSidebar>
      </Modal>
    </>
  );
};
export default SideBar;
