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
import { Overlay } from "react-bootstrap";
import { getEvents } from "../API/Event";

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
  const [userData, setUserData] = useState(null);
  const targetNoti = useRef(null);
  const [showNoti, setShowNoti] = useState(false);
  const removeId = (obj) => {
    const { _id, ...rest } = obj;
    return rest;
  };
  // const getStoredEvents = async () => {
  //   const res = await getEvents();
  //   if (currentUser.rollSelect === 'Manager') {
  //     dispatch(updateAllEvents(res?.data));
  //   } else if (currentUser.rollSelect === 'Shooter' || currentUser.rollSelect === 'Editor') {
  //     const eventsToShow = res.data?.map(event => {
  
  //       if (event?.shootDirectors?.some(director => director._id === currentUser._id)) {
  //         return { ...event, userRole: 'Shoot Director' };
  //       } else if (event?.choosenPhotographers.some(photographer => photographer._id === currentUser._id)) {
  //         return { ...event, userRole: 'Photographer' };
  //       } else if (event?.choosenCinematographers.some(cinematographer => cinematographer._id === currentUser._id)) {
  //         return { ...event, userRole: 'Cinematographer' };
  //       } else if (event?.droneFlyers.some(flyer => flyer._id === currentUser._id)) {
  //         return { ...event, userRole: 'Drone Flyer' };
  //       } else if (event?.manager.some(manager => manager._id === currentUser._id)) {
  //         return { ...event, userRole: 'Manager' };
  //       } else if (event?.sameDayPhotoMakers.some(photoMaker => photoMaker._id === currentUser._id)) {
  //         return { ...event, userRole: 'Same Day Photos Maker' };
  //       } else if (event?.sameDayVideoMakers.some(videoMaker => videoMaker._id === currentUser._id)) {
  //         return { ...event, userRole: 'Same Day Video Maker' };
  //       } else if (event?.assistants.some(assistant => assistant._id === currentUser._id)) {
  //         return { ...event, userRole: 'Assistant' };
  //       } else {
  //         return null;
  //       }
  //     });
  //     dispatch(updateAllEvents(eventsToShow));
  //   }
  // };
  useEffect(() => {
    try {
      getUserData();
      // getStoredEvents();
      store.dispatch({ type: "SOCKET_CONNECT" });

      return (() => {
        store.dispatch({ type: "SOCKET_DISCONNECT" });
      })

    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getUserData = async () => {
    const currentUser = Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));
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
  // useEffect(() => {
  //   if (location.pathname.startsWith('/MyProfile/AddClient')) {
  //     setCurrentTab('Add Client');
  //     setActiveMenu(1)
  //     setCurrentSubMenuIndex(0)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Client')) {
  //     setCurrentTab('View Clients');
  //     setActiveMenu(1)
  //     setCurrentSubMenuIndex(1)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Calender')) {
  //     setCurrentTab('Calender View');
  //     setActiveMenu(2)
  //     setCurrentSubMenuIndex(0)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/PreWedShoot')) {
  //     setCurrentTab('Pre-wed Shoot');
  //     setActiveMenu(2)
  //     setCurrentSubMenuIndex(1)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Deliverables/Cinematography')) {
  //     setCurrentTab('Cinematography');
  //     setActiveMenu(3)
  //     setCurrentSubMenuIndex(0)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Deliverables/Photos')) {
  //     setCurrentTab('Photos');
  //     setActiveMenu(3)
  //     setCurrentSubMenuIndex(1)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Deliverables/Albums')) {
  //     setCurrentTab('Albums');
  //     setActiveMenu(3)
  //     setCurrentSubMenuIndex(2)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/CheckLists')) {
  //     setCurrentTab('Checklists');
  //     setActiveMenu(4)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Attendence')) {
  //     setCurrentTab('Attendence');
  //     setActiveMenu(5)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Tasks/DailyTasks')) {
  //     setCurrentTab('Tasks');
  //     setActiveMenu(6)
  //     setCurrentSubMenuIndex(0)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Tasks/Reports')) {
  //     setCurrentTab('Tasks Reports');
  //     setActiveMenu(6)
  //     setCurrentSubMenuIndex(1)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Reports')) {
  //     setCurrentTab('Reports');
  //     setActiveMenu(7)
  //   }
  //   if (location.pathname.startsWith('/MyProfile/Team')) {
  //     setCurrentTab('Teams');
  //     setActiveMenu(8)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  const currentUser = Cookies.get('currentUser') && JSON.parse(Cookies.get('currentUser'));
  const dispatch = useDispatch()
  useEffect(() => {
    if (location.pathname.startsWith('/MyProfile/AddClient')) {
      if (currentUser?.rollSelect !== 'Manager') {
        navigate('/')
      }
      setCurrentTab('Add Client');
      setActiveMenu(1)
      setCurrentSubMenuIndex(0)
    }
    if (location.pathname.startsWith('/MyProfile/Client')) {
      if (currentUser?.rollSelect !== 'Manager') {
        navigate('/')
      }
      setCurrentTab('View Clients');
      setActiveMenu(1)
      setCurrentSubMenuIndex(1)
    }
    if (location.pathname.startsWith('/MyProfile/Calender')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Shooter') {
        navigate('/')
      }
      setCurrentTab('Calender View');
      setActiveMenu(2)
      setCurrentSubMenuIndex(0)
    }
    if (location.pathname.startsWith('/MyProfile/PreWedShoot')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Shooter') {
        navigate('/')
      }
      setCurrentTab('Pre-wed Shoot');
      setActiveMenu(2)
      setCurrentSubMenuIndex(1)
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Cinematography')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor') {
        navigate('/')
      }
      setCurrentTab('Cinematography');
      setActiveMenu(3)
      setCurrentSubMenuIndex(0)
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Photos')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor') {
        navigate('/')
      }
      setCurrentTab('Photos');
      setActiveMenu(3)
      setCurrentSubMenuIndex(1)
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Albums')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor') {
        navigate('/')
      }
      setCurrentTab('Albums');
      setActiveMenu(3)
      setCurrentSubMenuIndex(2)
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/PreWed-Deliverables')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor') {
        navigate('/')
      }

      setCurrentTab('PreWed-Deliverables');
      setActiveMenu(3)
      setCurrentSubMenuIndex(3)
    }
    if (location.pathname.startsWith('/MyProfile/CheckLists')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor' && currentUser?.rollSelect !== 'Shooter') {
        navigate('/')
      }
      setCurrentTab('Checklists');
      setActiveMenu(4)
    }
    if (location.pathname.startsWith('/MyProfile/Attendence')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor' && currentUser?.rollSelect !== 'Shooter') {
        navigate('/')
      }
      setCurrentTab('Attendence');
      setActiveMenu(5)
    }
    if (location.pathname.startsWith('/MyProfile/Tasks/DailyTasks')) {
      if (currentUser?.rollSelect !== 'Manager' && currentUser?.rollSelect !== 'Editor') {
        navigate('/')
      }
      setCurrentTab('Tasks');
      setActiveMenu(6)
      setCurrentSubMenuIndex(0)
    }
    if (location.pathname.startsWith('/MyProfile/Tasks/Reports')) {
      if (currentUser?.rollSelect !== 'Manager') {
        navigate('/')
      }
      setCurrentTab('Tasks Reports');
      setActiveMenu(6)
      setCurrentSubMenuIndex(1)
    }
    if (location.pathname.startsWith('/MyProfile/Reports')) {
      if (currentUser?.rollSelect !== 'Manager') {
        navigate('/')
      }
      setCurrentTab('Reports');
      setActiveMenu(7)
    }
    if (location.pathname.startsWith('/MyProfile/Team')) {
      if (currentUser?.rollSelect !== 'Manager') {
        navigate('/')
      }
      setCurrentTab('Teams');
      setActiveMenu(8)
    }
    if (location.pathname.startsWith('/MyProfile/FormOptions')) {
      if (currentUser?.rollSelect !== 'Admin') {
        navigate('/')
      }
      setCurrentTab('FormOptions');
    }
  }, [location])


  return (
    <>

      <div
        className="mobile_hide"
        style={{ display: 'flex', height: '100%', position: 'absolute' }}
      >
        <ProSidebar style={{ marginRight: '-20px' }}>
          <SidebarHeader>
            <div
              className="logotext drawerLogo"
              onClick={() => navigate('/MyProfile')}
            >
              <span className="">
                <Logo />
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <>
              <Menu>
                {currentUser.rollSelect === 'Admin' && (
                  <>
                    < MenuItem
                      icon={
                        <img alt=""
                          src={
                            "/images/sidebar/clients.png"
                          }
                          width={20}
                        />
                      }
                      onClick={() => {
                        setActiveMenu(101);
                        navigate('/MyProfile/Accounts/Count');
                        setCurrentTab(null);
                      }}
                      className={
                        activeMenu === 101 || currentTab === 'Accounts'
                          ? 'active active_color'
                          : ''
                      }
                    >
                      Accounts
                    </MenuItem>
                    <MenuItem
                      icon={
                        <img alt=""
                          src={
                            "/images/sidebar/clients.png"
                          }
                          width={20}
                        />
                      }
                      onClick={() => {
                        setActiveMenu(100);
                        navigate('/MyProfile/FormOptions');
                        setCurrentTab(null);
                      }}
                      className={
                        activeMenu === 100 || currentTab === 'FormOptions'
                          ? 'active active_color'
                          : ''
                      }
                    >
                      Form Options
                    </MenuItem>
                    <MenuItem
                      icon={
                        <img alt=""
                          src={
                            "/images/sidebar/clients.png"
                          }
                          width={20}
                        />
                      }
                      onClick={() => {
                        setActiveMenu(103);
                        navigate('/MyProfile/Deadlines');
                        setCurrentTab(null);
                      }}
                      className={
                        activeMenu === 103 || currentTab === 'DeliverablesDeadline'
                          ? 'active active_color'
                          : ''
                      }
                    >
                      Deliverables Deadlines
                    </MenuItem>
                    <MenuItem
                      icon={
                        <img alt=""
                          src={
                            "/images/sidebar/clients.png"
                          }
                          width={20}
                        />
                      }
                      onClick={() => {
                        setActiveMenu(102);
                        navigate('/MyProfile/Whatsapp');
                        setCurrentTab(null);
                      }}
                      className={
                        activeMenu === 102 || currentTab === 'Whatsapp'
                          ? 'active active_color'
                          : ''
                      }
                    >
                      Whatsapp
                    </MenuItem>
                  </>
                )}
                {currentUser.rollSelect === 'Manager' && (
                  <>
                    <SubMenu className={activeMenu === 1 || currentTab === 'Add Client' || currentTab === 'View Clients' ? 'active' : ''}
                      icon={activeMenu === 1 || currentTab === 'Add Client' || currentTab === 'View Clients' ? (
                        <img alt=""
                          src="/images/sidebar/clients_active.png"
                          width={30}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/clients.png"
                          width={30}
                        />
                      )
                      }
                      title="Clients"
                      open={activeMenu === 1 || currentTab === 'Add Client' || currentTab === 'View Clients' ? true : false}
                      onOpenChange={() => {
                        setActiveMenu(1);

                      }}
                    >
                      <MenuItem
                        icon={
                          (currentSubMenuIndex === 0 && activeMenu === 1) || currentTab === 'Add Client' ? (
                            <img alt=""
                              src="/images/sidebar/oval_active.png"
                              width={10}
                            />
                          ) : (
                            <img alt=""
                              src="/images/sidebar/oval.png"
                              width={10}
                            />
                          )
                        }
                        onClick={() => {
                          setCurrentSubMenuIndex(0);
                          navigate('/MyProfile/AddClient/Form-I');

                        }}
                        className={
                          (currentSubMenuIndex === 0 && activeMenu === 1) || currentTab === 'Add Client'
                            ? 'active_submenu'
                            : ''
                        }
                      >
                        Add Client
                      </MenuItem>
                      <MenuItem
                        icon={
                          (currentSubMenuIndex === 1 && activeMenu === 1) || currentTab === 'View Clients' ? (
                            <img alt=""
                              src="/images/sidebar/oval_active.png"
                              width={10}
                            />
                          ) : (
                            <img alt=""
                              src="/images/sidebar/oval.png"
                              width={10}
                            />
                          )
                        }
                        onClick={() => {
                          setCurrentSubMenuIndex(1);
                          navigate('/MyProfile/Client/ViewClient');

                        }}
                        className={
                          (currentSubMenuIndex === 1 && activeMenu === 1) || currentTab === 'View Clients'
                            ? 'active_submenu'
                            : ''
                        }
                      >
                        View Clients
                      </MenuItem>
                    </SubMenu>
                  </>
                )}
                {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Shooter') && (
                  <SubMenu
                    className={activeMenu === 2 || currentTab === 'Calender View' || currentTab === 'Pre-wed Shoot' ? 'active' : ''}
                    icon={
                      activeMenu === 2 || currentTab === 'Calender View' || currentTab === 'Pre-wed Shoot' ? (
                        <img alt=""
                          src="/images/sidebar/CalenderActive.png"
                          width={30}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/calendar.png"
                          width={30}
                        />
                      )
                    }
                    title="Calendar"
                    open={activeMenu === 2 || currentTab === 'Calender View' || currentTab === 'Pre-wed Shoot' ? true : false}
                    onOpenChange={() => {
                      setCurrentTab(null)
                      setActiveMenu(2);
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 0 && activeMenu === 2) || currentTab === 'Calender View' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(0);
                        navigate('/MyProfile/Calender/View');

                      }}
                      className={
                        (currentSubMenuIndex === 0 && activeMenu === 2) || currentTab === 'Calender View'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Calendar View
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 1 && activeMenu === 2) || currentTab === 'Pre-wed Shoot' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(1);
                        navigate('/MyProfile/PreWedShoot/PreWedShootScreen');

                      }}
                      className={
                        (currentSubMenuIndex === 1 && activeMenu === 2) || currentTab === 'Pre-wed Shoot'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Pre-wed Shoot
                    </MenuItem>
                  </SubMenu>
                )}

                {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Editor') && (
                  <SubMenu
                    className={activeMenu === 3 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'PreWed-Deliverables' || currentTab === 'Albums' ? 'active' : ''}
                    icon={
                      activeMenu === 3 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? (
                        <img alt=""
                          src="/images/sidebar/deliverables.png"
                          width={20}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/deliverables.png"
                          width={20}
                        />
                      )
                    }
                    open={activeMenu === 3 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? true : false}
                    title="Deliverables"
                    onClick={() => {
                      setActiveMenu(3);
                      setCurrentTab(null)
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 0 && activeMenu === 3) || currentTab === 'Cinematography' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {

                        navigate('/MyProfile/Deliverables/Cinematography');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 0 && activeMenu === 3) || currentTab === 'Cinematography'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Cinema
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 1 && activeMenu === 3) || currentTab === 'Photos' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {

                        navigate('/MyProfile/Deliverables/Photos');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 1 && activeMenu === 3) || currentTab === 'Photos'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Photos
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 2 && activeMenu === 3) || currentTab === 'Albums' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        navigate('/MyProfile/Deliverables/Albums');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 2 && activeMenu === 3) || currentTab === 'Albums'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Albums
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 3 && activeMenu === 3) || currentTab === 'PreWed-Deliverables' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(3);
                        navigate('/MyProfile/Deliverables/PreWed-Deliverables');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 3 && activeMenu === 3) || currentTab === 'PreWed-Deliverables'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Pre-Wedding
                    </MenuItem>
                  </SubMenu>
                )}
                {currentUser.rollSelect === 'Manager' && (
                  <MenuItem
                    icon={
                      activeMenu === 4 || currentTab === 'Checklists' ? (
                        <img alt="" src={Checklist} width={20} />
                      ) : (
                        <img alt="" src={UnActiveChecklist} width={20} />
                      )
                    }
                    className={
                      activeMenu === 4 || currentTab === 'Checklists' ? 'active active_color' : ''
                    }
                    onClick={() => {
                      navigate('/MyProfile/CheckLists');
                      setCurrentTab(null)
                    }}
                  >
                    Checklists
                  </MenuItem>
                )}
                {currentUser.rollSelect !== 'Admin' && (
                  <MenuItem
                    icon={
                      <img alt=""
                        src={
                          activeMenu === 5 || currentTab === 'Attendence'
                            ? '/images/sidebar/attendanceActive.png'
                            : '/images/sidebar/attendance.png'
                        }
                        width={20}
                      />
                    }
                    className={activeMenu === 5 || currentTab === 'Attendence' ? 'active active_color' : ''}
                    onClick={() => {
                      navigate('/MyProfile/Attendence');
                      setCurrentTab('Attendance')
                    }}
                  >
                    Attendence
                  </MenuItem>
                )}
                {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Editor') && (
                  <>
                    <SubMenu
                      className={activeMenu === 6 || currentTab === 'Tasks' ? 'active' : ''}
                      icon={
                        activeMenu === 6 || currentTab === 'Tasks' ? (
                          <img alt="" src={ActiveTask} width={20} />
                        ) : (
                          <img alt="" src="/images/sidebar/tasks.png"
                            width={20} />
                        )
                      }
                      title="Tasks"
                      open={activeMenu === 6 || currentTab === 'Tasks' ? true : false}
                      onClick={() => {
                        setCurrentTab(null)
                        setActiveMenu(6);
                      }}
                    >
                      <MenuItem
                        icon={
                          (currentSubMenuIndex === 0 && activeMenu === 6) || currentTab === 'Tasks' ? (
                            <img alt=""
                              src="/images/sidebar/oval_active.png"
                              width={10}
                            />
                          ) : (
                            <img alt=""
                              src="/images/sidebar/oval.png"
                              width={10}
                            />
                          )
                        }
                        onClick={() => {
                          setCurrentSubMenuIndex(0);
                          navigate('/MyProfile/Tasks/DailyTasks');
                          setCurrentTab(null)
                        }}
                        className={
                          (currentSubMenuIndex === 0 && activeMenu === 6) || currentTab === 'Tasks'
                            ? 'active_submenu'
                            : ''
                        }
                      >Daily Tasks
                      </MenuItem>
                      {currentUser.rollSelect === 'Manager' ?
                        <MenuItem
                          icon={
                            (currentSubMenuIndex === 1 && activeMenu === 6) || currentTab === 'Tasks Reports' ? (
                              <img alt=""
                                src="/images/sidebar/oval_active.png"
                                width={10}
                              />
                            ) : (
                              <img alt=""
                                src="/images/sidebar/oval.png"
                                width={10}
                              />
                            )
                          }
                          onClick={() => {
                            setCurrentSubMenuIndex(1);
                            navigate('/MyProfile/Tasks/Reports');
                            setCurrentTab(null)
                          }}
                          className={
                            (currentSubMenuIndex === 1 && activeMenu === 6) || currentTab === 'Tasks Reports'
                              ? 'active_submenu'
                              : ''
                          }
                        >
                          Reports
                        </MenuItem>
                        :
                        null
                      }
                    </SubMenu>
                  </>
                )}

                {currentUser.rollSelect === 'Manager' && (
                  <>
                    <MenuItem
                      icon={
                        activeMenu === 7 || currentTab === 'Reports' ? (
                          <img alt="" src={ActiveReport} width={20} />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/reports.png"
                            width={20}
                          />
                        )
                      }
                      className={activeMenu === 7 || currentTab === 'Reports' ? 'active active_color' : ''}
                      onClick={() => {

                        navigate('/MyProfile/Reports');
                        setCurrentTab(null);
                      }}
                    >
                      Reports
                    </MenuItem>
                    <MenuItem
                      icon={
                        activeMenu === 8 || currentTab === 'Teams' ? (
                          <img alt="" src={ActiveTeam} width={30} />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/teams.png"
                            width={20}
                          />
                        )
                      }
                      className={activeMenu === 8 || currentTab === 'Teams' ? 'active active_color' : ''}
                      onClick={() => {
                        setActiveMenu(7);
                        navigate('/MyProfile/Team');
                        setCurrentTab(null)
                      }}
                    >
                      Team
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  icon={
                    <img alt="" src="/images/sidebar/logout.png" width={20} />
                  }
                  onClick={() => {
                    dispatch(updateAllEvents([]))
                    Cookies.remove('currentUser');
                    navigate('/')
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
        <div className="d-flex justify-content-center align-items-center ps-3" onClick={() => setMobileSideBar(true)}>
          <img alt=""
            src="/images/navbar/oval.png"
            width={70}
            style={{ position: 'absolute', cursor: 'pointer', top: '-3px', left: '10px' }}
          />
          <img alt=""
            src="/images/navbar/verticle_lines.png"
            className="mt-2"
            style={{ cursor: 'pointer', width: '20px', zIndex: '10' }}
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
          <img alt=""
            src="/images/Logo.png"
            width={45}
            height={35}
            style={{ background: 'red' }}
          />

          {showNoti && <div
            style={{ top: '40px', backgroundColor: '#edeef7', boxShadow: '0px 2px 4px  #d5d5d5', borderRadius: '10px', zIndex: 200 }}
            className="position-absolute p-2 "

          >

            {/* {(props) => (
            <Tooltip id="overlay-example" {...props}> */}
            <div style={{ width: "320px", }}>
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
                  <div style={{
                    minWidth: '310px',
                    overflowX: "scroll"
                  }}>


                    {notifications?.today?.map((notification, index) => (
                      <div className="notificationsBox mt12 R_A_Justify">
                        {notification.forManager
                          ? !notification.readBy.includes(currentUser._id) && (
                            <div className="Circle" />
                          )
                          : !notification.read && <div className="Circle" />}

                        <div >

                          <p className="text-black my-auto ">
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
                  </div>
                </>
              )}
              {notiTab === "2" && (
                <>
                  <div style={{
                    minWidth: '310px',
                    overflowX: "scroll"
                  }}>
                    {notifications?.previous?.map((notification, index) => (
                      <div className="notificationsBox mt12 R_A_Justify">
                        {notification.forManager
                          ? !notification.readBy.includes(currentUser._id) && (
                            <div className="Circle" />
                          )
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

                  </div>

                </>
              )}
            </div>
            {/* </Tooltip>
          )}   */}
          </div>}


        </div>


        {/* <div className="search_div d-flex align-items-center justify-content-between">
          <input
            className="input_search"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
          <img src="/images/navbar/search.png" width={25}></img>
        </div> */}
        {/* <div className="d-flex align-items-center">
          <img
            src="/images/navbar/noti.png"
            style={{ marginTop: -10 }}
            width={25}
            height={25}
          />
        </div> */}
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
                setActiveMenu(0)
                setCurrentTab(null)
                toggle()
                navigate('/MyProfile/About')}
              } 
            >
              <div className="d-flex align-items-center">
                <div className="name_div_side">
                  <img alt=""
                    src="/images/navbar/oval.png"
                    width={90}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      marginTop: '-30px',
                    }}
                  />
                  <div className="name_div_Text">
                    <p style={{ marginBottom: 0, paddingLeft: 20 }}>{currentUser?.firstName}</p>
                  </div>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="h-100">
            <Menu className="mibile-side-back">
              {currentUser.rollSelect === 'Manager' && (
                <>
                  <SubMenu className={activeMenu === 1 || currentTab === 'Add Client' || currentTab === 'View Clients' ? 'active' : ''}
                    icon={activeMenu === 1 || currentTab === 'Add Client' || currentTab === 'View Clients' ? (
                      <img alt=""
                        src="/images/sidebar/clients_active.png"
                        width={30}
                      />
                    ) : (
                      <img alt=""
                        src="/images/sidebar/clients.png"
                        width={30}
                      />
                    )
                    }
                    title="Clients"
                    open={activeMenu === 1 || currentTab === 'Add Client' || currentTab === 'View Clients' ? true : false}
                    onOpenChange={() => {
                      setActiveMenu(1);
                      setCurrentTab(null)
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 0 && activeMenu === 1) || currentTab === 'Add Client' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(0);
                        navigate('/MyProfile/AddClient/Form-I');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 0 && activeMenu === 1) || currentTab === 'Add Client'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Add Client
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 1 && activeMenu === 1) || currentTab === 'View Client' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(1);
                        navigate('/MyProfile/Client/ViewClient');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 1 && activeMenu === 1) || currentTab === 'View Clients'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      View Clients
                    </MenuItem>
                  </SubMenu>
                </>
              )}
              {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Shooter') && (
                <SubMenu
                  className={activeMenu === 2 || currentTab === 'Calender View' || currentTab === 'Pre-wed Shoot' ? 'active' : ''}
                  icon={
                    activeMenu === 2 || currentTab === 'Calender View' || currentTab === 'Pre-wed Shoot' ? (
                      <img alt=""
                        src="/images/sidebar/CalenderActive.png"
                        width={30}
                      />
                    ) : (
                      <img alt=""
                        src="/images/sidebar/calendar.png"
                        width={30}
                      />
                    )
                  }
                  title="Calendar"
                  open={activeMenu === 2 || currentTab === 'Calender View' || currentTab === 'Pre-wed Shoot' ? true : false}
                  onOpenChange={() => {
                    setCurrentTab(null)
                    setActiveMenu(2);
                  }}
                >
                  <MenuItem
                    icon={
                      (currentSubMenuIndex === 0 && activeMenu === 2) || currentTab === 'Calender View' ? (
                        <img alt=""
                          src="/images/sidebar/oval_active.png"
                          width={10}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/oval.png"
                          width={10}
                        />
                      )
                    }
                    onClick={() => {
                      setCurrentSubMenuIndex(0);
                      navigate('/MyProfile/Calender/View');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                    className={
                      (currentSubMenuIndex === 0 && activeMenu === 2) || currentTab === 'Calender View'
                        ? 'active_submenu'
                        : ''
                    }
                  >
                    Calendar View
                  </MenuItem>
                  <MenuItem
                    icon={
                      (currentSubMenuIndex === 1 && activeMenu === 2) || currentTab === 'Pre-wed Shoot' ? (
                        <img alt=""
                          src="/images/sidebar/oval_active.png"
                          width={10}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/oval.png"
                          width={10}
                        />
                      )
                    }
                    onClick={() => {
                      setCurrentSubMenuIndex(1);
                      navigate('/MyProfile/PreWedShoot/PreWedShootScreen');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                    className={
                      (currentSubMenuIndex === 1 && activeMenu === 2) || currentTab === 'Pre-wed Shoot'
                        ? 'active_submenu'
                        : ''
                    }
                  >
                    Pre-wed Shoot
                  </MenuItem>
                </SubMenu>
              )}

              {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Editor') && (
                <SubMenu
                  className={activeMenu === 3 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'PreWed-Deliverables' || currentTab === 'Albums' ? 'active' : ''}
                  icon={
                    activeMenu === 3 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? (
                      <img alt=""
                        src="/images/sidebar/deliverables.png"
                        width={20}
                      />
                    ) : (
                      <img alt=""
                        src="/images/sidebar/deliverables.png"
                        width={20}
                      />
                    )
                  }
                  open={activeMenu === 3 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? true : false}
                  title="Deliverables"
                  onOpenChange={() => {
                    setActiveMenu(3);
                    setCurrentTab(null)
                  }}
                >
                  <MenuItem
                    icon={
                      (currentSubMenuIndex === 0 && activeMenu === 3) || currentTab === 'Cinematography' ? (
                        <img alt=""
                          src="/images/sidebar/oval_active.png"
                          width={10}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/oval.png"
                          width={10}
                        />
                      )
                    }
                    onClick={() => {
                      setCurrentSubMenuIndex(0);
                      navigate('/MyProfile/Deliverables/Cinematography');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                    className={
                      (currentSubMenuIndex === 0 && activeMenu === 3) || currentTab === 'Cinematography'
                        ? 'active_submenu'
                        : ''
                    }
                  >
                    Cinema
                  </MenuItem>
                  <MenuItem
                    icon={
                      (currentSubMenuIndex === 1 && activeMenu === 3) || currentTab === 'Photos' ? (
                        <img alt=""
                          src="/images/sidebar/oval_active.png"
                          width={10}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/oval.png"
                          width={10}
                        />
                      )
                    }
                    onClick={() => {
                      setCurrentSubMenuIndex(1);
                      navigate('/MyProfile/Deliverables/Photos');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                    className={
                      (currentSubMenuIndex === 1 && activeMenu === 3) || currentTab === 'Photos'
                        ? 'active_submenu'
                        : ''
                    }
                  >
                    Photos
                  </MenuItem>
                  <MenuItem
                    icon={
                      (currentSubMenuIndex === 2 && activeMenu === 3) || currentTab === 'Albums' ? (
                        <img alt=""
                          src="/images/sidebar/oval_active.png"
                          width={10}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/oval.png"
                          width={10}
                        />
                      )
                    }
                    onClick={() => {
                      setCurrentSubMenuIndex(2);
                      navigate('/MyProfile/Deliverables/Albums');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                    className={
                      (currentSubMenuIndex === 2 && activeMenu === 3) || currentTab === 'Albums'
                        ? 'active_submenu'
                        : ''
                    }
                  >
                    Albums
                  </MenuItem>
                  <MenuItem
                    icon={
                      (currentSubMenuIndex === 3 && activeMenu === 3) || currentTab === 'PreWed-Deliverables' ? (
                        <img alt=""
                          src="/images/sidebar/oval_active.png"
                          width={10}
                        />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/oval.png"
                          width={10}
                        />
                      )
                    }
                    onClick={() => {
                      setCurrentSubMenuIndex(3);
                      navigate('/MyProfile/Deliverables/PreWed-Deliverables');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                    className={
                      (currentSubMenuIndex === 3 && activeMenu === 3) || currentTab === 'PreWed-Deliverables'
                        ? 'active_submenu'
                        : ''
                    }
                  >
                    Pre-Wedding
                  </MenuItem>
                </SubMenu>
              )}
              {currentUser.rollSelect === 'Manager' && (
                <MenuItem
                  icon={
                    activeMenu === 4 || currentTab === 'Checklists' ? (
                      <img alt="" src={Checklist} width={20} />
                    ) : (
                      <img alt="" src={UnActiveChecklist} width={20} />
                    )
                  }
                  className={
                    activeMenu === 4 || currentTab === 'Checklists' ? 'active active_color' : ''
                  }
                  onClick={() => {
                    setActiveMenu(4);
                    navigate('/MyProfile/CheckLists');
                    setCurrentTab(null);
                    setMobileSideBar(false)
                  }}
                >
                  Checklists
                </MenuItem>
              )}
              <MenuItem
                icon={
                  <img alt=""
                    src={
                      activeMenu === 5 || currentTab === 'Attendence'
                        ? '/images/sidebar/attendanceActive.png'
                        : '/images/sidebar/attendance.png'
                    }
                    width={20}
                  />
                }
                className={activeMenu === 5 || currentTab === 'Attendence' ? 'active active_color' : ''}
                onClick={() => {
                  setActiveMenu(5);
                  navigate('/MyProfile/Attendence');
                  setCurrentTab(null);
                  setMobileSideBar(false)
                }}
              >
                Attendence
              </MenuItem>

              {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Editor') && (
                <>
                  <SubMenu
                    className={activeMenu === 6 || currentTab === 'Tasks' ? 'active' : ''}
                    icon={
                      activeMenu === 6 || currentTab === 'Tasks' ? (
                        <img alt="" src={ActiveTask} width={20} />
                      ) : (
                        <img alt="" src="/images/sidebar/tasks.png"
                          width={20} />
                      )
                    }
                    title="Tasks"
                    open={activeMenu === 6 || currentTab === 'Tasks' ? true : false}
                    onOpenChange={() => {
                      setCurrentTab(null)
                      setActiveMenu(6);
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 0 && activeMenu === 6) || currentTab === 'Tasks' ? (
                          <img alt=""
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/oval.png"
                            width={10}
                          />
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(0);
                        navigate('/MyProfile/Tasks/DailyTasks');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 0 && activeMenu === 6) || currentTab === 'Tasks'
                          ? 'active_submenu'
                          : ''
                      }
                    >Daily Tasks
                    </MenuItem>
                    {currentUser.rollSelect === 'Manager' ?
                      <MenuItem
                        icon={
                          (currentSubMenuIndex === 1 && activeMenu === 6) || currentTab === 'Tasks Reports' ? (
                            <img alt=""
                              src="/images/sidebar/oval_active.png"
                              width={10}
                            />
                          ) : (
                            <img alt=""
                              src="/images/sidebar/oval.png"
                              width={10}
                            />
                          )
                        }
                        onClick={() => {
                          setCurrentSubMenuIndex(1);
                          navigate('/MyProfile/Tasks/Reports');
                          setCurrentTab(null);
                          setMobileSideBar(false)
                        }}
                        className={
                          (currentSubMenuIndex === 1 && activeMenu === 6) || currentTab === 'Tasks Reports'
                            ? 'active_submenu'
                            : ''
                        }
                      >
                        Reports
                      </MenuItem>
                      :
                      null
                    }
                  </SubMenu>
                </>
              )}

              {currentUser.rollSelect === 'Manager' && (
                <>
                  <MenuItem
                    icon={
                      activeMenu === 7 || currentTab === 'Reports' ? (
                        <img alt="" src={ActiveReport} width={20} />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/reports.png"
                          width={20}
                        />
                      )
                    }
                    className={activeMenu === 7 || currentTab === 'Reports' ? 'active active_color' : ''}
                    onClick={() => {
                      setActiveMenu(7);
                      navigate('/MyProfile/Reports');
                      setCurrentTab(null);
                      setMobileSideBar(false)
                    }}
                  >
                    Reports
                  </MenuItem>
                  <MenuItem
                    icon={
                      activeMenu === 8 || currentTab === 'Teams' ? (
                        <img alt="" src={ActiveTeam} width={30} />
                      ) : (
                        <img alt=""
                          src="/images/sidebar/teams.png"
                          width={20}
                        />
                      )
                    }
                    className={activeMenu === 8 || currentTab === 'Teams' ? 'active active_color' : ''}
                    onClick={() => {
                      setActiveMenu(8);
                      navigate('/MyProfile/Team');
                      setCurrentTab(null)
                      setMobileSideBar(false)
                    }}
                  >
                    Team
                  </MenuItem>
                </>
              )}
              <MenuItem
                icon={
                  <img alt="" src="/images/sidebar/logout.png" width={20} />
                }
                onClick={() => {
                  dispatch(updateAllEvents([]))
                  Cookies.remove('currentUser');
                  navigate('/')
                  setMobileSideBar(false)
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
