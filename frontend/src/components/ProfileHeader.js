import React, { useState, useEffect } from "react";
import "../assets/css/common.css";
import "../assets/css/Profile.css";
import locate from "../assets/Profile/locate.svg";
import mail from "../assets/Profile/mail.svg";
import ID from "../assets/Profile/ID.svg";
import phone from "../assets/Profile/phone.svg";
import BackMobile from "../assets/Profile/BackMobile.svg";
import Call from "../assets/Profile/Call.svg";
import MailIcon from "../assets/Profile/MailIcon.svg";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { Last } from "react-bootstrap/esm/PageItem";
import { useAuthContext } from "../config/context";
import Cookies from "js-cookie";
import BASE_URL from "../API";


function ProfileHeader({ attendence = false, profile = false }) {
  const [selected, setSelectedTab] = useState(1);
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get('currentUser'));
  let Data3 = [
    {
      title: "About",
      id: 1,
    },
    {
      title: "Profile",
      id: 2,
    },
    {
      title: "Job",
      id: 3,
    },
    {
      title: "Documents",
      id: 4,
    },
    {
      title: "Assets",
      id: 5,
    },
  ];
  let Data4 = [
    {
      title: "About",
      id: 1,
    },
    {
      title: "Profile",
      id: 2,
    },
    {
      title: "Documents",
      id: 4,
    },
    {
      title: "Assets",
      id: 5,
    },
  ];
  const [timePage, setTimePage] = useState(true);
  return (
    <div style={{ width: "100%" }}>
      {!attendence && (
        <div className="rowBox Profile_Web_hide">
          {user?.photo ? (
          <div className="ProfileBoxForImg w-25 Text50Semi">
            <img className="w-100 h-100 imgRadius" src={BASE_URL + '/' + user.photo} />
          </div>
          ) : (
            <div className="ProfileBox Text50Semi">
            {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
          </div>
          )}
          <div className="ProfileRightBox">
            <div className="Text20Semi padding_leftSmall">{`${user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1).toLowerCase()} ${user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1).toLowerCase()}`}</div>
            <div className="padding_leftSmall rowalign mtsmall">
              <div
                className="d-flex align-items-center justify-content-between"
                style={{ width: "95%" }}
              >
                <div className="d-flex align-items-center">
                  <img src={locate} className="marginrightsmall" />
                  <p className="title_profile">{user?.currentAddress}</p>
                </div>
                <div className="d-flex align-items-center">
                  <img src={mail} className="marginrightsmall" />
                  <p className="title_profile">{user?.email}</p>
                </div>
                <div className="d-flex align-items-center">
                  <img src={phone} className="marginrightsmall" />
                  <p className="title_profile">{user?.phoneNo}</p>
                </div>
                <div className="d-flex align-items-center">
                  <img src={ID} className="marginrightsmall" />
                  <p className="title_profile">ID Card</p>
                </div>
              </div>
            </div>
            <div className="line linestyle" />
            <div className="padding_leftSmall rowalign mtsmall">
              <div
                className="d-flex align-items-center justify-content-around"
                style={{ width: "95%" }}
              >
                <div>
                  <div className="Text12Semi">
                    JOB TITLE
                  </div>
                  <div className=" mtsmall">
                    {user.jobTitle}
                  </div>
                </div>
                <div>
                  <div className="Text12Semi">
                    EMP NO
                  </div>
                  <div className=" mtsmall">
                    {user?.employeeNumber}
                  </div>
                </div>
              </div>
            </div>
            <div className="bottomBox padding_leftSmall rowalign">
              <div
                className="d-flex align-items-center justify-content-between"
                style={{ width: "75%" }}
              >
                {Data3.map((i, value) => (
                  <div
                    style={{ height: 20, cursor: "pointer" }}
                    onClick={() => {
                      navigate(i.title);
                      setSelectedTab(i.id);
                    }}
                  >
                    <div
                      key={i.id}
                      className={
                        i.id == selected
                          ? "itemsbox Text12 active_profile_tab "
                          : "itemsbox Text12 non_active_profile_tab"
                      }
                    >
                      {i.title}
                    </div>
                    {i.id == selected ? (
                      <img
                        src="/images/focus_arrow.png"
                        width={15}
                        className="focus_arrow"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="Profile_mobile_View">
        <img src={BackMobile} style={{ marginLeft: "25px" }} />
        <div className="Text14Semi headerProfile">My Profile</div>
        <div />
      </div>
      {!profile && (
        <>
          <div className="Profile_mobile_View center">
            <div className="HeaderName Text35R mt25">MS</div>
            <div className="Text16N mt12">Manmeet Singh</div>
            <div className="Text12 mt7">Photographer</div>
            <div className="R_A_Evenly mt7" style={{ width: "15%" }}>
              <img src={Call} />
              <img src={MailIcon} />
            </div>
          </div>

          <div
            className="Profile_mobile_View headerBottom mt7"
            style={{ width: "95%", justifyContent: "flex-start" }}
          >
            <div
              className={
                !timePage
                  ? "Text12 gray ml20 textleft"
                  : "Text12 gray selectedHeader2 ml20 textleft"
              }
              onClick={() => {
                setTimePage(true);
                navigate("/MyProfile/About");
              }}
            >
              Profile
            </div>
            <div
              className={
                timePage
                  ? "Text12 gray ml20 textleft"
                  : "Text12 gray selectedHeader2 ml20 textleft"
              }
              onClick={() => {
                setTimePage(false);
                navigate("/MyProfile/Attendence");
              }}
            >
              Time
            </div>
          </div>
        </>
      )}
      {!attendence && (
        <div className="Profile_mobile_View mt12">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "95%", background: "#F6F6F6", padding: "3px" }}
          >
            {Data4.map((i, value) => (
              <div
                style={{ height: 20, cursor: "pointer" }}
                onClick={() => {
                  navigate(i.title);
                  setSelectedTab(i.id);
                }}
              >
                <div
                  key={i.id}
                  className={
                    i.id == selected
                      ? "itemsbox Text12 active_profile_tab_new "
                      : "itemsbox Text12 non_active_profile_tab"
                  }
                >
                  {i.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default ProfileHeader;
