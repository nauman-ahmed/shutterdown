import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";
import Whatsapp from "./Whatsapp";

const WhatsAppPage = () => {
  return (
    <>
      <div className="main_content">
        <div style={{ width: "100%", padding: "0px 20px" }}>
          <ClientHeader title="Event Options" />
          <div className="Text24Semi alignCenter">Edit Whatsapp Text</div>
          <div>
            <Whatsapp />
          </div>
        </div>
        {/* <CalenderBar /> */}
      </div>
    </>
  );
};
export default WhatsAppPage;
