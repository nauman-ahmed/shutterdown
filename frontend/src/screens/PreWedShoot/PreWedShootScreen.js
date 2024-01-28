import React, { useState, useEffect, useContext, useRef, } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import { getClients, updateClient } from "../../API/Client";
import Select from 'react-select'
import { useAuthContext } from "../../config/context";
import Cookies from "js-cookie";
import CalenderImg from '../../assets/Profile/Calender.svg';
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';

function PreWedShootScreen(props) {
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
      return clientData.events.some(eventData => (new Date(eventData.eventDate)).getTime() === (new Date(date)).getTime())
    }))
  }
  const filterByMonth = (date) => {
    setClientsForShow(preWedClients.filter(clientData => {
      return clientData.events.some(eventData => new Date(eventData.eventDate).getFullYear() === date.getFullYear() && new Date(eventData.eventDate).getMonth() === date.getMonth())
    }))
  }
  const target = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setClientsForShow(preWedClients)
  }, [preWedClients])
  const getAllClients = async (req, res) => {
    try {
      const allClients = await getClients();
      const preClients = allClients.filter(client => client.deliverables.preWeddingPhotos === true || client.deliverables.preWeddingVideos === true);
      if (currentUser.rollSelect == 'Manager') {
        setPreWedClients(preClients);
        setClientsForShow(preClients);
      } else if (currentUser.rollSelect == 'Shooter') {
        const clientsToShow = preClients.filter(client => {
          return client.events?.some(event => event.choosenPhotographers?.some(photographer => photographer._id == currentUser._id) || event.choosenCinematographers?.some(cinematographer => cinematographer._id == currentUser._id) || event.shootDirector?.some(director => director == currentUser._id) || event.assistants?.some(assistant => assistant._id == currentUser._id) || event.droneFlyers?.some(flyer => flyer._id == currentUser._id) || event.manager.some(manager => manager._id == currentUser._id) || event.sameDayPhotoMakers?.some(photosMaker => photosMaker._id == currentUser._id) || event.sameDayVideosMaker?.some(videoMaker => videoMaker._id == currentUser._id))
        });
        setPreWedClients(clientsToShow);
        setClientsForShow(clientsToShow);
      }
    } catch (error) {
      console.log(error, "error")
    }
  }
  console.log(useAuthContext());
  useEffect(() => {
    getAllClients();
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
      if (!client.preWeddingDetails) {
        window.notify('Please Select the values!', 'error');
        return
      } else if (!client.preWeddingDetails.shootDate) {
        window.notify('Please choose shoot Date!', 'error');
        return
      } else if (!client.preWeddingDetails.status) {
        window.notify('Please Select some status!', 'error');
        return
      }
      setUpdatingIndex(index);
      await updateClient(client);
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {clientsForShow ? (
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
              borderless
              responsive
              style={{ width: '100%', marginTop: '15px' }}
            >
              <thead>
                <tr className="logsHeader Text16N1">
                  <th className="tableBody">Couple</th>
                  <th className="tableBody">Wedding Date</th>
                  <th className="tableBody">POC</th>
                  <th className="tableBody">Shoot Date</th>
                  <th className="tableBody">Status</th>
                  {currentUser.rollSelect == 'Manager' && (
                    <th className="tableBody">Save</th>
                  )}
                </tr>
              </thead>
              <tbody className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                }}  >
                {clientsForShow?.map((client, index) => {
                  return (
                    <>
                      <tr
                        style={{
                          background: index % 2 === 0 ? '' : '#F6F6F6',
                        }}
                      >
                        <td className="tableBody Text14Semi primary2">
                          {client.brideName}
                          <br />
                          <img src={Heart} />
                          <br />
                          {client.groomName}
                        </td>
                        <td className="tableBody Text14Semi primary2">
                          {client.events.map((event, i) => {
                            return (
                              <>
                                {dayjs(event.eventDate).format('DD/MM/YYYY')}<br />
                              </>
                            )
                          })}

                        </td>
                        <td className="tableBody Text14Semi primary2">
                          {client.userID?.firstName}{' '}{client.userID?.lastName}
                        </td>
                        <td className="tableBody Text14Semi primary2">
                          <input
                            type="date"
                            name="shootDate"
                            className="dateInput"
                            onChange={(e) => {
                              const updatedClients = [...preWedClients]
                              updatedClients[index].preWeddingDetails = client.preWeddingDetails || {};
                              updatedClients[index].preWeddingDetails.shootDate = e.target.value;
                              setPreWedClients(updatedClients)
                            }}
                            readOnly={currentUser.rollSelect == 'Shooter'}
                            value={client.preWeddingDetails?.shootDate ? new Date(client.preWeddingDetails.shootDate).toISOString().split('T')[0] : null}
                          />
                        </td>
                        <td className="tableBody Text14Semi primary2">
                          {currentUser.rollSelect == 'Manager' ? (
                            <Select value={client.preWeddingDetails?.status ? { value: client?.preWeddingDetails?.status, label: client?.preWeddingDetails?.status } : null} name='preWeddingDetailsStatus' onChange={(selected) => {
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
                        {currentUser.rollSelect == 'Manager' && (
                          <td>
                            <button
                              style={{ backgroundColor: '#FFDADA', borderRadius: '5px', border: 'none', height: '30px' }}
                              onClick={() => handleSaveData(index)}
                            >
                              {updatingIndex == index ? (
                                <div className='w-100'>
                                  <div class="smallSpinner mx-auto"></div>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </td>
                        )}
                      </tr>
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
