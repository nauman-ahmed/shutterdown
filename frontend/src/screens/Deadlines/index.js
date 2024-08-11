import React from "react";

import { Outlet } from "react-router-dom";
import DeadlineDays from "./DeadlineDays";
import ClientHeader from "../../components/ClientHeader";

const DeliverablesDeadline = () => {
  return (
    <>
      <div className="main_content">
        <div style={{ width: "100%", padding: "0px 20px" }}>
          <ClientHeader title="Deadline Days" />
          <div className="Text24Semi alignCenter">
            Set Deliverables Deadlines
          </div>
          <div>
            <DeadlineDays />
          </div>
        </div>
        {/* <CalenderBar /> */}
      </div>
    </>
  );
};
export default DeliverablesDeadline;
