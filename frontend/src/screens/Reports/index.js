import React from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import Reports from "./Reports";
function ReportsScreen(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
          <Reports />
        </div>
        <CalenderBar />
      </div>
    </>
  );
}

export default ReportsScreen;
