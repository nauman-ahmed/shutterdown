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
import { FaEdit } from "react-icons/fa";
import {
  getAllEventOptions,
  updateAllEventOptions,
} from "../../API/FormEventOptionsAPI";
import {
  getAllDeliverableOptions,
  updateAllDeliverableOptions,
} from "../../API/FormDeliverableOptionsAPI";
import { toast } from "react-toastify";
import { getDraftClientData, saveDraftClientData } from "./Form-I";

function FormII() {
  const storedEvents = useSelector((state) => state.allEvents);
  const [allEvents, setAllEvents] = useState(storedEvents);
  const [weddingAssigned, setWeddingAssigned] = useState(false);
  const [eventOptionsKeyValues, setEventOptionsKeyValues] = useState(null);
  const [sameLocationForAll, setSameLocationForAll] = useState(false);
  const [sameTravelForAll, setSameTravelForAll] = useState(false);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [useCustomTravel, setUseCustomTravel] = useState(false);
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
    "performanceFilms",
  ];
  const simpleFields = ["hardDrives"];

  const target = useRef(null);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.clientData);
  const [eventValues, setEventValues] = useState(null);
  const updateEventValues = (e) => {
    setEventValues({ ...eventValues, [e.target.name]: e.target.value });
  };
  const [deliverables, setDeliverables] = useState(
    clientData?.deliverables || [
      { albums: [""], forEvents: [], photos: true, number: 1 },
    ]
  );
  const navigate = useNavigate();
  // Add this useEffect to apply global settings for location and travel
  useEffect(() => {
    if (clientData?.events?.length > 0 && eventValues) {
      // If using same location for all and not custom, set location from first event
      if (sameLocationForAll && !useCustomLocation) {
        const firstEvent = clientData.events[0];
        setEventValues((prev) => ({
          ...prev,
          location: firstEvent.location,
        }));
      }

      // If using same travel for all and not custom, set travel from first event
      if (sameTravelForAll && !useCustomTravel) {
        const firstEvent = clientData.events[0];
        setEventValues((prev) => ({
          ...prev,
          travelBy: firstEvent.travelBy,
        }));
      }
    }
  }, [
    clientData?.events,
    sameLocationForAll,
    sameTravelForAll,
    useCustomLocation,
    useCustomTravel,
  ]);

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
    updateGlobalSettings(updatedEvents);
    saveDraftClientData({ ...clientData, events: updatedEvents });
    const updatedStoredEvents = [...allEvents];
    updatedStoredEvents.push(eventValues);
    setAllEvents(updatedStoredEvents);
  };
  const addNewDeliverables = () => {
    const updatedDeliverables = [...deliverables];
    updatedDeliverables.push({
      photos: true,
      albums: [""],
      forEvents: [],
      number: deliverables?.length + 1,
    });
    setDeliverables(updatedDeliverables);
  };
  const clearLatsDeliverables = () => {
    const updatedDeliverables = [...deliverables];
    updatedDeliverables.pop();
    setDeliverables(updatedDeliverables);
  };

  useEffect(() => {
    if (clientData.events && clientData.events.length) {
      let earliest = clientData.events.reduce((prev, curr) => {
        return new Date(prev.eventDate) < new Date(curr.eventDate)
          ? prev
          : curr;
      }, clientData.events[0]);
      setMinDate(earliest.eventDate);
      return;
    }
    setMinDate(new Date(Date.now()));
  }, [clientData]);

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
    saveDraftClientData({ ...clientData, events: updatedEvents });
  };

  useEffect(() => {
    dispatch(updateClintData({ ...clientData, deliverables: deliverables }));
    saveDraftClientData({ ...clientData, deliverables: deliverables });
  }, [deliverables]);

  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();
    const deliverableOptions = await getAllDeliverableOptions();
    setEventOptionsKeyValues(eventOptions);
    setDeliverableOptionsKeyValues(deliverableOptions);
  };

  useEffect(() => {
    if (!clientData.form1Submitted) {
      navigate("/clients/add-client/form-1");
    }
    getAllFormOptionsHandler();

    const data = getDraftClientData();
    if (data) {
      dispatch(updateClintData(data));
    }
  }, []);

  const handleAddDate = (date) => {
    setEventValues({
      ...eventValues,
      eventDate: dayjs(new Date(date)).format("YYYY-MM-DD").toString(),
    });
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

  // Add this function to handle global updates when first event is added/updated
  const updateGlobalSettings = (events) => {
    if (events?.length > 0) {
      const firstEvent = events[0];

      // If we're using global settings, update all existing events
      if (sameLocationForAll || sameTravelForAll) {
        const updatedEvents = events.map((event, index) => {
          // First event stays as is
          if (index === 0) return event;

          // For other events, apply global settings
          let updatedEvent = { ...event };

          if (sameLocationForAll) {
            updatedEvent.location = firstEvent.location;
          }

          if (sameTravelForAll) {
            updatedEvent.travelBy = firstEvent.travelBy;
          }

          return updatedEvent;
        });

        dispatch(updateClintData({ ...clientData, events: updatedEvents }));
        saveDraftClientData({ ...clientData, events: updatedEvents });
      }
    }
  };

  return (
    <>
      <div className="mt18">
        <div className="Text16N d-flex flex-wrap gap-4 mt-4 mb-3">
          <div>
            <input
              type="checkbox"
              id="sameLocationForAll"
              checked={sameLocationForAll}
              onChange={(e) => {
                setSameLocationForAll(e.target.checked);
                if (e.target.checked) {
                  setUseCustomLocation(false);
                }
              }}
              style={{ width: "16px", height: "16px", marginRight: "8px" }}
            />
            <label htmlFor="sameLocationForAll" className="cursor-pointer">
              Same Location for All Events
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="sameTravelForAll"
              checked={sameTravelForAll}
              onChange={(e) => {
                setSameTravelForAll(e.target.checked);
                if (e.target.checked) {
                  setUseCustomTravel(false);
                }
              }}
              style={{ width: "16px", height: "16px", marginRight: "8px" }}
            />
            <label htmlFor="sameTravelForAll" className="cursor-pointer">
              Same Travel Mode for All Events
            </label>
          </div>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingEvent === null) {
              handleAddEvent(e);
            } else {
              const clientEvents = [...clientData.events];
              clientEvents[editingEvent] = eventValues;
              const isWeddingAvailable = clientEvents.filter(
                (event) => event.isWedding === true
              );
              if (isWeddingAvailable.length > 0) {
                setWeddingAssigned(true);
              } 
              dispatch(
                updateClintData({ ...clientData, events: clientEvents })
              );
              updateGlobalSettings(clientEvents);
              saveDraftClientData({ ...clientData, events: clientEvents });
              setAllEvents([...storedEvents, ...clientEvents]);
              setEditingEvent(null);
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
                  style={{ width: "16px", height: "16px" }}
                  name="isWedding"
                  checked={eventValues?.isWedding}
                  disabled={weddingAssigned}
                />
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div className="mt25">
                <div
                  className="Text16N"
                  style={{
                    marginBottom: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Location</span>
                  {sameLocationForAll && clientData?.events?.length > 0 && (
                    <div>
                      <input
                        type="checkbox"
                        id="customLocation"
                        checked={useCustomLocation}
                        onChange={(e) => setUseCustomLocation(e.target.checked)}
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                        }}
                      />
                      <label
                        htmlFor="customLocation"
                        style={{ fontSize: "12px" }}
                      >
                        Custom for this event
                      </label>
                    </div>
                  )}
                </div>
                <Input
                  type="text"
                  name="location"
                  disabled={
                    sameLocationForAll &&
                    !useCustomLocation &&
                    clientData?.events?.length > 0
                  }
                  className="forminput"
                  value={eventValues?.location || ""}
                  required={true}
                  onChange={(e) => updateEventValues(e)}
                  placeholder={"Location"}
                />
              </div>
            </Col>
            {eventOptionObjectKeys.map((Objkey) => (
              <Col
                xs="12"
                sm="6"
                md="6"
                lg="6"
                xl="4"
                className="pr5"
                key={Objkey}
              >
                <div className="mt25">
                  <div
                    className="Text16N"
                    style={{
                      marginBottom: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {eventOptionsKeyValues &&
                        eventOptionsKeyValues[Objkey].label}
                    </span>
                    {Objkey === "travelBy" &&
                      sameTravelForAll &&
                      clientData?.events?.length > 0 && (
                        <div>
                          <input
                            type="checkbox"
                            id="customTravel"
                            checked={useCustomTravel}
                            onChange={(e) =>
                              setUseCustomTravel(e.target.checked)
                            }
                            style={{
                              width: "16px",
                              height: "16px",
                              marginRight: "5px",
                            }}
                          />
                          <label
                            htmlFor="customTravel"
                            style={{ fontSize: "12px" }}
                          >
                            Custom for this event
                          </label>
                        </div>
                      )}
                  </div>
                  <Select
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
                    isDisabled={
                      Objkey === "travelBy" &&
                      sameTravelForAll &&
                      !useCustomTravel &&
                      clientData?.events?.length > 0
                    }
                  />
                </div>
              </Col>
            ))}
          </Row>
          <Button type="submit" className="add_album album mt-4">
            {editingEvent !== null ? "Edit " : "Add "}
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
                          setEditingEvent(i);
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
            console.log(clientData);

            if (
              clientData.deliverables.some(
                (deliv) => deliv.forEvents?.length == 0
              )
            ) {
              toast.error(
                "Deliverable cannot be added without selecting events"
              );
              return;
            }
            if (!weddingAssigned) {
              toast.warning("Wedding Event is not Added yet!");
            }
            
            dispatch(updateClintData({ ...clientData, form2Submitted: true }));
            saveDraftClientData({ ...clientData, form2Submitted: true });
            navigate("/clients/add-client/preview");
          }}
        >
          <div className="Text16N d-flex flex-row flex-wrap gap-3 mt-2">
            <div>
              <input
                type="checkbox"
                onChange={(e) => {
                  dispatch(
                    updateClintData({
                      ...clientData,
                      preWeddingPhotos: e.target.checked,
                    })
                  );
                  saveDraftClientData({
                    ...clientData,
                    preWeddingPhotos: e.target.checked,
                  });
                }}
                name="preWeddingPhotos"
                checked={clientData?.preWeddingPhotos}
                disabled={false}
              />
              {"   "}
              Pre Wedding Photos
            </div>
            <div>
              <input
                onChange={(e) => {
                  dispatch(
                    updateClintData({
                      ...clientData,
                      preWeddingVideos: e.target.checked,
                    })
                  );
                  saveDraftClientData({
                    ...clientData,
                    preWeddingVideos: e.target.checked,
                  });
                }}
                type="checkbox"
                name="preWeddingVideos"
                checked={clientData?.preWeddingVideos}
                disabled={false}
              />
              {"   "}
              Pre Wedding Videos
            </div>
          </div>

          {(clientData?.preWeddingVideos || clientData?.preWeddingPhotos) && (
            <Row>
              {deliverablePreWeddingOptionObjectKeys.map((Objkey) => (
                <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
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
                        saveDraftClientData({
                          ...clientData,
                          ["preWed" + Objkey]: selected?.value,
                        });
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
          {clientData?.events?.length > 0 && (
            <>
              <div
                className="fs-3 mt25"
                style={{ marginTop: "30px", marginBottom: "0px !important" }}
              >
                Deliverables
              </div>
              {deliverables?.map((deliverable, index) => (
                <div className="bg-slight deliverableBox my-2">
                  <Row>
                    <Col xl="10" sm="8">
                      <div className=" d-flex flex-row align-items-center gap-4">
                        <h4 className="LabelDrop">
                          {" "}
                          {deliverable.number + ")"} For Events :
                        </h4>
                        {clientData?.events?.map((event, eventIndex) => (
                          <div className="d-flex flex-row align-items-center gap-2">
                            <input
                              onChange={(e) => {
                                const updatedDeliverables = [...deliverables];
                                const updatedForEvents = [
                                  ...deliverable?.forEvents,
                                ];
                                if (e.target.checked) {
                                  updatedForEvents.push(eventIndex);
                                  updatedDeliverables[index] = {
                                    ...updatedDeliverables[index],
                                    forEvents: updatedForEvents,
                                  };
                                } else {
                                  const filteredForEvents =
                                    updatedForEvents.filter(
                                      (num) => num != eventIndex
                                    );
                                  updatedDeliverables[index] = {
                                    ...updatedDeliverables[index],
                                    forEvents: filteredForEvents,
                                  };
                                }

                                setDeliverables(updatedDeliverables);
                              }}
                              type="checkbox"
                              style={{ width: "16px", height: "16px" }}
                              className="cursor-pointer"
                              name={`event${index}-${eventIndex}`}
                              checked={deliverable?.forEvents?.includes(
                                eventIndex
                              )}
                            />
                            <span>{event.eventType}</span>
                          </div>
                        ))}
                      </div>
                      <Row>
                        {deliverable?.albums?.map((albumValue, i) =>
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
                                    if (selected.value !== "Not included") {
                                      const updatedDeliverables = [
                                        ...deliverables,
                                      ];
                                      const updatedAlbums = [
                                        ...deliverable?.[Objkey],
                                      ];
                                      updatedAlbums[i] = selected?.value;
                                      updatedDeliverables[index] = {
                                        ...updatedDeliverables[index],
                                        [Objkey]: updatedAlbums,
                                      };
                                      setDeliverables(updatedDeliverables);
                                    } else {
                                      const updatedDeliverables = [
                                        ...deliverables,
                                      ];
                                      const updatedAlbums = [
                                        ...deliverable?.[Objkey],
                                      ];
                                      if (i === 0) {
                                        updatedAlbums[i] = "Not included";
                                      } else {
                                        updatedAlbums.splice(i, 1);
                                      }
                                      updatedDeliverables[index] = {
                                        ...updatedDeliverables[index],
                                        [Objkey]: updatedAlbums,
                                      };
                                      setDeliverables(updatedDeliverables);
                                    }
                                  }}
                                  styles={customStyles}
                                  options={
                                    deliverableOptionsKeyValues &&
                                    deliverableOptionsKeyValues[Objkey].values
                                  }
                                />
                              </div>
                            </Col>
                          ))
                        )}
                      </Row>
                    </Col>
                    <Col xs="12" sm="6" lg="6" xl="4" className="mt-3">
                      <div className="d-flex fex-row">
                        {deliverable?.albums?.length > 1 && (
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
                              const updatedDeliverables = [...deliverables];
                              const updatedAlbums = [...deliverable?.albums];
                              updatedAlbums.pop();
                              updatedDeliverables[index] = {
                                ...updatedDeliverables[index],
                                albums: updatedAlbums,
                              };
                              setDeliverables(updatedDeliverables);
                            }}
                          >
                            <CgMathMinus />
                          </div>
                        )}
                        {deliverable?.albums?.length >= 1 &&
                          deliverable?.albums[0] !== "" &&
                          deliverable?.albums[0] !== "Not included" && (
                            <div
                              className="fs-3 mt-4 mx-1 d-flex justify-content-center align-items-center"
                              onClick={() => {
                                const updatedDeliverables = [...deliverables];
                                const updatedAlbums = [...deliverable?.albums];
                                updatedAlbums.push("");
                                updatedDeliverables[index] = {
                                  ...updatedDeliverables[index],
                                  albums: updatedAlbums,
                                };
                                setDeliverables(updatedDeliverables);
                              }}
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
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {deliverableOptionObjectKeys.map((Objkey) => (
                      <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
                        <div className="mt25">
                          <div
                            className="Text16N"
                            style={{ marginBottom: "6px" }}
                          >
                            {deliverableOptionsKeyValues &&
                              deliverableOptionsKeyValues[Objkey].label}
                          </div>
                          <Select
                            value={
                              deliverable?.[Objkey]
                                ? {
                                    value: deliverable?.[Objkey],
                                    label: deliverable?.[Objkey],
                                  }
                                : null
                            }
                            name={Objkey}
                            onChange={(selected) => {
                              const updatedDeliverables = [...deliverables];
                              updatedDeliverables[index] = {
                                ...updatedDeliverables[index],
                                [Objkey]: selected?.value,
                              };
                              setDeliverables(updatedDeliverables);
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
                </div>
              ))}
            </>
          )}
          {clientData?.events?.length > 1 && (
            <Col xs="12" sm="6" lg="6" xl="4" className="mt-3">
              <div className="d-flex fex-row">
                {deliverables?.length > 1 && (
                  <div
                    style={{
                      backgroundColor: "rgb(102, 109, 255)",
                      color: "white",
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                    }}
                    className="fs-3 cursor-pointer mt-4 mx-1 d-flex justify-content-center align-items-center"
                    onClick={clearLatsDeliverables}
                  >
                    <CgMathMinus />
                  </div>
                )}
                <div
                  className="fs-5 p-2 cursor-pointer mt-4 mx-1 d-flex justify-content-center align-items-center"
                  onClick={addNewDeliverables}
                  style={{
                    backgroundColor: "rgb(102, 109, 255)",
                    color: "white",

                    height: "30px",
                    borderRadius: "6px",
                  }}
                >
                  <LuPlus /> Deliverables
                </div>
              </div>
            </Col>
          )}

          {simpleFields.map((Objkey) => (
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
                        [Objkey]: selected.value,
                      })
                    );
                    saveDraftClientData({
                      ...clientData,
                      [Objkey]: selected.value,
                    });
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
              onChange={(e) => {
                dispatch(
                  updateClintData({
                    ...clientData,
                    [e.target.name]: e.target.value,
                  })
                );
                saveDraftClientData({
                  ...clientData,
                  [e.target.name]: e.target.value,
                });
              }}
              placeholder={"Write notes here..."}
            />
          </div>
          <div className="centerAlign mt40 mb15 ">
            <Button
              type="button"
              className="submit_btn submit me-5"
              onClick={() => {
                navigate("/clients/add-client/form-1");
              }}
            >
              Back
            </Button>
            <Button type="submit" className="submit_btn submit me-3">
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
                CalenderPress={toggle}
                onClickDay={(date) => {
                  handleAddDate(date);
                }}
                tileClassName={({ date }) => {
                  let count = 0;
                  for (let index = 0; index < allEvents?.length; index++) {
                    const initialDate = dayjs(
                      new Date(allEvents[index].eventDate)
                    ).format("YYYY-MM-DD");
                    const targetDate = dayjs(new Date(date)).format(
                      "YYYY-MM-DD"
                    );
                    if (initialDate == targetDate) {
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
