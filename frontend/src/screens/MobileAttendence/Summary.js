import React, { useState } from "react";
import "../../assets/css/Profile.css";
import SummaryOut from "../../assets/Profile/SummaryOut.svg";
import SummaryIn from "../../assets/Profile/SummaryIn.svg";
import WhiteTick from "../../assets/Profile/WhiteTick.svg";
import Next from "../../assets/Profile/Next.svg";

function Summary(props) {
  const [summary, setSummary] = useState(true);
  return (
    <div className="About_mobile_View" style={{ flexDirection: "column" }}>
      <div className="lineWfh mt40" />
      <div
        className="Profile_mobile_View headerBottom mt7"
        style={{ justifyContent: "flex-start" }}
      >
        <div
          className={
            !summary
              ? "Text12 gray ml20 textleft"
              : "Text12 gray selectedHeader2 ml20 textleft"
          }
          onClick={() => setSummary(true)}
        >
          Summary
        </div>
        <div
          className={
            summary
              ? "Text12 gray ml20 textleft"
              : "Text12 gray selectedHeader2 ml20 textleft"
          }
          onClick={() => setSummary(false)}
        >
          Logs
        </div>
      </div>
      <div className="Text14Semi gray mt12 pl20">
        {summary ? "Today" : "This Week"}
      </div>
      <div className="lineWfh" />
      {summary ? (
        <div className="pl20 mt12">
          <div className="Text14Semi black">15th Sep, 2022</div>
          <div className="Text12 gray mt12">11:00 AM- 7:00 PM</div>

          <div className="R_A_Justify">
            <div className="Text10S gray mt12">
              <img src={SummaryIn} style={{ marginRight: "10px" }} />
              11:00 AM
              <br />
              IN
            </div>
            <div className="Text10S gray mt12">
              <img src={SummaryOut} style={{ marginRight: "10px" }} />
              11:00 AM
              <br />
              IN
            </div>
            <div className="Text6S green2" style={{ paddingRight: "20px" }}>
              (8h 0m)
            </div>
          </div>
        </div>
      ) : (
        <div>
          {[1, 2, 3, 4, 5, 6].map(() => (
            <div className="dropBoxattendence R_A_Evenly Text12">
              <div className="">Mon, 15 Sep</div>
              <div className="white webBox">WEB</div>
              <div className="Text12 gray R_A_Evenly" style={{ width: "30%" }}>
                10h 30m
                <div className="greenTick R_A_Justify">
                  <img src={WhiteTick} />
                </div>
                <img src={Next} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
