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

function FormII() {
 
  const [allEvents, setAllEvents] = useState([]);
  const [weddingAssigned, setWeddingAssigned] = useState(false);

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
  const getStoredEvents = async () => {
    const storedEvents = await getEvents();
    setAllEvents(storedEvents.data);
    dispatch(updateAllEvents(storedEvents.data));
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
    console.log(clientData,updatedDeliverables)
    dispatch(
      updateClintData({ ...clientData, deliverables: updatedDeliverables })
    );
  };
  const addAlbum = () => {
    let updatedAlbums = [...clientData?.albums];
    updatedAlbums.push("");
    dispatch(updateClintData({ ...clientData, albums: updatedAlbums }));
  };
  useEffect(() => {
    if (!clientData.form1Submitted) {
      navigate("/MyProfile/AddClient/Form-I");
    }
    getStoredEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleAddDate = (date) => {
    setEventValues({ ...eventValues, eventDate: date });
    setShow(!show);
  };
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
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };
  const toggle = () => {
    setShow(!show);
  };
  const target = useRef(null);
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="mt18">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent(e);
            setEventValues(null);
          }}
        >
          <Row>
            <Col xs="6" sm="3" className="pr5">
              <div ref={target}>
                <div>
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
            <Col xs="6" sm="3">
              <div>
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
            <Col xs="6" sm="3">
              <div style={{ marginLeft: "10px" }}>
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Is This a Wedding Event
                </div>
                <input
                  onChange={(e) => {
                    setEventValues({
                      ...eventValues,
                      isWedding: e.target.checked,
                    });
                  }}
                  className="mx-2"
                  type="checkbox"
                  name="isWedding"
                  style={{ marginTop: "20px" }}
                  checked={eventValues?.isWedding}
                  disabled={weddingAssigned}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="4" sm="3" className="pr5">
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
            <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Travel By
                </div>
                <Select
                  // ref={travelSelect}
                  value={eventValues?.travelBy ? {label : eventValues?.travelBy, value : eventValues?.travelBy} : null}
                  name="travelBy"
                  className="w-75"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      travelBy: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={travelByOptions}
                  required={true}
                />
              </div>
            </Col>
            <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Shoot Directors
                </div>
                <Select
                  // ref={shootDirectorsSelect}
                  value={eventValues?.shootDirectors ? {label : eventValues?.shootDirectors, value : eventValues?.shootDirectors} : null}
                  name="shootDirectors"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      shootDirectors: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={[
                    {
                      value: "0",
                      label: "0",
                    },
                    {
                      value: "1",
                      label: "1",
                    },
                  ]}
                  required={true}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="4" sm="3" className="pr5">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Photographers
                </div>
                <Select
                  // ref={photographersSelect}
                  value={eventValues?.photographers ? {label : eventValues?.photographers, value : eventValues?.photographers} : null}
                  name="photographers"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      photographers: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
            <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Cinematographers
                </div>
                <Select
                  // ref={cinematographersSelect}
                  value={eventValues?.cinematographers ? {label : eventValues?.cinematographers, value : eventValues?.cinematographers} : null}
                  name="cinematographers"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      cinematographers: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
            <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Drones
                </div>
                <Select
                  // ref={dronesSelect}
                  value={eventValues?.drones ? {label : eventValues?.drones, value : eventValues?.drones} : null}
                  name="drones"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({ ...eventValues, drones: selected?.value });
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Same Day Photo Editors
                </div>
                <Select
                  // ref={sameDayPhotoEditorsSelect}
                  value={eventValues?.sameDayPhotoEditor ? {label : eventValues?.sameDayPhotoEditor, value : eventValues?.sameDayPhotoEditor} : null}
                  name="sameDayPhotoEditor"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      sameDayPhotoEditor: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
            <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Same Day Video Editors
                </div>
                <Select
                  // ref={sameDayVideoEditorsSelect}
                  value={eventValues?.sameDayVideoEditor ? {label : eventValues?.sameDayVideoEditor, value : eventValues?.sameDayVideoEditor} : null}
                  name="sameDayVideoEditor"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      sameDayVideoEditor: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
            {/* <Col xs="6" sm="3">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Tentative
                </div>
                <Select
                  // ref={tentativeSelect}
                  value={eventValues?.tentative ? {label : eventValues?.tentative, value : eventValues?.tentative} : null}
                  name="tentative"
                  className="w-50"
                  onChange={(selected) => {
                    setEventValues({
                      ...eventValues,
                      tentative: selected?.value,
                    });
                  }}
                  styles={customStyles}
                  options={yesNoOptions}
                  required
                />
              </div>
            </Col> */}
          </Row>
          {/* <Row className='mt-2'>
            <Col xs="6" sm="3">
              <div className='mt25'>
                <div className="Text16N mt-5" style={{ marginBottom: '6px' }}>
                  <input
                    onChange={(e) => {
                      setEventValues({ ...eventValues, isWedding: e.target.checked })
                    }}
                    className='mx-2'
                    type="checkbox"
                    name="isWedding"
                    style={{ marginLeft: "20px" }}
                    checked={eventValues?.isWedding}
                    disabled={false}
                  />Wedding
                </div>
              </div>
            </Col>
          </Row> */}
          <Button type="submit" className="add_album album mt-4">
            Add Event
          </Button>
        </Form>
        <div className="mt-4">
          <Table
            bordered
            hover
            striped
            responsive
            style={{ marginTop: "15px", width: "80%" }}
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
                      <FaEdit onClick={()=>{
                        if(weddingAssigned && event.isWedding){
                          setWeddingAssigned(false)
                        }
                        setEventValues(event)
                        handleDeleteEvent(event, i)
                      }}  className="mx-1 cursor-pointer"/>
                      <AiFillDelete className="mx-1 cursor-pointer"
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
          <div className="mt25">
            <div className="Text16N" style={{ marginBottom: "6px" }}>
              Deliverables
            </div>
            <div className="Text16N">
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
              <input
                onChange={(e) => {
                  updateDeliverables(e);
                }}
                type="checkbox"
                name="preWeddingVideos"
                style={{ marginLeft: "20px" }}
                checked={clientData?.deliverables?.preWeddingVideos}
                disabled={false}
              />
              {"   "}
              Pre Wedding Videos
              {/* <input
                onChange={(e) => {
                  updateDeliverables(e)
                }}
                type="checkbox"
                name="photos"
                style={{ marginLeft: "20px" }}
                checked={clientData?.deliverables?.photos}
                disabled={false}
              />
              {"   "}
              Photos
               */}
            </div>
          </div>
          {console.log("FORM 2",clientData)}
          {(clientData?.deliverables?.preWeddingVideos ||
            clientData?.deliverables?.preWeddingPhotos) && (
            <>
              <p className="mt-5 text16N mb-0 fw-bold">For Pre-Wedding:</p>
              <Row>
                <Col xs="6" sm="3">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      Photographers
                    </div>
                    <Select
                      value={
                        clientData?.preWedPhotographers
                          ? {
                              value: clientData?.preWedPhotographers,
                              label: clientData?.preWedPhotographers,
                            }
                          : null
                      }
                      name="preWedPhotographers"
                      className="w-50"
                      onChange={(selected) => {
                        dispatch(
                          updateClintData({
                            ...clientData,
                            preWedPhotographers: selected?.value,
                          })
                        );
                      }}
                      styles={customStyles}
                      options={numberOptions}
                      required
                    />
                  </div>
                </Col>
                <Col xs="6" sm="3">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      Cinematograpers
                    </div>
                    <Select
                      value={
                        clientData?.preWedCinematographers
                          ? {
                              value: clientData?.preWedCinematographers,
                              label: clientData?.preWedCinematographers,
                            }
                          : null
                      }
                      name="preWedCinematographers"
                      className="w-50"
                      onChange={(selected) => {
                        dispatch(
                          updateClintData({
                            ...clientData,
                            preWedCinematographers: selected?.value,
                          })
                        );
                      }}
                      styles={customStyles}
                      options={numberOptions}
                      required
                    />
                  </div>
                </Col>
                <Col xs="6" sm="3">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      Assistants
                    </div>
                    <Select
                      value={
                        clientData?.preWedAssistants
                          ? {
                              value: clientData?.preWedAssistants,
                              label: clientData?.preWedAssistants,
                            }
                          : null
                      }
                      name="preWedAssistants"
                      className="w-50"
                      onChange={(selected) => {
                        dispatch(
                          updateClintData({
                            ...clientData,
                            preWedAssistants: selected?.value,
                          })
                        );
                      }}
                      styles={customStyles}
                      options={numberOptions}
                      required
                    />
                  </div>
                </Col>
                <Col xs="6" sm="3">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      Drone Flyers
                    </div>
                    <Select
                      value={
                        clientData?.preWedDroneFlyers
                          ? {
                              value: clientData?.preWedDroneFlyers,
                              label: clientData?.preWedDroneFlyers,
                            }
                          : null
                      }
                      name="preWedDroneFlyerss"
                      className="w-50"
                      onChange={(selected) => {
                        dispatch(
                          updateClintData({
                            ...clientData,
                            preWedDroneFlyers: selected?.value,
                          })
                        );
                      }}
                      styles={customStyles}
                      options={numberOptions}
                      required
                    />
                  </div>
                </Col>
              </Row>
            </>
          )}

          <Row>
            <Col xl="10" sm="8">
              <Row>
                {clientData?.albums?.map((albumValue, i) => {
                  return (
                    <Col xs="4" sm="3" key={i}>
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
                            const updatedAlbums = [...clientData?.albums];
                            updatedAlbums[i] = selected?.value;
                            dispatch(
                              updateClintData({
                                ...clientData,
                                albums: updatedAlbums,
                              })
                            );
                            setEventValues({
                              ...eventValues,
                              albums: selected?.value,
                            });
                          }}
                          styles={customStyles}
                          options={[
                            { value: "RGB", label: "RGB" },
                            { value: "CMYK", label: "CMYK" },
                          ]}
                          required={true}
                        />
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col xl="2" sm="4" className="mt-3">
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
            <Col xs="4" sm="2">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Promo
                </div>
                <Select
                  value={
                    clientData?.promos
                      ? { value: clientData?.promos, label: clientData?.promos }
                      : null
                  }
                  name="promos"
                  className="w-75"
                  onChange={(selected) => {
                    dispatch(
                      updateClintData({
                        ...clientData,
                        promos: selected?.value,
                      })
                    );
                  }}
                  styles={customStyles}
                  options={yesNoOptions}
                  required
                />
              </div>
            </Col>
            <Col xs="6" sm="2">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Long Films
                </div>
                <Select
                  value={
                    clientData?.longFilms
                      ? {
                          value: clientData?.longFilms,
                          label: clientData?.longFilms,
                        }
                      : null
                  }
                  name="longFilms"
                  className="w-75"
                  onChange={(selected) => {
                    dispatch(
                      updateClintData({
                        ...clientData,
                        longFilms: selected?.value,
                      })
                    );
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
            <Col xs="4" sm="2">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Reels
                </div>
                <Select
                  value={
                    clientData?.reels
                      ? { value: clientData?.reels, label: clientData?.reels }
                      : null
                  }
                  name="reels"
                  className="w-75"
                  onChange={(selected) => {
                    dispatch(
                      updateClintData({ ...clientData, reels: selected?.value })
                    );
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
            <Col xs="3" sm="2">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Hard Drives
                </div>
                <Select
                  value={
                    clientData?.hardDrives
                      ? {
                          value: clientData?.hardDrives,
                          label: clientData?.hardDrives,
                        }
                      : null
                  }
                  name="hardDrives"
                  className="w-75"
                  onChange={(selected) => {
                    dispatch(
                      updateClintData({
                        ...clientData,
                        hardDrives: selected?.value,
                      })
                    );
                  }}
                  styles={customStyles}
                  options={numberOptions}
                  required
                />
              </div>
            </Col>
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
                minDate={new Date(Date.now())}
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
                // tileDisabled={({ date }) => {
                //   let count = 0;
                //   for (let index = 0; index < allEvents?.length; index++) {
                //     const initialDate = new Date(allEvents[index].eventDate)
                //     const targetDate = new Date(date);
                //     const initialDatePart = initialDate.toISOString().split("T")[0];
                //     const targetDatePart = targetDate.toISOString().split("T")[0];
                //     if (initialDatePart === targetDatePart) {
                //       count += 1
                //     }
                //   }
                //   if (count == 1) {
                //     return "highlight5"
                //   } else if (count == 2) {
                //     return "highlight3"
                //   } else if (count >= 3) {
                //     return "highlight1"
                //   }
                // }}
              />
            </div>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

export default FormII;
