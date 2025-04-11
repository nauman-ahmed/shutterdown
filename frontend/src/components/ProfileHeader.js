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
import { useLoggedInUser } from "../config/zStore";


function ProfileHeader() {
  const [selected, setSelectedTab] = useState(0);
  const navigate = useNavigate();
const {userData} = useLoggedInUser()


  let Data3 = [
    {
      title: "about",
      id: 1,
    },
    {
      title: "details",
      id: 2,
    },
    {
      title: "job",
      id: 3,
    },
    {
      title: "documents",
      id: 4,
    },
    {
      title: "assets",
      id: 5,
    },
  ];
  let Data4 = [
    {
      title: "about",
      id: 1,
    },
    {
      title: "details",
      id: 2,
    },
    {
      title: "documents",
      id: 4,
    },
    {
      title: "assets",
      id: 5,
    },
  ];
  return (
    <div className="CalenderViewWidth">
      <div className="rowBox Profile_Web_hide">
        {userData?.photo ? (
          <div className="ProfileBoxForImg w-25 Text50Semi">
            <img alt="" className="w-100 h-100 imgRadius" src={BASE_URL + '/preview-file/' + userData?.photo} />
          </div>
        ) : (
          <div className="ProfileBox Text50Semi">
            {`${userData?.firstName?.charAt(0).toUpperCase()}${userData?.lastName?.charAt(0).toUpperCase()}`}
          </div>
        )}
        <div className="ProfileRightBox">
          <div className="Text20Semi padding_leftSmall">{`${userData?.firstName?.charAt(0).toUpperCase() + userData?.firstName?.slice(1).toLowerCase()} ${userData?.lastName?.charAt(0).toUpperCase() + userData?.lastName?.slice(1).toLowerCase()}`}</div>
          <div className="padding_leftSmall rowalign mtsmall">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "95%" }}
            >
              <div className="d-flex align-items-center">
                <img alt="" src={locate} className="marginrightsmall" />
                {/* <p className="title_profile">{userData?.currentAddress}</p> */}
                <p className="title_profile">India</p>
              </div>
              <div className="d-flex align-items-center">
                <img alt="" src={mail} className="marginrightsmall" />
                <p className="title_profile">{userData?.email}</p>
              </div>
              <div className="d-flex align-items-center">
                <img alt="" src={phone} className="marginrightsmall" />
                <p className="title_profile">{userData?.phoneNo}</p>
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
              className="d-flex align-items-center justify-content-between"
              style={{ width: "95%" }}
            >
              <div>
                <div className="Text12Semi">
                  Sub Role
                </div>
                <div className=" mtsmall d-flex">
                  {userData?.subRole?.length > 0 ? 
                    userData?.subRole?.map((role,index) => (
                      <div key={index} className="mx-1">
                        {role}{index < userData?.subRole?.length - 1 ? "," : null}
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
                  {userData?.employeeNumber}
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
          {userData?.photo ?
            <div style={{ width: '100px', height: '100px', padding: '0px' }} className="HeaderName Text35R mt25"><img alt="" style={{ width: '100px', height: '100px', padding: '0px', objectFit: "cover", borderRadius: '50px' }} className="w-100" src={BASE_URL + '/preview-file/' + userData?.photo} /></div>
            : <div className="HeaderName Text35R mt25">{userData?.firstName?.charAt(0).toUpperCase()}{userData?.lastName?.charAt(0).toUpperCase()}</div>
          }
          <div className="Text16N mt12">{userData?.firstName + ' ' + userData?.lastName}</div>
          <div className="Text12 mt7">{userData?.rollSelect}</div>
          <div className="R_A_Evenly mt7" style={{ width: "15%" }}>
            {/* <img src={Call} />
              <img src={MailIcon} /> */}
          </div>
        </div>
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
