import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { addEvent, deleteClient, deleteEvent, getAllEvents, updateClientData, updateEventData } from "../../API/Event";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateAllEvents } from "../../redux/eventsSlice";
import { FaEdit } from "react-icons/fa";
import { getAllEventOptions, updateAllEventOptions } from "../../API/FormEventOptionsAPI";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import { getAllDeliverableOptions } from "../../API/FormDeliverableOptionsAPI";
import { CgMathMinus } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";

function ClientInfo() {
  const { clientId } = useParams();
  const deleteClientDetails = useRef()
  const [clientData, setClientData] = useState(null);
  const [groupedAlbums, setGroupedAlbums] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [newEventModel, setNewEventModel] = useState(false);
  const [editEventModel, setEditEventModel] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [newEvent, setNewEvent] = useState({ client: clientId });
  const [showCalender, setShowCalender] = useState(false);
  const [allEvents, setAllEvents] = useState();
  const [eventOptionsKeyValues, setEventOptionsKeyValues] = useState(null);
  const eventOptionObjectKeys = ["travelBy", "shootDirector", "photographers", "cinematographers", "drones", "sameDayPhotoEditors", "sameDayVideoEditors"]
  const [deliverableOptionsKeyValues, setDeliverableOptionsKeyValues] = useState(null);
  const currentUser = Cookies.get('currentUser') && JSON.parse(Cookies.get('currentUser'));
  const [editClientModal, setEditClientModal] = useState(false)
  const [editedClient, setEditedClient] = useState(null)
  const dispatch = useDispatch();
  const getStoredEvents = async () => {
    const res = await getAllEvents();
    if (currentUser.rollSelect === "Manager") {
      dispatch(updateAllEvents(res?.data));
      setAllEvents(res.data)
    } else if (
      currentUser.rollSelect === "Shooter" ||
      currentUser.rollSelect === "Editor"
    ) {
      const eventsToShow = res.data?.filter(
        (event) =>
          event?.shootDirectors?.some(
            (director) => director._id === currentUser._id
          ) ||
          event?.choosenPhotographers.some(
            (photographer) => photographer._id === currentUser._id
          ) ||
          event?.choosenCinematographers.some(
            (cinematographer) => cinematographer._id === currentUser._id
          ) ||
          event?.droneFlyers.some((flyer) => flyer._id === currentUser._id) ||
          event?.manager.some((manager) => manager._id === currentUser._id) ||
          event?.sameDayPhotoMakers.some(
            (photoMaker) => photoMaker._id === currentUser._id
          ) ||
          event?.sameDayVideoMakers.some(
            (videoMaker) => videoMaker._id === currentUser._id
          ) ||
          event?.assistants.some(
            (assistant) => assistant._id === currentUser._id
          )
      );
      dispatch(updateAllEvents(eventsToShow));
      
    }

  };
  const deliverableOptionObjectKeys = [
    "promos",
    "longFilms",
    "reels",
    "hardDrives",
  ];

  const target = useRef(null);
  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();
    const deliverableOptions = await getAllDeliverableOptions();
    setEventOptionsKeyValues(eventOptions);
    setDeliverableOptionsKeyValues(deliverableOptions);
  };



  useEffect(() => {
    getIdData();
    // getStoredEvents();
    getAllFormOptionsHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let bookingOptions = [
    {
      value: 'Yes',
      label: 'Yes',
    },
    {
      value: 'No',
      label: 'No',
    },
  ];
  let paymentOptions = [
    {
      value: 'Advance',
      label: 'Advance',
    },
    {
      value: 'Full Payment',
      label: 'Full Payment',
    },
  ];
  const deliverablePreWeddingOptionObjectKeys = [
    "photographers",
    "cinematographers",
    "assistants",
    "drones",
  ];
  const deliverableAlbumOptionObjectKeys = ["albums"];
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
  const groupAndCount = (array) => {
    return array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  };
  const getIdData = async () => {
    try {
      const res = await getClientById(clientId);
      const result = groupAndCount(res.albums);
      setGroupedAlbums(result)
      res.events = res.events?.sort((a, b) => {
        const dateA = new Date(a?.eventDate);
        const dateB = new Date(b?.eventDate);
        return dateA - dateB 
      })
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
  const updateEditedClient = (e) => {
    setEditedClient({ ...editedClient, [e.target.name]: e.target.value });
  };
  const addNewEvent = async () => {
    try {
      await addEvent(newEvent);
      setNewEvent({ client: clientId });
      setNewEventModel(false);
      window.notify("Event added successfully!", "success");
      getIdData();
      // getStoredEvents();
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
      // getStoredEvents();
    } catch (error) {
      console.log(error);
    }
  };
  const updateClient = async () => {
    try {
      console.log("Start")
      await updateClientData(editedClient);
      console.log("End")
      setEditedClient(null)
      setEditClientModal(false);
      getIdData();
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate()

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
            <th>Performance Films</th>
            <th>Long Films</th>
            <th>Reels</th>
            <th>Promo</th>
            <th>Payment Status</th>
            <th>Client Suggestion</th>
            <th>Action</th>
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
              className="tableBody Text14Semi primary2 fs-6 tablePlaceContent"
            >
              {clientData?.brideName}
              <br />
              <img alt="" src={Heart} />
              <br />
              {clientData?.groomName}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">+{clientData?.phoneNumber}</td>

            <td className="textPrimary fs-6 tablePlaceContent">
              <>
                {Object.entries(groupedAlbums).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </>
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
            <td className="textPrimary fs-6 tablePlaceContent">
              <FaEdit className="fs-5 cursor-pointer"
                onClick={() => {
                  setEditedClient(clientData)
                  setEditClientModal(true);
                }}
              /><MdDelete
                onClick={async () => {
                  deleteClientDetails.current = {
                    clientDelete : true,
                    _id : clientData._id,
                    message: "Are you sure you want to delete this client?"
                  }
                  setDeleteModal(true)
                  
                }}
                className="text-danger cursor-pointer fs-3"
              /></td>
          </tr>
        </tbody>
      </Table>
      <div className="clientBtn d-flex mb-3 flex-row justify-content-between">
        <h3 className=" my-1 py-1 Text24Semi d-sm-none d-md-block">Events</h3>
        <div>
          <button
            onClick={() => setNewEventModel(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#666DFF' }}
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
            <th>Shoot Directors</th>
            <th>Photographers</th>
            <th>Cinematographers</th>
            <th>Drones</th>
            <th>Same Day Photo Editors</th>
            <th>Same Day Video Editors</th>
            <th>Is Wedding</th>
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
                <td className="textPrimary tablePlaceContent fs-6">{event?.eventType}</td>
                <td className="textPrimary tablePlaceContent fs-6">{event.location}</td>
                <td className="textPrimary tablePlaceContent fs-6">{event?.travelBy}</td>
                <td className="textPrimary tablePlaceContent fs-6">{event?.shootDirector}</td>
                <td className="textPrimary tablePlaceContent fs-6">{event?.photographers}</td>
                <td className="textPrimary tablePlaceContent fs-6">{event?.cinematographers}</td>
                <td className="textPrimary tablePlaceContent fs-6">{event?.drones}</td>
                <td className="textPrimary tablePlaceContent fs-6">
                  {event?.sameDayPhotoEditors}
                </td>
                <td className="textPrimary tablePlaceContent fs-6">
                  {event?.sameDayVideoEditors}
                </td>
                <td className="textPrimary tablePlaceContent fs-6">
                  {event?.isWedding ? "Yes" : "No"}
                </td>
                {/* <td className="textPrimary tablePlaceContent fs-6">{event?.tentative}</td> */}
                <td className=" textPrimary tablePlaceContent fs-6">
                  <div className="d-flex flex-row align-items-center gap-2">

                    <FaEdit className="fs-5 cursor-pointer" 
                      onClick={() => {
                        setEventToEdit(event);
                        setEditEventModel(true);
                      }}
                    />
                    <MdDelete
                      onClick={async () => {
                        deleteClientDetails.current = {
                          clientDelete : false,
                          _id : event._id,
                          message: "Are you sure you want to delete this event?"
                        }
                        setDeleteModal(true)
                        // await deleteEvent(event._id);
                        // getIdData();
                        // getStoredEvents();
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

      <Modal isOpen={deleteModal} centered={true} size="md" >
        <ModalHeader>Warning</ModalHeader>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            if(deleteClientDetails.current?.clientDelete){
              await deleteClient(deleteClientDetails.current?._id)
              // getStoredEvents()
              navigate('/MyProfile/Client/ViewClient')
            }else if(!deleteClientDetails.current?.clientDelete){
              await deleteEvent(deleteClientDetails.current?._id);
              getIdData();
              // getStoredEvents();
            }
            setDeleteModal(false);
          }}
        >
          <ModalBody>
            <Row >
              <Col xl="12" sm="12" className="p-2">
                {deleteClientDetails.current?.message}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" type="submit" className="Update_btn">
              Delete
            </Button>
            <Button
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal isOpen={newEventModel} centered={true} size="lg" >
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
                      width: "280px"
                    }}
                    className="position-absolute"
                  >
                    <Calendar
                      
                      CalenderPress={() => setShowCalender(false)}
                      onClickDay={(date) => {
                        setShowCalender(!showCalender);
                        setNewEvent({ ...newEvent, eventDate: dayjs(new Date(date)).format('YYYY-MM-DD')});
                      }}
                      tileClassName={({ date }) => {
                        let count = 0;
                        for (
                          let index = 0;
                          index < allEvents?.length;
                          index++
                        ) {
                          const initialDate = dayjs(new Date(
                            allEvents[index].eventDate
                          )).format('YYYY-MM-DD');
                          const targetDate = dayjs(new Date(date)).format('YYYY-MM-DD');
                          // const initialDatePart = initialDate
                          //   .toISOString()
                          //   .split("T")[0];
                          // const targetDatePart = targetDate
                          //   .toISOString()
                          //   .split("T")[0];
                          if (initialDate === targetDate) {
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
                  className="ContactModel  Text16N"
                  placeholder="Location"
                  required
                />
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label mt25">Is This a Wedding Event</div>
                <input
                  onChange={(e) => {
                    setNewEvent({ ...newEvent, isWedding: e.target.checked });
                  }}
                  type="checkbox"
                  name="isWedding"
                  style={{ width: '16px', height: '16px' }}
                  checked={newEvent?.isWedding}
                // disabled={weddingAssigned}
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
                      className="w-100"
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

      <Modal isOpen={editEventModel} centered={true} size="lg" >
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
                      width: "280px"
                    }}
                    className="position-absolute"
                  >
                    <Calendar                    
                      CalenderPress={() => setShowCalender(false)}
                      onClickDay={(date) => {
                        setShowCalender(!showCalender);
                        setEventToEdit({ ...eventToEdit, eventDate: dayjs(new Date(date)).format('YYYY-MM-DD').toString() });
                      }}
                      
                      value={eventToEdit?.eventDate ? new Date(eventToEdit?.eventDate) : new Date()}
                      tileClassName={({ date }) => {
                        let count = 0;
                        for (
                          let index = 0;
                          index < allEvents?.length;
                          index++
                        ) {
                          const initialDate = dayjs(new Date(
                            allEvents[index].eventDate
                          )).format('YYYY-MM-DD');
                          const targetDate = dayjs(new Date(date)).format('YYYY-MM-DD');
                          // const initialDatePart = initialDate
                          //   .toISOString()
                          //   .split("T")[0];
                          // const targetDatePart = targetDate
                          //   .toISOString()
                          //   .split("T")[0];
                          if (initialDate === targetDate) {
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
              <Col xl="6" sm="6" className="p-2">
                <div className="label mt25">Is This a Wedding Event</div>
                <input
                  onChange={(e) => {
                    setEventToEdit({ ...eventToEdit, isWedding: e.target.checked });
                  }}
                  type="checkbox"
                  name="isWedding"
                  style={{ width: '16px', height: '16px' }}
                  checked={eventToEdit?.isWedding}
                // disabled={weddingAssigned}
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
                      className="w-100"
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



      <Modal isOpen={editClientModal} centered={true} size="lg" >
        <ModalHeader>Client Details</ModalHeader>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          
            updateClient();
          }}
        >
          <ModalBody>
            <Row ref={target}>

              <Col xl="6" sm="6" className="p-2">
                <div className="label">Bride Name</div>
                <input
                  value={editedClient?.brideName}
                  onChange={(e) => updateEditedClient(e)}
                  type="name"
                  name="brideName"
                  placeholder="Bride_Name"
                  className="ContactModel textPrimary"
                  required
                />
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Groom Name</div>
                <input
                  value={editedClient?.groomName}
                  onChange={(e) => updateEditedClient(e)}
                  type="name"
                  name="groomName"
                  placeholder="Bride_Name"
                  className="ContactModel textPrimary"
                  required
                />
              </Col>
              <Col xl="6" sm="6" className="p-2 mt-4">
                <div className="label">Phone Number</div>
                <PhoneInput
                  country='in'
                  name="phoneNumber"
                  id="exampleEmail"
                  required={true}
                  onChange={(value) => {
                    setEditedClient({ ...editedClient, phoneNumber: value })
                  }}

                  value={editedClient?.phoneNumber}
                  placeholder="Phone_Number"
                  inputClass={'ContactModel textPrimary editClientPhone'}
                />
              </Col>
              <Col xl="6" sm="6" className="p-2 mt-4">
                <div className="label">Email Id</div>
                <input
                  value={editedClient?.email}
                  onChange={(e) => updateEditedClient(e)}
                  type="email"
                  name="email"
                  placeholder="Email_Id"
                  className="ContactModel textPrimary"
                  required={false}
                />
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Booking Confirmed
                  </div>
                  <Select
                    value={
                      editedClient?.bookingStatus
                        ? { value: editedClient?.bookingStatus, label: editedClient?.bookingStatus } : null
                    }
                    name='bookingStatus'
                    className="w-100"
                    onChange={(selected) => {
                      setEditedClient({ ...editedClient, bookingStatus: selected.value })
                    }}
                    styles={customStyles}
                    options={bookingOptions}
                    required
                  />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Payment Status
                  </div>
                  <Select
                    value={
                      editedClient?.paymentStatus
                        ? { value: editedClient?.paymentStatus, label: editedClient?.paymentStatus } : null
                    }
                    name='paymentStatus'
                    className="w-100"
                    onChange={(selected) => {
                      setEditedClient({ ...editedClient, paymentStatus: selected.value })
                    }}
                    styles={customStyles}
                    options={paymentOptions}
                    required
                  />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Pre Wedding Photos
                  </div>
                  <input
                    type="checkbox"
                    onChange={(e)=>{
                      
                      setEditedClient({...editedClient, preWeddingPhotos : e.target.checked})
                    }}
                    name="preWeddingPhotos"
                    style={{ width: '16px', height: '16px' }}
                    checked={editedClient?.preWeddingPhotos}
                    disabled={false}
                  />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Pre Wedding Videos
                  </div>
                  <input
                    type="checkbox"
                    onChange={(e)=>{
                    
                      setEditedClient({...editedClient, preWeddingVideos : e.target.checked})
                    }}
                    name="preWeddingVideos"
                    style={{ width: '16px', height: '16px' }}
                    checked={editedClient?.preWeddingVideos}
                    disabled={false}
                  />
                </div>
              </Col>

              {(editedClient?.preWeddingVideos ||
                editedClient?.preWeddingPhotos) && (
                  <>
                    {deliverablePreWeddingOptionObjectKeys.map((Objkey) => (
                      <Col xl="6" sm="6" className="p-2">
                        <div className="mt25">
                          <div className="Text16N" style={{ marginBottom: "6px" }}>
                            {deliverableOptionsKeyValues &&
                              deliverableOptionsKeyValues[Objkey].label}
                          </div>
                          <Select
                            value={
                              editedClient?.["preWed" + Objkey] !== null
                                ? {
                                  value: editedClient?.["preWed" + Objkey],
                                  label: editedClient?.["preWed" + Objkey],
                                }
                                : null
                            }
                            name={"preWed" + Objkey}
                            onChange={(selected) => {
                              setEditedClient({ ...editedClient, ["preWed" + Objkey]: selected?.value, })

                            }}
                            className="w-100"
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
                  </>
                )}
              <p className="text16N fs-5 fw-bolder">Deliverables</p>

              {editedClient?.albums?.map((albumValue, i) =>
                deliverableAlbumOptionObjectKeys.map((Objkey) => (
                  <Col xl="6" sm="6" className="p-2" key={i}>
                    <div className="Drop">
                      <h4 className="LabelDrop">Album {i + 1}</h4>
                      <Select
                        value={
                          albumValue?.length > 0
                            ? { value: albumValue, label: albumValue }
                            : null
                        }
                        name={`album${i + 1}`}
                        className="w-100"
                        onChange={(selected) => {
                          const updatedAlbums = [...editedClient?.[Objkey]];
                          updatedAlbums[i] = selected?.value;
                          setEditedClient({ ...editedClient, [Objkey]: updatedAlbums, })


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

              <Col xs="12"  >
                <div className="d-flex fex-row">
                  {editedClient?.albums?.length > 1 && (
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
                        const updatedAlbums = [...editedClient?.albums];
                        updatedAlbums.pop();
                        setEditedClient({ ...editedClient, albums: updatedAlbums, })

                      }}
                    >
                      <CgMathMinus />
                    </div>
                  )}
                  <div
                    className="fs-3 mt-4 mx-1 d-flex justify-content-center align-items-center"
                    onClick={() => {
                      let updatedAlbums = [...editedClient?.albums];
                      updatedAlbums.push("");
                      setEditedClient({ ...editedClient, albums: updatedAlbums })

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
                </div>
              </Col>

              {deliverableOptionObjectKeys.map((Objkey) => (
                <Col xl="6" sm="6" className="p-2">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      {deliverableOptionsKeyValues &&
                        deliverableOptionsKeyValues[Objkey].label}
                    </div>
                    <Select
                      value={
                        editedClient?.[Objkey] !== null
                          ? {
                            value: editedClient?.[Objkey],
                            label: editedClient?.[Objkey],
                          }
                          : null
                      }
                      name={Objkey}
                      onChange={(selected) => {
                        setEditedClient({ ...editedClient, [Objkey]: selected?.value, })

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

              <Col className="p-2 mt-4">
                <div className="label">Client Suggestions</div>
                <input
                  value={editedClient?.suggestion}
                  onChange={(e) => updateEditedClient(e)}
                  type="name"
                  name="suggestion"
                  placeholder="Client_Suggestions"
                  className="ContactModel h100 textPrimary"
                  required={false}
                />
              </Col>


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
                setEditClientModal(false);
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
