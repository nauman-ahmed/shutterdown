import React, { useRef, useState, useEffect } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import Camera from "../../assets/Profile/Camera.svg";
import Video from "../../assets/Profile/Video.svg";
import Drone from "../../assets/Profile/Drone.svg";
import Manager from "../../assets/Profile/Manager.svg";
import Assistant from "../../assets/Profile/Assistant.svg";
import Car from "../../assets/Profile/Car.svg";
import Plane from "../../assets/Profile/Plane.svg";
import ShootDropDown from "../../components/ShootDropDown";
import { addEvent } from "../../API/Event";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import { assignEventTeam, getEvents } from "../../API/Event";
import { getAllUsers } from "../../API/userApi";
import Cookies from "js-cookie";
import CalenderImg from "../../assets/Profile/Calender.svg";
import Select from "react-select";
import Calendar from "react-calendar";
import { Overlay } from "react-bootstrap";
import { IoIosArrowRoundUp, IoIosWarning } from "react-icons/io";
import ClientHeader from "../../components/ClientHeader";
import { IoIosArrowRoundDown } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAllEvents } from "../../redux/eventsSlice";
import tippy from 'tippy.js';

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
import { getClients } from "../../API/Client";
import CalenderMulti from "../../components/Calendar";
import { GrPowerReset } from "react-icons/gr";
import { all } from "axios";

