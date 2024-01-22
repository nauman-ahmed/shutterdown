import React, { useState, useEffect } from "react";
import "../assets/css/common.css";
import "../assets/css/Profile.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import "../App.css";
import { Button, Table } from "reactstrap";
import Chat from "../assets/Profile/Chat.svg";
import Heart from "../assets/Profile/Heart.svg";
import { getEvents } from "../API/Event";
import dayjs from 'dayjs';
import Cookies from "js-cookie";

function CalenderBar(props) {
  const [EventsList, setEventsList] = useState([]);
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const getEventsData = async () => {
    try {
      const res = await getEvents();
      if (currentUser.rollSelect == 'Manager') {
        setEventsList(res.data);
      } else if (currentUser.rollSelect == 'Shooter') {
        const eventsToShow = res.data.map(event => {
          if (event?.shootDirector.some(director => director._id == currentUser._id)) {
            return { ...event, userRole: 'Shoot Director' };
          } else if (event?.choosenPhotographers.some(photographer => photographer._id == currentUser._id)) {
            return { ...event, userRole: 'Photographer' };
          } else if (event?.choosenCinematographers.some(cinematographer => cinematographer._id == currentUser._id)) {
            return { ...event, userRole: 'Cinematographer' };
          } else if (event?.droneFlyers.some(flyer => flyer._id == currentUser._id)) {
            return { ...event, userRole: 'Drone Flyer' };
          } else if (event?.manager.some(manager => manager._id == currentUser._id)) {
            return { ...event, userRole: 'Manager' };
          } else if (event?.sameDayPhotoMakers.some(photoMaker => photoMaker._id == currentUser._id)) {
            return { ...event, userRole: 'Same Day Photos Maker' };
          } else if (event?.sameDayVideoMakers.some(videoMaker => videoMaker._id == currentUser._id)) {
            return { ...event, userRole: 'Same Day Video Maker' };
          } else if (event?.assistants.some(assistant => assistant._id == currentUser._id)) {
            return { ...event, userRole: 'Assistant' };
          } else {
            return null;
          }
        });
        setEventsList(eventsToShow);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getEventsData();
  }, [])

  function getCurrentMonthAndYear() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    return `${currentMonth}, ${currentYear}`;
  }

  return (
    <>
      <div className="CalenderComponent mobile_hide_calendar">
        <div className="Text20Semi">{getCurrentMonthAndYear()}</div>
        <div className="calendar-container">
          <Calendar
            tileClassName={({ date }) => {
              let count = 0
              for (let index = 0; index < EventsList.length; index++) {
                if (EventsList[index]) {

                  const initialDate = new Date(EventsList[index].eventDate)
                  const targetDate = new Date(date);

                  const initialDatePart = initialDate.toISOString().split("T")[0];
                  const targetDatePart = targetDate.toISOString().split("T")[0];

                  if (initialDatePart === targetDatePart) {
                    count += 1
                  }
                }
              }

              if (count == 1) {
                return "highlight5"
              } else if (count == 2) {
                return "highlight3"
              }
              else if (count >= 3) {
                return "highlight1"
              }


            }}
            onChange={() => null}
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
              <img src={Chat} style={{ marginRight: '15px' }} />
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
                  <th>Date</th>
                  <th>Couple </th>
                  <th>Location</th>
                  <th>Photographer: Cinematographer</th>
                </tr>
              </thead>
              <tbody className="Text10S alignCenter">
                {EventsList.map((event, i) => (
                  <>
                    {event && (
                      <tr>
                        <td
                          className="primary2"
                          style={{ paddingTop: '15px', paddingBottom: '15px' }}
                        >
                          {dayjs(event?.eventDate).format('DD-MM-YYYY')}
                        </td>
                        <td
                          className="primary2"
                          style={{ paddingTop: '15px', paddingBottom: '15px' }}
                        >
                          {event?.client?.brideName}
                          <br />
                          <img src={Heart} />
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
      </div>
      {/* <div style={{ display: 'none' }}>
        <ClientHeader getCalenderData={getCalenderData} />
      </div> */}
    </>
  );
}

export default CalenderBar;
