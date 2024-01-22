import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../assets/css/Calender.css';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../assets/css/Calender.css';
import dayjs from 'dayjs';
import axios from 'axios';

const CalenderModal = (props) => {
  const [show, setShow] = useState(false);
  const handleShow = () => props.setModalShow(true);
  const handleClose = () => props.setModalShow(false);
  // const calenderData=props.calenderEvents.map((data)=>data.map((event)=>event.events.map((event)=>props.specificArray.filter((date)=> date===dayjs(event.dates)))))

  const fetchApi = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('userEmail'));
      const res = axios.get(
        `http://localhost:5001/MyProfile/Calender/View/${props.specificArray}`,
        {
          Headers: {
            Content_Type: 'application/json',
          },
        }
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <>
      { (
        <>
          {/* <button
            variant="primary"
            className="ms-3 bg-danger"
            style={{ borderRadius: '50%' }}
            onClick={handleShow}
          >
            {props.specificArray.length>1&& props.specificArray.length}
          </button> */}
        </>
      )}

      <div>
        <Modal show={props.modalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{new Date().toDateString()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {' '}
            <div>
              <div className="row">
                {props.currentDate?.map((data) => {
                  return (

                    
                    <>
                    {data.events.map((event)=>{

                      return (
                        <>
                          <div className="col-6 mb-3">
                            <div
                              className="calenderEventBox p4 ms-5"
                              style={{ width: '70%' }}
                            >
                              <div className="topbar" />
                              <div
                                className="rowalign2 p4"
                                style={{ width: '100%' }}
                              >
                                {/* <div className="Text10S yel pR3">length:</div> */}
                                {/* <AvatarGroup
                    appearance="stack"
                    data={props.data_}
                    testId={'1'}
                    size="xsmall"
                    maxCount={2}
                  /> */}
                              </div>
                              <div className="rowalign2 p4">
                                <div className="Text10S yel pR3">name: </div>
                                <div className="Text10N white">{data.Bride_Name}</div>
                              </div>
                              <div className="rowalign2 p4">
                                <div className="Text10S yel pR3">Event: </div>
                                <div className="Text10N white">
                                  {event.eventType}
                                </div>
                              </div>
                              <div className="rowalign2 p4">
                                <div className="Text10S yel pR3">
                                  Location :{' '}
                                </div>
                                <div className="Text10N white">
                                  {event.locationSelect}
                                </div>
                              </div>
                              {/* <div
                                className="rowalign2 p4"
                                style={{ width: '100%' }}
                              >
                                <div className="Text10S yel pR3">Team:</div> 
                                 <AvatarGroup
                    appearance="stack"
                    data={props.calenderData}
                    size="xsmall"
                    maxCount={3}
                  /> 
                              </div> */}
                            </div>
                          </div>
                        </>
                      );
                    })}
                     
                    </>
                  );
                })}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {/* <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button> */}
          </Modal.Footer>
        </Modal>
      </div>
      <div className="d-none">
        <Calendar show={show} />
      </div>
    </>
  );
};

export default CalenderModal;
