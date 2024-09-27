import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "../assets/css/common.css";
import "../assets/css/Profile.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']


function CalenderMultiListView({  setMonthForData, setYearForData, setDateForFilter, setShow, dateForFilter, monthForData, yearForData }) {
  console.log(dateForFilter);
  console.log(monthForData);
  console.log(yearForData);
  
  const today = new Date();

  // Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [currentView, setCurrentView] = useState("month");


  const changeViewHandler = (props) => {
    setMonthForData(months[new Date(props.activeStartDate).getMonth()])
    setYearForData(new Date(props.activeStartDate).getFullYear())
  }

  const onDateClickHandler = (date) => {
    setShow(false)
   setDateForFilter(new Date(date))
  }

  return (
    <>
      <Calendar
      
        value={dateForFilter ? dateForFilter : new Date(yearForData, months.indexOf(monthForData), 1) }
        view={'month'}
        onViewChange={changeViewHandler}
        onActiveStartDateChange={changeViewHandler}
        onChange={onDateClickHandler}
      />
    </>
  );
}

export default CalenderMultiListView;
