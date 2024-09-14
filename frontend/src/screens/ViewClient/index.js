import React, { useEffect, useState } from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet, useLocation } from "react-router-dom";

const Client = () => {
  const location = useLocation();
  const [inViewClient, setViewClient] = useState(false)

  useEffect(()=>{
    if(location.pathname.startsWith('/MyProfile/Client/ViewClient')){
      setViewClient(true)
    } else {
      setViewClient(false)
    }
  }, [location])
  return (
    <>
      <div className="main_content">
        {/* <div style={location.pathname === "/MyProfile/Client/ViewClient" ? { width: "70%", paddingRight: "20px" }: { width: "100%", paddingRight: "20px" }}> */}
        <div className={`${inViewClient && 'widthViewClient'}`} style={{ paddingRight: "20px", width : !inViewClient && '100%' }}>
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
