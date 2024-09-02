import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "../assets/css/common.css";
import "../assets/css/Profile.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";


function CalenderMulti({filterByDates}) {
  
  const today = new Date();

  // Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [currentView, setCurrentView] = useState("month");


  const changeViewHandler = (props) => {
    if(props.view == "month" || props.view == "year")
      setCurrentView(props.view)
  }

  const onChangeHandler = (props) => {
    if(props.view == "month"){
      onFilterChangeHandler(props)
    }
    else if(props.view == "year"){
      onFilterChangeHandler(props)
    }

  }
  
  const onFilterChangeHandler = (props) => {
    if(props.view == "month"){
      const startDate = new Date(props.activeStartDate)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      filterByDates(startDate,endDate,props.view)
    }
    else if(props.view == "year"){
      const startDate = new Date(props.activeStartDate);
      const endDate = new Date(startDate.getFullYear(), 11, 31, 23, 59, 59, 999);

      filterByDates(startDate,endDate,props.view)
    }else{
      filterByDates(props,props,props.view)
    }
  }

  const onDateClickHandler = (props) => {
    onFilterChangeHandler(props)
  }

  return (
    <>
      <Calendar 
        value={selectedDate}
        view={currentView}
        onViewChange = {changeViewHandler}
        onActiveStartDateChange = {onChangeHandler}
        onChange = {onDateClickHandler}
      />
    </>
  );
}

export default CalenderMulti;
