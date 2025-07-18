import React, { useRef, useState, useEffect } from "react";
import { Table } from "reactstrap";
import Heart from "../../assets/Profile/Heart.svg";
import Camera from "../../assets/Profile/Camera.svg";
import Video from "../../assets/Profile/Video.svg";
import Drone from "../../assets/Profile/Drone.svg";
import Manager from "../../assets/Profile/Manager.svg";
import Assistant from "../../assets/Profile/Assistant.svg";
import Car from "../../assets/Profile/Car.svg";
import Plane from "../../assets/Profile/Plane.svg";
import ShootDropDown from "../../components/ShootDropDown";
import {
  addEvent,
  getAllEvents,
  getEventsByFixDate,
  getEventsByMonth,
} from "../../API/Event";
import { assignEventTeam, getEvents } from "../../API/Event";
import { getAllUsers } from "../../API/userApi";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import CalenderImg from "../../assets/Profile/Calender.svg";
import Select from "react-select";
import Calendar from "react-calendar";
import { IoIosArrowRoundUp, IoIosWarning } from "react-icons/io";
import ClientHeader from "../../components/ClientHeader";
import { IoIosArrowRoundDown } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { getAllEventOptions } from "../../API/FormEventOptionsAPI";
import { getAllClients } from "../../API/Client";
import { GrPowerReset } from "react-icons/gr";
import CalenderMultiListView from "../../components/CalendarFilterListView";
import { Overlay } from "react-bootstrap";
import Spinner from "../../components/Spinner";
import { useLoggedInUser } from "../../config/zStore";
import RangeCalendarFilter from "../../components/common/RangeCalendarFilter";
import { MdOutlinePhotoCameraFront } from "react-icons/md";
import { MdPhotoCameraFront } from "react-icons/md";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Decemeber",
];
const transport_icons = {
  Cab: Car,
  "Personal Car": Car,
  Flight: Plane,
  Bus: Car,
};

