import React from 'react';
import SideBar from '../../components/Sidebar';
import Header from '../../components/Header';
import CalenderBar from '../../components/CalenderBar';
import AttendenceHeader from './AttendenceHeader';
import Logs from './Logs';
import ProfileHeader from '../../components/ProfileHeader';
import WebClock from '../MobileAttendence/WebClock';
import Attendence from './Attendence';
const AttendenceSettings = () => {
  return (
    <>
    <Attendence attendenceSettings={'attendenceSettings'}/>
      {/* <div className="main_content">
        <div style={{ width: '100%' }}>
          <ProfileHeader attendence />
          <AttendenceHeader/>
          <WebClock/>
       
          <Logs />
        </div>
        <CalenderBar Attendence />
      </div> */}
    </>
  );
};
export default AttendenceSettings;
