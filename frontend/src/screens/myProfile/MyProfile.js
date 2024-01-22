import React, { useState,useEffect } from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import ProfileHeader from "../../components/ProfileHeader";

const MyProfile = () => {




  return (
    <>
      {/* <Header />
      <SideBar /> */}
      <div className="main_content">
        <ProfileHeader />
        <CalenderBar />
      </div>
    </>
  );
};
export default MyProfile;
