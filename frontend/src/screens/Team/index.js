import React from "react";
import SideBar from "../../components/Sidebar";
import Header from "../../components/Header";
import CalenderBar from "../../components/CalenderBar";
import Team from "./Team";
function TeamScreen(props) {
  return (
    <>
      {/* <Header />
      <SideBar /> */}
      <div className="main_content">
        <div className="CalenderViewWidth">
          <Team />
        </div>
        <CalenderBar />
      </div>
    </>
  );
}

export default TeamScreen;
