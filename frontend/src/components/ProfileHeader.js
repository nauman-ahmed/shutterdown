import React, { useState } from "react";
import "../assets/css/common.css";
import "../assets/css/Profile.css";
import locate from "../assets/Profile/locate.svg";
import mail from "../assets/Profile/mail.svg";
import ID from "../assets/Profile/ID.svg";
import phone from "../assets/Profile/phone.svg";
import { Outlet, useNavigate } from "react-router-dom";
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
  return (
    <div className="CalenderViewWidth">
      <div className="rowBox Profile_Web_hide">
        {user?.photo ? (
          <div className="ProfileBoxForImg w-25 Text50Semi">
            <img alt="" className="w-100 h-100 imgRadius" src={BASE_URL + '/' + user.photo} />
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
                <img alt="" src={locate} className="marginrightsmall" />
                {/* <p className="title_profile">{user?.currentAddress}</p> */}
                <p className="title_profile">India</p>
              </div>
              <div className="d-flex align-items-center">
                <img alt="" src={mail} className="marginrightsmall" />
                <p className="title_profile">{user?.email}</p>
              </div>
              <div className="d-flex align-items-center">
                <img alt="" src={phone} className="marginrightsmall" />
                <p className="title_profile">{user?.phoneNo}</p>
              </div>
              <div className="d-flex align-items-center">
                <img alt="" src={ID} className="marginrightsmall" />
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
                  Sub Role
                </div>
                <div className=" mtsmall d-flex">
                  {user?.subRole?.length > 0 ? 
                    user.subRole?.map((role,index) => (
                      <div className="mx-1">
                        {role}{index < user?.subRole?.length - 1 ? "," : null}
                      </div>
                    ))
                  : "Not Selected"
                  }
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
                      i.id === selected
                        ? "itemsbox Text12 active_profile_tab "
                        : "itemsbox Text12 non_active_profile_tab"
                    }
                  >
                    {i.title}
                  </div>
                  {i.id === selected ? (
                    <img alt=""
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
      <>
        <div className="Profile_mobile_View mx-auto">
          {/* <img src={BackMobile} style={{ marginLeft: "25px" }} /> */}
          <div className="w-100 d-flex justify-content-center">

          <div className="Text14Semi headerProfile">My Profile</div>
          </div>
          <div />
        </div>
        <div className="Profile_mobile_View center">
          {user?.photo ?
            <div style={{ width: '100px', height: '100px', padding: '0px' }} className="HeaderName Text35R mt25"><img alt="" style={{ borderRadius: '50px' }} className="w-100" src={BASE_URL + '/' + user.photo} /></div>
            : <div className="HeaderName Text35R mt25">{user?.firstName.charAt(0).toUpperCase()}{user?.lastName.charAt(0).toUpperCase()}</div>
          }
          <div className="Text16N mt12">{user?.firstName + ' ' + user?.lastName}</div>
          <div className="Text12 mt7">{user?.rollSelect}</div>
          <div className="R_A_Evenly mt7" style={{ width: "15%" }}>
            {/* <img src={Call} />
              <img src={MailIcon} /> */}
          </div>
        </div>

        {/* <div
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
          </div> */}
      </>
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
                  i.id === selected
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
      <Outlet />
    </div>
  );
}

export default ProfileHeader;
