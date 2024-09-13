import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row } from "reactstrap";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import "../../assets/css/common.css";
import "../../assets/css/Profile.css";
import { Overlay, Tooltip } from "react-bootstrap";
import "../../assets/css/tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { Table } from "reactstrap";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import CalenderImg from "../../assets/Profile/Calender.svg";
import Select from "react-select";
import { updateClintData } from "../../redux/clientBookingForm";
import { CgMathMinus } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { getEvents } from "../../API/Event";
import { updateAllEvents } from "../../redux/eventsSlice";
import { FaEdit } from "react-icons/fa";
import {
  getAllEventOptions,
  updateAllEventOptions,
} from "../../API/FormEventOptionsAPI";
import {
  getAllDeliverableOptions,
  updateAllDeliverableOptions,
} from "../../API/FormDeliverableOptionsAPI";

function FormII() {
  const [allEvents, setAllEvents] = useState([]);
  const [weddingAssigned, setWeddingAssigned] = useState(false);
  const [eventOptionsKeyValues, setEventOptionsKeyValues] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deliverableOptionsKeyValues, setDeliverableOptionsKeyValues] =
    useState(null);
  const [minDate, setMinDate] = useState(new Date(Date.now()));

  const eventOptionObjectKeys = [
    "travelBy",
    "shootDirector",
    "photographers",
    "cinematographers",
    "drones",
    "sameDayPhotoEditors",
    "sameDayVideoEditors",
  ];
  const deliverablePreWeddingOptionObjectKeys = [
    "photographers",
    "cinematographers",
    "assistants",
    "drones",
  ];
  const deliverableAlbumOptionObjectKeys = ["albums"];
  const deliverableOptionObjectKeys = [
    "promos",
    "longFilms",
    "reels",
    "hardDrives",
  ];

  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [storedEvents, setStoredEvents] = useState(null)
  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.clientData);
  const [eventValues, setEventValues] = useState(null);
  const updateEventValues = (e) => {
    setEventValues({ ...eventValues, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleAddEvent = (e) => {
    if (!eventValues?.eventDate) {
      return window.notify("Please Select the Date", "error");
    }
    const updatedEvents = clientData?.events ? [...clientData?.events] : [];
    updatedEvents.push(eventValues);
    const isWeddingAvailable = updatedEvents.filter(
      (events) => events.isWedding === true
    );
    if (isWeddingAvailable.length > 0) {
      setWeddingAssigned(true);
    }
    dispatch(updateClintData({ ...clientData, events: updatedEvents }));
    const updatedStoredEvents = [...allEvents];
    updatedStoredEvents.push(eventValues);
    setAllEvents(updatedStoredEvents);
  };

  useEffect(() => {
    if (clientData.events && clientData.events.length) {
      let earliest = clientData.events.reduce((prev, curr) => {
        return new Date(prev.eventDate) < new Date(curr.eventDate)
          ? prev
          : curr;
      }, clientData.events[0]);
      setMinDate(earliest.eventDate);
      console.log("USE EFFECT", clientData, earliest);
      return;
    }
    setMinDate(new Date(Date.now()));
  }, [clientData]);

  const getStoredEvents = async () => {
    const storedEventsDB = await getEvents();
    setStoredEvents(storedEventsDB.data)
    setAllEvents(storedEventsDB.data);
    dispatch(updateAllEvents(storedEventsDB.data));
  };

  const handleDeleteEvent = (event, index) => {
    let updatedEvents = [...clientData?.events];
    updatedEvents.splice(index, 1);
    const isWeddingAvailable = updatedEvents.filter(
      (events) => events.isWedding === true
    );
    if (isWeddingAvailable.length === 0) {
      setWeddingAssigned(false);
    }
    dispatch(updateClintData({ ...clientData, events: updatedEvents }));
  };

  const updateDeliverables = (e) => {
    var updatedDeliverables = { ...clientData?.deliverables } || {
      photos: true,
    };
    updatedDeliverables = {
      ...updatedDeliverables,
      [e.target.name]: e.target.checked,
    };
    dispatch(
      updateClintData({ ...clientData, deliverables: updatedDeliverables })
    );
  };

  const addAlbum = () => {
    let updatedAlbums = [...clientData?.albums];
    updatedAlbums.push("");
    dispatch(updateClintData({ ...clientData, albums: updatedAlbums }));
  };

  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();
    const deliverableOptions = await getAllDeliverableOptions();

    setEventOptionsKeyValues(eventOptions);
    setDeliverableOptionsKeyValues(deliverableOptions);
  };

  useEffect(() => {
    if (!clientData.form1Submitted) {
      navigate("/MyProfile/AddClient/Form-I");
    }
    getStoredEvents();
    getAllFormOptionsHandler();
  }, []);

  const handleAddDate = (date) => {
    setEventValues({ ...eventValues, eventDate: date });
    setShow(!show);
  };

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
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };
  const toggle = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="mt18">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if(editingEvent === null){

              handleAddEvent(e);
            } else {
              const clientEvents = [...clientData.events]
              clientEvents[editingEvent] = eventValues
              const isWeddingAvailable = clientEvents.filter(
                (event) => event.isWedding === true
              );
              if (isWeddingAvailable.length > 0) {
                setWeddingAssigned(true);
              }
              console.log(clientEvents);
              
              dispatch(updateClintData({ ...clientData, events: clientEvents }));
              // const updatedStoredEvents = [...allEvents];
              // updatedStoredEvents[editingEvent] = eventValues;
              // console.log(updatedStoredEvents);
              
              setAllEvents([...storedEvents, ...clientEvents]);
              setEditingEvent(null)
            }
            setEventValues(null);
          }}
        >
          <Row>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div ref={target}>
              <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Add Date
                  </div>
                  <div
                    className={`forminput R_A_Justify1 cursor-pointer`}
                    onClick={toggle}
                  >
                    {eventValues?.eventDate
                      ? dayjs(eventValues?.eventDate).format("DD-MMM-YYYY")
                      : "Date"}
                    <img alt="" src={CalenderImg} />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Event Type
                </div>
                <Input
                  type="text"
                  name="eventType"
                  disabled={false}
                  className="forminput"
                  value={eventValues?.eventType || ""}
                  required={true}
                  onChange={(e) => updateEventValues(e)}
                  placeholder={"Event Type"}
                />
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4">
            <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "25px" }}>
                  Is This a Wedding Event
                </div>
                <input
                  onChange={(e) => {
                    setEventValues({
                      ...eventValues,
                      isWedding: e.target.checked,
                    });
                  }}
                  type="checkbox"
                  name="isWedding"
                  checked={eventValues?.isWedding}
                  disabled={weddingAssigned}
                />
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Location
                </div>
                <Input
                  type="text"
                  name="location"
                  disabled={false}
                  className="forminput"
                  value={eventValues?.location || ""}
                  required={true}
                  onChange={(e) => updateEventValues(e)}
                  placeholder={"Location"}
                />
              </div>
            </Col>
            {eventOptionObjectKeys.map((Objkey) => (
              <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    {eventOptionsKeyValues &&
                      eventOptionsKeyValues[Objkey].label}
                  </div>
                  <Select
                    // ref={travelSelect}
                    value={
                      eventValues?.[Objkey]
                        ? {
                            label: eventValues?.[Objkey],
                            value: eventValues?.[Objkey],
                          }
                        : null
                    }
                    name={Objkey}
                    className="w-100"
                    onChange={(selected) => {
                      setEventValues({
                        ...eventValues,
                        [Objkey]: selected?.value,
                      });
                    }}
                    styles={customStyles}
                    options={
                      eventOptionsKeyValues &&
                      eventOptionsKeyValues[Objkey].values
                    }
                    required={true}
                  />
                </div>
              </Col>
            ))}
          </Row>
          <Button type="submit" className="add_album album mt-4">
            {editingEvent !== null ? 'Edit ' : 'Add '}
             Event
          </Button>
        </Form>
        <div className="mt-4">
          <Table
            bordered
            hover
            striped
            responsive
            style={{ marginTop: "15px", width: "700px" }}
          >
            <thead>
              <tr className="Text14Semi gray3 alignCenter">
                <th>Event Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Travel By</th>
                <th>Wedding Event Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="Text14Semi alignCenter">
              {clientData?.events?.map((event, i) => {
                return (
                  <tr>
                    <td>
                      {i + 1} : {event.eventType}
                    </td>
                    <td className="primary2">
                      {dayjs(event.eventDate).format("DD-MMM-YYYY")}
                    </td>
                    <td className="primary2">{event.location}</td>
                    <td className="primary2">{event.travelBy}</td>
                    <td className="primary2">
                      {event.isWedding ? "Yes" : "No"}
                    </td>
                    <td className="primary2">
                      <FaEdit
                        onClick={() => {
                          if (weddingAssigned && event.isWedding) {
                            setWeddingAssigned(false);
                          }
                          setEventValues(event);
                          setEditingEvent(i)
                          // handleDeleteEvent(event, i);
                        }}
                        className="mx-1 cursor-pointer"
                      />
                      <AiFillDelete
                        className="mx-1 cursor-pointer"
                        onClick={() => handleDeleteEvent(event, i)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(updateClintData({ ...clientData, form2Submitted: true }));
            navigate("/MyProfile/AddClient/Preview");
          }}
        >
         
          
            <div className="Text16N d-flex flex-row flex-wrap gap-3 mt-2">
              <div>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    updateDeliverables(e);
                  }}
                  name="preWeddingPhotos"
                  checked={clientData?.deliverables?.preWeddingPhotos}
                  disabled={false}
                />
                {"   "}
                Pre Wedding Photos
              </div>
              <div>
                <input
                  onChange={(e) => {
                    updateDeliverables(e);
                  }}
                  type="checkbox"
                  name="preWeddingVideos"
                  
                  checked={clientData?.deliverables?.preWeddingVideos}
                  disabled={false}
                />
                {"   "}
                Pre Wedding Videos
              </div>
            </div>
          
          {(clientData?.deliverables?.preWeddingVideos ||
            clientData?.deliverables?.preWeddingPhotos) && (
            <Row>
              {deliverablePreWeddingOptionObjectKeys.map((Objkey) => (
                <Col xs="12" sm="6" md="6" lg="6" xl="4"  className="pr5">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      {deliverableOptionsKeyValues &&
                        deliverableOptionsKeyValues[Objkey].label}
                    </div>
                    <Select
                      value={
                        clientData?.["preWed" + Objkey]
                          ? {
                              value: clientData?.["preWed" + Objkey],
                              label: clientData?.["preWed" + Objkey],
                            }
                          : null
                      }
                      name={"preWed" + Objkey}
                      onChange={(selected) => {
                        dispatch(
                          updateClintData({
                            ...clientData,
                            ["preWed" + Objkey]: selected?.value,
                          })
                        );
                      }}
                      styles={customStyles}
                      options={
                        deliverableOptionsKeyValues &&
                        deliverableOptionsKeyValues[Objkey].values
                      }
                      required
                    />
                  </div>
                </Col>
              ))}
            </Row>
          )}

          

          <Row>
          
            <Col xl="10" sm="8">
              <Row>
                <div className="Text16N mt25" style={{ marginTop: "30px", marginBottom: "0px !important" }}>
                  Deliverables
                </div>
                {clientData?.albums?.map((albumValue, i) =>
                  deliverableAlbumOptionObjectKeys.map((Objkey) => (
                    <Col xs="12" sm="6" key={i}>
                      <div className="Drop">
                        <h4 className="LabelDrop">Album {i + 1}</h4>
                        <Select
                          value={
                            albumValue?.length > 0
                              ? { value: albumValue, label: albumValue }
                              : null
                          }
                          name={`album${i + 1}`}
                          className="w-75"
                          onChange={(selected) => {
                            const updatedAlbums = [...clientData?.[Objkey]];
                            updatedAlbums[i] = selected?.value;
                            dispatch(
                              updateClintData({
                                ...clientData,
                                [Objkey]: updatedAlbums,
                              })
                            );
                            setEventValues({
                              ...eventValues,
                              [Objkey]: selected?.value,
                            });
                          }}
                          styles={customStyles}
                          options={
                            deliverableOptionsKeyValues &&
                            deliverableOptionsKeyValues[Objkey].values
                          }
                          required={true}
                        />
                      </div>
                    </Col>
                  ))
                )}
              </Row>
            </Col>
            <Col xs="12" sm="6" lg="6" xl="4" className="mt-3">
              <div className="d-flex fex-row">
                {clientData?.albums?.length > 1 && (
                  <div
                    style={{
                      backgroundColor: "rgb(102, 109, 255)",
                      color: "white",
                      width: "30PX",
                      height: "30px",
                      borderRadius: "100%",
                    }}
                    className="fs-3 mt-4 mx-1 d-flex justify-content-center align-items-center"
                    onClick={() => {
                      const updatedAlbums = [...clientData?.albums];
                      updatedAlbums.pop();
                      dispatch(
                        updateClintData({
                          ...clientData,
                          albums: updatedAlbums,
                        })
                      );
                    }}
                  >
                    <CgMathMinus />
                  </div>
                )}
                <div
                  className="fs-3 mt-4 mx-1 d-flex justify-content-center align-items-center"
                  onClick={addAlbum}
                  style={{
                    backgroundColor: "rgb(102, 109, 255)",
                    color: "white",
                    width: "30PX",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  <LuPlus />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            {deliverableOptionObjectKeys.map((Objkey) => (
              <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    {deliverableOptionsKeyValues &&
                      deliverableOptionsKeyValues[Objkey].label}
                  </div>
                  <Select
                    value={
                      clientData?.[Objkey]
                        ? {
                            value: clientData?.[Objkey],
                            label: clientData?.[Objkey],
                          }
                        : null
                    }
                    name={Objkey}
                    onChange={(selected) => {
                      dispatch(
                        updateClintData({
                          ...clientData,
                          [Objkey]: selected?.value,
                        })
                      );
                    }}
                    styles={customStyles}
                    options={
                      deliverableOptionsKeyValues &&
                      deliverableOptionsKeyValues[Objkey].values
                    }
                    required
                  />
                </div>
              </Col>
            ))}
          </Row>
          <div className="mt25">
            <div className="Text16N" style={{ marginBottom: "6px" }}>
              Client Suggestions If Any
            </div>
            <Input
              type="text"
              name="suggestion"
              disabled={false}
              className="forminput h100 alignTop"
              value={clientData?.suggestion || ""}
              required={false}
              onChange={(e) =>
                dispatch(
                  updateClintData({
                    ...clientData,
                    [e.target.name]: e.target.value,
                  })
                )
              }
              placeholder={"Write notes here..."}
            />
          </div>
          <div className="centerAlign mt40 mb15 ">
            <Button
              type="button"
              className="submit_btn submit me-5"
              onClick={() => {
                navigate("/MyProfile/AddClient/Form-I");
              }}
            >
              Back
            </Button>
            <Button type="submit" className="submit_btn submit me-5">
              Next/Preview
            </Button>
          </div>
        </Form>
      </div>
      <Overlay
        rootClose={true}
        onHide={() => setShow(false)}
        target={target.current}
        show={show}
        placement="bottom"
      >
        {(props) => (
          <Tooltip id="overlay-example" bsPrefix="tooltipBg" {...props}>
            <div style={{ width: "300px" }} className="tooltipBg">
              <Calendar
                value={minDate}
                // minDate={new Date(Date.now())}
                CalenderPress={toggle}
                onClickDay={(date) => {
                  handleAddDate(date);
                }}
                tileClassName={({ date }) => {
                  let count = 0;
                  for (let index = 0; index < allEvents?.length; index++) {
                    const initialDate = new Date(allEvents[index].eventDate);
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
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

export default FormII;
