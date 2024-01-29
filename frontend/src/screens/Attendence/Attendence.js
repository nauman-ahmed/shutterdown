import React from "react";
import CalenderBar from "../../components/CalenderBar";
// import AttendenceHeader from "./AttendenceHeader";
import Logs from "./Logs";
import ProfileHeader from "../../components/ProfileHeader";

const Attendence = (props) => {
  return (
    <>
      {props.attendenceSettings ? (
        <>
          <div className="main_content">
            <div style={{ width: '100%' }}>
              <ProfileHeader attendence />
              {/* <AttendenceHeader attendenceSettings={'attendenceSettings'}   /> */}
            </div>
            <CalenderBar Attendence />
          </div>
        </>
      ) : (
        <>
          <div className="main_content">
            <div style={{ width: '100%' }}>
              {/* <ProfileHeader attendence /> */}
              {/* <AttendenceHeader  /> */}
              <Logs />
            </div>
            <CalenderBar Attendence />
          </div>
        </>
      )}
    </>
  );
};
export default Attendence;
