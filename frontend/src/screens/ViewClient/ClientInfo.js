import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import dayjs from "dayjs";
import { getClientById } from "../../API/Client";
import Calendar from "react-calendar";
import CalenderImg from "../../assets/Profile/Calender.svg";
import Select from "react-select";
import { addEvent, deleteEvent, getEvents, updateEventData } from "../../API/Event";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateAllEvents } from "../../redux/eventsSlice";
import { FaEdit } from "react-icons/fa";
import { getAllEventOptions, updateAllEventOptions } from "../../API/FormEventOptionsAPI";

function ClientInfo() {
  const [clientData, setClientData] = useState(null);
  const { clientId } = useParams();
  const [newEventModel, setNewEventModel] = useState(false);
  const [editEventModel, setEditEventModel] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [newEvent, setNewEvent] = useState({ client: clientId });
  const [showCalender, setShowCalender] = useState(false);
  const [allEvents, setAllEvents] = useState(null);
  const [eventOptionsKeyValues, setEventOptionsKeyValues] = useState(null);
  const eventOptionObjectKeys = ["travelBy", "shootDirector", "photographers", "cinematographers", "drones", "sameDayPhotoEditors", "sameDayVideoEditors"]
  
  const dispatch = useDispatch();
  const getStoredEvents = async () => {
    const storedEvents = await getEvents();
    setAllEvents(storedEvents?.data);
    dispatch(updateAllEvents(storedEvents?.data));
  };

  const target = useRef(null);

  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();

    setEventOptionsKeyValues(eventOptions)
  }

  useEffect(() => {
    getIdData();
    getStoredEvents();
    getAllFormOptionsHandler()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let travelByOptions = [
    {
      value: "By Car",
      label: "By Car",
    },
    {
      value: "By Bus",
      label: "By Bus",
    },
    {
      value: "By Air",
      label: "By Air",
    },
    {
      value: "N/A",
      label: "N/A",
    },
  ];
  let numberOptions = [
    {
      value: "1",
      label: "1",
    },
    {
      value: "2",
      label: "2",
    },
    {
      value: "3",
      label: "3",
    },
  ];
  let yesNoOptions = [
    {
      value: "Yes",
      label: "Yes",
    },
    {
      value: "No",
      label: "NO",
    },
  ];
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected ? "rgb(102, 109, 255)" : "#EFF0F5",
    }),
    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "#EFF0F5",
      padding: "2px",
      border: "none",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };
  const getIdData = async () => {
    try {
      const res = await getClientById(clientId);
      setClientData(res);
    } catch (error) {
      console.log(error);
    }
  };
  const updateNewEvent = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };
  const updateEventToEdit = (e) => {
    setEventToEdit({ ...eventToEdit, [e.target.name]: e.target.value });
  };
  const addNewEvent = async () => {
    try {
      await addEvent(newEvent);
      setNewEvent({ client: clientId });
      setNewEventModel(false);
      window.notify("Event added successfully!", "success");
      getIdData();
      getStoredEvents();
    } catch (error) {
      console.log(error);
    }
  };
  const updateEvent = async () => {
    try {
      await updateEventData(eventToEdit);
      setEventToEdit(null)
      setEditEventModel(false);
      getIdData();
      getStoredEvents();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Table bordered hover responsive>
        <thead>
          <tr
            className="logsHeader Text16N1"
            style={{ background: "#EFF0F5", borderWidth: "1px !important" }}
          >
            <th>Client</th>
            <th>Phone Number</th>
            <th>Albums</th>
            <th>Pre-Wedding Photos</th>
            <th>Pre-Wedding Videos</th>
            <th>HDDs</th>
            <th>Long Films</th>
            <th>Reels</th>
            <th>Promo</th>
            <th>Payment Status</th>
            <th>Client Suggestion</th>
          </tr>
        </thead>
        <tbody
          className="Text12 primary2"
          style={{
            textAlign: "center",
            borderWidth: "0px 1px 0px 1px",
          }}
        >
          <tr>
            <td
              style={{
                fontSize: "12px",
                paddingTop: "15px",
                paddingBottom: "15px",
              }}
              className="tableBody Text14Semi primary2 fs-6"
            >
              {clientData?.brideName}
              <br />
              <img alt="" src={Heart} />
              <br />
              {clientData?.groomName}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">+{clientData?.phoneNumber}</td>
           
            <td className="textPrimary fs-6 tablePlaceContent">
              {clientData?.albums?.map((val, i) => (
                <div>
                  {i + 1} : {val}
                  <br />
                </div>
              ))}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">
              {clientData?.preWeddingPhotos ? "Yes" : "No"}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">
              {clientData?.preWeddingVideos ? "Yes" : "No"}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.hardDrives}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.longFilms}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.reels}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.promos}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.paymentStatus}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.suggestion}</td>
          </tr>
        </tbody>
      </Table>
      <div className="clientBtn d-flex flex-row justify-content-between">
        <h3 className=" my-1 py-1 Text24Semi d-sm-none d-md-block">Events</h3>
        <div>
          <button
            onClick={() => setNewEventModel(true)}
            className="btn btn-primary"
            style={{ backgroundColor : '#666DFF'}} 
          >
            Add Event
          </button>
        </div>
      </div>
      <Table bordered hover responsive>
        <thead>
          <tr
            className="logsHeader Text16N1"
            style={{ background: "#EFF0F5", borderWidth: "1px !important" }}
          >
            <th>Event Date</th>
            <th>Event Type</th>
            <th>Location</th>
            <th>Travel By</th>
            <th>Photographers</th>
            <th>Cinematographers</th>
            <th>Drones</th>
            <th>Same Day Photo Editors</th>
            <th>Same Day Video Editors</th>
            {/* <th>Tentative</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody
          className="Text12 primary2"
          style={{
            textAlign: "center",
            borderWidth: "0px 1px 0px 1px",
            // background: "#EFF0F5",
          }}
        >
          {clientData?.events?.map((event, i) => {
            return (
              <tr>
                <td className="textPrimary fs-6">
                  {dayjs(event.eventDate).format("DD-MMM-YYYY")}
                </td>
                <td className="textPrimary fs-6">{event?.eventType}</td>
                <td className="textPrimary fs-6">{event.location}</td>
                <td className="textPrimary fs-6">{event?.travelBy}</td>
                <td className="textPrimary fs-6">{event?.photographers}</td>
                <td className="textPrimary fs-6">{event?.cinematographers}</td>
                <td className="textPrimary fs-6">{event?.drones}</td>
                <td className="textPrimary fs-6">
                  {event?.sameDayPhotoEditors}
                </td>
                <td className="textPrimary fs-6">
                  {event?.sameDayVideoEditors}
                </td>
                {/* <td className="textPrimary fs-6">{event?.tentative}</td> */}
                <td className=" textPrimary fs-6">
                <div className="d-flex flex-row align-items-center gap-2">

                
                  <FaEdit className="fs-5 cursor-pointer"
                    onClick={() => {
                      setEventToEdit(event);
                      setEditEventModel(true);
                    }}
                  />
                  <MdDelete
                    onClick={async () => {
                      await deleteEvent(event._id);
                      getIdData();
                      getStoredEvents();
                    }}
                    className="text-danger cursor-pointer fs-3"
                  />
                </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal isOpen={newEventModel} centered={true} size="lg" fullscreen="md">
        <ModalHeader>Event Details</ModalHeader>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (newEvent.eventDate === "" || !newEvent.eventDate) {
              window.notify("Please set event Date!", "error");
              return;
            }
            addNewEvent();
          }} 
        >
          <ModalBody>
            <Row ref={target}>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Event Date</div>
                <div
                  className={`ContactModel d-flex justify-content-between textPrimary`}
                  onClick={() => setShowCalender(!showCalender)}
                  style={{ cursor: "pointer" }}
                >
                  {newEvent?.eventDate
                    ? dayjs(newEvent?.eventDate).format("DD-MMM-YYYY")
                    : "Date"}
                  <img alt="" src={CalenderImg} />
                </div>
                {showCalender && (
                  <div
                    style={{
                      zIndex: "5",
                      width: "300px"
                    }}
                    className="position-absolute"
                  >
                    <Calendar
                      minDate={new Date(Date.now())}
                      CalenderPress={() => setShowCalender(false)}
                      onClickDay={(date) => {
                        setShowCalender(!showCalender);
                        setNewEvent({ ...newEvent, eventDate: date });
                      }}
                      tileClassName={({ date }) => {
                        let count = 0;
                        for (
                          let index = 0;
                          index < allEvents?.length;
                          index++
                        ) {
                          const initialDate = new Date(
                            allEvents[index].eventDate
                          );
                          const targetDate = new Date(date);
                          const initialDatePart = initialDate
                            .toISOString()
                            .split("T")[0];
                          const targetDatePart = targetDate
                            .toISOString()
                            .split("T")[0];
                          if (initialDatePart === targetDatePart) {
                            count += 1;
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
                    />
                  </div>
                )}
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Event Type</div>
                <input
                  value={newEvent?.eventType}
                  onChange={(e) => updateNewEvent(e)}
                  type="name"
                  name="eventType"
                  placeholder="Enter Event Type"
                  className="ContactModel"
                  required
                />
              </Col>
              <Col xl="6" sm="6" className="p-2"> 
                <div className="label mt25">Location</div>
                <input
                  value={newEvent?.location}
                  type="text"
                  onChange={(e) => updateNewEvent(e)}
                  name="location"
                  className="ContactModel Text16N"
                  placeholder="Location"
                  required
                />
              </Col>
              {eventOptionObjectKeys.map((Objkey) => 
                <Col xl="6" sm="6" className="p-2">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      {eventOptionsKeyValues && eventOptionsKeyValues[Objkey].label}
                    </div>
                    <Select
                      value={
                        newEvent?.[Objkey]
                          ? {
                              value: newEvent?.[Objkey],
                              label: newEvent?.[Objkey],
                            }
                          : null
                      }
                      name={Objkey}
                      className="w-75"
                      onChange={(selected) => {
                        setNewEvent({ ...newEvent, [Objkey]: selected.value });
                      }}
                      styles={customStyles}
                      options={eventOptionsKeyValues && eventOptionsKeyValues[Objkey].values}
                      required
                    />
                  </div>
                </Col>
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" className="Update_btn">
              ADD
            </Button>
            <Button
              color="danger"
              onClick={() => {
                setNewEventModel(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={editEventModel} centered={true} size="lg" fullscreen="md">
        <ModalHeader>Event Details</ModalHeader>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (eventToEdit.eventDate === "" || !eventToEdit.eventDate) {
              window.notify("Please set event Date!", "error");
              return;
            }
            updateEvent();
          }}
        >
          <ModalBody>
            <Row ref={target}>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Event Date</div>
                <div
                  className={`ContactModel d-flex justify-content-between textPrimary`}
                  onClick={() => setShowCalender(!showCalender)}
                  style={{ cursor: "pointer" }}
                >
                  {eventToEdit?.eventDate
                    ? dayjs(eventToEdit?.eventDate).format("DD-MMM-YYYY")
                    : "Date"}
                  <img alt="" src={CalenderImg} />
                </div>
                {showCalender && (
                  <div
                    style={{
                      zIndex: "5",
                    }}
                    className="position-absolute"
                  >
                    <Calendar
                      minDate={new Date(Date.now())}
                      CalenderPress={() => setShowCalender(false)}
                      onClickDay={(date) => {
                        setShowCalender(!showCalender);
                        setEventToEdit({ ...eventToEdit, eventDate: date });
                      }}
                      tileClassName={({ date }) => {
                        let count = 0;
                        for (
                          let index = 0;
                          index < allEvents?.length;
                          index++
                        ) {
                          const initialDate = new Date(
                            allEvents[index].eventDate
                          );
                          const targetDate = new Date(date);
                          const initialDatePart = initialDate
                            .toISOString()
                            .split("T")[0];
                          const targetDatePart = targetDate
                            .toISOString()
                            .split("T")[0];
                          if (initialDatePart === targetDatePart) {
                            count += 1;
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
                    />
                  </div>
                )}
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Event Type</div>
                <input
                  value={eventToEdit?.eventType}
                  onChange={(e) => updateEventToEdit(e)}
                  type="name"
                  name="eventType"
                  placeholder="Event_Type"
                  className="ContactModel"
                  required
                />
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label mt25">Location</div>
                <input
                  value={eventToEdit?.location}
                  type="text"
                  onChange={(e) => updateEventToEdit(e)}
                  name="location"
                  className="ContactModel Text16N"
                  placeholder="Location"
                  required
                />
              </Col>
              {eventOptionObjectKeys.map((Objkey) => 
                <Col xl="6" sm="6" className="p-2">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      {eventOptionsKeyValues && eventOptionsKeyValues[Objkey].label}
                    </div>
                    <Select
                      value={
                        eventToEdit?.[Objkey]
                          ? {
                              value: eventToEdit?.[Objkey],
                              label: eventToEdit?.[Objkey],
                            }
                          : null
                      }
                      name={Objkey}
                      className="w-75"
                      onChange={(selected) => {
                        setEventToEdit({
                          ...eventToEdit,
                          [Objkey]: selected.value,
                        });
                      }}
                      styles={customStyles}
                      options={eventOptionsKeyValues && eventOptionsKeyValues[Objkey].values}
                      required
                    />
                  </div>
                </Col>
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" className="Update_btn">
              UPDATE
            </Button>
            <Button
              color="danger"
              onClick={() => {
                setEventToEdit(null);
                setEditEventModel(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
}

export default ClientInfo;