function ListView(props) {
  const { clientIdd } = useParams();
  const allEvents = useSelector((state) => state.allEvents);
  const [eventsForShow, setEventsForShow] = useState(null);
  const { userData: currentUser } = useLoggedInUser();
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [ascending, setAscending] = useState(false);
  const [newEventModel, setNewEventModel] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [showCalender, setShowCalender] = useState(false);
  const [eventOptionsKeyValues, setEventOptionsKeyValues] = useState(null);
  const eventOptionObjectKeys = [
    "travelBy",
    "shootDirector",
    "photographers",
    "cinematographers",
    "drones",
    "sameDayPhotoEditors",
    "sameDayVideoEditors",
  ];
  const target = useRef(null);
  const currentDate = new Date();
  const [show, setShow] = useState(false);
  const [rowOfWarning, setRowOfWarnig] = useState(null);
  const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const [monthForData, setMonthForData] = useState(
    months[new Date().getMonth()] + " " + new Date().getFullYear()
  );
  const [directors, setDirectors] = useState([]);
  const [photographer, setPhotographer] = useState([]);
  const [cinematographer, setCinematographer] = useState([]);
  const [flyer, setFlyer] = useState([]);
  const [manager, setManager] = useState([]);
  const [assistant, setAssistant] = useState([]);
  const [photoEditor, setPhotoEditor] = useState([]);
  const [videoEditor, setVideoEditor] = useState([]);
  const [clientId, setClientId] = useState(clientIdd);
  const [allClients, setAllClients] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const toggle = () => {
    setShow(!show);
  };

  const groupByClientID = (events) => {
    // Step 1: Group events by brideName
    const groupedByClientID = events?.reduce((acc, event) => {
      const clientID = event?.client?._id;
      // Check if the bride's group already exists in acc
      let found = acc?.find((group) => group.clientID === clientID);
      if (!found) {
        // Create a new group for this bride
        found = { clientID, events: [] };
        acc.push(found);
      }
      // Add the current event to the bride's group
      found.events.push(event);
      return acc;
    }, []);

    // Step 3: Flatten the groups back into a single array of events
    const sortedEvents = groupedByClientID.reduce((acc, group) => {
      acc.push(...group.events); // Append each group's sorted events
      return acc;
    }, []);

    return sortedEvents;
  };

  const getEventsData = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      setDirectors(
        usersData.users.filter((user) =>
          user.subRole.includes("Shoot Director")
        )
      );
      setPhotographer(
        usersData.users.filter((user) => user.subRole.includes("Photographer"))
      );
      setCinematographer(
        usersData.users.filter((user) =>
          user.subRole.includes("Cinematographer")
        )
      );
      setFlyer(
        usersData.users.filter((user) => user.subRole.includes("Drone Flyer"))
      );
      setManager(
        usersData.users.filter((user) => user.subRole.includes("Manager"))
      );
      setAssistant(
        usersData.users.filter((user) => user.subRole.includes("Assistant"))
      );
      setPhotoEditor(
        usersData.users.filter((user) => user.subRole.includes("Photo Editor"))
      );
      setVideoEditor(
        usersData.users.filter((user) => user.subRole.includes("Video Editor"))
      );

      let res = await getEvents(
        clientId,
        startDate,
        endDate,
      );
      if (currentUser.rollSelect === "Manager" || currentUser?.rollSelect === 'Production Manager') {
        setEventsForShow(
          groupByClientID(
            res?.data?.sort((a, b) => {
              const dateA = new Date(a?.eventDate);
              const dateB = new Date(b?.eventDate);
              return ascending ? dateB - dateA : dateA - dateB;
            })
          )
        );
      } else if (currentUser.rollSelect === "Shooter" || currentUser.rollSelect === "Editor") {
        let eventsToShow = [];
        res?.data?.forEach((event) => {
          if (
            event?.shootDirectors?.some(
              (director) => director._id === currentUser._id
            )
          ) {
            eventsToShow.push({ ...event, userRole: "Shoot Directors" });
          } else if (
            event?.choosenPhotographers?.some(
              (photographer) => photographer._id === currentUser._id
            )
          ) {
            eventsToShow.push({ ...event, userRole: "Photographer" });
          } else if (
            event?.choosenCinematographers?.some(
              (cinematographer) => cinematographer._id === currentUser._id
            )
          ) {
            eventsToShow.push({ ...event, userRole: "Cinematographer" });
          } else if (
            event?.droneFlyers?.some((flyer) => flyer._id === currentUser._id)
          ) {
            eventsToShow.push({ ...event, userRole: "Drone Flyer" });
          } else if (
            event.manager?.some((manager) => manager._id === currentUser._id)
          ) {
            eventsToShow.push({ ...event, userRole: "Manager" });
          } else if (
            event?.sameDayPhotoMakers?.some(
              (photoMaker) => photoMaker._id === currentUser._id
            )
          ) {
            eventsToShow.push({ ...event, userRole: "Same Day Video Maker" });
          } else if (
            event?.sameDayVideoMakers?.some(
              (videoMaker) => videoMaker._id === currentUser._id
            )
          ) {
            eventsToShow.push({ ...event, userRole: "Same Day Video Maker" });
          } else if (
            event?.assistants?.some(
              (assistant) => assistant._id === currentUser._id
            )
          ) {
            eventsToShow.push({ ...event, userRole: "Assistant" });
          }
        });
        setEventsForShow(
          groupByClientID(
            eventsToShow?.sort((a, b) => {
              const dateA = new Date(a?.eventDate);
              const dateB = new Date(b?.eventDate);
              return ascending ? dateB - dateA : dateA - dateB;
            })
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEventsData();
  }, [updateData]);



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

  const onSubmitHandler = async (event, index) => {
    try {
      setUpdatingIndex(index);
      await assignEventTeam(event);
      setUpdatingIndex(null);
      event.shootDirectors?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.choosenPhotographers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.choosenCinematographers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.droneFlyers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.manager?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.assistants?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.sameDayPhotoMakers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
      event.sameDayVideoMakers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "event",
              data: event,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: event._id,
            },
          },
        });
      });
    } catch (error) {
      toast.error("It seems like nothing to update");
      return;
    }
  };

  const getClientsForFilters = async () => {
    const completeclients = await getAllClients();
    setAllClients(completeclients);
  };

  const filterOptions = [
    {
      title: "Clients",
      id: 1,
      filters: allClients,
    },
  ];

  const applySorting = (order) => {
    try {
      setEventsForShow(
        groupByClientID(
          eventsForShow?.sort((a, b) => {
            const dateA = new Date(a?.eventDate);
            const dateB = new Date(b?.eventDate);
            return order ? dateB - dateA : dateA - dateB;
          })
        )
      );
    } catch (error) {
      console.log("applySorting ERROR", error);
    }
  };

  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();
    setEventOptionsKeyValues(eventOptions);
  };

  useEffect(() => {
    getEventsData();
    // getStoredEvents();
    getAllFormOptionsHandler();
    getClientsForFilters();
  }, []);

  useEffect(() => {
    // Select the .table-responsive element
    const tableResponsiveElement = document.querySelector(".table-responsive");
    // Apply the max-height style
    if (tableResponsiveElement) {
      tableResponsiveElement.style.maxHeight = "75vh";
      tableResponsiveElement.style.overflowY = "auto";
    }

    // Clean up style when the component unmounts
    return () => {
      if (tableResponsiveElement) {
        tableResponsiveElement.style.maxHeight = "";
        tableResponsiveElement.style.overflowY = "";
      }
    };
  }, [document.querySelector(".table-responsive")]);

  const addNewEvent = async () => {
    try {
      await addEvent(newEvent);
      setNewEvent({});
      setNewEventModel(false);
      window.notify("Event added successfully!", "success");
      getEventsData();
      // getStoredEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const updateNewEvent = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const filterByNameHanler = (idOfClient) => {
    console.log(idOfClient);

    if (idOfClient == "Reset") {
      setClientId(null);
      setUpdateData(!updateData)
      return;
    }
    setClientId(idOfClient);
    setUpdateData(!updateData)
  };

  const returnOneRow = (event, prevEvent) => {
    if (prevEvent && !clientId) {
      if (event?.client?._id !== prevEvent?.client?._id) {
        if (currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") {
          return (
            <tr style={{ backgroundColor: "rgb(102, 109, 255)" }}>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
            </tr>
          );
        } else {
          return (
            <tr style={{ backgroundColor: "rgb(102, 109, 255)" }}>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>

            </tr>
          );
        }
      }
    }
  };

  const getClientsForFilterShooter = () => {
    const set = new Set();
    let clients = [];

    allEvents?.forEach((event) => {
      if (!set.has(event.client._id)) {
        clients.push(event.client);
        set.add(event.client._id);
      }
    });
    return clients;
  };
  // console.log('events ', eventsForShow);

  return (
    <>
      <ToastContainer />
      {eventsForShow !== null ? (
        <>
          <ClientHeader title="List View" options={filterOptions} calender />
          <div
            className=" d-flex mx-auto align-items-center justify-content-between flex-wrap gap-3"
            style={{ width: "100%" }}
          >
            <div style={{ width: "120px" }}>
              {currentUser?.rollSelect == "Manager" && (
                <button
                  onClick={() => setNewEventModel(true)}
                  className="btn btn-primary"
                  style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
                >
                  Add Event
                </button>
              )}
            </div>

            <div style={{ width: "200px", zIndex: 102 }}>
              <Select
                isSearchable={true}
                onChange={(e) => {
                  console.log(e);

                  filterByNameHanler(e.value)
                }}
                styles={{ ...customStyles, zIndex: -1000, width: "300px" }}
                options={[
                  {
                    value: "Reset",
                    label: (
                      <div className="d-flex justify-content-around">
                        <strong>Reset</strong>
                      </div>
                    ),
                    brideName: 'reset',
                    groomName: 'reset'
                  },
                  ...Array.from(
                    (currentUser.rollSelect === "Manager" || currentUser.rollSelect === "Production Manager")
                      ? allClients
                      : getClientsForFilterShooter()
                  )?.map((client) => {
                    return {
                      value: client._id,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{client.brideName}</span>
                          <img className="mx-1" alt="" src={Heart} />
                          <span>{client.groomName}</span>
                        </div>
                      ),
                      brideName: client.brideName,
                      groomName: client.groomName,
                    };
                  }),
                ]}
                filterOption={(option, searchInput) => {
                  const { brideName, groomName } = option.data;
                  const searchText = searchInput?.toLowerCase();
                  if (brideName === 'reset' && groomName === 'reset') {
                    return true
                  }
                  // Perform search on both brideName and groomName
                  return (
                    brideName?.toLowerCase().startsWith(searchText) ||
                    groomName?.toLowerCase().startsWith(searchText)
                  );
                }}
                required
              />
            </div>
            <div
              className="addMarginForCalendar"
              style={{ width: "200px", position: "relative" }}
            >
              <div
                ref={target}
                className={`forminput R_A_Justify1`}
                style={{ cursor: "pointer" }}
              >
                <div onClick={toggle}>
                  <>
                    {monthForData}
                  </>

                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ position: "relative" }}
                >
                  <img alt="" src={CalenderImg} onClick={toggle} />
                  <GrPowerReset
                    className="mx-1"
                    onClick={() => {
                      setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
                      setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
                      setMonthForData(months[currentDate.getMonth()] + " " + currentDate.getFullYear());
                      setUpdateData(!updateData);
                    }}
                  />
                </div>
              </div>
            </div>
          </div> 
          <div style={{ overflowX: "hidden", width: "100%" }}>
            <Table
              striped
              responsive
              style={{
                marginTop: "15px",
                width: "180%",
              }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 101 }}>

                <tr className="logsHeader Text16N1">
                  <th className="tableBody sticky-column ">Couple Location</th>
                  <th className="tableBody sticky-column ">
                    Date{" "}
                    {!ascending ? (
                      <IoIosArrowRoundDown
                        style={{ color: "#666DFF" }}
                        onClick={() => {
                          setAscending(false);
                          applySorting(false);
                        }}
                        className="fs-4 cursor-pointer"
                      />
                    ) : (
                      <IoIosArrowRoundUp
                        style={{ color: "#666DFF" }}
                        className="fs-4 cursor-pointer"
                        onClick={() => {
                          setAscending(true);
                          applySorting(true);
                        }}
                      />
                    )}
                  </th>
                  <th className="tableBody">Shoot Directors</th>
                  <th className="tableBody mx-1">
                    Photographers
                    <img alt="" src={Camera} />
                  </th>
                  <th className="tableBody mx-1">
                    Cinematographers
                    <img alt="" src={Video} />
                  </th>
                  <th className="tableBody mx-1">
                    Drone Flyers
                    <img alt="" src={Drone} />
                  </th>
                  <th className="tableBody mx-1">
                    Manager
                    <img alt="" src={Manager} />
                  </th>
                  <th className="tableBody mx-1">
                    Assistants
                    <img alt="" src={Assistant} />
                  </th>
                  <th className="tableBody">Same Day Photos</th>
                  <th className="tableBody">Same Day Videos</th>
                  {(currentUser.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") && (
                    <th className="tableBody">Team Assign</th>
                  )}
                </tr>


              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: "center",
                  borderWidth: "0px 1px 0px 1px",
                }}
              >
                {eventsForShow?.map((event, index) => {
                  let errorText = "";
                  if (currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") {
                    if (
                      Number(event?.sameDayVideoEditors) > 0 &&
                      (!event?.sameDayVideoMakers ||
                        event?.sameDayVideoMakers.length !=
                        Number(event.sameDayVideoEditors))
                    ) {
                      errorText += "Same Day Video Maker(s) are incomplete, \n";
                    }

                    if (
                      Number(event?.sameDayPhotoEditors) > 0 &&
                      (!event?.sameDayPhotoMakers ||
                        event?.sameDayPhotoMakers.length !==
                        Number(event.sameDayPhotoEditors))
                    ) {
                      errorText += "Same Day Photo Maker(s) are incomplete, \n";
                    }

                    if (
                      Number(event?.cinematographers) > 0 &&
                      (!event?.choosenCinematographers ||
                        event?.choosenCinematographers?.length !==
                        Number(event?.cinematographers))
                    ) {
                      errorText += "Cinematographer(s) are incomplete, \n";
                    }

                    if (
                      Number(event?.drones) > 0 &&
                      (!event?.droneFlyers ||
                        event?.droneFlyers.length !== Number(event.drones))
                    ) {
                      errorText += "Drone Flyer(s) are not complete, \n";
                    }

                    if (!event?.manager || event?.manager.length !== 1) {
                      errorText += "Manager(s) are incomplete, \n";
                    }

                    if (
                      Number(event?.photographers) > 0 &&
                      (!event?.choosenPhotographers ||
                        event?.choosenPhotographers.length !==
                        Number(event?.photographers))
                    ) {
                      errorText += "Photographer(s) are incomplete, \n";
                    }

                    if (
                      Number(event?.shootDirector) > 0 &&
                      (!event?.shootDirectors ||
                        event?.shootDirectors.length !==
                        Number(event?.shootDirector))
                    ) {
                      errorText += "Shoot Director(s) are incomplete. \n";
                    }
                  }


                  return (
                    <>
                      {returnOneRow(
                        event,
                        index >= 0 ? eventsForShow[index - 1] : null
                      )}
                      {event && event !== null && (
                        <>
                          {(currentUser.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") && (
                            <tr className="relative" key={index}>
                              <td
                                style={{
                                  width: "180px",
                                }}
                                className={`tableBody Text14Semi primary2 ${rowOfWarning === index ||
                                  (rowOfWarning === index - 1 &&
                                    errorText?.length > 150)
                                  ? " "
                                  : " sticky-column "
                                  } tablePlaceContent`}
                              >

                                <div
                                  className={"d-flex flex-row justify-content-center"}>
                                  <div
                                    className={`${errorText.length === 0 && "ms-4"
                                      }`}
                                  >
                                    {event?.client?.brideName}
                                    <br />
                                    <img alt="" src={Heart} />
                                    <br />
                                    {event?.client?.groomName}
                                    <br />
                                    <div
                                      className="mt-2"
                                      style={{ color: "green" }}
                                    >
                                      {event?.location}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                      {errorText.length > 0 && (
                                        <ButtonWithHoverBox
                                          buttonText="error"
                                          hoverText={errorText}
                                          setRowOfWarnig={setRowOfWarnig}
                                          i={index}
                                        />
                                      )}
                                      <img height="30"
                                        alt=""
                                        src={transport_icons[event.travelBy]}
                                      />
                                      {Number(event?.sameDayPhotoEditors) > 0 && (
                                        <MdOutlinePhotoCameraFront className="fs-4" />
                                      )}
                                      {Number(event?.sameDayVideoEditors) > 0 && (
                                        <MdPhotoCameraFront className="fs-4" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                style={{
                                  width: "90px",
                                  marginLeft: 10,
                                }}
                                className={`tableBody Text14Semi primary2 ${rowOfWarning === index ||
                                  (rowOfWarning === index - 1 &&
                                    errorText?.length > 150)
                                  ? " "
                                  : " sticky-column "
                                  }  tablePlaceContent`}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {dayjs(event?.eventDate).format(
                                    "DD-MMM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <ShootDropDown
                                  role={"shootDirectors"}
                                  message={"Shoot Directors"}
                                  teble={true}
                                  allowedPersons={event?.shootDirector}
                                  usersToShow={directors}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  eventsForShow={eventsForShow}
                                  existedUsers={event?.shootDirectors}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].shootDirectors =
                                      Array.isArray(event?.shootDirectors)
                                        ? [...event?.shootDirectors, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].shootDirectors =
                                      event?.shootDirectors?.filter(
                                        (director) =>
                                          director._id !== userObj._id
                                      );

                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.shootDirectors) &&
                                  event?.shootDirectors?.map((director) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {director.firstName} {director.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <ShootDropDown
                                  role={"choosenPhotographers"}
                                  message={"Photographers"}
                                  teble={true}
                                  allowedPersons={event?.photographers}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  eventsForShow={eventsForShow}
                                  usersToShow={photographer}
                                  existedUsers={event?.choosenPhotographers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].choosenPhotographers =
                                      Array.isArray(event?.choosenPhotographers)
                                        ? [
                                          ...event?.choosenPhotographers,
                                          userObj,
                                        ]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].choosenPhotographers =
                                      event?.choosenPhotographers?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.choosenPhotographers) &&
                                  event?.choosenPhotographers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <ShootDropDown
                                  role={"choosenCinematographers"}
                                  message={"Cinematographers"}
                                  teble={true}
                                  currentEvent={event}
                                  eventsForShow={eventsForShow}
                                  allEvents={allEvents}
                                  allowedPersons={event?.cinematographers}
                                  usersToShow={cinematographer}
                                  existedUsers={event?.choosenCinematographers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[
                                      index
                                    ].choosenCinematographers = Array.isArray(
                                      event?.choosenCinematographers
                                    )
                                        ? [
                                          ...event?.choosenCinematographers,
                                          userObj,
                                        ]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[
                                      index
                                    ].choosenCinematographers =
                                      event?.choosenCinematographers?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(
                                  event?.choosenCinematographers
                                ) &&
                                  event?.choosenCinematographers &&
                                  event?.choosenCinematographers?.map(
                                    (user) => (
                                      <p
                                        style={{
                                          marginBottom: 0,
                                          fontFamily: "Roboto Regular",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {user.firstName} {user.lastName}
                                      </p>
                                    )
                                  )}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <ShootDropDown
                                  role={"droneFlyers"}
                                  message={"Drone Flyers"}
                                  teble={true}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  eventsForShow={eventsForShow}
                                  allowedPersons={event?.drones}
                                  usersToShow={flyer}
                                  existedUsers={event?.droneFlyers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].droneFlyers =
                                      Array.isArray(event?.droneFlyers)
                                        ? [...event?.droneFlyers, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].droneFlyers =
                                      event?.droneFlyers?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.droneFlyers) &&
                                  event?.droneFlyers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <ShootDropDown
                                  role={"manager"}
                                  message={"Manager"}
                                  teble={true}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  allowedPersons={1}
                                  usersToShow={manager}
                                  eventsForShow={eventsForShow}
                                  existedUsers={event?.manager}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].manager =
                                      Array.isArray(event?.manager)
                                        ? [...event?.manager, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].manager =
                                      event?.manager?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.manager) &&
                                  event?.manager?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <ShootDropDown
                                  role={"assistants"}
                                  message={"Assistants"}
                                  teble={true}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  allowedPersons={4}
                                  usersToShow={assistant}
                                  eventsForShow={eventsForShow}
                                  existedUsers={event?.assistants}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].assistants =
                                      Array.isArray(event?.assistants)
                                        ? [...event?.assistants, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].assistants =
                                      event?.assistants?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.assistants) &&
                                  event?.assistants?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                <ShootDropDown
                                  role={"sameDayPhotoMakers"}
                                  message={"Same Day Photo Makers"}
                                  teble={true}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  eventsForShow={eventsForShow}
                                  allowedPersons={event?.sameDayPhotoEditors}
                                  usersToShow={photoEditor}
                                  existedUsers={event?.sameDayPhotoMakers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].sameDayPhotoMakers =
                                      Array.isArray(event?.sameDayPhotoMakers)
                                        ? [
                                          ...event?.sameDayPhotoMakers,
                                          userObj,
                                        ]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].sameDayPhotoMakers =
                                      event?.sameDayPhotoMakers?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.sameDayPhotoMakers) &&
                                  event?.sameDayPhotoMakers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                <ShootDropDown
                                  role={"sameDayVideoEditors"}
                                  message={"Same Day Video Makers"}
                                  teble={true}
                                  allowedPersons={event?.sameDayVideoEditors}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  eventsForShow={eventsForShow}
                                  usersToShow={videoEditor}
                                  existedUsers={event?.sameDayVideoMakers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].sameDayVideoMakers =
                                      Array.isArray(event?.sameDayVideoMakers)
                                        ? [
                                          ...event?.sameDayVideoMakers,
                                          userObj,
                                        ]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].sameDayVideoMakers =
                                      event?.sameDayVideoMakers?.filter(
                                        (existingUser) =>
                                          existingUser._id !== userObj._id
                                      );
                                    setEventsForShow(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.sameDayVideoMakers) &&
                                  event?.sameDayVideoMakers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  ))}
                              </td>
                              <td className="tablePlaceContent">
                                <button
                                  style={{
                                    backgroundColor: "#FFDADA",
                                    borderRadius: "5px",
                                    border: "none",
                                    height: "30px",
                                  }}
                                  onClick={() => onSubmitHandler(event, index)}
                                >
                                  {updatingIndex === index ? (
                                    <div className="w-100">
                                      <div className="smallSpinner mx-auto"></div>
                                    </div>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </td>
                            </tr>
                          )}
                          {(currentUser.rollSelect === "Shooter" || currentUser.rollSelect === "Editor") && (
                            <tr className="relative" key={index}>
                              <td
                                className={`tableBody Text14Semi primary2  tablePlaceContent`}
                              >
                                <div
                                  className="d-flex flex-row justify-content-center"
                                >
                                  <div
                                  >
                                    {event?.client?.brideName}
                                    <br />
                                    <img alt="" src={Heart} />
                                    <br />
                                    {event?.client?.groomName}
                                    <br />
                                    <div
                                      className="mt-2"
                                      style={{ color: "green" }}
                                    >
                                      {event?.location}
                                    </div>
                                    <img
                                      alt=""
                                      src={transport_icons[event.travelBy]}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td
                                style={{
                                  width: "90px",

                                }}
                                className={`tableBody Text14Semi primary2  tablePlaceContent`}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {dayjs(event?.eventDate).format(
                                    "DD-MMM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                {(Array.isArray(event?.shootDirectors) && event?.shootDirectors?.length > 0) ?
                                  event?.shootDirectors?.map((director) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {director.firstName} {director.lastName}
                                    </p>
                                  )) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                {(Array.isArray(event?.choosenPhotographers) && event?.choosenPhotographers?.length > 0) ?
                                  event?.choosenPhotographers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  )) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                {(Array.isArray(event?.choosenCinematographers) && event?.choosenCinematographers?.length > 0) ?
                                  event?.choosenCinematographers?.map(
                                    (user) => (
                                      <p
                                        style={{
                                          marginBottom: 0,
                                          fontFamily: "Roboto Regular",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {user.firstName} {user.lastName}
                                      </p>
                                    )
                                  ) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                {(Array.isArray(event?.droneFlyers) && event?.droneFlyers?.length > 0) ?
                                  event?.droneFlyers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  )) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                {(Array.isArray(event?.manager) && event?.manager?.length > 0) ?
                                  event?.manager?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  )) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">

                                {(Array.isArray(event?.assistants) && event?.assistants?.length > 0) ?
                                  event?.assistants?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  )) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">


                                {(Array.isArray(event?.sameDayPhotoMakers) && event?.sameDayPhotoMakers?.length > 0) ?
                                  event?.sameDayPhotoMakers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  )) : "None"}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">


                                {(Array.isArray(event?.sameDayVideoMakers) && event?.sameDayVideoMakers?.length > 0) ?
                                  event?.sameDayVideoMakers?.map((user) => (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {user.firstName} {user.lastName}
                                    </p>
                                  )) : "None"}
                              </td>

                            </tr>

                          )}
                        </>
                      )}
                    </>
                  );
                })}
              </tbody>
            </Table>
            {loading && <Spinner />}
            {!hasMore && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <div>No more data to load.</div>
              </div>
            )}
            {/* {!loading && hasMore && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <button
                  onClick={() => fetchEvents()}
                  className="btn btn-primary"
                  style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
                >
                  Load More
                </button>
              </div>
            )} */}
          </div>
          <Overlay
            rootClose={true}
            onHide={() => {
              setShow(false);
              setUpdateData(!updateData);
            }}
            target={target.current}
            show={show}
            placement="bottom"
          >
            <div style={{ width: "300px", zIndex: 102 }}>
              <RangeCalendarFilter startDate={startDate} setMonthForData={setMonthForData} updateStartDate={setStartDate} updateEndDate={setEndDate} endDate={endDate} />
              {/* <CalenderMultiListView
                monthForData={monthForData}
                dateForFilter={dateForFilter}
                yearForData={yearForData}
                setShow={setShow}
                setMonthForData={setMonthForData}
                setYearForData={setYearForData}
                setDateForFilter={setDateForFilter}
              /> */}
            </div>
          </Overlay>
        </>
      ) : (
        <div
          style={{ height: "400px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="spinner"></div>
        </div>
      )}

      <Modal
        className="bg-white"
        style={{ borderRadius: "10px" }}
        isOpen={newEventModel}
        centered={true}
        size="lg"
      >
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
          <ModalBody className="bg-white ">
            <Row ref={target}>
              <Col xl="6" sm="6" lg="6" className="p-2">
                <div className="label">Client</div>
                <Select
                  className="w-full"
                  onChange={(selected) => {
                    setNewEvent({ ...newEvent, client: selected.value });
                  }}
                  styles={customStyles}
                  options={[
                    {
                      value: "Reset",
                      label: (
                        <div className="d-flex justify-content-around">
                          <strong>Reset</strong>
                        </div>
                      ),
                    },
                    ...Array.from(
                      // Use a Map to filter out duplicate clients
                      new Map(
                        allEvents?.map((event) => [
                          // Use a unique key based on both bride and groom names
                          event?.client?.brideName +
                          "<" +
                          event?.client?.groomName,
                          event,
                        ])
                      ).values() // Extract the unique events from the Map
                    ).map((event) => ({
                      value: event?.client?._id,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{event?.client?.brideName}</span>{" "}
                          <img alt="" src={Heart} />{" "}
                          <span>{event?.client?.groomName}</span>
                        </div>
                      ),
                      brideName: event?.client?.brideName,
                      groomName: event?.client?.groomName,
                    })),
                  ]}
                  required
                  filterOption={(option, searchInput) => {
                    const { brideName, groomName } = option.data;
                    const searchText = searchInput?.toLowerCase();

                    // Perform search on both brideName and groomName
                    return (
                      brideName?.toLowerCase().startsWith(searchText) ||
                      groomName?.toLowerCase().startsWith(searchText)
                    );
                  }}
                />
              </Col>
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
                      width: "300px",
                      right: "5px",
                    }}
                    className="position-absolute top-5 right-5"
                  >
                    <Calendar
                      CalenderPress={() => setShowCalender(false)}
                      onClickDay={(date) => {
                        setShowCalender(!showCalender);
                        setNewEvent({
                          ...newEvent,
                          eventDate: dayjs(new Date(date)).format("YYYY-MM-DD"),
                        });
                      }}
                      tileClassName={({ date }) => {
                        let count = 0;
                        for (
                          let index = 0;
                          index < allEvents?.length;
                          index++
                        ) {
                          const initialDate = dayjs(
                            new Date(allEvents[index].eventDate)
                          ).format("YYYY-MM-DD");
                          const targetDate = dayjs(new Date(date)).format(
                            "YYYY-MM-DD"
                          );

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
                <div className="label mt25">Event Type</div>
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
              <Col xl="6" sm="6" className="p-2">
                <div className="label mt25">Is This a Wedding Event</div>
                <input
                  onChange={(e) => {
                    setNewEvent({ ...newEvent, isWedding: e.target.checked });
                  }}
                  type="checkbox"
                  name="isWedding"
                  style={{ width: "16px", height: "16px" }}
                  checked={newEvent?.isWedding}
                // disabled={weddingAssigned}
                />
              </Col>
              {eventOptionObjectKeys?.map((Objkey) => (
                <Col xl="6" sm="6" className="p-2">
                  <div className="mt25">
                    <div className="Text16N" style={{ marginBottom: "6px" }}>
                      {eventOptionsKeyValues &&
                        eventOptionsKeyValues[Objkey].label}
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
                      className="w-full"
                      onChange={(selected) => {
                        setNewEvent({ ...newEvent, [Objkey]: selected.value });
                      }}
                      styles={customStyles}
                      options={
                        eventOptionsKeyValues &&
                        eventOptionsKeyValues[Objkey].values
                      }
                      required
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </ModalBody>
          <ModalFooter className="bg-white">
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
    </>
  );
}
const ButtonWithHoverBox = ({ hoverText, setRowOfWarnig, i }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = (e) => {
    setTimeout(() => {
      setIsHovered(true);
      setRowOfWarnig(i);
    }, 200);
  };
  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
      setRowOfWarnig(null);
    }, 200);
  };

  return (
    <div style={{ position: 'relative' }}>
      <IoIosWarning
        className="fs-5 text-danger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 16,
            zIndex: 10000,
            width: "300px",
            background: "silver",
            borderRadius: "10px",
            color: "red",
            padding: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {hoverText}
        </div>
      )}
    </div>
  );
};

export default ListView;
