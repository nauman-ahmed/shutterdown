import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


function RangeCalendarFilter({ startDate, endDate, updateStartDate, updateEndDate, setMonthForData}) {

  const changeViewHandler = (props) => {
    const activeDate = new Date(props.activeStartDate)
    updateStartDate(new Date(activeDate))
    updateEndDate(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0))
    setMonthForData(months[new Date(props.activeStartDate).getMonth()] + " " + new Date(props.activeStartDate).getFullYear())
  }

  const onDateClickHandler = (date) => {
    setMonthForData(months[new Date(date[0]).getMonth()]+ " " + new Date(date[0]).getFullYear())
    updateStartDate(new Date(date[0]))
    updateEndDate(new Date(date[1]))
  }

  return (
    <>
      <Calendar
        selectRange
        value={[new Date(startDate), new Date(endDate)]}
        view={'month'}
        // onViewChange={changeViewHandler}
        // onActiveStartDateChange={changeViewHandler}
        onChange={onDateClickHandler}
      />
    </>
  );
}

export default RangeCalendarFilter;
