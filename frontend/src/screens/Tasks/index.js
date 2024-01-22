import React,{useEffect} from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";
import axios from "axios";
import DailyTasks from "./DailyTasks";
function Tasks(props) {
 
  return (
    <>
      {/* <Header />
      <SideBar /> */}
      <div className="main_content">
        <div className="CalenderViewWidth">
          {/* <ClientHeader filter title="Daily Tasks" /> */}
          <DailyTasks/>
          {/* <Outlet hello={'hello'}/> */}
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default Tasks;
