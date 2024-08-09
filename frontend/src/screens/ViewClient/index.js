import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet, useLocation } from "react-router-dom";

const Client = () => {
  const location = useLocation();
  return (
    <>
      <div className="main_content">
        <div style={location.pathname === "/MyProfile/Client/ViewClient" ? { width: "70%", paddingRight: "20px" }: { width: "100%", paddingRight: "20px" }}>
          <ClientHeader  title="View Clients"  />
          <div>
            <Outlet />
          </div>
        </div>
        {location.pathname === "/MyProfile/Client/ViewClient" && <CalenderBar />}
      </div>
    </>
  );
};
export default Client;
