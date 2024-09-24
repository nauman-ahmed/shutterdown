import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ProfileHeader from "../../components/ProfileHeader";
import Cookies from 'js-cookie'

const MyProfile = () => {
  const currentUser = Cookies.get('currentUser') && JSON.parse(Cookies.get('currentUser'))
  return (
    <>
      <div className="main_content"> 
        <ProfileHeader />
        {currentUser?.rollSelect !== 'Admin' && (
          <CalenderBar />
        )}
      </div>
    </>
  );
};
export default MyProfile;
