import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";

const AddClient = () => {
  return (
    <>
      <div className="main_content">
        <div style={{ paddingRight: "10px" }} className="CalenderViewWidth">
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
