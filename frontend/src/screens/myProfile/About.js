import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import "../../assets/css/Profile.css";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { updateUserData } from "../../API/userApi";
import { useLoggedInUser } from "../../config/zStore";


function About() {
  const {userData : stateUser} = useLoggedInUser()
  const [userData, setUserData] = useState(stateUser);
  const [updating, setUpdating] = useState(false);
 

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleUpdateUserData = async (e) => {
    try {
      setUpdating(true);
      e.preventDefault();
      await updateUserData(userData);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.log(error, "error")
    }
  }

  return (
    <div>
      {userData ?
        <>
          <div style={{ width : '95%'}} className="AboutCard">
            <div className="Text16N">About</div>
            <textarea name="about" maxLength={150} placeholder="Add your answer here" value={userData?.about} className="input mt7 Text10N" cols="20" rows="3" onChange={handleChange}></textarea>
            <div className="Text16N mt15">What I love about my job?</div>
            <textarea name="aboutJob" placeholder="Add your answer here" value={userData?.aboutJob} className="input mt7 Text10N" cols="20" rows="3" onChange={handleChange}></textarea>
            <div className="Text16N mt15">My Interests and Hobbies</div>
            <textarea name="interestHobbies" placeholder="Add your answer here" value={userData?.interestHobbies} className="input mt7 Text10N" cols="20" rows="3" onChange={handleChange}></textarea>
          </div>
          <div className="pb-5 mb-3 text-end px-3">
            <Button className="Update_btn btnWidth" onClick={!updating && handleUpdateUserData}>
              {updating ? (
                <div className='w-100'>
                  <div class="smallSpinner mx-auto"></div>
                </div>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </>
        : <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      }
    </div>
  );
}

export default About;
