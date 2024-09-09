import React from "react";
import CalenderBar from "../../components/CalenderBar";
import Logs from "./Logs";

const Attendence = (props) => {
  return (
    <>
      <div className="main_content">
        <div style={{ paddingRight: "10px" }} className="CalenderViewWidth">
          <Logs />
        </div>
        <CalenderBar Attendence />
      </div>

    </>
  );
};
export default Attendence;
