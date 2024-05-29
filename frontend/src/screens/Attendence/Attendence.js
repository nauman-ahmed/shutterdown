import React from "react";
import CalenderBar from "../../components/CalenderBar";
import Logs from "./Logs";

const Attendence = (props) => {
  return (
    <>
      <div className="main_content">
        <div style={{ width: '100%' }}>
          <Logs />
        </div>
        <CalenderBar Attendence />
      </div>

    </>
  );
};
export default Attendence;
