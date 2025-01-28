import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../assets/css/Calender.css";
import "../../assets/css/Calender.css";
import * as bootstrap from "bootstrap";
import { getAllEvents } from "../../API/Event";
import Cookies from "js-cookie";
import ClientHeader from "../../components/ClientHeader";
import { FaDirections } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useLoggedInUser } from "../../config/zStore";
import { useSelector } from "react-redux";
import { IoIosWarning } from "react-icons/io";

function Calender() {
  const poperReferencd = useRef(null);
  const [allEvents, setAllEvents] = useState(null);
  const { userData: currentUser } = useLoggedInUser();
  const navigate = useNavigate();
  const EventsList = useSelector((state) => state.allEvents);
  const getEventsData = async () => {
    try {
      // const res = await getAllEvents();
      const res = { data: EventsList }
      let eventsToShow;
      if (currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === 'Production Manager') {
        eventsToShow = res.data;
      } else if (currentUser?.rollSelect === "Shooter" || currentUser?.rollSelect === "Editor") {
        eventsToShow = res.data.map((event) => {
          if (
            event?.shootDirectors.some(
              (director) => director._id === currentUser?._id
            )
          ) {
            return { ...event, userRole: "Shoot Director" };
          } else if (
            event?.choosenPhotographers.some(
              (photographer) => photographer._id === currentUser?._id
            )
          ) {
            return { ...event, userRole: "Photographer" };
          } else if (
            event?.choosenCinematographers.some(
              (cinematographer) => cinematographer._id === currentUser?._id
            )
          ) {
            return { ...event, userRole: "Cinematographer" };
          } else if (
            event?.droneFlyers.some((flyer) => flyer._id === currentUser?._id)
          ) {
            return { ...event, userRole: "Drone Flyer" };
          } else if (
            event?.manager.some((manager) => manager._id === currentUser?._id)
          ) {
            return { ...event, userRole: "Manager" };
          } else if (
            event?.sameDayPhotoMakers.some(
              (photoMaker) => photoMaker._id === currentUser?._id
            )
          ) {
            return { ...event, userRole: "Same Day Photos Maker" };
          } else if (
            event?.sameDayVideoMakers.some(
              (videoMaker) => videoMaker._id === currentUser?._id
            )
          ) {
            return { ...event, userRole: "Same Day Video Maker" };
          } else if (
            event?.assistants.some(
              (assistant) => assistant._id === currentUser?._id
            )
          ) {
            return { ...event, userRole: "Assistant" };
          } else {
            return null;
          }
        });
      }

      setAllEvents(
        eventsToShow?.map((eventInfo) => {
          if (eventInfo) {
            const eventType = eventInfo.eventType;
            const date = dayjs(new Date(eventInfo.eventDate)).format(
              "YYYY-MM-DD"
            );
            return {
              ...eventInfo,
              title: ` • ${eventType}`,
              date,
              allDay: true,
            };
          } else {
            return {};
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEventsData();
  }, []);

  return (
    <>
      <ClientHeader title="Calendar View" calender />
      <div style={{ width: "100%", overflowX: "scroll" }}>
        {allEvents ? (
          <div style={{ minWidth: "600px" }}>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                listPlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
              defaultView="basicWeek"
              eventContent={(eventInfo) => {
                console.log(eventInfo);
                let errorText = "";
                if (currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") {
                  if (
                    Number(eventInfo.event?.extendedProps?.sameDayVideoEditors) > 0 &&
                    (!eventInfo.event?.extendedProps?.sameDayVideoMakers ||
                      eventInfo.event?.extendedProps?.sameDayVideoMakers.length !=
                      Number(eventInfo.event?.extendedProps.sameDayVideoEditors))
                  ) {
                    errorText += "Same Day Video Maker(s) are incomplete, \n";
                  }

                  if (
                    Number(eventInfo.event?.extendedProps?.sameDayPhotoEditors) > 0 &&
                    (!eventInfo.event?.extendedProps?.sameDayPhotoMakers ||
                      eventInfo.event?.extendedProps?.sameDayPhotoMakers.length !==
                      Number(eventInfo.event?.extendedProps.sameDayPhotoEditors))
                  ) {
                    errorText += "Same Day Photo Maker(s) are incomplete, \n";
                  }

                  if (
                    Number(eventInfo.event?.extendedProps?.cinematographers) > 0 &&
                    (!eventInfo.event?.extendedProps?.choosenCinematographers ||
                      eventInfo.event?.extendedProps?.choosenCinematographers?.length !==
                      Number(eventInfo.event?.extendedProps?.cinematographers))
                  ) {
                    errorText += "Cinematographer(s) are incomplete, \n";
                  }

                  if (
                    Number(eventInfo.event?.extendedProps?.drones) > 0 &&
                    (!eventInfo.event?.extendedProps?.droneFlyers ||
                      eventInfo.event?.extendedProps?.droneFlyers.length !== Number(eventInfo.event?.extendedProps.drones))
                  ) {
                    errorText += "Drone Flyer(s) are not complete, \n";
                  }

                  if (!eventInfo.event?.extendedProps?.manager || eventInfo.event?.extendedProps?.manager.length !== 1) {
                    errorText += "Manager(s) are incomplete, \n";
                  }

                  if (
                    Number(eventInfo.event?.extendedProps?.photographers) > 0 &&
                    (!eventInfo.event?.extendedProps?.choosenPhotographers ||
                      eventInfo.event?.extendedProps?.choosenPhotographers.length !==
                      Number(eventInfo.event?.extendedProps?.photographers))
                  ) {
                    errorText += "Photographer(s) are incomplete, \n";
                  }

                  if (
                    Number(eventInfo.event?.extendedProps?.shootDirector) > 0 &&
                    (!eventInfo.event?.extendedProps?.shootDirectors ||
                      eventInfo.event?.extendedProps?.shootDirectors.length !==
                      Number(eventInfo.event?.extendedProps?.shootDirector))
                  ) {
                    errorText += "Shoot Director(s) are incomplete. \n";
                  }
                }

                return (
                  <div className="d-block" style={{ cursor: "pointer" }}>
                    <div className="rowalign2 p4 ">
                      <div className="Text10N white ">
                       
                        {errorText.length > 0 ? (
                          <IoIosWarning
                          style={{fontSize : '18px'}}
                            className=" text-danger"
                          />
                        ) : (
                          <FaDirections color="black" style={{fontSize : '15px'}} />
                        )}
                      </div>
                      <div
                        className={
                          // eventInfo.event?.extendedProps.allDataCompleted
                          //   ? "Text10N p-1 calenderEventBox"
                          // :
                          "Text10N p-1 calenderEventBoxYellow"
                        }
                        style={{
                          marginLeft: "5px",
                          width: "100%",
                          overflow: "auto",
                          backgroundColor: eventInfo.event?.extendedProps.client.bookingStatus !== "Yes" ? "#ff4242" : eventInfo.event?.extendedProps.isWedding ? "#4aff4a" : eventInfo.event?.extendedProps.eventType === 'Pre-Wedding' ? "#6663ff" : "#fcfc58",
                          color: (eventInfo.event?.extendedProps.client.bookingStatus !== "Yes" || eventInfo.event?.extendedProps.eventType === 'Pre-Wedding') ? "white" : "black"
                        }}
                      >
                        {" "}
                        • {
                          eventInfo.event?.extendedProps.client?.brideName
                        } X {eventInfo.event?.extendedProps.client?.groomName}
                      </div>
                    </div>
                  </div>
                );
              }}
              slotDuration="24:00:00"
              views={{
                timeGridWeek: {
                  slotDuration: "24:00:00",
                },
                timeGridDay: {
                  slotDuration: "24:00:00",
                },
              }}
              initialView="dayGridMonth"
              initialDate={new Date().toISOString().slice(0, 10)}
              dayHeaderClassNames={"dayFormat"}
              events={allEvents}
              displayEventTime={false}
              eventDisplay="block"
              eventClick={(info) => {
                if (poperReferencd.current) {
                  poperReferencd.current.hide();
                }
                navigate(
                  "/calendar/list-view/client/" +
                  info.event?.extendedProps.client._id
                );
              }}
              eventMouseEnter={(info) => {
                if (poperReferencd.current) {
                  poperReferencd.current.disable();
                }
                const pop = new bootstrap.Popover(info.el, {
                  title: info.event?._def.extendedProps.eventType,
                  placement: "auto",
                  trigger: "hover",
                  customClass: "popoverStyle",
                  html: true,
                  content: `
              <div class="popover-custom-content">
                <div class="rowalign px-auto mb-2 weds">
                  <div className="col-12">${info.event?.extendedProps.client?.brideName} X  ${info.event?.extendedProps.client?.groomName}</div>
                </div>
                <div class="rowalign">
                  <div >Photographers : </div>
                    <div class="px-1">
                     ${info.event?.extendedProps.photographers}
                    </div>  
                </div>
                <div class="rowalign">
                  <div >Cinematographers : </div>
                    <div class="px-1">
                     ${info.event?.extendedProps.cinematographers}
                    </div>  
                </div>
                <div class="rowalign">
                  <div >Drone flyers : </div>
                    <div class="px-1">
                     ${info.event?.extendedProps.drones}
                    </div>  
                </div>
                <div class="rowalign">
                  <div class="wedHead">Event Location : </div>
                    <div class="px-1">
                     ${info.event?.extendedProps.location}
                    </div>  
                </div>
              </div>
            `,
                });
                poperReferencd.current = pop;
                pop.show();
              }}
              eventMouseLeave={(info) => {
                poperReferencd.current.disable();
              }}
              headerToolbar={{
                start: "prev,next today", // will normally be on the left. if RTL, will be on the right
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
              }}
            />
          </div>
        ) : (
          <div
            style={{ height: "400px" }}
            className="d-flex justify-content-center align-items-center"
          >
            <div class="spinner"></div>
          </div>
        )}
      </div>
    </>
  );
}

export default Calender;
