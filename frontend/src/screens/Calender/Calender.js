import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../assets/css/Calender.css';
import '../../assets/css/Calender.css';
import * as bootstrap from "bootstrap"
import { getEvents } from '../../API/Event';
import Cookies from 'js-cookie';

function Calender() {

  const poperReferencd = useRef(null);
  const [allEvents, setAllEvents] = useState(null);
  const currentUser = JSON.parse(Cookies.get('currentUser'))
  const getEventsData = async () => {
    try {
      const res = await getEvents();
      let eventsToShow;
      if (currentUser.rollSelect == 'Manager') {
        eventsToShow = res.data;
      } else if (currentUser.rollSelect == 'Shooter') {
        eventsToShow = res.data.map(event => {
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
      }

      setAllEvents(eventsToShow.map(eventInfo => {
        if (eventInfo) {
          const eventType = eventInfo.eventType;
          const date = eventInfo.eventDate;
          return { ...eventInfo, title: ` • ${eventType}`, date, allDay: true }
        } else {
          return {}
        }
      }))
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEventsData();
  }, []);

  return (
    <>
      <div>
        {allEvents ? (
          <FullCalendar
            plugins={[
              dayGridPlugin,
              listPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            defaultView='basicWeek'
            eventContent={(eventInfo) => {
              return (
                <div className="calenderEventBox d-block">
                  <div className="rowalign2 p4" style={{ width: '100%' }}>
                    <div className="Text10N white"> • {eventInfo.event?.extendedProps.eventType}</div>
                  </div>
                </div>
              )
            }}
            slotDuration='24:00:00'
            views={{
              timeGridWeek: {
                slotDuration: '24:00:00'
              },
              timeGridDay: {
                slotDuration: '24:00:00'
              }
            }}
            initialView="dayGridMonth"
            initialDate={new Date().toISOString().slice(0, 10)}
            dayHeaderClassNames={'dayFormat'}
            events={allEvents}
            displayEventTime={false}
            eventDisplay='block'
            eventMouseEnter={(info) => {
              const pop = new bootstrap.Popover(info.el, {
                title: info.event?._def.extendedProps.eventType,
                placement: "auto",
                trigger: "hover",
                customClass: "popoverStyle",
                html: true,
                content: `
              <div class="popover-custom-content">
                <div class="rowalign px-auto mb-2 weds">
                  <div className="col-12">${info.event?.extendedProps.client?.groomName} weds  ${info.event?.extendedProps.client?.brideName}</div>
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
            `
              })
              poperReferencd.current = pop
              pop.show()
            }}
            eventMouseLeave={(info) => {
              poperReferencd.current.disable()
            }}
            headerToolbar={{
              start: 'prev,next today', // will normally be on the left. if RTL, will be on the right
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay', // will normally be on the right. if RTL, will be on the left
            }}
          />
        ) : (
          <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
            <div class="spinner"></div>
          </div>
        )}

      </div>
    </>
  );
}

export default Calender;
