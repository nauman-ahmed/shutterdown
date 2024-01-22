import React, { useState } from "react";
import "../../assets/css/Profile.css";
import SummaryOut from "../../assets/Profile/SummaryOut.svg";
import SummaryIn from "../../assets/Profile/SummaryIn.svg";
import WhiteTick from "../../assets/Profile/WhiteTick.svg";
import HoliDaysCalender from "../../assets/Profile/HoliDaysCalender.svg";

function Holidays(props) {
  return (
    <div className="About_mobile_View mt40" style={{ flexDirection: "column" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => (
        <div className="holidaysBox Text14Semi rowalign2">
          <img src={HoliDaysCalender} />
          <div className="pl20">
            <div>New Year’s Day</div>
            <div className="gray">Saturday</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Holidays;
