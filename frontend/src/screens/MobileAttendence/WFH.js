import React from "react";
import "../../assets/css/Profile.css";
import ShiftStart from "../../assets/Profile/ShiftStart.svg";
import ShiftLocate from "../../assets/Profile/ShiftLocate.svg";
import ShiftOut from "../../assets/Profile/ShiftOut.svg";
import GreenCircle from "../../assets/Profile/GreenCircle.svg";
import RedCircle from "../../assets/Profile/RedCircle.svg";

function WFHome(props) {
  return (
    <div className="About_mobile_View" style={{ flexDirection: "column" }}>
      <div className="lineWfh mt40 mb25" />
      <div className="R_A_Evenly">
        <div className="Text8S gray">
          <div>START DATE </div>
          <div className="Text10S mt7 mb8">14 Sep, Wed</div>
          <div>FULL DAY </div>
        </div>
        <div className="WHFDayBox Text10S gray centerAlign">1.0 day</div>
        <div className="Text8S gray">
          <div>START DATE </div>
          <div className="Text10S mt7 mb8">14 Sep, Wed</div>
          <div>FULL DAY </div>
        </div>
      </div>
      <div className="lineWfh mt25" />
      <div
        className="Text8S gray rowalign2 mt25"
        style={{ marginLeft: "25px" }}
      >
        <input type={"checkbox"} style={{ marginRight: "10px" }} /> This is an
        hourly required
      </div>
      <div style={{ width: "85%", marginLeft: "25px" }}>
        <textarea className="forminput h100 alignTop mt25" placeholder="Reason" />
        <div className="Text12 gray mt25">Notify</div>
        <input
          type="text"
          name="name"
          placeholder="Reason"
          className="input2 Text10N"
        />
      </div>
    </div>
  );
}

export default WFHome;
