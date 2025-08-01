import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Input,
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
import ButtonLoader from "../../components/common/buttonLoader";

import { FiChevronDown } from 'react-icons/fi';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
  const [editClientModal, setEditClientModal] = useState(false)
  const [editedClient, setEditedClient] = useState(null)
  const [editingClient, setEditingClient] = useState(false)
  const deliverableOptionObjectKeys = [
    "promos",
    "longFilms",
    "reels",
    "performanceFilms"
  ];
  const simpleFields = [
    "hardDrives"
  ]

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
      value: 'Recieved',
      label: 'Recieved',
    },
    {
      value: 'Cleared',
      label: 'Cleared',
    },
    {
      value: 'Pending',
      label: 'Pending',
    },
    {
      value: 'Others',
      label: 'Others',
    }
  ];
  let projectOptions = [
    {
      value: 'Open',
      label: 'Open',
    },
    {
      value: 'Closed',
      label: 'Closed',
    },
    {
      value: 'Closed & Cleared',
      label: 'Closed & Cleared',
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
      if ("Not included" !== item) {
        acc[item] = (acc[item] || 0) + 1;
      }
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
      console.log("res",res);
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
    } catch (error) {
      console.log(error);
    }
  };
  const updateClient = async () => {
    try {
      setEditingClient(true)
      await updateClientData(editedClient);
      setEditingClient(false)
      setEditedClient(null)
      setEditClientModal(false);
      getIdData();
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate()



  // Add this useEffect to initialize phoneNumbers array from single phoneNumber if needed
  useEffect(() => {
    if (editedClient) {
      if (!editedClient.phoneNumbers && editedClient.phoneNumber) {
        setEditedClient({
          ...editedClient,
          phoneNumbers: [{ number: editedClient.phoneNumber, belongsTo: 'Both' }]
        });
      }
    }
  }, [editedClient?.phoneNumber]);

  // Function to add a new phone number
  const addPhoneNumber = () => {
    setEditedClient({
      ...editedClient,
      phoneNumbers: editedClient.phoneNumbers
        ? [...editedClient.phoneNumbers, { number: '', belongsTo: 'Bride' }]
        : [{ number: '', belongsTo: 'Bride' }]
    });
  };

  // Function to remove a phone number
  const removePhoneNumber = (index) => {
    if (editedClient.phoneNumbers.length > 1) {
      const updatedPhoneNumbers = [...editedClient.phoneNumbers];
      updatedPhoneNumbers.splice(index, 1);
      setEditedClient({ ...editedClient, phoneNumbers: updatedPhoneNumbers });
    }
  };

  // Function to update a phone number
  const updatePhoneNumber = (value, index) => {
    const updatedPhoneNumbers = [...editedClient.phoneNumbers];
    updatedPhoneNumbers[index].number = value;

    // Also update the primary phoneNumber for backward compatibility
    if (index === 0) {
      setEditedClient({
        ...editedClient,
        phoneNumbers: updatedPhoneNumbers,
        phoneNumber: value
      });
    } else {
      setEditedClient({ ...editedClient, phoneNumbers: updatedPhoneNumbers });
    }
  };

  // Function to update who the phone number belongs to
  const updatePhoneOwner = (value, index) => {
    const updatedPhoneNumbers = [...editedClient.phoneNumbers];
    updatedPhoneNumbers[index].belongsTo = value;
    setEditedClient({ ...editedClient, phoneNumbers: updatedPhoneNumbers });
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
            <th>Performance Films</th>
            <th>Long Films</th>
            <th>Reels</th>
            <th>Promo</th>
            <th>Hard Drives</th>
            <th>Payment Status</th>
            {clientData?.paymentStatus === 'Pending' && (
              <th>Pending Amount</th>
            )}

            <th>Project Status</th>
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
            <td className="textPrimary fs-6 tablePlaceContent"> {clientData?.phoneNumbers ? clientData?.phoneNumbers.map(phoneObj => <p>{phoneObj.belongsTo}: +{phoneObj.number}</p>) : clientData?.phoneNumber && "+" + clientData?.phoneNumber}</td>

            <td className="textPrimary fs-6 tablePlaceContent">
              {clientData?.deliverables?.filter(deliv => deliv.isAlbum == true)?.length}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">
              {clientData?.preWeddingPhotos ? "Yes" : "No"}
            </td>
            <td className="textPrimary fs-6 tablePlaceContent">
              {clientData?.preWeddingVideos ? "Yes" : "No"}
            </td>

            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.deliverables?.filter(deliv => deliv.deliverableName === 'Performance Film')?.length}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.deliverables?.filter(deliv => deliv.deliverableName === 'Long Film')?.length}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.deliverables?.filter(deliv => deliv.deliverableName === 'Reel')?.length}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.deliverables?.filter(deliv => deliv.deliverableName === 'Promo')?.length}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.hardDrives || "_"}</td>
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.paymentStatus}</td>
            {clientData?.paymentStatus === 'Pending' && (
              <td className="textPrimary fs-6 tablePlaceContent">{clientData?.pendingAmount}</td>
            )}
            <td className="textPrimary fs-6 tablePlaceContent">{clientData?.projectStatus}</td>
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
                    clientDelete: true,
                    _id: clientData._id,
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody
          className="Text12 primary2"
          style={{
            textAlign: "center",
            borderWidth: "0px 1px 0px 1px",
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
                          clientDelete: false,
                          _id: event._id,
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
            if (deleteClientDetails.current?.clientDelete) {
              await deleteClient(deleteClientDetails.current?._id)
              // getStoredEvents()
              navigate('/clients/view-client/all-clients')
            } else if (!deleteClientDetails.current?.clientDelete) {
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
                        setNewEvent({ ...newEvent, eventDate: dayjs(new Date(date)).format('YYYY-MM-DD') });
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
              {/* Replace the existing Phone Number section with this */}
              <Col xl="6" sm="6" className="p-2 mt-4">
                <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Phone Numbers
                  <Button
                    color="primary"
                    size="sm"
                    onClick={addPhoneNumber}
                    style={{ borderRadius: '50%', padding: '6px 6px' }}
                  >
                    <LuPlus />
                  </Button>
                </div>

                {editedClient?.phoneNumbers?.map((phone, index) => (
                  <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <PhoneInput
                      country='in'
                      name={`phoneNumber-${index}`}
                      required={index === 0}
                      onChange={(value) => updatePhoneNumber(value, index)}
                      value={phone.number}
                      placeholder="Phone_Number"
                      inputClass='ContactModel textPrimary'
                      containerStyle={{ width: '70%' }}
                    />
                    <UncontrolledDropdown style={{ marginLeft: '5px', flex: 1 }}>
                      <DropdownToggle
                        caret
                        color="light"
                        style={{
                          backgroundColor: '#EFF0F5',
                          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15)',
                          color: '#666DFF',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        {phone.belongsTo} <FiChevronDown size={14} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => updatePhoneOwner('Bride', index)}>Bride</DropdownItem>
                        <DropdownItem onClick={() => updatePhoneOwner('Groom', index)}>Groom</DropdownItem>
                        <DropdownItem onClick={() => updatePhoneOwner('Both', index)}>Both</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    {editedClient.phoneNumbers.length > 1 && (
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => removePhoneNumber(index)}
                        style={{ borderRadius: '50%', marginLeft: '5px', padding: '6px 6px' }}
                      >
                        <CgMathMinus />
                      </Button>
                    )}
                  </div>
                ))}
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
              {editedClient?.paymentStatus === 'Others' && (
                <Col xl="6" sm="6" className="p-2">
                  <div className="label mt25">Payment Info</div>
                  <input
                    value={editedClient?.paymentInfo}
                    onChange={(e) => updateEditedClient(e)}
                    type="name"
                    name="paymentInfo"
                    placeholder="Payment_Info"
                    className="ContactModel textPrimary"
                    required
                  />
                </Col>
              )}
              <Col xl="6" sm="6" className="p-2">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Project Status
                  </div>
                  <Select
                    value={
                      editedClient?.projectStatus
                        ? { value: editedClient?.projectStatus, label: editedClient?.projectStatus } : null
                    }
                    name='paymentStatus'
                    className="w-100"
                    onChange={(selected) => {
                      setEditedClient({ ...editedClient, projectStatus: selected.value })
                    }}
                    styles={customStyles}
                    options={projectOptions}
                    required
                  />
                </div>
              </Col>
              {editedClient?.paymentStatus === 'Pending' && (
                <Col xl="6" sm="6" className="p-2">
                  <div className="label mt25">Pending Amount</div>
                  <input
                    value={editedClient?.pendingAmount}
                    onChange={(e) => updateEditedClient(e)}
                    type="name"
                    name="pendingAmount"
                    placeholder="Pending_Amount"
                    className="ContactModel textPrimary"
                    required
                  />
                </Col>
              )}
              <Col xl="6" sm="6" className="p-2">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    Pre Wedding Photos
                  </div>
                  <input
                    type="checkbox"
                    onChange={(e) => {

                      setEditedClient({ ...editedClient, preWeddingPhotos: e.target.checked })
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
                    onChange={(e) => {

                      setEditedClient({ ...editedClient, preWeddingVideos: e.target.checked })
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



              {editedClient?.events?.length > 0 && (
                <>
                  <div
                    className="fs-3 mt25"
                    style={{ marginTop: "30px", marginBottom: "0px !important" }}
                  >
                    Deliverables
                  </div>
                  {editedClient?.deliverablesArr?.map((deliverableObj, index) => (
                    <div className="bg-slight deliverableBox p-2 my-2">

                      <Row>
                        <Col xl="10" sm="8">
                          <div className=" d-flex flex-row align-items-center flex-wrap gap-4">
                            <h4 className="LabelDrop m-0">{deliverableObj?.number + ")"} For Events :</h4>
                            {editedClient?.events?.map((event, eventIndex) => (
                              <div className="d-flex flex-row  align-items-center flex-wrap gap-2">
                                <input
                                  onChange={(e) => {
                                    const updatedDeliverables = [...editedClient?.deliverablesArr]
                                    const updatedForEvents = [...deliverableObj?.forEvents];
                                    if (e.target.checked) {
                                      updatedForEvents.push(eventIndex)
                                      updatedDeliverables[index] = { ...updatedDeliverables[index], forEvents: updatedForEvents }
                                    } else {
                                      const filteredForEvents = updatedForEvents.filter(num => num != eventIndex)
                                      updatedDeliverables[index] = { ...updatedDeliverables[index], forEvents: filteredForEvents }
                                    }
                                    setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })

                                  }}
                                  type="checkbox"
                                  style={{ width: "16px", height: "16px" }}
                                  className="cursor-pointer"
                                  name={`event${index}-${eventIndex}`}
                                  checked={deliverableObj?.forEvents?.includes(eventIndex)}

                                />
                                <span>{event.eventType}</span>
                              </div>
                            ))}

                          </div>
                          <Row>
                            {deliverableObj?.albums?.map((albumValue, i) =>
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
                                        if (selected.value !== 'Not included') {

                                          const updatedDeliverables = [...editedClient?.deliverablesArr]
                                          const updatedAlbums = [...deliverableObj?.[Objkey]];
                                          updatedAlbums[i] = selected?.value;
                                          updatedDeliverables[index] = { ...updatedDeliverables[index], [Objkey]: updatedAlbums }
                                          setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })
                                        } else {
                                          const updatedDeliverables = [...editedClient?.deliverablesArr]
                                          const updatedAlbums = [...deliverableObj?.[Objkey]];
                                          if (i === 0) {
                                            updatedAlbums[i] = "Not included"
                                          } else {
                                            updatedAlbums.splice(i, 1);
                                          }
                                          updatedDeliverables[index] = { ...updatedDeliverables[index], [Objkey]: updatedAlbums }
                                          setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })
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
                            {deliverableObj?.albums?.length > 1 && (
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
                                  const updatedDeliverables = [...editedClient?.deliverablesArr]
                                  const updatedAlbums = [...deliverableObj?.albums];
                                  updatedAlbums.pop();
                                  updatedDeliverables[index] = { ...updatedDeliverables[index], albums: updatedAlbums };
                                  setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })

                                }}
                              >
                                <CgMathMinus />
                              </div>
                            )}
                            {(deliverableObj?.albums?.length >= 1 && deliverableObj?.albums[0] !== "" && deliverableObj?.albums[0] !== "Not included") && (


                              <div
                                className="fs-3 mt-4 mx-1 d-flex justify-content-center align-items-center"
                                onClick={() => {
                                  const updatedDeliverables = [...editedClient?.deliverablesArr]
                                  const updatedAlbums = [...deliverableObj?.albums];
                                  updatedAlbums.push("");
                                  updatedDeliverables[index] = { ...updatedDeliverables[index], albums: updatedAlbums };
                                  setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })
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
                              <div className="Text16N" style={{ marginBottom: "6px" }}>
                                {deliverableOptionsKeyValues &&
                                  deliverableOptionsKeyValues[Objkey].label}
                              </div>
                              <Select
                                value={
                                  deliverableObj?.[Objkey]
                                    ? {
                                      value: deliverableObj?.[Objkey],
                                      label: deliverableObj?.[Objkey],
                                    }
                                    : null
                                }
                                name={Objkey}
                                onChange={(selected) => {
                                  const updatedDeliverables = [...editedClient?.deliverablesArr]
                                  updatedDeliverables[index] = { ...updatedDeliverables[index], [Objkey]: selected?.value, }
                                  setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })
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
              {editedClient?.events?.length > 1 && (
                <Col xs="12" sm="6" lg="6" xl="4" className="mt-3">
                  <div className="d-flex fex-row">
                    {editedClient?.deliverablesArr?.length > 1 && (
                      <div
                        style={{
                          backgroundColor: "rgb(102, 109, 255)",
                          color: "white",
                          width: "30px",
                          height: "30px",
                          borderRadius: "100%",
                        }}
                        className="fs-3 cursor-pointer mt-4 mx-1 d-flex justify-content-center align-items-center"
                        onClick={() => {
                          const updatedDeliverables = [...editedClient?.deliverablesArr];
                          updatedDeliverables.pop()
                          setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })
                        }}
                      >
                        <CgMathMinus />
                      </div>
                    )}
                    <div
                      className="fs-5 p-2 cursor-pointer mt-4 mx-1 d-flex justify-content-center align-items-center"
                      onClick={() => {
                        const updatedDeliverables = [...editedClient?.deliverablesArr];
                        updatedDeliverables.push({ photos: true, albums: [""], forEvents: [], number: editedClient?.deliverablesArr?.length + 1 })
                        setEditedClient({ ...editedClient, deliverablesArr: updatedDeliverables })
                      }}
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
            </Row>
            <Row>
              {simpleFields.map((Objkey) => (
                <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      Hard Drives
                    </div>
                    <Input
                      type="text"
                      name='hardDrives'

                      className="forminput"
                      value={editedClient?.hardDrives}
                      required={true}
                      onChange={(e) => updateEditedClient(e)}
                      placeholder={"Hard_Drives"}
                    />

                  </div>
                </Col>
              ))}
            </Row>
            <Row>
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
              {editingClient ? <ButtonLoader /> : "UPDATE"}
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
