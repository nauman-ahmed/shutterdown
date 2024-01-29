import React, { useEffect, useRef, useState } from 'react';
import { Form, Table } from 'reactstrap';
import '../../assets/css/Profile.css';
import Heart from '../../assets/Profile/Heart.svg';
import '../../assets/css/tableRoundHeader.css';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { addCinematography, getClients } from '../../API/Client';
import { getEditors } from '../../API/userApi';
import Select from 'react-select';
import CalenderImg from '../../assets/Profile/Calender.svg';
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';
import Cookies from 'js-cookie';


function Cinematography(props) {
  const [editors, setEditors] = useState(null);
  const [allClients, setAllClients] = useState(null);
  const [clientsForShow, setClientsForShow] = useState(null);
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const currentUser = JSON.parse(Cookies.get('currentUser'));

  const [filteringDay, setFilteringDay] = useState(null);
  const filterByDay = (date) => {
    setFilteringDay(date)
    setShow(!show);
    setClientsForShow(allClients.filter(clientData => {
      return clientData.events.some(eventData => (new Date(eventData.eventDate)).getTime() === (new Date(date)).getTime())
    }))
  }
  const filterByMonth = (date) => {
    setClientsForShow(allClients.filter(clientData => {
      return clientData.events.some(eventData => new Date(eventData.eventDate).getFullYear() === date.getFullYear() && new Date(eventData.eventDate).getMonth() === date.getMonth())
    }))
  }
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const fetchData = async () => {
    try {
      const data = await getClients();
      const res = await getEditors();
      if (currentUser.rollSelect == 'Manager') {
        setAllClients(data);
        setClientsForShow(data);
      } else if (currentUser.rollSelect == 'Editor') {
        const clientsToShow = data.filter(client => client.cinematography?.editor._id == currentUser._id);
        setAllClients(clientsToShow);
        setClientsForShow(clientsToShow)
      }
      setEditors(res.editors)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setClientsForShow(allClients)
  }, [allClients])

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
    menu: (defaultStyles) => ({ ...defaultStyles, zIndex: 9999 }), // Set a higher zIndex
    menuList: (defaultStyles) => ({ ...defaultStyles, zIndex: 9999 }), // Set a higher zIndex
    menuPortal: (defaultStyles) => ({ ...defaultStyles, zIndex: 9999 }), // Set a higher zIndex
  };

  const handleSaveData = async (index) => {
    try {
      const client = allClients[index];
      if (!client.cinematography) {
        window.notify('Please Select the values!', 'error');
        return
      } else if (!client.cinematography.editor) {
        window.notify('Please Select Editor!', 'error');
        return
      } else if (!client.cinematography.weddingDate) {
        window.notify('Please Select Wedding Date!', 'error');
        return
      } else if (!client.cinematography.companyDeadline) {
        window.notify('Please Provide Company Deadline!', 'error');
        return
      } else if (!client.cinematography.status) {
        window.notify('Please Select any Status!', 'error');
        return
      } else if (!client.cinematography.clientRevision) {
        window.notify('Please Select Client Revisions!', 'error');
        return
      }
      setUpdatingIndex(index);
      await addCinematography(client)
      setUpdatingIndex(null)
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
                    setClientsForShow(allClients)
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
            <Table
              hover
              borderless
              responsive
              className="tableViewClient"
              style={currentUser.rollSelect == 'Manager' ? { width: '130%', marginTop: '15px'} : { width: '100%', marginTop: '15px'}}
            >
              <thead>
                {currentUser?.rollSelect == "Manager" && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client:</th>
                    <th className="tableBody">Deliverable</th>
                    <th className="tableBody">Editor</th>
                    <th className="tableBody">Wedding Date</th>
                    <th className="tableBody">Company Deadline</th>
                    <th className="tableBody">Status</th>
                    <th className="tableBody">Suggestions</th>
                    <th className="tableBody">Client Revisions</th>
                    <th className="tableBody">Save</th>
                  </tr>
                )}
                {currentUser?.rollSelect == 'Editor' && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client:</th>
                    <th className="tableBody">Deliverable</th>
                    <th className="tableBody">Company Deadline</th>
                    <th className="tableBody">Status</th>
                    <th className="tableBody">Save</th>
                  </tr>
                )}
              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                  // background: "#EFF0F5",
                }}
              >
                {clientsForShow?.map((client, index) => {
                  return (
                    <>
                      {index == 0 && <div style={{ marginTop: '15px' }} />}
                      {currentUser?.rollSelect == 'Manager' && (
                        <tr
                          style={{
                            background: '#EFF0F5',
                            borderRadius: '8px',
                          }}
                        >
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2"
                          >
                            {client.brideName}
                            <div
                              style={{
                                fontSize: '12px',
                                marginRight: '10px',
                                marginBottom: '5px',
                              }}
                            >
                              <img src={Heart} />
                              <br />
                              {client.groomName}
                            </div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <div>
                              long Films : {client.longFilms}
                              <br />
                              Reels : {client.reels}
                              <br />
                              {client.promos === 'Yes' && 'Promos'}
                            </div>

                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >

                            <Select value={client.cinematography?.editor ? { value: client?.cinematography?.editor.firstName, label: client?.cinematography?.editor?.firstName } : null} name='editor' onChange={(selected) => {
                              const updatedClients = [...allClients];
                              updatedClients[index].cinematography = client.cinematography || {};
                              updatedClients[index].cinematography.editor = selected.value;
                              setAllClients(updatedClients)
                            }} styles={customStyles} options={editors?.map(editor => {
                              return ({ value: editor, label: editor.firstName })
                            })} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}  >
                            <Select value={client.cinematography?.weddingDate ? { value: client?.cinematography.weddingDate, label: dayjs(client?.cinematography?.weddingDate).format('DD-MM-YYYY') } : null} name='cinematographyDate' onChange={(selected) => {
                              const updatedClients = [...allClients];
                              updatedClients[index].cinematography = client.cinematography || {};
                              updatedClients[index].cinematography.weddingDate = selected.value;
                              setAllClients(updatedClients)
                            }} styles={customStyles} options={client.events?.map(event => {
                              return ({ value: event.eventDate, label: dayjs(event.eventDate).format('DD-MM-YYYY') })
                            })} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <input
                              type="date"
                              name="companyDeadline"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedClients = [...allClients]
                                updatedClients[index].cinematography = client?.cinematography || {};
                                updatedClients[index].cinematography.companyDeadline = e.target.value;
                                setAllClients(updatedClients);
                              }}
                              value={client.cinematography?.companyDeadline ? dayjs(new Date(client.cinematography?.companyDeadline)).format('YYYY-MM-DD') : null}
                            />
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2"   >
                            <Select value={client.cinematography?.status ? { value: client?.cinematography?.status, label: client?.cinematography?.status } : null} name='cinematographyStatus' onChange={(selected) => {
                              const updatedClients = [...allClients];
                              updatedClients[index].cinematography = client.cinematography || {};
                              updatedClients[index].cinematography.status = selected.value;
                              setAllClients(updatedClients)
                            }} styles={customStyles} options={[
                              { value: 'Yet to Start', label: 'Yet to Start' },
                              { value: 'In Progress', label: 'In Progress' },
                              { value: 'Completed', label: 'Completed' }]} required />
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: '10%',
                            }}
                            className="tableBody">
                            {client.suggestion}
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: '10%',
                            }}
                            className="tableBody"
                          >
                            {' '}
                            <Select value={client.cinematography?.clientRevision ? { value: client?.cinematography?.clientRevision, label: client?.cinematography?.clientRevision } : null} name='clientRevision' onChange={(selected) => {
                              const updatedClients = [...allClients];
                              updatedClients[index].cinematography = client.cinematography || {};
                              updatedClients[index].cinematography.clientRevision = selected.value;
                              setAllClients(updatedClients)
                            }} styles={customStyles} options={[
                              { value: 1, label: 1 },
                              { value: 2, label: 2 },
                              { value: 3, label: 3 }]} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            <button className="btn btn-primary "
                              onClick={(e) => handleSaveData(index)} >
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
                      {currentUser?.rollSelect == 'Editor' && (
                        <tr
                          style={{
                            borderRadius: '8px',
                          }}
                        >
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2"
                          >
                            {client.brideName}
                            <div
                              style={{
                                fontSize: '12px',
                                marginRight: '10px',
                                marginBottom: '5px',
                              }}
                            >
                              <img src={Heart} />
                              <br />
                              {client.groomName}
                            </div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <div>
                              long Films : {client.longFilms}
                              <br />
                              Reels : {client.reels}
                              <br />
                              {client.promos === 'Yes' && 'Promos'}
                            </div>

                          </td>


                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <input
                              type="date"
                              name="companyDeadline"
                              className="dateInput text-center"
                              onChange={(e) => {
                                const updatedClients = [...allClients]
                                updatedClients[index].cinematography = client?.cinematography || {};
                                updatedClients[index].cinematography.companyDeadline = e.target.value;
                                setAllClients(updatedClients);
                              }}
                              value={client.cinematography?.companyDeadline ? dayjs(new Date(client.cinematography?.companyDeadline)).format('YYYY-MM-DD') : null}
                              readOnly />
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2"   >
                            <Select value={client.cinematography?.status ? { value: client?.cinematography?.status, label: client?.cinematography?.status } : null} name='cinematographyStatus' onChange={(selected) => {
                              const updatedClients = [...allClients];
                              updatedClients[index].cinematography = client.cinematography || {};
                              updatedClients[index].cinematography.status = selected.value;
                              setAllClients(updatedClients)
                            }} styles={customStyles} options={[
                              { value: 'Yet to Start', label: 'Yet to Start' },
                              { value: 'In Progress', label: 'In Progress' },
                              { value: 'Completed', label: 'Completed' }]} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            <button className="btn btn-primary "
                              onClick={(e) => handleSaveData(index)} >
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

                      <div style={{ marginTop: '15px' }} />
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

export default Cinematography;
