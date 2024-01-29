import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import '../../assets/css/Profile.css';
import Heart from '../../assets/Profile/Heart.svg';
import Camera from '../../assets/Profile/Camera.svg';
import Video from '../../assets/Profile/Video.svg';
import Drone from '../../assets/Profile/Drone.svg';
import Manager from '../../assets/Profile/Manager.svg';
import Assistant from '../../assets/Profile/Assistant.svg';
import Car from '../../assets/Profile/Car.svg';
import Plane from '../../assets/Profile/Plane.svg';
import ShootDropDown from '../../components/ShootDropDown';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import { assignEventTeam, getEvents, updateEventData } from '../../API/Event';
import { getAllUsers } from '../../API/userApi';
import Cookies from 'js-cookie';
import CalenderImg from '../../assets/Profile/Calender.svg';
import Select from 'react-select'
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';

function ListView() {
  const [allEvents, setAllEvents] = useState([]);
  const [eventsForShow, setEventsForShow] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const [filterFor, setFilterFor] = useState('day')
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const toggle = () => {
    setShow(!show);
  };
  const [filteringDay, setFilteringDay] = useState(null);
  const filterByDay = (date) => {
    setFilteringDay(date)
    setShow(!show);
    setEventsForShow(allEvents.filter(event => (new Date(event.eventDate)).getTime() === (new Date(date)).getTime()
    ))
  }
  const filterByMonth = (date) => {
    setEventsForShow(allEvents.filter(event => new Date(event.eventDate).getFullYear() === date.getFullYear() && new Date(event.eventDate).getMonth() === date.getMonth()
    ))
  }
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const getEventsData = async () => {
    try {
      const usersData = await getAllUsers();
      setAllUsers(usersData.users)
      const res = await getEvents();
      if (currentUser.rollSelect == 'Manager') {
        setAllEvents(res.data);
        setEventsForShow(res.data);
      } else if (currentUser.rollSelect == 'Shooter') {
        const eventsToShow = res.data.map(event => {
          if (event.shootDirector.some(director => director._id == currentUser._id)) {
            return { ...event, userRole: 'Shoot Director' };
          } else if (event.choosenPhotographers.some(photographer => photographer._id == currentUser._id)) {
            return { ...event, userRole: 'Photographer' };
          } else if (event.choosenCinematographers.some(cinematographer => cinematographer._id == currentUser._id)) {
            return { ...event, userRole: 'Cinematographer' };
          } else if (event.droneFlyers.some(flyer => flyer._id == currentUser._id)) {
            return { ...event, userRole: 'Drone Flyer' };
          } else if (event.manager.some(manager => manager._id == currentUser._id)) {
            return { ...event, userRole: 'Manager' };
          } else if (event.sameDayPhotoMakers.some(photoMaker => photoMaker._id == currentUser._id)) {
            return { ...event, userRole: 'Same Day Photos Maker' };
          } else if (event.sameDayVideoMakers.some(videoMaker => videoMaker._id == currentUser._id)) {
            return { ...event, userRole: 'Same Day Video Maker' };
          } else if (event.assistants.some(assistant => assistant._id == currentUser._id)) {
            return { ...event, userRole: 'Assistant' };
          } else {
            return null;
          }
        });
        setAllEvents(eventsToShow);
        setEventsForShow(eventsToShow);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setEventsForShow(allEvents);
  }, [allEvents])
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
  const customStyles2 = {
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
  useEffect(() => {
    getEventsData();
  }, []);

  const onSubmitHandler = async (event, index) => {
    try {
      if (event.sameDayVideoEditor !== "No") {
        if (!event.sameDayVideoMakers || event.sameDayVideoMakers.length < 1) {
          toast.error('Please Select same Day video Makers, as required!');
          return;
        }
      }

      if (event.sameDayPhotoEditor !== 'No') {
        if (!event.sameDayPhotoMakers || event.sameDayPhotoMakers.length < 2) {
          toast.error('Please Select same day Photo Makers, as required');
          return;
        }
      }

      if (!event.choosenCinematographers || event.choosenCinematographers.length !== event.cinematographers) {
        toast.error('Please Select Cinematographers, as required!');
        return;
      }

      if (!event.droneFlyers || event.droneFlyers.length !== event.drones) {
        toast.error('Please Select Drone Flyers , as required!');
        return;
      }

      if (!event.manager || event.manager.length !== 1) {
        toast.error('Please Select Manager!');
        return;
      }

      if (!event.assistants || event.assistants.length !== 1) {
        toast.error('Please Select  Assisstance');
        return;
      }

      if (!event.choosenPhotographers || event.choosenPhotographers.length !== event.photographers) {
        toast.error('Please Select Photographers, as required!');
        return;
      }

      if (!event.shootDirector || event.shootDirector.length !== 1) {
        toast.error('Please Select shoot Director, as required!');
        return;
      }
      setUpdatingIndex(index);
      await assignEventTeam(event);
      setUpdatingIndex(null);
    } catch (error) {
      toast.error('It seems like nothing to update');
      return;
    }
  };
  const onStatusUpdate = async (event, index) => {
    try {
      

      setUpdatingIndex(index);
      await updateEventData(event);
      setUpdatingIndex(null);
    } catch (error) {
      toast.error('It seems like nothing to update');
      return;
    }
  };



  return (
    <>
      <ToastContainer />
      {eventsForShow !== null ? (
        <>
          <div className='w-50 d-flex flex-row  mx-auto align-items-center' style={{
            marginTop: '-70px',
            marginBottom: '30px'
          }} ref={target}>

            <div className='w-100 d-flex flex-row align-items-center'>
              <div className='w-50'>
                {filterFor === 'day' ?
                  <div
                    className={`forminput R_A_Justify1`}
                    onClick={toggle}
                    style={{ cursor: 'pointer' }}
                  >
                    {filteringDay ? dayjs(filteringDay).format('DD-MMM-YYYY') : 'Date'}
                    <img src={CalenderImg} />
                  </div>
                  :
                  <input type='month' onChange={(e) => {
                    filterByMonth(new Date(e.target.value))
                  }} className='forminput R_A_Justify mt-1' />
                }
              </div>
              <div className='w-50 px-2 '>
                <Select value={{ value: filterFor, label: filterFor }} className='w-75' onChange={(selected) => {
                  if (selected.value !== filterFor) {
                    setEventsForShow(allEvents)
                    setFilteringDay('');
                  }
                  setFilterFor(selected.value);
                  setShow(false)
                }} styles={customStyles}
                  options={[
                    { value: 'day', label: 'Day' },
                    { value: 'month', label: 'Month' }]} />
              </div>
            </div>

          </div>
          <div style={{ overflowX: 'hidden', width: '100%' }}>
            <Table striped
              responsive
              style={{ marginTop: '15px', width : '130%' }}>
              <thead>
                {currentUser.rollSelect == 'Manager' && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Couple : Location</th>
                    <th className="tableBody">Date : Travel</th>
                    <th className='tableBody'>Event Type</th>
                    <th className='tableBody'>Status</th>
                    <th className="tableBody">Shoot Director</th>
                    <th className="tableBody">
                      Photographer
                      <img src={Camera} />
                    </th>
                    <th className="tableBody">
                      Cinematographer
                      <img src={Video} />
                    </th>
                    <th className="tableBody">
                      DroneFlyer
                      <img src={Drone} />
                    </th>
                    <th className="tableBody">
                      Manager
                      <img src={Manager} />
                    </th>
                    <th className="tableBody">
                      Assistant
                      <img src={Assistant} />
                    </th>
                    <th className="tableBody">SameDay Photos</th>
                    <th className="tableBody">SameDay Videos</th>
                    <th className="tableBody">Team Assign</th>
                  </tr>
                )}
                {currentUser.rollSelect == 'Shooter' && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Date</th>
                    <th className="tableBody">Client</th>
                    <th className="tableBody">Event Type</th>
                    <th className="tableBody">Role</th>
                    <th className="tableBody">Location</th>
                    <th className="tableBody">Save</th>
                  </tr>
                )}
              </thead>
              <tbody className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                }}>
                {eventsForShow?.map((event, index) => {
                  return (
                    <>
                      {event && (
                        <>
                          {currentUser.rollSelect == 'Manager' && (
                            <tr style={{
                              background: index % 2 === 0 ? '' : '#F6F6F6',
                            }}>
                              <td className="tableBody Text14Semi primary2">
                                {event?.client?.groomName}
                                <br />
                                <img src={Heart} />
                                <br />
                                {event?.client?.brideName}
                                <br />
                                <div className="mt-2" style={{ color: "green" }}>
                                  {event?.location}
                                </div>
                              </td>
                              <td style={{
                                width: '90px',
                                marginLeft: 10,
                              }} className="tableBody Text14Semi primary2">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {dayjs(event?.eventDate).format('DD MMM YYYY')}
                                </div>
                                {event?.travelBy == 'Car' || event?.travelBy == 'Bus' ?
                                  <img src={Car} /> : event?.travelBy == 'By Air' ? <img src={Plane} /> : 'N/A'}
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{event?.eventType}</p>
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{event?.eventStatus || 'Yet to start'}</p>
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <ShootDropDown
                                  teble={true}
                                  allowedPersons={1}
                                  usersToShow={allUsers}
                                  existedUsers={event?.shootDirector}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].shootDirector = Array.isArray(event?.shootDirector) ? [...event?.shootDirector, userObj] : [userObj];
                                    setAllEvents(updatedEvents)
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].shootDirector = event?.shootDirector.filter(director => director !== userObj);
                                    setAllEvents(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.shootDirector) &&
                                  event?.shootDirector?.map((director) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{director.firstName} {director.lastName}</p>
                                  )
                                }
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <ShootDropDown
                                  teble={true}
                                  allowedPersons={event?.photographers}
                                  usersToShow={allUsers}
                                  existedUsers={event?.choosenPhotographers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].choosenPhotographers = Array.isArray(event?.choosenPhotographers) ? [...event?.choosenPhotographers, userObj] : [userObj];
                                    console.log(updatedEvents)
                                    setAllEvents(updatedEvents)
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].choosenPhotographers = event?.choosenPhotographers.filter(existingUser => existingUser !== userObj);
                                    setAllEvents(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.choosenPhotographers) &&
                                  event?.choosenPhotographers?.map((user) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                  )
                                }
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <ShootDropDown
                                  teble={true}
                                  allowedPersons={event?.cinematographers}
                                  usersToShow={allUsers}
                                  existedUsers={event?.choosenCinematographers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].choosenCinematographers = Array.isArray(event?.choosenCinematographers) ? [...event?.choosenCinematographers, userObj] : [userObj];
                                    setAllEvents(updatedEvents)
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].choosenCinematographers = event?.choosenCinematographers.filter(existingUser => existingUser !== userObj);
                                    setAllEvents(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.choosenCinematographers) && event?.choosenCinematographers && event?.choosenCinematographers?.map((user) =>
                                  <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                )}
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <ShootDropDown
                                  teble={true}
                                  allowedPersons={event?.drones}
                                  usersToShow={allUsers}
                                  existedUsers={event?.droneFlyers}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].droneFlyers = Array.isArray(event?.droneFlyers) ? [...event?.droneFlyers, userObj] : [userObj];
                                    setAllEvents(updatedEvents)
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].droneFlyers = event?.droneFlyers.filter(existingUser => existingUser !== userObj);
                                    setAllEvents(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.droneFlyers) &&
                                  event?.droneFlyers?.map((user) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                  )
                                }
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <ShootDropDown
                                  teble={true}
                                  allowedPersons={1}
                                  usersToShow={allUsers}
                                  existedUsers={event?.manager}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].manager = Array.isArray(event?.manager) ? [...event?.manager, userObj] : [userObj];
                                    setAllEvents(updatedEvents)
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].manager = event?.manager.filter(existingUser => existingUser !== userObj);
                                    setAllEvents(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.manager) &&
                                  event?.manager?.map((user) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                  )
                                }
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <ShootDropDown
                                  teble={true}
                                  allowedPersons={1}
                                  usersToShow={allUsers}
                                  existedUsers={event?.assistants}
                                  userChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].assistants = Array.isArray(event?.assistants) ? [...event?.assistants, userObj] : [userObj];
                                    setAllEvents(updatedEvents)
                                  }}
                                  userUnChecked={(userObj) => {
                                    const updatedEvents = [...allEvents];
                                    updatedEvents[index].assistants = event?.assistants.filter(existingUser => existingUser !== userObj);
                                    setAllEvents(updatedEvents);
                                  }}
                                />
                                {Array.isArray(event?.assistants) &&
                                  event?.assistants?.map((user) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                  )
                                }
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{event?.sameDayPhotoEditor}</p>
                                {event?.sameDayPhotoEditor == 'Yes' && (
                                  <ShootDropDown
                                    teble={true}
                                    allowedPersons={2}
                                    usersToShow={allUsers}
                                    existedUsers={event?.sameDayPhotoMakers}
                                    userChecked={(userObj) => {
                                      const updatedEvents = [...allEvents];
                                      updatedEvents[index].sameDayPhotoMakers = Array.isArray(event?.sameDayPhotoMakers) ? [...event?.sameDayPhotoMakers, userObj] : [userObj];
                                      setAllEvents(updatedEvents)
                                    }}
                                    userUnChecked={(userObj) => {
                                      const updatedEvents = [...allEvents];
                                      updatedEvents[index].sameDayPhotoMakers = event?.sameDayPhotoMakers.filter(existingUser => existingUser !== userObj);
                                      setAllEvents(updatedEvents);
                                    }}
                                  />
                                )}

                                {Array.isArray(event?.sameDayPhotoMakers) &&
                                  event?.sameDayPhotoMakers?.map((user) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                  )
                                }
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{event?.sameDayVideoEditor}</p>
                                {event?.sameDayVideoEditor == 'Yes' && (
                                  <ShootDropDown
                                    teble={true}
                                    allowedPersons={1}
                                    usersToShow={allUsers}
                                    existedUsers={event?.sameDayVideoMakers}
                                    userChecked={(userObj) => {
                                      const updatedEvents = [...allEvents];
                                      updatedEvents[index].sameDayVideoMakers = Array.isArray(event?.sameDayVideoMakers) ? [...event?.sameDayVideoMakers, userObj] : [userObj];
                                      setAllEvents(updatedEvents)
                                    }}
                                    userUnChecked={(userObj) => {
                                      const updatedEvents = [...allEvents];
                                      updatedEvents[index].sameDayVideoMakers = event?.sameDayVideoMakers.filter(existingUser => existingUser !== userObj);
                                      setAllEvents(updatedEvents);
                                    }}
                                  />
                                )}

                                {Array.isArray(event?.sameDayVideoMakers) &&
                                  event?.sameDayVideoMakers?.map((user) =>
                                    <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{user.firstName} {user.lastName}</p>
                                  )
                                }
                              </td>
                              <td>
                                <button
                                  style={{ backgroundColor: '#FFDADA', borderRadius: '5px', border: 'none', height: '30px' }}
                                  onClick={() => onSubmitHandler(event, index)}>
                                  {updatingIndex == index ? (
                                    <div className='w-100'>
                                      <div class="smallSpinner mx-auto"></div>
                                    </div>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </td>
                            </tr>
                          )}
                          {currentUser.rollSelect == 'Shooter' && (
                            <tr style={{
                              background: index % 2 === 0 ? '' : '#F6F6F6',
                            }}>
                              <td style={{
                                width: '120px',
                                marginLeft: 10,
                              }} className="tableBody Text14Semi primary2">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {dayjs(event?.eventDate).format('DD MMM YYYY')}
                                </div>
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                {event?.client?.groomName}
                                <br />
                                <img src={Heart} />
                                <br />
                                {event?.client?.brideName}
                                <br />
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                {event?.eventType}
                              </td>
                              <td
                                style={{
                                  paddingTop: '15px',
                                  paddingBottom: '15px',
                                }}
                                className="tableBody Text14Semi primary2"   >
                                <Select value={event?.eventStatus ? { value: event?.eventStatus, label: event?.eventStatus } : null} name='eventStatus' onChange={(selected) => {
                                  const updatedEvents = [...eventsForShow];
                                  updatedEvents[index].eventStatus = selected.value;
                                  setEventsForShow(updatedEvents)
                                }} styles={customStyles2} options={[
                                  { value: 'Yet to Start', label: 'Yet to Start' },
                                  { value: 'In Progress', label: 'In Progress' },
                                  { value: 'Completed', label: 'Completed' }]} required />
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                {event?.userRole}
                              </td>
                              <td className="tableBody Text14Semi primary2">
                                {event?.travelBy == 'Car' || event?.travelBy == 'Bus' ?
                                  <img src={Car} /> : event?.travelBy == 'By Air' ? <img src={Plane} /> : 'N/A'}
                                <div className="mt-2" style={{ color: "green" }}>
                                  {event?.location}
                                </div>
                              </td>
                              <td>
                                <button
                                  style={{ backgroundColor: '#FFDADA', borderRadius: '5px', border: 'none', height: '30px' }}
                                  onClick={() => onStatusUpdate(event, index)}>
                                  {updatingIndex == index ? (
                                    <div className='w-100'>
                                      <div class="smallSpinner mx-auto"></div>
                                    </div>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </>
                  )
                }
                )}
              </tbody>
            </Table>
            <Overlay
              rootClose={true}
              onHide={() => setShow(false)}
              target={target.current}
              show={show}
              placement="bottom"
            >
              <div>
                <Calendar
                  value={filteringDay}
                  minDate={new Date(Date.now())}
                  CalenderPress={toggle}
                  onClickDay={(date) => {
                    filterByDay(date);
                  }}
                />
              </div>
            </Overlay>
          </div>
        </>
      ) : (
        <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      )}

    </>
  );
}

export default ListView;
