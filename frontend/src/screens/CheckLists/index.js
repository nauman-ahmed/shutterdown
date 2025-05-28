import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import CheckLists from "./CheckLists";
import { Outlet } from "react-router-dom";

function CheckListsPage(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
          
          <Outlet />
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default CheckListsPage;
