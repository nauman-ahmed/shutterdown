import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import CheckLists from "./CheckLists";

function CheckListsPage(props) {
  return (
    <>
      {/* <Header />
      <SideBar /> */}
      <div className="main_content">
        <div className="CalenderViewWidth">
          <ClientHeader  title="CheckLists" />
          <CheckLists />
        </div>
        <CalenderBar Attendence />
      </div>
    </>
  );
}

export default CheckListsPage;
