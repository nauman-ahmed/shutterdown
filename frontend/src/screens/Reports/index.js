import React from "react";
import CalenderBar from "../../components/CalenderBar";
import Reports from "./Reports";

function ReportsScreen(props) {
  return (
    <>
      <div className="main_content">
        <div className="CalenderViewWidth">
        
          <Reports />
        </div>
        <CalenderBar />
      </div>
    </>
  );
}

export default ReportsScreen;
