import React from "react";
import CalenderBar from "../../components/CalenderBar";
import { Outlet } from "react-router-dom";
import "../../assets/css/Calender.css";

function CalenderView() {
  return (
    <>
      <div className="main_content">
        <div style={{ paddingRight: "10px" }} className="CalenderViewWidth">
          <Outlet  />
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default CalenderView;
