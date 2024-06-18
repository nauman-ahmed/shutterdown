import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";
import AccountCreated from "./AccountCreated";

const AddClient = () => {
  return (
    <>
      <div className="main_content">
        <div style={{ width: "100%", padding: "0px 20px" }}>
          <ClientHeader title="Account Settings" />
          <div>
            <Outlet />
          </div> 
        </div>
        {/* <CalenderBar /> */}
      </div>
    </>
  );
};
export default AddClient;
