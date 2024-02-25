import React from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";

const AddClient = () => {
  return (
    <>
      {/* <Header />
      <SideBar /> */}
      <div className="main_content">
        <div style={{ width: "100%", padding: "0px 20px" }}>
          <ClientHeader title="Add Client" />
          <div className="Text24Semi alignCenter">Client Booking Form</div>
          <div>
            <Outlet />
          </div>
        </div>
        <CalenderBar />
      </div>
    </>
  );
};
export default AddClient;
