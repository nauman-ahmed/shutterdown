import React from "react";
import CalenderBar from "../../components/CalenderBar";
import ClientHeader from "../../components/ClientHeader";
import { Outlet } from "react-router-dom";
import FormOptions from "./FormOptions";

const FormOptionsPage = () => {
  return (
    <>
      <div className="main_content">
        <div style={{ width: "100%", padding: "0px 20px" }}>
          <ClientHeader title="Event Options" />
          <div className="Text24Semi alignCenter">Edit Form Options</div>
          <div>
           <FormOptions />
          </div>
        </div>
        {/* <CalenderBar /> */}
      </div>
    </>
  );
};
export default FormOptionsPage;
