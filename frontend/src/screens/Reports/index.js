import React from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import Reports from "./Reports";
import ClientHeader from '../../components/ClientHeader'

function ReportsScreen(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
        <ClientHeader title="Reports" />
          <Reports />
        </div>
        <CalenderBar />
      </div>
    </>
  );
}

export default ReportsScreen;
