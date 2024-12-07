import React, { useEffect, useState } from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet, useLocation } from "react-router-dom";

const Client = () => {
  const location = useLocation();
  const [inViewClient, setViewClient] = useState(false);

  useEffect(() => {
    if (location.pathname === "/clients/view-client/all-clients") {
      setViewClient(true);
    } else {
      setViewClient(false);
    }
  }, [location]);
  return (
    <>
      <div className="main_content">
        <div
          className={`${inViewClient && "widthViewClient"}`}
          style={{ paddingRight: "20px", width: !inViewClient && "100%" }}
        >
          <ClientHeader title="View Clients" />
          <div>
            <Outlet />
          </div>
        </div>
        {location.pathname === "/clients/view-client/all-clients" && (
          <CalenderBar />
        )}
      </div>
    </>
  );
};
export default Client;
