import React from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";
import "../../assets/css/Calender.css";

function Deliverables(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
          <ClientHeader filter title="Cinematography" />
          <Outlet />
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default Deliverables;
