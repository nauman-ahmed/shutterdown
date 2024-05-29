import React from "react";
import CalenderBar from "../../components/CalenderBar";
import DailyTasks from "./DailyTasks";


function Tasks(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
          <DailyTasks />
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default Tasks;
