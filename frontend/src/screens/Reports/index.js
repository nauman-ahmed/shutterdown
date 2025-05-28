import React from "react";
import CalenderBar from "../../components/CalenderBar";
import Reports from "./Reports";
import { Outlet } from "react-router-dom";

function ReportsScreen(props) {
  return (
    <>
    Reports Screen
    <div className="main_content">
      <div className="CalenderViewWidth">
        <Outlet />
      </div>
      <CalenderBar Attendence />
    </div>
  </>
  );
}

export default ReportsScreen;
