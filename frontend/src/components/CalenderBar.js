import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import "../assets/css/common.css";
import "../assets/css/Profile.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import "../App.css";
import { Button, Table } from "reactstrap";
import Chat from "../assets/Profile/Chat.svg";
import Heart from "../assets/Profile/Heart.svg";
import { getAllEvents, getEvents, getEventsByMonths } from "../API/Event";
import dayjs from 'dayjs';
import Cookies from "js-cookie";
import { updateAllEvents } from "../redux/eventsSlice";
import moment from 'moment';

function CalenderBar(props) {
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM'));
  const EventsList = useSelector(state => state.allEvents);
  const dispatch = useDispatch()
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [monthEvents, setMonthEvents] = useState()

  const getEventsData = async () => {
    try {
      // const res = await getEvents();

      const res = await getAllEvents();
      if (currentUser.rollSelect === 'Manager') {
        dispatch(updateAllEvents(res?.data));
      } else if (currentUser.rollSelect === 'Shooter' || currentUser.rollSelect === 'Editor') {
        const eventsToShow = res.data?.map(event => {

          if (event?.shootDirectors?.some(director => director._id === currentUser._id)) {
            return { ...event, userRole: 'Shoot Director' };
          } else if (event?.choosenPhotographers.some(photographer => photographer._id === currentUser._id)) {
            return { ...event, userRole: 'Photographer' };
          } else if (event?.choosenCinematographers.some(cinematographer => cinematographer._id === currentUser._id)) {
            return { ...event, userRole: 'Cinematographer' };
          } else if (event?.droneFlyers.some(flyer => flyer._id === currentUser._id)) {
            return { ...event, userRole: 'Drone Flyer' };
          } else if (event?.manager.some(manager => manager._id === currentUser._id)) {
            return { ...event, userRole: 'Manager' };
          } else if (event?.sameDayPhotoMakers.some(photoMaker => photoMaker._id === currentUser._id)) {
            return { ...event, userRole: 'Same Day Photos Maker' };
          } else if (event?.sameDayVideoMakers.some(videoMaker => videoMaker._id === currentUser._id)) {
            return { ...event, userRole: 'Same Day Video Maker' };
          } else if (event?.assistants.some(assistant => assistant._id === currentUser._id)) {
            return { ...event, userRole: 'Assistant' };
          } else {
            return null;
          }
        });
        dispatch(updateAllEvents(eventsToShow));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getEventsData();
  }, [])
  useEffect(() => {
    const eventsCopy = EventsList && [...EventsList];

    // Get the current active year and month from the activeStartDate state
    const currentYear = new Date(activeStartDate).getFullYear();
    const currentMonthIndex = new Date(activeStartDate).getMonth(); // Get the month as a number (0 - 11)

    // Filter events by both month and year
    const filteredMonthEvents = eventsCopy?.filter((event) => {
      const eventDate = new Date(event?.eventDate);
      const eventYear = eventDate.getFullYear();
      const eventMonthIndex = eventDate.getMonth();

      // Check if both year and month match the current active date
      return eventYear === currentYear && eventMonthIndex === currentMonthIndex;
    });

    setMonthEvents(filteredMonthEvents);
  }, [activeStartDate, EventsList]); // Dependency on activeStartDate to detect month or year changes



  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function getCurrentMonthAndYear() {

    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    return `${currentMonth}, ${currentYear}`;
  }

  return (
    <>
      <div className="CalenderComponent mobile_hide_calendar">
        {EventsList ? (
          <>
            <div className="Text20Semi">{getCurrentMonthAndYear()}</div>
            <div className="calendar-container">
              <Calendar
                activeStartDate={activeStartDate}
                tileClassName={({ date }) => {
                  let count = 0;

                  for (let index = 0; index < EventsList?.length; index++) {
                    if (EventsList[index]) {

                      const eventDate = new Date(EventsList[index].eventDate);
                      const calendarDate = new Date(date);

                      // Adjust eventDate to local time for comparison
                      const eventDateLocal = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                      const calendarDateLocal = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());

                      // Compare only the year, month, and date part
                      if (eventDateLocal.getTime() === calendarDateLocal.getTime()) {
                        count += 1;
                      }
                    }
                  }

                  if (count === 1) {
                    return "highlight5";
                  } else if (count === 2) {
                    return "highlight3";
                  } else if (count >= 3) {
                    return "highlight1";
                  }
                }}
                onChange={() => null}
                onActiveStartDateChange={({ activeStartDate }) => {
                  setActiveStartDate(activeStartDate);
                  setCurrentMonth(moment(activeStartDate).format('MMMM'));
                }}
              />

            </div>
            {props.Attendence && (
              <div className="summaryBox">
                <div className="R_A_Justify1">
                  <Button
                    className="submit_btn submit summary"
                    style={{ marginRight: '10px' }}
                  >
                    Summary
                  </Button>
                  <div>
                    <Button
                      className="mx-1 mt-1"
                      onClick={() => {
                        const newDate = new Date(activeStartDate.setMonth(activeStartDate.getMonth() - 1));
                        setActiveStartDate(new Date(newDate));
                        setCurrentMonth(moment(newDate).format('MMMM'));
                      }}
                    >
                      {"<"}
                    </Button>
                    <Button
                      className="mx-1 mt-1"
                      onClick={() => {
                        const newDate = new Date(activeStartDate.setMonth(activeStartDate.getMonth() + 1));
                        setActiveStartDate(new Date(newDate));
                        setCurrentMonth(moment(newDate).format('MMMM'));
                      }}
                    >
                      {">"}
                    </Button>
                  </div>
                  {/* <img alt="" src={Chat} style={{ marginRight: '15px' }} /> */}
                </div>
                <Table
                  // bordered
                  hover
                  striped
                  responsive
                  style={{ marginTop: '15px' }}
                >
                  <thead>
                    <tr className="Text10S gray3 alignTop">
                      <th style={{ fontSize: "smaller", textAlign: "center" }}>Date</th>
                      <th style={{ fontSize: "smaller", textAlign: "center" }}>Couple </th>
                      <th style={{ fontSize: "smaller", textAlign: "center" }}>Location</th>
                      <th style={{ fontSize: "smaller", textAlign: "center" }}>Photographer: Cinematographer</th>
                    </tr>
                  </thead>
                  <tbody className="Text10S alignCenter">
                    {monthEvents && monthEvents?.map((event, i) => (
                      <>
                        {event && (
                          <tr>
                            <td
                              className="primary2"
                              style={{ paddingTop: '15px', paddingBottom: '15px' }}
                            >
                              {dayjs(event?.eventDate).format('DD-MMM-YYYY')}
                            </td>
                            <td
                              className="primary2"
                              style={{ paddingTop: '15px', paddingBottom: '15px' }}
                            >
                              {event?.client?.brideName}
                              <br />
                              <img alt="" src={Heart} />
                              <br />
                              {event?.client?.groomName}
                            </td>
                            <td
                              className="green"
                              style={{ paddingTop: '15px', paddingBottom: '15px' }}
                            >
                              {event?.location}
                            </td>
                            <td
                              className="primary2"
                              style={{ paddingTop: '15px', paddingBottom: '15px' }}
                            >
                              ({event?.photographers},{event?.cinematographers})
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        ) : (
          <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
            <div class="spinner"></div>
          </div>
        )}
      </div>
    </>
  );
}

export default CalenderBar;
