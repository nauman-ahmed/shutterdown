import React, { useState, useEffect, useRef, } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import { addPreWedData, getPreWedClients } from "../../API/Client";
import Select from 'react-select'
import Cookies from "js-cookie";
import CalenderImg from '../../assets/Profile/Calender.svg';
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';
import { getShooters } from "../../API/userApi";
import ShootDropDown from "../../components/ShootDropDown";
import ClientHeader from "../../components/ClientHeader";

function PreWedShootScreen() {
  const [preWedClients, setPreWedClients] = useState(null);
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const [clientsForShow, setClientsForShow] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const [filteringDay, setFilteringDay] = useState(null);
  const filterByDay = (date) => {
    setFilteringDay(date)
    setShow(!show);
    setClientsForShow(preWedClients.filter(clientData => {
      const weddingEvent = clientData.events.find(eventData => eventData.isWedding === true);
      if (weddingEvent) {
        return new Date(weddingEvent.eventDate).getTime() === (new Date(date)).getTime()
      } else {
        return false
      }
    }))
  }
  const filterByMonth = (date) => {
    setClientsForShow(preWedClients.filter(clientData => {
      const weddingEvent = clientData.events.find(eventData => eventData.isWedding === true);
      if (weddingEvent) {
        return new Date(weddingEvent.eventDate).getFullYear() === date.getFullYear() && new Date(weddingEvent.eventDate).getMonth() === date.getMonth()
      } else {
        return false
      }
    }))
  }

  const filterOptions = [
    {
      title: 'All',
      id: 1,
    },
    {
      title: 'Date Assigned',
      id: 2,
    },
    {
      title: 'Date Unassigned',
      id: 3,
    },
  ];
  const getClients = async () => {
    try {
      const allPreWedClients = await getPreWedClients();
      const res = await getShooters();
      setShooters(res.shooters)
      if (currentUser.rollSelect === 'Manager') {
        setPreWedClients(allPreWedClients);
        setClientsForShow(allPreWedClients);
      } else if (currentUser.rollSelect === 'Shooter') {
        const clientsToShow = allPreWedClients.filter(client => {
          return client.preWeddingDetails?.photographers?.some(photographer => photographer._id === currentUser._id) || client.preWeddingDetails?.cinematographers?.some(cinematographer => cinematographer._id === currentUser._id) || client.preWeddingDetails?.assistants?.some(assistant => assistant._id === currentUser._id) || client.preWeddingDetails?.droneFlyers?.some(flyer => flyer._id === currentUser._id)
        });
        for (let client_index = 0; client_index < clientsToShow.length; client_index++) {
          if (clientsToShow[client_index]?.preWeddingDetails.photographers?.some(photographer => photographer._id === currentUser._id)) {
            clientsToShow[client_index].userRole = "Photographer"
            break
          } else if (clientsToShow[client_index]?.preWeddingDetails.photographers?.some(cinematographer => cinematographer._id === currentUser._id)) {
            clientsToShow[client_index].userRole = "Cinematographer"
            break
          } else if (clientsToShow[client_index]?.preWeddingDetails.photographers?.some(flyer => flyer._id === currentUser._id)) {
            clientsToShow[client_index].userRole = "Drone Flyer"
            break
          } else if (clientsToShow[client_index]?.preWeddingDetails.photographers?.some(assistant => assistant === currentUser._id)) {
            clientsToShow[client_index].userRole = "Assistant"
            break
          } else {
            clientsToShow[client_index].userRole = "Not Assigned"
          }

        }
        setPreWedClients(clientsToShow);
        setClientsForShow(clientsToShow);
      }
    } catch (error) {
      console.log(error, "error")
    }
  }

  const applyFilter = (filterTitle) => {
    if(filterTitle == null){
      setClientsForShow(preWedClients)
      return
    }
    if (filterTitle === 'Date Assigned') {
      setClientsForShow(preWedClients.filter(client => client.preWeddingDetails?.shootStartDate && client.preWeddingDetails?.shootEndDate))
    } else if (filterTitle === 'Date Unassigned') {
      setClientsForShow(preWedClients.filter(client => !client.preWeddingDetails?.shootStartDate && !client.preWeddingDetails?.shootEndDate))
    }else {
      getClients()
    }
  }
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [shooters, setShooters] = useState([]);
  // useEffect(() => {
  //   setClientsForShow(preWedClients)
  // }, [preWedClients])
  useEffect(() => {
    getClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleSaveData = async (index) => {
    try {
      const client = preWedClients[index];
      // if (!client.preWeddingDetails) {
      //   window.notify('Please Select the values!', 'error');
      //   return
      // } else if (!client.preWeddingDetails.shootDate) {
      //   window.notify('Please choose shoot Date!', 'error');
      //   return
      // } else if (!client.preWeddingDetails.status) {
      //   window.notify('Please Select some status!', 'error');
      //   return
      // }
      setUpdatingIndex(index);
      await addPreWedData(client);
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ClientHeader applyFilter={applyFilter} options={filterOptions} filter title="Pre-Wedding" />
      {clientsForShow ? (
        <>
          <div className='widthForFilters d-flex flex-row  mx-auto align-items-center' style={{
          }} ref={target}>

            <div className='w-100 d-flex flex-row align-items-center'>
              <div className='w-50 '>
                {filterFor === 'day' ?
                  <div
                    className={`forminput R_A_Justify1`}
                    onClick={toggle}
                    style={{ cursor: 'pointer' }}
                  >
                    {filteringDay ? dayjs(filteringDay).format('DD-MMM-YYYY') : 'Date'}
                    <img alt="" src={CalenderImg} />
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
                    setClientsForShow(preWedClients)
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
            <ToastContainer />
            <Table
              hover
              bordered
              responsive
              style={{ width: '150%', marginTop: '15px' }}
            >
              <thead>
                {currentUser.rollSelect === 'Manager' && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Couple</th>
                    <th className="tableBody">Wedding Date</th>
                    {/* <th className="tableBody">POC</th> */}
                    <th className="tableBody">Photographers</th>
                    <th className="tableBody">Cinematographers</th>
                    <th className="tableBody">Assistants</th>
                    <th className="tableBody">Drone Flyers</th>
                    <th className="tableBody">Shoot Date</th>
                    <th className="tableBody">Status</th>
                    <th className="tableBody">Save</th>
                  </tr>
                )}
                {currentUser.rollSelect === 'Shooter' && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Couple</th>
                    {/* <th className="tableBody">POC</th> */}
                    <th className="tableBody">Shoot Date</th>
                    <th className="tableBody">Role</th>
                    <th className="tableBody">Status</th>
                  </tr>
                )}
              </thead>
              <tbody className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                }}  >
                {clientsForShow?.map((client, index) => {
                  return (
                    <>
                      {currentUser.rollSelect === 'Manager' &&
                        <tr
                          style={{
                            background: index % 2 === 0 ? '' : '#F6F6F6',
                          }}
                        >
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {client.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {client.groomName}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <>
                              {dayjs(client.events.find(event => event.isWedding === true)?.eventDate).format('DD-MMM-YYYY')}<br />
                            </>
                          </td>
                          {/* <td className="tableBody Text14Semi primary2">
                            {client.userID?.firstName}{' '}{client.userID?.lastName}
                          </td> */}
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              allowedPersons={client.preWedPhotographers}
                              usersToShow={shooters}
                              existedUsers={client?.preWeddingDetails?.photographers}
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails = { ...client.preWeddingDetails } || {}
                                updatedClients[index].preWeddingDetails.photographers = Array.isArray(client?.preWeddingDetails?.photographers) ? [...client?.preWeddingDetails?.photographers, userObj] : [userObj];
                                setPreWedClients(updatedClients)
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (updatedClients[index].preWeddingDetails?.photographers) {
                                  updatedClients[index].preWeddingDetails.photographers = updatedClients[index].preWeddingDetails.photographers.filter(photographer => photographer._id !== userObj._id);
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(client?.preWeddingDetails?.photographers) && client?.preWeddingDetails?.photographers?.map((photographer) => {
                              return (
                                <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{photographer.firstName} {photographer.lastName}</p>
                              )
                            })
                            }
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              allowedPersons={client?.preWedCinematographers}
                              usersToShow={shooters}
                              existedUsers={client?.preWeddingDetails?.cinematographers}
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails = { ...client.preWeddingDetails } || {}
                                updatedClients[index].preWeddingDetails.cinematographers = Array.isArray(client?.preWeddingDetails?.cinematographers) ? [...client?.preWeddingDetails?.cinematographers, userObj] : [userObj];
                                setPreWedClients(updatedClients)
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (updatedClients[index].preWeddingDetails?.cinematographers) {
                                  updatedClients[index].preWeddingDetails.cinematographers = updatedClients[index].preWeddingDetails.cinematographers.filter(cinematographer => cinematographer._id !== userObj._id);
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(client?.preWeddingDetails?.cinematographers) &&
                              client?.preWeddingDetails?.cinematographers?.map((cinematographer) => {
                                return (

                                  <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{cinematographer.firstName} {cinematographer.lastName}</p>
                                )
                              }
                              )
                            }
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              allowedPersons={client?.preWedAssistants}
                              usersToShow={shooters}
                              existedUsers={client?.preWeddingDetails?.assistants}
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails = { ...client.preWeddingDetails } || {}
                                updatedClients[index].preWeddingDetails.assistants = Array.isArray(client?.preWeddingDetails?.assistants) ? [...client?.preWeddingDetails?.assistants, userObj] : [userObj];
                                setPreWedClients(updatedClients)
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (updatedClients[index].preWeddingDetails?.assistants) {
                                  updatedClients[index].preWeddingDetails.assistants = updatedClients[index].preWeddingDetails.assistants.filter(assistant => assistant._id !== userObj._id);
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(client?.preWeddingDetails?.assistants) &&
                              client?.preWeddingDetails?.assistants?.map((assistant) => {
                                return (
                                  <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{assistant.firstName} {assistant.lastName}</p>
                                )
                              }
                              )
                            }
                          </td>

                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              allowedPersons={client?.preWedDroneFlyers}
                              usersToShow={shooters}
                              existedUsers={client?.preWeddingDetails?.droneFlyers}
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails = { ...client.preWeddingDetails } || {}
                                updatedClients[index].preWeddingDetails.droneFlyers = Array.isArray(client?.preWeddingDetails?.droneFlyers) ? [...client?.preWeddingDetails?.droneFlyers, userObj] : [userObj];
                                setPreWedClients(updatedClients)
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (updatedClients[index].preWeddingDetails?.droneFlyers) {
                                  updatedClients[index].preWeddingDetails.droneFlyers = updatedClients[index].preWeddingDetails.droneFlyers.filter(flyer => flyer._id !== userObj._id);
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(client?.preWeddingDetails?.droneFlyers) &&
                              client?.preWeddingDetails?.droneFlyers?.map((flyer) => {
                                return (
                                  <p style={{ marginBottom: 0, fontFamily: 'Roboto Regular', whiteSpace: 'nowrap' }}>{flyer.firstName} {flyer.lastName}</p>
                                )
                              }
                              )
                            }
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <div className="d-flex flex-column">
                              <input
                                type="date"
                                name="shootStartDate"
                                className="dateInput"
                                onChange={(e) => {
                                  const updatedClients = [...preWedClients]
                                  updatedClients[index].preWeddingDetails = client.preWeddingDetails || {};
                                  updatedClients[index].preWeddingDetails.shootStartDate = e.target.value;
                                  setPreWedClients(updatedClients)
                                }}
                                readOnly={currentUser.rollSelect === 'Shooter'}
                                value={client.preWeddingDetails?.shootStartDate ? new Date(client.preWeddingDetails.shootStartDate).toISOString().split('T')[0] : ''}
                              />
                              TO
                              <input
                                type="date"
                                name="shootEndDate"
                                className="dateInput"
                                onChange={(e) => {
                                  const updatedClients = [...preWedClients]
                                  updatedClients[index].preWeddingDetails = client.preWeddingDetails || {};
                                  updatedClients[index].preWeddingDetails.shootEndDate = e.target.value;
                                  setPreWedClients(updatedClients)
                                }}
                                readOnly={currentUser.rollSelect === 'Shooter'}
                                value={client.preWeddingDetails?.shootEndDate ? new Date(client.preWeddingDetails.shootEndDate).toISOString().split('T')[0] : ''}
                              />
                            </div>
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {currentUser.rollSelect === 'Manager' ? (
                              <Select value={client.preWeddingDetails?.status ? { value: client?.preWeddingDetails?.status, label: client?.preWeddingDetails?.status } : { value: 'Yet to Start', label: 'Yet to Start' }} name='preWeddingDetailsStatus' onChange={(selected) => {
                                const updatedClients = [...preWedClients];
                                updatedClients[index].preWeddingDetails = client.preWeddingDetails || {};
                                updatedClients[index].preWeddingDetails.status = selected.value;
                                setPreWedClients(updatedClients)
                              }} styles={customStyles} options={[
                                { value: 'Yet to Start', label: 'Yet to Start' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Completed', label: 'Completed' }]} required />
                            ) : (
                              <>
                                {client.preWeddingDetails?.status || 'Not Filled'}
                              </>
                            )}
                          </td>
                          <td>
                            <button
                              style={{ backgroundColor: '#FFDADA', borderRadius: '5px', border: 'none', height: '30px' }}
                              onClick={() => updatingIndex == null && handleSaveData(index)}
                            >
                              {updatingIndex === index ? (
                                <div className='w-100'>
                                  <div class="smallSpinner mx-auto"></div>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </td>
                        </tr>
                      }
                      {currentUser.rollSelect === 'Shooter' &&
                        <tr
                          style={{
                            background: index % 2 === 0 ? '' : '#F6F6F6',
                          }}
                        >
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {client.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {client.groomName}
                          </td>
                          {/* <td className="tableBody Text14Semi primary2">
                            <>
                              {client.userID?.firstName}{' '}{client.userID?.lastName}
                            </>
                          </td> */}
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <>
                              {client.preWeddingDetails?.shootStartDate ? new Date(client.preWeddingDetails.shootStartDate).toISOString().split('T')[0] : "Not Available"} to {client.preWeddingDetails?.shootStartDate ? new Date(client.preWeddingDetails.shootStartDate).toISOString().split('T')[0] : "Not Available"}
                            </>
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <>

                              {client.userRole}
                            </>
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <>
                              {client.preWeddingDetails?.status || 'Not Filled'}
                            </>
                          </td>
                        </tr>
                      }
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

export default PreWedShootScreen;
