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
import React, { useEffect, useState } from "react";
import "../assets/css/sidebar.css";
import { Button, Modal, ModalBody } from "reactstrap";
import Checklist from "../assets/Profile/Checklist.svg";
import ActiveDeleiverables from "../assets/Profile/ActiveDeleiverables.svg";
import ActiveTask from "../assets/Profile/ActiveTask.svg";
import ActiveReport from "../assets/Profile/ActiveReport.svg";
import UnActiveChecklist from "../assets/Profile/UnActiveChecklist.svg";
import ActiveTeam from "../assets/Profile/ActiveTeam.png";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [activeMenu, setActiveMenu] = useState(15);
  const [currentSubMenuIndex, setCurrentSubMenuIndex] = useState(15);
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [shooterHide, setShooterHide] = useState(false)
  const [EditorHide, setEditorHide] = useState(false)
  const [manager, setManager] = useState(false);
  const location = useLocation();
  const toggle = () => {
    setMobileSideBar(false);
  };
  const [currentTab, setCurrentTab] = useState(null);
  useEffect(() => {
    if (location.pathname.startsWith('/MyProfile/AddClient')) {
      setCurrentTab('Add Client');
    }
    if (location.pathname.startsWith('/MyProfile/Client')) {
      setCurrentTab('View Client');
    }
    if (location.pathname.startsWith('/MyProfile/Calender')) {
      setCurrentTab('Calender View');
    }
    if (location.pathname.startsWith('/MyProfile/PreWedShoot')) {
      setCurrentTab('Pre-wed Shoot');
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Cinematography')) {
      setCurrentTab('Cinematography');
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Photos')) {
      setCurrentTab('Photos');
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Albums')) {
      setCurrentTab('Albums');
    }
    if (location.pathname.startsWith('/MyProfile/CheckLists')) {
      setCurrentTab('Checklists');
    }
    if (location.pathname.startsWith('/MyProfile/Attendence')) {
      setCurrentTab('Attendence');
    }
    if (location.pathname.startsWith('/MyProfile/Reports')) {
      setCurrentTab('Reports');
    }
    if (location.pathname.startsWith('/MyProfile/Team')) {
      setCurrentTab('Teams');
    }

  }, [])
  useEffect(() => {
    if (location.pathname.startsWith('/MyProfile/AddClient')) {
      setCurrentTab('Add Client');
    }
    if (location.pathname.startsWith('/MyProfile/Client')) {
      setCurrentTab('View Client');
    }
    if (location.pathname.startsWith('/MyProfile/Calender')) {
      setCurrentTab('Calender View');
    }
    if (location.pathname.startsWith('/MyProfile/PreWedShoot')) {
      setCurrentTab('Pre-wed Shoot');
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Cinematography')) {
      setCurrentTab('Cinematography');
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Photos')) {
      setCurrentTab('Photos');
    }
    if (location.pathname.startsWith('/MyProfile/Deliverables/Albums')) {
      setCurrentTab('Albums');
    }
    if (location.pathname.startsWith('/MyProfile/CheckLists')) {
      setCurrentTab('Checklists');
    }
    if (location.pathname.startsWith('/MyProfile/Attendence')) {
      setCurrentTab('Attendence');
    }
    if (location.pathname.startsWith('/MyProfile/Tasks')) {
      setCurrentTab('Tasks');
    }
    if (location.pathname.startsWith('/MyProfile/Reports')) {
      setCurrentTab('Reports');
    }
    if (location.pathname.startsWith('/MyProfile/Team')) {
      setCurrentTab('Teams');
    }

  }, [location])
  const currentUser = Cookies.get('currentUser') && JSON.parse(Cookies.get('currentUser'));
  console.log(currentTab);
  console.log(activeMenu);
  return (
    <>
      <div
        className="mobile_hide"
        style={{ display: 'flex', height: '100%', position: 'absolute' }}
      >
        <ProSidebar style={{marginRight : '-20px'}}>
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
                {currentUser.rollSelect == 'Manager' && (
                  <>
                    <SubMenu className={activeMenu == 1 || currentTab == 'Add Client' || currentTab == 'View Client' ? 'active' : ''}
                      icon={activeMenu == 1 || currentTab == 'Add Client' || currentTab == 'View Client' ? (
                        <img
                          src="/images/sidebar/clients_active.png"
                          width={30}
                        ></img>
                      ) : (
                        <img
                          src="/images/sidebar/clients.png"
                          width={30}
                        ></img>
                      )
                      }
                      title="Clients"
                      open={activeMenu == 1 || currentTab == 'Add Client' || currentTab == 'View Client' ? true : false}
                      onOpenChange={() => {
                        setActiveMenu(1);
                        setCurrentTab(null)
                      }}
                    >
                      <MenuItem
                        icon={
                          (currentSubMenuIndex == 0 && activeMenu == 1) || currentTab == 'Add Client' ? (
                            <img
                              src="/images/sidebar/oval_active.png"
                              width={10}
                            ></img>
                          ) : (
                            <img
                              src="/images/sidebar/oval.png"
                              width={10}
                            ></img>
                          )
                        }
                        onClick={() => {
                          setCurrentSubMenuIndex(0);
                          navigate('/MyProfile/AddClient/Form-I');
                          setCurrentTab(null);
                        }}
                        className={
                          (currentSubMenuIndex == 0 && activeMenu == 1) || currentTab == 'Add Client'
                            ? 'active_submenu'
                            : ''
                        }
                      >
                        Add Client
                      </MenuItem>
                      <MenuItem
                        icon={
                          (currentSubMenuIndex == 1 && activeMenu == 1) || currentTab == 'View Client' ? (
                            <img
                              src="/images/sidebar/oval_active.png"
                              width={10}
                            ></img>
                          ) : (
                            <img
                              src="/images/sidebar/oval.png"
                              width={10}
                            ></img>
                          )
                        }
                        onClick={() => {
                          setCurrentSubMenuIndex(1);
                          navigate('/MyProfile/Client/ViewClient');
                          setCurrentTab(null)
                        }}
                        className={
                          (currentSubMenuIndex == 1 && activeMenu == 1) || currentTab == 'View Client'
                            ? 'active_submenu'
                            : ''
                        }
                      >
                        View Client
                      </MenuItem>
                    </SubMenu>

                  </>
                )}


                {(currentUser.rollSelect == 'Manager' || currentUser.rollSelect == 'Shooter') && (
                  <SubMenu
                    className={activeMenu == 2 || currentTab == 'Calender View' || currentTab == 'Pre-wed Shoot' ? 'active' : ''}
                    icon={
                      activeMenu == 2 || currentTab == 'Calender View' || currentTab == 'Pre-wed Shoot' ? (
                        <img
                          src="/images/sidebar/CalenderActive.png"
                          width={30}
                        ></img>
                      ) : (
                        <img
                          src="/images/sidebar/calendar.png"
                          width={30}
                        ></img>
                      )
                    }
                    title="Calendar"
                    open={activeMenu == 2 || currentTab == 'Calender View' || currentTab == 'Pre-wed Shoot' ? true : false}
                    onOpenChange={() => {
                      setCurrentTab(null)
                      setActiveMenu(2);
                    }}
                  >


                    <MenuItem
                      icon={
                        (currentSubMenuIndex == 0 && activeMenu == 2) || currentTab == 'Calender View' ? (
                          <img
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          ></img>
                        ) : (
                          <img
                            src="/images/sidebar/oval.png"
                            width={10}
                          ></img>
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(0);
                        navigate('/MyProfile/Calender/View');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex == 0 && activeMenu == 2) || currentTab == 'Calender View'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Calendar View
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex == 1 && activeMenu == 2) || currentTab == 'Pre-wed Shoot' ? (
                          <img
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          ></img>
                        ) : (
                          <img
                            src="/images/sidebar/oval.png"
                            width={10}
                          ></img>
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(1);
                        navigate('/MyProfile/PreWedShoot/PreWedShootScreen');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex == 1 && activeMenu == 2) || currentTab == 'Pre-wed Shoot'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Pre-wed Shoot
                    </MenuItem>
                  </SubMenu>
                )}

                {(currentUser.rollSelect == 'Manager' || currentUser.rollSelect == 'Editor') && (
                  <SubMenu
                    className={activeMenu == 4 || currentTab == 'Cinematography' || currentTab == 'Photos' || currentTab == 'Albums' ? 'active' : ''}
                    icon={
                      activeMenu == 4 || currentTab == 'Cinematography' || currentTab == 'Photos' || currentTab == 'Albums' ? (
                        <img
                          src="/images/sidebar/deliverables.png"
                          width={20}
                        ></img>
                      ) : (
                        <img
                          src="/images/sidebar/deliverables.png"
                          width={20}
                        ></img>
                      )
                    }
                    open={activeMenu == 4 || currentTab == 'Cinematography' || currentTab == 'Photos' || currentTab == 'Albums' ? true : false}
                    title="Deliverables"
                    onOpenChange={() => {
                      setActiveMenu(4);
                      setCurrentTab(null)
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex == 3 && activeMenu == 4) || currentTab == 'Cinematography' ? (
                          <img
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          ></img>
                        ) : (
                          <img
                            src="/images/sidebar/oval.png"
                            width={10}
                          ></img>
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(3);
                        navigate('/MyProfile/Deliverables/Cinematography');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex == 3 && activeMenu === 4) || currentTab == 'Cinematography'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Cinematography
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex == 4 && activeMenu === 4) || currentTab == 'Photos' ? (
                          <img
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          ></img>
                        ) : (
                          <img
                            src="/images/sidebar/oval.png"
                            width={10}
                          ></img>
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(4);
                        navigate('/MyProfile/Deliverables/Photos');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex == 4 && activeMenu == 4) || currentTab == 'Photos'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Photos
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex == 5 && activeMenu == 4) || currentTab == 'Albums' ? (
                          <img
                            src="/images/sidebar/oval_active.png"
                            width={10}
                          ></img>
                        ) : (
                          <img
                            src="/images/sidebar/oval.png"
                            width={10}
                          ></img>
                        )
                      }
                      onClick={() => {
                        setCurrentSubMenuIndex(5);
                        navigate('/MyProfile/Deliverables/Albums');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex == 5 && activeMenu == 4) || currentTab == 'Albums'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Albums
                    </MenuItem>
                  </SubMenu>
                )}


                {currentUser.rollSelect == 'Manager' && (
                  <MenuItem
                    icon={
                      activeMenu == 10 || currentTab == 'Checklists' ? (
                        <img src={Checklist} width={20}></img>
                      ) : (
                        <img src={UnActiveChecklist} width={20}></img>
                      )
                    }
                    className={
                      activeMenu == 10 || currentTab == 'Checklists' ? 'active active_color' : ''
                    }
                    onClick={() => {
                      setActiveMenu(10);
                      navigate('/MyProfile/CheckLists');
                      setCurrentTab(null)
                    }}
                  >
                    Checklists
                  </MenuItem>
                )}



                <MenuItem
                  icon={
                    <img
                      src={
                        activeMenu !== 3 || currentTab == 'Attendence'
                          ? '/images/sidebar/attendance.png'
                          : '/images/sidebar/attendanceActive.png'
                      }
                      width={20}
                    ></img>
                  }
                  className={activeMenu == 3 || currentTab == 'Attendence' ? 'active active_color' : ''}
                  onClick={() => {
                    setActiveMenu(3);
                    navigate('/MyProfile/Attendence');
                    setCurrentTab(null)
                  }}
                >
                  Attendence
                </MenuItem>

                {(currentUser.rollSelect == 'Manager' || currentUser.rollSelect == 'Editor') && (
                  <>

                    <MenuItem
                      icon={
                        activeMenu == 5 || currentTab == 'Tasks' ? (
                          <img src={ActiveTask} width={20}></img>
                        ) : (
                          <img
                            src="/images/sidebar/tasks.png"
                            width={20}
                          ></img>
                        )
                      }
                      className={activeMenu == 5 || currentTab == 'Tasks' ? 'active active_color' : ''}
                      onClick={() => {
                        setActiveMenu(5);
                        navigate('/MyProfile/Tasks/DailyTasks');
                        setCurrentTab(null)
                      }}
                    >
                      Tasks
                    </MenuItem>

                  </>
                )}

                {currentUser.rollSelect == 'Manager' && (
                  <>
                    <MenuItem
                      icon={
                        activeMenu == 6 || currentTab == 'Reports' ? (
                          <img src={ActiveReport} width={20}></img>
                        ) : (
                          <img
                            src="/images/sidebar/reports.png"
                            width={20}
                          ></img>
                        )
                      }
                      className={activeMenu == 6 || currentTab == 'Reports' ? 'active active_color' : ''}
                      onClick={() => {
                        setActiveMenu(6);
                        navigate('/MyProfile/Reports');
                        setCurrentTab(null);
                      }}
                    >
                      Reports
                    </MenuItem>
                    <MenuItem
                      icon={
                        activeMenu == 7 || currentTab == 'Teams' ? (
                          <img src={ActiveTeam} width={30}></img>
                        ) : (
                          <img
                            src="/images/sidebar/teams.png"
                            width={20}
                          ></img>
                        )
                      }
                      className={activeMenu == 7 || currentTab == 'Teams' ? 'active active_color' : ''}
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
                    <img src="/images/sidebar/logout.png" width={20}></img>
                  }
                  onClick={() => {
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
        <div onClick={() => setMobileSideBar(true)}>
          <img
            src="/images/navbar/oval.png"
            width={70}
            style={{ cursor: 'pointer', marginRight: -30 }}
          />
          <img
            src="/images/navbar/verticle_lines.png"
            style={{ cursor: 'pointer', width: '15px', marginTop: '10px' }}
          />
        </div>
        <div>
          <img
            src="/images/Logo.png"
            width={35}
            height={35}
            style={{ background: 'red' }}
          />
        </div>

        <div className="search_div d-flex align-items-center justify-content-between">
          <input
            className="input_search"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
          <img src="/images/navbar/search.png" width={25}></img>
        </div>
        <div className="d-flex align-items-center">
          <img
            src="/images/navbar/noti.png"
            style={{ marginTop: -10 }}
            width={25}
            height={25}
          />
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
              onClick={() => navigate('/MyProfile/About')}
            >
              <div className="d-flex align-items-center">
                <div className="name_div_side">
                  <img
                    src="/images/navbar/oval.png"
                    width={90}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      marginTop: '-30px',
                    }}
                  />
                  <div className="name_div_Text">
                    <p style={{ marginBottom: 0, paddingLeft: 20 }}>Manmeet</p>
                  </div>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu>
              <SubMenu
                className={activeMenu == 1 ? 'active' : ''}
                icon={
                  activeMenu == 1 ? (
                    <img
                      src="/images/sidebar/clients_active.png"
                      width={30}
                    ></img>
                  ) : (
                    <img src="/images/sidebar/clients.png" width={30}></img>
                  )
                }
                title="Clients"
                open={activeMenu == 1 ? true : false}
                onOpenChange={() => {
                  setActiveMenu(1);
                }}
              >
                <MenuItem
                  icon={
                    currentSubMenuIndex == 0 && activeMenu == 1 ? (
                      <img
                        src="/images/sidebar/oval_active.png"
                        width={10}
                      ></img>
                    ) : (
                      <img src="/images/sidebar/oval.png" width={10}></img>
                    )
                  }
                  onClick={() => {
                    setCurrentSubMenuIndex(0);
                    navigate('/MyProfile/AddClient/Form-I');
                  }}
                  className={
                    currentSubMenuIndex == 0 && activeMenu == 1
                      ? 'active_submenu'
                      : ''
                  }
                >
                  Add Client
                </MenuItem>
                <MenuItem
                  icon={
                    currentSubMenuIndex == 1 && activeMenu == 1 ? (
                      <img
                        src="/images/sidebar/oval_active.png"
                        width={10}
                      ></img>
                    ) : (
                      <img src="/images/sidebar/oval.png" width={10}></img>
                    )
                  }
                  onClick={() => {
                    setCurrentSubMenuIndex(1);
                    navigate('/MyProfile/Client/ViewClient');
                  }}
                  className={
                    currentSubMenuIndex == 1 && activeMenu == 1
                      ? 'active_submenu'
                      : ''
                  }
                >
                  View Client
                </MenuItem>
              </SubMenu>

              <MenuItem
                icon={<img src="/images/sidebar/calendar.png" width={30}></img>}
                className={activeMenu == 2 ? 'active active_color' : ''}
                onClick={() => {
                  setActiveMenu(2);
                  navigate('/MyProfile/Calender/View');
                }}
              >
                Calendar
              </MenuItem>

              <MenuItem
                icon={
                  <img
                    src={
                      activeMenu !== 3
                        ? '/images/sidebar/attendance.png'
                        : '/images/sidebar/attendanceActive.png'
                    }
                    width={20}
                  ></img>
                }
                className={activeMenu == 3 ? 'active active_color' : ''}
                onClick={() => {
                  setActiveMenu(3);
                  navigate('/MyProfile/Attendence');
                }}
              >
                Attendence
              </MenuItem>

              <SubMenu
                className={activeMenu == 4 ? 'active' : ''}
                icon={
                  activeMenu == 4 ? (
                    <img
                      src="/images/sidebar/deliverables.png"
                      width={20}
                    ></img>
                  ) : (
                    <img
                      src="/images/sidebar/deliverables.png"
                      width={20}
                    ></img>
                  )
                }
                open={activeMenu == 4 ? true : false}
                title="Deliverables"
                onOpenChange={(boolean) => {
                  setActiveMenu(4);
                }}
              >
                <MenuItem
                  icon={
                    currentSubMenuIndex == 3 && activeMenu == 4 ? (
                      <img
                        src="/images/sidebar/oval_active.png"
                        width={10}
                      ></img>
                    ) : (
                      <img src="/images/sidebar/oval.png" width={10}></img>
                    )
                  }
                  onClick={() => {
                    setCurrentSubMenuIndex(3);
                    navigate('/MyProfile/Deliverables/Cinematography');
                  }}
                  className={
                    currentSubMenuIndex == 3 && activeMenu === 4
                      ? 'active_submenu'
                      : ''
                  }
                >
                  Cinematography
                </MenuItem>
                <MenuItem
                  icon={
                    currentSubMenuIndex == 4 && activeMenu === 4 ? (
                      <img
                        src="/images/sidebar/oval_active.png"
                        width={10}
                      ></img>
                    ) : (
                      <img src="/images/sidebar/oval.png" width={10}></img>
                    )
                  }
                  onClick={() => {
                    setCurrentSubMenuIndex(4);
                    navigate('/MyProfile/Deliverables/Photos');
                  }}
                  className={
                    currentSubMenuIndex == 4 && activeMenu == 4
                      ? 'active_submenu'
                      : ''
                  }
                >
                  Photos
                </MenuItem>
                <MenuItem
                  icon={
                    currentSubMenuIndex == 5 && activeMenu == 4 ? (
                      <img
                        src="/images/sidebar/oval_active.png"
                        width={10}
                      ></img>
                    ) : (
                      <img src="/images/sidebar/oval.png" width={10}></img>
                    )
                  }
                  onClick={() => {
                    setCurrentSubMenuIndex(5);
                    navigate('/MyProfile/Deliverables/Albums');
                  }}
                  className={
                    currentSubMenuIndex == 5 && activeMenu == 4
                      ? 'active_submenu'
                      : ''
                  }
                >
                  Albums
                </MenuItem>
              </SubMenu>

              <MenuItem
                icon={<img src="/images/sidebar/tasks.png" width={20}></img>}
                className={activeMenu == 5 ? 'active active_color' : ''}
                onClick={() => {
                  setActiveMenu(5);
                  navigate('/MyProfile/Tasks/DailyTasks');
                }}
              >
                Tasks
              </MenuItem>

              <MenuItem
                icon={<img src="/images/sidebar/reports.png" width={20}></img>}
                className={activeMenu == 6 ? 'active active_color' : ''}
                onClick={() => {
                  setActiveMenu(6);
                  navigate('/MyProfile/Reports');
                }}
              >
                Reports
              </MenuItem>

              <MenuItem
                icon={<img src="/images/sidebar/teams.png" width={20}></img>}
                className={activeMenu == 7 ? 'active active_color' : ''}
                onClick={() => {
                  setActiveMenu(7);
                  navigate('/MyProfile/Team');
                }}
              >
                Team
              </MenuItem>

              <MenuItem
                icon={<img src="/images/sidebar/logout.png" width={20}></img>}
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