function ListView(props) {
  const [clientData, setClientData] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [eventsForShow, setEventsForShow] = useState(null);
  const currentUser = JSON.parse(Cookies.get("currentUser"));
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [ascending, setAscending] = useState(true);
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
  const [show, setShow] = useState(false);
  const [filteringDay, setFilteringDay] = useState(null);
  const [rowOfWarning, setRowOfWarnig] = useState(null)
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const dispatch = useDispatch();
  const { clientId } = useParams();

  const [directors, setDirectors] = useState([]);
  const [photographer, setPhotographer] = useState([]);
  const [cinematographer, setCinematographer] = useState([]);
  const [flyer, setFlyer] = useState([]);
  const [manager, setManager] = useState([]);
  const [assistant, setAssistant] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const toggle = () => {
    setShow(!show);
  };

  const filterByDates = (
    startDate = null,
    endDate = null,
    view = null,
    reset = false
  ) => {
    if (reset) {
      setShow(false);
      setEventsForShow(groupByBrideName(allEvents));
      setFilteringDay(null);
      setFilterStartDate(null);
      setFilterEndDate(null);
      return;
    } else if (view !== "month" && view !== "year") {
      setShow(false);
    }
    setFilteringDay(startDate);
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);

    let filteredData = allEvents?.filter(
      (event) =>
        new Date(event.eventDate).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0) &&
        new Date(event.eventDate).setHours(0, 0, 0, 0) <= new Date(endDate).setHours(0, 0, 0, 0)
    );
    setEventsForShow(groupByBrideName(filteredData));
  };

  const groupByBrideName = (events) => {
    // Step 2: Group by brideName, but store the result as an array of objects
    const groupedByBrideName = events?.reduce((acc, event) => {
      const brideName = event?.client?.brideName;
      const found = acc?.find((item) => item?.client?.brideName === brideName);
      const index = acc?.findIndex(
        (item) => item?.client?.brideName === brideName
      );
      if (!found) {
        // If no existing group for this brideName, create a new group
        acc.push(event);
      } else {
        // Add to the existing group's events array
        acc.splice(index + 1, 0, event);
      }
      return acc;
    }, []);
    return groupedByBrideName;
  };

  const getEventsData = async (clientId) => {
    try {
      const usersData = await getAllUsers();
      setDirectors(usersData.users.filter(user => user.subRole.includes("Shoot Director")))
      setPhotographer(usersData.users.filter(user => user.subRole.includes("Photographer")))
      setCinematographer(usersData.users.filter(user => user.subRole.includes("Cinematographer")))
      setFlyer(usersData.users.filter(user => user.subRole.includes("Drone Flyer")))
      setManager(usersData.users.filter(user => user.subRole.includes("Manager")))
      setAssistant(usersData.users.filter(user => user.subRole.includes("Assistant")))

      const res = await getEvents(clientId, page);
      if (currentUser.rollSelect === "Manager") {
        setAllEvents(res.data);
        setEventsForShow(groupByBrideName(res.data));
      } else if (currentUser.rollSelect === "Shooter") {
        const eventsToShow = res?.data?.map((event) => {
          if (
            event?.shootDirectors?.some(
              (director) => director._id === currentUser._id
            )
          ) {
            return { ...event, userRole: "Shoot Directors" };
          } else if (
            event?.choosenPhotographers?.some(
              (photographer) => photographer._id === currentUser._id
            )
          ) {
            return { ...event, userRole: "Photographer" };
          } else if (
            event?.choosenCinematographers?.some(
              (cinematographer) => cinematographer._id === currentUser._id
            )
          ) {
            return { ...event, userRole: "Cinematographer" };
          } else if (
            event?.droneFlyers?.some((flyer) => flyer._id === currentUser._id)
          ) {
            return { ...event, userRole: "Drone Flyer" };
          } else if (
            event?.manager?.some((manager) => manager._id === currentUser._id)
          ) {
            return { ...event, userRole: "Manager" };
          } else if (
            event?.sameDayPhotoMakers?.some(
              (photoMaker) => photoMaker._id === currentUser._id
            )
          ) {
            return { ...event, userRole: "Same Day Photos Maker" };
          } else if (
            event?.sameDayVideoMakers?.some(
              (videoMaker) => videoMaker._id === currentUser._id
            )
          ) {
            return { ...event, userRole: "Same Day Video Maker" };
          } else if (
            event?.assistants?.some(
              (assistant) => assistant._id === currentUser._id
            )
          ) {
            return { ...event, userRole: "Assistant" };
          } else {
            return null;
          }
        });
        setAllEvents(eventsToShow);
        setEventsForShow(groupByBrideName(eventsToShow));
      }
    } catch (error) {
      console.log(error);
    }
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
      console.log(error);
      toast.error("It seems like nothing to update");
      return;
    }
  };

  const getClientsForFilters = () => {
    const seenClients = new Set();
    return allEvents
      ?.map((eventObj, i) => ({
        title: `${eventObj?.client?.brideName} Weds ${eventObj?.client?.groomName}`,
        id: i,
        clientId: eventObj?.client?._id,
      }))
      ?.filter((eventObj) => {
        if (eventObj?.clientId && !seenClients?.has(eventObj.clientId)) {
          seenClients?.add(eventObj?.clientId);
          return true;
        }
        return false;
      });
  };

  const filterOptions = [
    {
      title: "Clients",
      id: 1,
      filters: getClientsForFilters(),
    },
  ];

  const applySorting = () => {
    try {
      setEventsForShow(
        groupByBrideName(
          eventsForShow?.sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return ascending ? dateB - dateA : dateA - dateB;
          })
        )
      );
      setAscending(!ascending);
    } catch (error) {
      console.log("applySorting ERROR", error);
    }
  };

  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();
    setEventOptionsKeyValues(eventOptions);
  };

  useEffect(() => {
    getEventsData(clientId);
    getStoredEvents();
    fetchClientsData();
    getAllFormOptionsHandler();
  }, []);

  const fetchEvents = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const res = await getEvents(clientId, page === 1 ? page + 1 : page);
        if (res.data.length > 0) {
          if (currentUser.rollSelect === "Manager") {
            setAllEvents([...allEvents, ...res.data]);
            if (filterStartDate && filterEndDate) {
              let filteredData = res.data?.filter(
                (event) =>
                  new Date(event.eventDate).getTime() >=
                  new Date(filterStartDate).getTime() &&
                  new Date(event.eventDate).getTime() <=
                  new Date(filterEndDate).getTime()
              );
              setEventsForShow([
                ...eventsForShow,
                ...groupByBrideName(filteredData),
              ]);
            } else {
              setEventsForShow([
                ...eventsForShow,
                ...groupByBrideName(res.data),
              ]);
            }
          } else if (currentUser.rollSelect === "Shooter") {
            const eventsToShow = res?.data?.map((event) => {
              if (
                event?.shootDirectors?.some(
                  (director) => director._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Shoot Directors" };
              } else if (
                event?.choosenPhotographers?.some(
                  (photographer) => photographer._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Photographer" };
              } else if (
                event?.choosenCinematographers?.some(
                  (cinematographer) => cinematographer._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Cinematographer" };
              } else if (
                event?.droneFlyers?.some(
                  (flyer) => flyer._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Drone Flyer" };
              } else if (
                event.manager?.some(
                  (manager) => manager._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Manager" };
              } else if (
                event?.sameDayPhotoMakers?.some(
                  (photoMaker) => photoMaker._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Same Day Photos Maker" };
              } else if (
                event?.sameDayVideoMakers?.some(
                  (videoMaker) => videoMaker._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Same Day Video Maker" };
              } else if (
                event?.assistants?.some(
                  (assistant) => assistant._id === currentUser._id
                )
              ) {
                return { ...event, userRole: "Assistant" };
              } else {
                return null;
              }
            });
            setAllEvents([...allEvents, eventsToShow]);
            if (filterStartDate && filterEndDate) {
              let filteredData = eventsToShow?.filter(
                (event) =>
                  new Date(event.eventDate).getTime() >=
                  new Date(filterStartDate).getTime() &&
                  new Date(event.eventDate).getTime() <=
                  new Date(filterEndDate).getTime()
              );
              setEventsForShow([
                ...eventsForShow,
                ...groupByBrideName(filteredData),
              ]);
            } else {
              setEventsForShow([
                ...eventsForShow,
                ...groupByBrideName(eventsToShow),
              ]);
            }
            setEventsForShow(groupByBrideName(eventsToShow));
          }
          setPage(page + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventsForShow?.length < 10 && hasMore && !loading) {
      fetchEvents();
    }
  }, [eventsForShow]);

  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;

    if (bottomOfWindow) {
      fetchEvents();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const getStoredEvents = async () => {
    const storedEvents = await getEvents();
    setAllEvents(storedEvents.data);
    dispatch(updateAllEvents(storedEvents.data));
  };

  const addNewEvent = async () => {
    try {
      await addEvent(newEvent);
      setNewEvent({});
      setNewEventModel(false);
      window.notify("Event added successfully!", "success");
      getEventsData(clientId);
      getStoredEvents();
      fetchClientsData();
    } catch (error) {
      console.log(error);
    }
  };

  const updateNewEvent = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const fetchClientsData = async () => {
    const clients = await getClients();
    setClientData(clients);
  };

  const filterByNameHanler = (brideName) => {
    if (brideName == "Reset") {
      setEventsForShow(groupByBrideName(allEvents));
      return;
    }
    const seperator = "<";
    brideName = brideName?.split(seperator)[0];
    setEventsForShow(
      groupByBrideName(
        allEvents?.filter((event) => {
          return event.client.brideName == brideName;
        })
      )
    );
  };
  useEffect(() => {
    console.log(rowOfWarning);

  }, [rowOfWarning])

  const returnOneRow = (event, prevEvent) => {
    if (prevEvent && !clientId) {
      if (event?.client._id !== prevEvent?.client._id) {
        if(currentUser?.rollSelect === 'Manager' ){
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
              
            </tr>
          );
        }
       
      }
    }
  };
  console.log(allEvents);

  return (
    <>
      <ToastContainer />
      {eventsForShow !== null ? (
        <>
          <ClientHeader title="List View" options={filterOptions} calender />
          <div
            className=" d-flex mx-auto align-items-center justify-content-between flex-wrap gap-3"
            style={{ width: "100%" }}
            ref={target}
          >
            <div style={{ width: "120px" }}>
              <button
                onClick={() => setNewEventModel(true)}
                className="btn btn-primary"
                style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
              >
                Add Event
              </button>
            </div>
            <div style={{ width: '200px' }}>
              <Select
                isSearchable={true}
                onChange={(e) => filterByNameHanler(e.value)}
                styles={{ ...customStyles, zIndex: -1000, width: "300px" }}
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
                        event?.client?.brideName + "<" + event?.client?.groomName,
                        event,
                      ])
                    ).values() // Extract the unique events from the Map
                  ).map((event) => ({
                    value: event?.client?.brideName + "<" + event?.client?.groomName,
                    label: (
                      <div className="d-flex justify-content-around">
                        <span>{event?.client?.brideName}</span>{" "}
                        <img alt="" src={Heart} />{" "}
                        <span>{event?.client?.groomName}</span>
                      </div>
                    ),
                  })),
                ]}
                required
              />
            </div>
            <div style={{ width: "200px", position: 'relative' }}>
              
              <div
                className={`forminput R_A_Justify1`}
                style={{ cursor: "pointer" }}
              >
                {filteringDay
                  ? dayjs(filteringDay).format("DD-MMM-YYYY")
                  : "Date"}
                <div className="d-flex align-items-center" style={{position : 'relative'}}>
                  <img alt="" src={CalenderImg} onClick={toggle} />
                  <GrPowerReset
                    className="mx-1"
                    onClick={() => filterByDates(null, null, null, true)}
                  />
                  {show && (

                <div style={{ position: 'absolute', top: '30px', right : '10px', zIndex : 1000}}>
                  <div >
                    <CalenderMulti filterByDates={filterByDates} />
                  </div>
                </div>
              )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ overflowX: "hidden", width: "100%" }}>
            <Table
              striped
              responsive
              style={{ marginTop: "15px", width: currentUser?.rollSelect === 'Manager' ? "180%" : "100%" }}
            >
              <thead>
                {currentUser.rollSelect === "Manager" && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody sticky-column">Couple Location</th>
                    <th className="tableBody sticky-column">
                      Date{" "}
                      {ascending ? (
                        <IoIosArrowRoundDown
                          style={{ color: "#666DFF" }}
                          onClick={applySorting}
                          className="fs-4 cursor-pointer"
                        />
                      ) : (
                        <IoIosArrowRoundUp
                          style={{ color: "#666DFF" }}
                          className="fs-4 cursor-pointer"
                          onClick={applySorting}
                        />
                      )}
                    </th>
                    <th className="tableBody">Event Type</th>
                    {/* <th className="tableBody">Status</th> */}
                    <th className="tableBody">Shoot Director</th>
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
                    <th className="tableBody">Team Assign</th>
                  </tr>
                )}
                {currentUser.rollSelect === "Shooter" && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Date</th>
                    <th className="tableBody">Client</th>
                    <th className="tableBody">Event Type</th>
                    {/* <th className="tableBody">Status</th> */}
                    <th className="tableBody">Role</th>
                    <th className="tableBody">Location</th>
                  </tr>
                )}
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
                  if (event?.sameDayVideoEditor !== "No") {
                    if (
                      !event?.sameDayVideoMakers ||
                      event?.sameDayVideoMakers.length < 1
                    ) {
                      errorText += "Same Day Video Makers are not complete \n";
                    }
                  }

                  if (event?.sameDayPhotoEditor !== "No") {
                    if (
                      !event?.sameDayPhotoMakers ||
                      event?.sameDayPhotoMakers.length < 2
                    ) {
                      errorText += "Same Day Photo Makerasare not complete \n";
                    }
                  }

                  if (
                    !event?.choosenCinematographers ||
                    event?.choosenCinematographers.length !==
                    event?.cinematographers
                  ) {
                    errorText += "Cinematographers are not complete \n";
                  }

                  if (
                    !event?.droneFlyers ||
                    event?.droneFlyers.length !== event.drones
                  ) {
                    errorText += "Drone Flyers are not complete \n";
                  }

                  if (!event?.manager || event?.manager.length !== 1) {
                    errorText += "Manager not selected \n";
                  }

                  if (!event?.assistants || event?.assistants.length !== 1) {
                    errorText += "Assistants are not complete \n";
                  }

                  if (
                    !event?.choosenPhotographers ||
                    event?.choosenPhotographers.length !== event?.photographers
                  ) {
                    errorText += "Photographers are not complete \n";
                  }

                  if (
                    !event?.shootDirectors ||
                    event?.shootDirectors.length !== 1
                  ) {
                    errorText += "Shoot Director not selected \n";
                  }
                  return (
                    <>
                      {returnOneRow(
                        event,
                        index >= 0 ? eventsForShow[index - 1] : null
                      )}
                      {event && event !== null && (
                        <>
                          {currentUser.rollSelect === "Manager" && (
                            <tr className="relative">
                              <td className={`tableBody Text14Semi primary2 ${(rowOfWarning === index || (rowOfWarning === index - 1 && errorText?.length > 150)) ? " " : " sticky-column "} tablePlaceContent`}>
                                {errorText.length > 0 && (
                                  <ButtonWithHoverBox
                                    buttonText="error"
                                    hoverText={errorText}
                                    setRowOfWarnig={setRowOfWarnig}
                                    i={index}
                                  />
                                )}
                                <div className="d-flex flex-row ps-5">

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
                                  </div>
                                </div>
                              </td>
                              <td
                                style={{
                                  width: "90px",
                                  marginLeft: 10,

                                }}
                                className={`tableBody Text14Semi primary2 ${(rowOfWarning === index || (rowOfWarning === index - 1 && errorText?.length > 90)) ? " " : " sticky-column "}  tablePlaceContent`}
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
                                {event?.travelBy === "By Car" ||
                                  event?.travelBy === "By Bus" ? (
                                  <img alt="" src={Car} />
                                ) : event?.travelBy === "By Air" ? (
                                  <img alt="" src={Plane} />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="tableBody Text14Semi primary2 tablePlaceContent">
                                <p
                                  style={{
                                    marginBottom: 0,
                                    fontFamily: "Roboto Regular",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {event?.eventType}
                                </p>
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
                                  existedUsers={event?.shootDirectors}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].shootDirectors =
                                      Array.isArray(event?.shootDirectors)
                                        ? [...event?.shootDirectors, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].shootDirectors =
                                      event?.shootDirectors?.filter(
                                        (director) => director !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].choosenPhotographers =
                                      event?.choosenPhotographers?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                  allEvents={cinematographer}
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
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[
                                      index
                                    ].choosenCinematographers =
                                      event?.choosenCinematographers?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].droneFlyers =
                                      event?.droneFlyers?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                  existedUsers={event?.manager}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].manager =
                                      Array.isArray(event?.manager)
                                        ? [...event?.manager, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].manager =
                                      event?.manager?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                  allowedPersons={1}
                                  usersToShow={assistant}
                                  existedUsers={event?.assistants}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].assistants =
                                      Array.isArray(event?.assistants)
                                        ? [...event?.assistants, userObj]
                                        : [userObj];
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].assistants =
                                      event?.assistants?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                <p
                                  style={{
                                    marginBottom: 0,
                                    fontFamily: "Roboto Regular",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {event?.sameDayPhotoEditor}
                                </p>
                                <ShootDropDown
                                  role={"sameDayPhotoMakers"}
                                  message={"Same Day Photo Makers"}
                                  teble={true}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  allowedPersons={event?.sameDayPhotoEditors}
                                  usersToShow={photographer}
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
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].sameDayPhotoMakers =
                                      event?.sameDayPhotoMakers?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                <p
                                  style={{
                                    marginBottom: 0,
                                    fontFamily: "Roboto Regular",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {event?.sameDayVideoEditor}
                                </p>
                                <ShootDropDown
                                  role={"sameDayVideoEditors"}
                                  message={"Same Day Video Makers"}
                                  teble={true}
                                  allowedPersons={event?.sameDayVideoEditors}
                                  currentEvent={event}
                                  allEvents={allEvents}
                                  usersToShow={cinematographer}
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
                                    setAllEvents(updatedEvents);
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...eventsForShow];
                                    updatedEvents[index].sameDayVideoMakers =
                                      event?.sameDayVideoMakers?.filter(
                                        (existingUser) =>
                                          existingUser !== userObj
                                      );
                                    setEventsForShow(updatedEvents);
                                    setAllEvents(updatedEvents);
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
                                      <div class="smallSpinner mx-auto"></div>
                                    </div>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </td>
                            </tr>
                          )}
                          {currentUser.rollSelect === "Shooter" && (
                            <tr
                              style={{
                                background: index % 2 === 0 ? "" : "#F6F6F6",
                              }}
                            >
                              <td
                                style={{
                                  width: "120px",
                                  marginLeft: 10,
                                }}
                                className="tableBody Text14Semi primary2"
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
                              <td className="tableBody Text14Semi primary2">
                                {event?.client?.brideName}
                                <br />
                                <img alt="" src={Heart} />
                                <br />
                                {event?.client?.groomName}
                                <br />
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                {event?.eventType}
                              </td>
                              {/* <td
                                style={{
                                  paddingTop: "15px",
                                  paddingBottom: "15px",
                                }}
                                className="tableBody Text14Semi primary2"
                              >
                                {event?.eventStatus}
                              </td> */}
                              <td className="tableBody Text14Semi primary2">
                                {event?.userRole}
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                {event?.travelBy === "Car" ||
                                  event?.travelBy === "Bus" ? (
                                  <img alt="" src={Car} />
                                ) : event?.travelBy === "By Air" ? (
                                  <img alt="" src={Plane} />
                                ) : (
                                  "N/A"
                                )}
                                <div
                                  className="mt-2"
                                  style={{ color: "green" }}
                                >
                                  {event?.location}
                                </div>
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
            {loading && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <div class="spinner"></div>
              </div>
            )}
            {!hasMore && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <div>No more data to load.</div>
              </div>
            )}
          </div>

        </>
      ) : (
        <div
          style={{ height: "400px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <div class="spinner"></div>
        </div>
      )}

      <Modal
        className="bg-white"
        isOpen={newEventModel}
        centered={true}
        size="lg"
        fullscreen="md"
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
          <ModalBody className="bg-white">
            <Row ref={target}>
              <Col xl="6" sm="6" lg="6" className="p-2">
                <div className="label">Client</div>
                <Select
                  className="w-75"
                  onChange={(selected) => {
                    setNewEvent({ ...newEvent, client: selected.value._id });
                  }}
                  styles={customStyles}
                  options={clientData?.map((client) => {
                    return {
                      value: client,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{client.brideName}</span>{" "}
                          <img alt="" src={Heart} />{" "}
                          <span>{client.groomName}</span>
                        </div>
                      ),
                    };
                  })}
                  required
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
                      className="w-75"
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
      setRowOfWarnig(i)
    }, 200);
  };
  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
      setRowOfWarnig(null)
    }, 200);
  };

  return (
    <div style={{ position: "absolute" }}>
      <IoIosWarning
        className="fs-3 text-danger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 20,
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
