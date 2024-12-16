import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ProfileHeader from "../../components/ProfileHeader";
import Cookies from 'js-cookie'
import { useLoggedInUser } from "../../config/zStore";

const MyProfile = () => {
const {userData} = useLoggedInUser()
  return (
    <>
      <div className="main_content"> 
        <ProfileHeader />
        {userData?.rollSelect !== 'Admin' && (
          <CalenderBar />
        )}
      </div>
    </>
  );
};
export default MyProfile;
