import React, { useState, useRef, useEffect } from "react";
import { Nav, Navbar, Form, FormControl } from "react-bootstrap";
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


const Header = (args) => {

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [path, setCurrentPath] = useState("");
  const [notiTab, setNotiTab] = useState("1");
  const location = useLocation(); // React Hook

  const target = useRef(null);
  const targetNoti = useRef(null);

  const { profileData, GetDataProfile } = useAuthContext();

  useEffect(() => {
    GetDataProfile();
  }, [])


  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);
  return (
    <>
      <div className="set_header_width">
        <div className="navbar_container">
          <Navbar expand="lg" fixed="top">
            <div className="w-100 hide_nav_profile">
              <div className="w-100 d-flex align-items-center justify-content-between">
                <h4 className="heading"></h4>
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
                    ref={targetNoti}
                    onClick={() => setShowNoti(!showNoti)}
                    src="/images/navbar/noti.png"
                    style={{
                      marginTop: -10,
                      cursor: "pointer",
                    }}
                    width={25}
                    height={25}
                  />
                  <div className="name_div_flex">
                    <img
                      src="/images/navbar/oval.png"
                      ref={target}
                      onClick={() => setShow(!show)}
                      width={70}
                      style={{ position: "absolute", cursor: "pointer" }}
                    />
                    <div className="name_div">
                      <p style={{ marginBottom: 0 }}>{`${profileData?.firstName.charAt(0).toUpperCase() + profileData?.firstName.slice(1).toLowerCase()} ${profileData?.lastName.charAt(0).toUpperCase() + profileData?.lastName.slice(1).toLowerCase()}`}</p>
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
                  <img src="/images/navbar/profile_active.png" width={15}></img>
                  <p
                    className={
                      path == "/MyProfile" ? "active_popover" : "popover_txt"
                    }

                    onClick={() => navigate('/MyProfile')}
                  >
                    Profile
                  </p>
                </div>

                <div onClick={()=> navigate('/MyProfile/Attendence')} className="d-flex align-items-center mt-2 non_active_path">
                  <img src="/images/navbar/attendence.png" width={15}></img>
                  <p className="popover_txt">Attendence</p>
                </div>

                <div className="d-flex align-items-center mt-2 non_active_path">
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
