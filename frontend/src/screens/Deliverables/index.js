import React from "react";
import CalenderBar from "../../components/CalenderBar";
import { Outlet } from "react-router-dom";
import "../../assets/css/Calender.css";

function Deliverables(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidthfull">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Deliverables;
