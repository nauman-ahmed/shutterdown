import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";
import "../../assets/css/Calender.css";

function CalenderView(props) {
  return (
    <>
      <div className="main_content">
        <div style={{ paddingRight: "10px" }} className="CalenderViewWidth">
          <ClientHeader title="Calender View" calender />
          <Outlet />
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default CalenderView;
