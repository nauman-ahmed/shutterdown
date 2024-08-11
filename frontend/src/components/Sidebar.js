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
import { Modal } from "reactstrap";
import Checklist from "../assets/Profile/Checklist.svg";
import ActiveTask from "../assets/Profile/ActiveTask.svg";
import ActiveReport from "../assets/Profile/ActiveReport.svg";
import UnActiveChecklist from "../assets/Profile/UnActiveChecklist.svg";
import ActiveTeam from "../assets/Profile/ActiveTeam.png";
import Cookies from "js-cookie";

const SideBar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(15);
  const [currentSubMenuIndex, setCurrentSubMenuIndex] = useState(15);
  const [mobileSideBar, setMobileSideBar] = useState(false);
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
      setCurrentTab('View Clients');
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
    if (location.pathname.startsWith('/MyProfile/Tasks/DailyTasks')) {
      setCurrentTab('Tasks');
    }
    if (location.pathname.startsWith('/MyProfile/Tasks/Reports')) {
      setCurrentTab('Tasks Reports');
    }
    if (location.pathname.startsWith('/MyProfile/Reports')) {
      setCurrentTab('Reports');
    }
    if (location.pathname.startsWith('/MyProfile/Team')) {
      setCurrentTab('Teams');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (location.pathname.startsWith('/MyProfile/AddClient')) {
      setCurrentTab('Add Client');
    }
    if (location.pathname.startsWith('/MyProfile/Client')) {
      setCurrentTab('View Clients');
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
    if (location.pathname.startsWith('/MyProfile/Deliverables/PreWed-Deliverables')) {
      setCurrentTab('PreWed-Deliverables');
    }
    if (location.pathname.startsWith('/MyProfile/CheckLists')) {
      setCurrentTab('Checklists');
    }
    if (location.pathname.startsWith('/MyProfile/Attendence')) {
      setCurrentTab('Attendence');
    }
    if (location.pathname.startsWith('/MyProfile/Tasks/DailyTasks')) {
      setCurrentTab('Tasks');
    }
    if (location.pathname.startsWith('/MyProfile/Tasks/Reports')) {
      setCurrentTab('Tasks Reports');
    }
    if (location.pathname.startsWith('/MyProfile/Reports')) {
      setCurrentTab('Reports');
    }
    if (location.pathname.startsWith('/MyProfile/Team')) {
      setCurrentTab('Teams');
    }
    if (location.pathname.startsWith('/MyProfile/FormOptions')) {
      setCurrentTab('FormOptions');
    }
  }, [location])
  const currentUser = Cookies.get('currentUser') && JSON.parse(Cookies.get('currentUser'));
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
                          setCurrentTab(null)
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
                        setCurrentTab(null)
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
                        setCurrentTab(null)
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

                {(currentUser.rollSelect ==='Manager' || currentUser.rollSelect === 'Editor') && (
                  <SubMenu
                    className={activeMenu === 4 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'PreWed-Deliverables' || currentTab === 'Albums' ? 'active' : ''}
                    icon={
                      activeMenu === 4 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? (
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
                    open={activeMenu === 4 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? true : false}
                    title="Deliverables"
                    onOpenChange={() => {
                      setActiveMenu(4);
                      setCurrentTab(null)
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 3 && activeMenu === 4) || currentTab === 'Cinematography' ? (
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
                        navigate('/MyProfile/Deliverables/Cinematography');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 3 && activeMenu === 4) || currentTab === 'Cinematography'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Cinema
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 4 && activeMenu === 4) || currentTab === 'Photos' ? (
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
                        setCurrentSubMenuIndex(4);
                        navigate('/MyProfile/Deliverables/Photos');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 4 && activeMenu === 4) || currentTab === 'Photos'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Photos
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 5 && activeMenu === 4) || currentTab === 'Albums' ? (
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
                        setCurrentSubMenuIndex(5);
                        navigate('/MyProfile/Deliverables/Albums');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 5 && activeMenu === 4) || currentTab === 'Albums'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Albums
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 6 && activeMenu === 4) || currentTab === 'PreWed-Deliverables' ? (
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
                        setCurrentSubMenuIndex(6);
                        navigate('/MyProfile/Deliverables/PreWed-Deliverables');
                        setCurrentTab(null)
                      }}
                      className={
                        (currentSubMenuIndex === 6 && activeMenu === 4) || currentTab === 'PreWed-Deliverables'
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
                      activeMenu === 10 || currentTab === 'Checklists' ? (
                        <img alt="" src={Checklist} width={20}/>
                      ) : (
                        <img alt="" src={UnActiveChecklist} width={20}/>
                      )
                    }
                    className={
                      activeMenu === 10 || currentTab === 'Checklists' ? 'active active_color' : ''
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
                {currentUser.rollSelect !== 'Admin' && (
                  <MenuItem
                    icon={
                      <img alt=""
                        src={
                          activeMenu !== 3 || currentTab === 'Attendence'
                            ? '/images/sidebar/attendance.png'
                            : '/images/sidebar/attendanceActive.png'
                        }
                        width={20}
                      />
                    }
                    className={activeMenu === 3 || currentTab === 'Attendence' ? 'active active_color' : ''}
                    onClick={() => {
                      setActiveMenu(3);
                      navigate('/MyProfile/Attendence');
                      setCurrentTab(null)
                    }}
                  >
                    Attendence
                  </MenuItem>
                )}
                {(currentUser.rollSelect === 'Manager' || currentUser.rollSelect === 'Editor') && (
                  <>
                    <SubMenu
                      className={activeMenu === 5 || currentTab === 'Tasks' ? 'active' : ''}
                      icon={
                        activeMenu === 5 || currentTab === 'Tasks' ? (
                          <img alt="" src={ActiveTask} width={20} />
                        ) : (
                          <img alt="" src="/images/sidebar/tasks.png"
                            width={20} />
                        )
                      }
                      title="Tasks"
                      open={activeMenu === 5 || currentTab === 'Tasks' ? true : false}
                      onOpenChange={() => {
                        setCurrentTab(null)
                        setActiveMenu(5);
                      }}
                    >
                      <MenuItem
                        icon={
                          (currentSubMenuIndex === 0 && activeMenu === 5) || currentTab === 'Tasks' ? (
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
                          (currentSubMenuIndex === 0 && activeMenu === 5) || currentTab === 'Tasks'
                            ? 'active_submenu'
                            : ''
                        }
                      >Daily Tasks
                      </MenuItem>
                      {currentUser.rollSelect === 'Manager' ?
                        <MenuItem
                          icon={
                            (currentSubMenuIndex === 1 && activeMenu === 5) || currentTab === 'Tasks Reports' ? (
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
                            (currentSubMenuIndex === 1 && activeMenu === 5) || currentTab === 'Tasks Reports'
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
                        activeMenu === 6 || currentTab === 'Reports' ? (
                          <img alt="" src={ActiveReport} width={20} />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/reports.png"
                            width={20}
                          />
                        )
                      }
                      className={activeMenu === 6 || currentTab === 'Reports' ? 'active active_color' : ''}
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
                        activeMenu === 7 || currentTab === 'Teams' ? (
                          <img alt="" src={ActiveTeam} width={30} />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/teams.png"
                            width={20}
                          />
                        )
                      }
                      className={activeMenu === 7 || currentTab === 'Teams' ? 'active active_color' : ''}
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
            style={{ position : 'absolute', cursor: 'pointer', top : '-3px', left: '10px' }}
          />
          <img alt=""
            src="/images/navbar/verticle_lines.png"
            className="mt-2"
            style={{  cursor: 'pointer', width: '20px', zIndex : '10'}}
          />
        </div>
        <div>
          <img alt=""
            src="/images/Logo.png"
            width={35}
            height={35}
            style={{ background: 'red' }}
          />
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
              onClick={() => navigate('/MyProfile/About')}
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
          <SidebarContent>
          <Menu>
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
                    className={activeMenu === 4 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'PreWed-Deliverables' || currentTab === 'Albums' ? 'active' : ''}
                    icon={
                      activeMenu === 4 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? (
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
                    open={activeMenu === 4 || currentTab === 'Cinematography' || currentTab === 'Photos' || currentTab === 'Albums' || currentTab === 'PreWed-Deliverables' ? true : false}
                    title="Deliverables"
                    onOpenChange={() => {
                      setActiveMenu(4);
                      setCurrentTab(null)
                    }}
                  >
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 3 && activeMenu === 4) || currentTab === 'Cinematography' ? (
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
                        navigate('/MyProfile/Deliverables/Cinematography');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 3 && activeMenu === 4) || currentTab === 'Cinematography'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Cinema
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 4 && activeMenu === 4) || currentTab === 'Photos' ? (
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
                        setCurrentSubMenuIndex(4);
                        navigate('/MyProfile/Deliverables/Photos');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 4 && activeMenu === 4) || currentTab === 'Photos'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Photos
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 5 && activeMenu === 4) || currentTab === 'Albums' ? (
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
                        setCurrentSubMenuIndex(5);
                        navigate('/MyProfile/Deliverables/Albums');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 5 && activeMenu === 4) || currentTab === 'Albums'
                          ? 'active_submenu'
                          : ''
                      }
                    >
                      Albums
                    </MenuItem>
                    <MenuItem
                      icon={
                        (currentSubMenuIndex === 6 && activeMenu === 4) || currentTab === 'PreWed-Deliverables' ? (
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
                        setCurrentSubMenuIndex(6);
                        navigate('/MyProfile/Deliverables/PreWed-Deliverables');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                      className={
                        (currentSubMenuIndex === 6 && activeMenu === 4) || currentTab === 'PreWed-Deliverables'
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
                      activeMenu === 10 || currentTab === 'Checklists' ? (
                        <img alt="" src={Checklist} width={20} />
                      ) : (
                        <img alt="" src={UnActiveChecklist} width={20} />
                      )
                    }
                    className={
                      activeMenu === 10 || currentTab === 'Checklists' ? 'active active_color' : ''
                    }
                    onClick={() => {
                      setActiveMenu(10);
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
                        activeMenu !== 3 || currentTab === 'Attendence'
                          ? '/images/sidebar/attendance.png'
                          : '/images/sidebar/attendanceActive.png'
                      }
                      width={20}
                    />
                  }
                  className={activeMenu === 3 || currentTab === 'Attendence' ? 'active active_color' : ''}
                  onClick={() => {
                    setActiveMenu(3);
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
                      className={activeMenu === 5 || currentTab === 'Tasks' ? 'active' : ''}
                      icon={
                        activeMenu === 5 || currentTab === 'Tasks' ? (
                          <img alt="" src={ActiveTask} width={20} />
                        ) : (
                          <img alt="" src="/images/sidebar/tasks.png"
                            width={20} />
                        )
                      }
                      title="Tasks"
                      open={activeMenu === 5 || currentTab === 'Tasks' ? true : false}
                      onOpenChange={() => {
                        setCurrentTab(null)
                        setActiveMenu(5);
                      }}
                    >
                      <MenuItem
                        icon={
                          (currentSubMenuIndex === 0 && activeMenu === 5) || currentTab === 'Tasks' ? (
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
                          (currentSubMenuIndex === 0 && activeMenu === 5) || currentTab === 'Tasks'
                            ? 'active_submenu'
                            : ''
                        }
                      >Daily Tasks
                      </MenuItem>
                      {currentUser.rollSelect === 'Manager' ?
                        <MenuItem
                          icon={
                            (currentSubMenuIndex === 1 && activeMenu === 5) || currentTab === 'Tasks Reports' ? (
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
                            (currentSubMenuIndex === 1 && activeMenu === 5) || currentTab === 'Tasks Reports'
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
                        activeMenu === 6 || currentTab === 'Reports' ? (
                          <img alt="" src={ActiveReport} width={20} />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/reports.png"
                            width={20}
                          />
                        )
                      }
                      className={activeMenu === 6 || currentTab === 'Reports' ? 'active active_color' : ''}
                      onClick={() => {
                        setActiveMenu(6);
                        navigate('/MyProfile/Reports');
                        setCurrentTab(null);
                        setMobileSideBar(false)
                      }}
                    >
                      Reports
                    </MenuItem>
                    <MenuItem
                      icon={
                        activeMenu === 7 || currentTab === 'Teams' ? (
                          <img alt="" src={ActiveTeam} width={30} />
                        ) : (
                          <img alt=""
                            src="/images/sidebar/teams.png"
                            width={20}
                          />
                        )
                      }
                      className={activeMenu === 7 || currentTab === 'Teams' ? 'active active_color' : ''}
                      onClick={() => {
                        setActiveMenu(7);
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
