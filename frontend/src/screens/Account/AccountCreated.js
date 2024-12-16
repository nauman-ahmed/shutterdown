import React, { useRef, useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/common.css";
import "../../assets/css/Profile.css";
import "../../assets/css/tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import { getAllUserAccountRequestCount } from "../../API/userApi"
import { useNavigate } from 'react-router-dom';

function AccountCreated() {

  const [requestCount, setRequestCount] = useState(null)
  const navigate = useNavigate();

  const getUsertAccountRequestCountHandler = async () => {
    const count = await getAllUserAccountRequestCount()
    setRequestCount(count)
  }

  useEffect(() => {
    getUsertAccountRequestCountHandler()
  },[])
 
  const navigationHandler = () => {
    navigate('/admin/accounts/users');
  }

  return (
    <>
      <div
        style={{
          width: "270px",
          height: "150px",
          backgroundColor: "#666dff",
          margin: "auto",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white",
          padding: "0px 12px",
        }}
        onClick={navigationHandler}
      >
        <div
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-evenly",
            width:"100%"
          }}
        >
          <div>
            Account Requests/Settings
          </div>
          <div
            style={{
              backgroundColor:"#9499f4",
              paddingRight:"15px",
              paddingLeft:"15px",
              paddingTop:"7px",
              paddingBottom:"7px",
              borderRadius:"200px",
            }}
          >
            {requestCount && requestCount}
          </div>
        </div>

      </div>
    </>
  );
}

export default AccountCreated;

