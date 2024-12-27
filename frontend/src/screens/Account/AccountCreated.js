import React, { useRef, useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/common.css";
import "../../assets/css/Profile.css";
import "../../assets/css/tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import { getAllUserAccountRequestCount, getLastBackupInfo, makeBackup } from "../../API/userApi"
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs"

function AccountCreated() {

  const [requestCount, setRequestCount] = useState(null)
  const [recentBackup, setRecentBackup] = useState(null)
  const navigate = useNavigate();
  const [backingUp, setBackingUp] = useState(false)
  const getUsertAccountRequestCountHandler = async () => {
    const count = await getAllUserAccountRequestCount()
    setRequestCount(count)
  }
  const getRecentBackup = async () => {
    const backup = await getLastBackupInfo()
    setRecentBackup(backup)
  }
  const handleNewBackup = async () => {
    setBackingUp(true)
    const latestBackup = await makeBackup();
    setRecentBackup(latestBackup)
    setBackingUp(false)
  }
  useEffect(() => {
    getUsertAccountRequestCountHandler()
    getRecentBackup()
  }, [])

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "100%"
          }}
        >
          <div>
            Account Requests/Settings
          </div>
          <div
            style={{
              backgroundColor: "#9499f4",
              paddingRight: "15px",
              paddingLeft: "15px",
              paddingTop: "7px",
              paddingBottom: "7px",
              borderRadius: "200px",
            }}
          >
            {requestCount && requestCount}
          </div>
        </div>

      </div>
      <div className="d-flex justify-content-center my-2">
        <div
          style={{
            width: "270px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button onClick={handleNewBackup} style={{ backgroundColor: "#666dff", width: '100px', borderRadius: "6px", color: "white", borderWidth: '0px', height: '40px' }} className="">
            
            {backingUp ? "doing..." : "Backup" }
          </button>
          <span>Last : {dayjs(recentBackup?.date).format('YYYY-MM-DD')}</span>
        </div>
      </div>
    </>
  );
}

export default AccountCreated;

