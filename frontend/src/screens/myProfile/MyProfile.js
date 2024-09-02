import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ProfileHeader from "../../components/ProfileHeader";

const MyProfile = () => {
  return (
    <>
      <div className="main_content"> 
        <ProfileHeader />
        <CalenderBar />
      </div>
    </>
  );
};
export default MyProfile;
