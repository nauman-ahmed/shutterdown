import React from "react";
import CalenderBar from "../../components/CalenderBar";
import Team from "./Team";
function TeamScreen(props) {
  return (
    <>
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
