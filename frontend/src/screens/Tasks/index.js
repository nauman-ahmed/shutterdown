import React from "react";
import CalenderBar from "../../components/CalenderBar";
import DailyTasks from "./DailyTasks";
import { Outlet } from "react-router-dom";


function Tasks(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
          <Outlet/>
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default Tasks;
