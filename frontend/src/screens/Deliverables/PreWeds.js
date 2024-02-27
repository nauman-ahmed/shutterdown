import React, { useEffect, useRef, useState } from 'react';
import { Form, Table } from 'reactstrap';
import '../../assets/css/Profile.css';
import Heart from '../../assets/Profile/Heart.svg';
import '../../assets/css/tableRoundHeader.css';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { addphotosDeliverables, addPhotosDeliverables, getClients } from '../../API/Client';
import { getEditors } from '../../API/userApi';
import Select from 'react-select';
import CalenderImg from '../../assets/Profile/Calender.svg';
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';
import Cookies from 'js-cookie';
import ClientHeader from '../../components/ClientHeader';
import { getPhotos, getPreWeds, updateDeliverable } from '../../API/Deliverables';


function PreWedDeliverables() {

  const [editors, setEditors] = useState(null);
  const [allClients, setAllClients] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const [clientsForShow, setClientsForShow] = useState(null);
  const [deliverablesForShow, setDeliverablesForShow] = useState(null);
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
  };
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const target = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setClientsForShow(allClients)
  }, [allClients])

  const fetchData = async () => {
    try {
      const data = await getPreWeds();
      const res = await getEditors();
      setEditors(res.editors);
      console.log(data);
      if (currentUser?.rollSelect == 'Manager') {
        setAllDeliverables(data)
        setDeliverablesForShow(data)
      } else if (currentUser?.rollSelect == 'Editor') {
        const deliverablesToShow = data.filter(deliverable => deliverable?.editor?._id == currentUser._id);
        setAllDeliverables(deliverablesToShow);
        setDeliverablesForShow(deliverablesToShow);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData()
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
      const deliverable = allDeliverables[index];
      // if (!client.photosDeliverables) {
      //   window.notify('Please Select the values!', 'error');
      //   return
      // } else if (!client.photosDeliverables.editor) {
      //   window.notify('Please Select Editor!', 'error');
      //   return
      // } else if (!client.photosDeliverables.weddingDate) {
      //   window.notify('Please Select Wedding Date!', 'error');
      //   return
      // } else if (!client.photosDeliverables.companyDeadline) {
      //   window.notify('Please Provide Company Deadline!', 'error');
      //   return
      // } else if (!client.photosDeliverables.status) {
      //   window.notify('Please Select any Status!', 'error');
      //   return
      // } else if (!client.photosDeliverables.clientRevision) {
      //   window.notify('Please Select Client Revisions!', 'error');
      //   return
      // }
      setUpdatingIndex(index);
      await updateDeliverable(deliverable)
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ClientHeader filter title="Pre-Wedding" />
      {deliverablesForShow ? (
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
              style={currentUser.rollSelect == 'Manager' ? { width: '175%', marginTop: '15px' } : { width: '100%', marginTop: '15px' }}
            >
              <thead>
                {currentUser?.rollSelect == 'Editor' ?
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client:</th>
                    <th className="tableBody">Deliverable</th>
                    <th className="tableBody">Editor</th>
                    <th className="tableBody">Company Deadline</th>
                    <th className="tableBody">Status</th>
                  </tr>
                  :currentUser?.rollSelect == 'Manager' ?
                    <tr className="logsHeader Text16N1">
                      <th className="tableBody">Client:</th>
                      <th className="tableBody">Deliverable</th>
                      <th className="tableBody">Editor</th>
                      <th className="tableBody">Wedding Date</th>
                      <th className="tableBody">Client Deadline</th>
                      <th className="tableBody">Company Deadline</th>
                      <th className="tableBody">First Delivery Date</th>
                      <th className="tableBody">Final Delivery Date</th>
                      <th className="tableBody">Status</th>
                      <th className="tableBody">Client Revisions</th>
                      <th className="tableBody">Client Ratings</th>
                      <th className="tableBody">Save</th>
                    </tr>
                  :null
                }
              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                }}
              >
                {deliverablesForShow?.map((deliverable, index) => {
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
                              width:"10%"
                            }}
                            className="tableBody Text14Semi primary2"
                          >
                            {deliverable?.client?.brideName}
                            <div
                              style={{
                                fontSize: '12px',
                                marginRight: '10px',
                                marginBottom: '5px',
                              }}
                            >
                              <img src={Heart} />
                              <br />
                              {deliverable.client?.groomName}
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
                              {deliverable.deliverableName}

                            </div>

                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >

                            <Select value={deliverable?.editor ? { value: deliverable?.editor.firstName, label: deliverable?.editor?.firstName } : null} name='editor' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].editor = selected.value;
                              setAllDeliverables(updatedDeliverables)
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
                            {dayjs(new Date(deliverable?.clientDeadline).setDate(new Date(deliverable?.clientDeadline).getDate() - 45)).format('DD-MM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            {dayjs(deliverable?.clientDeadline).format('DD-MM-YYYY')}
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
                                const updatedDeliverables = [...allDeliverables]
                                updatedDeliverables[index].companyDeadline = e.target.value;
                                setAllDeliverables(updatedDeliverables);
                              }}
                              value={deliverable?.companyDeadline ? dayjs(deliverable?.companyDeadline).format('YYYY-MM-DD') : null}
                            />
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
                              name="firstDeliveryDate"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [...allDeliverables]
                                updatedDeliverables[index].firstDeliveryDate = e.target.value;
                                setAllDeliverables(updatedDeliverables);
                              }}
                              value={deliverable?.firstDeliveryDate ? dayjs(deliverable?.firstDeliveryDate).format('YYYY-MM-DD') : null}
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}>

                            <input
                              type="date"
                              name="finalDeliveryDate"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [...allDeliverables]
                                updatedDeliverables[index].finalDeliveryDate = e.target.value;
                                setAllDeliverables(updatedDeliverables);
                              }}
                              value={deliverable?.finalDeliveryDate ? dayjs(deliverable?.finalDeliveryDate).format('YYYY-MM-DD') : null}
                            />
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width:"10%"
                            }}
                            className="tableBody Text14Semi primary2"   >
                            <Select value={deliverable?.status ? { value: deliverable?.status, label: deliverable?.status } : null} name='Status' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].status = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={[
                              { value: 'Yet to Start', label: 'Yet to Start' },
                              { value: 'In Progress', label: 'In Progress' },
                              { value: 'Completed', label: 'Completed' }]} required />
                          </td>
                          {/* <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: '10%',
                            }}
                            className="tableBody">
                            {client.suggestion}
                          </td> */}
                          <td style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                            width: '10%',
                          }} className="tableBody">
                            {' '}
                            <Select value={deliverable?.clientRevision ? { value: deliverable?.clientRevision, label: deliverable?.clientRevision } : null} name='clientRevision' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].clientRevision = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={[
                              { value: 1, label: 1 },
                              { value: 2, label: 2 },
                              { value: 3, label: 3 }]} required />
                          </td>
                          <td style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                            width: '10%',
                          }} className="tableBody">
                            {' '}
                            <Select value={deliverable?.clientRating ? { value: deliverable?.clientRating, label: deliverable?.clientRating } : null} name='clientRating' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].clientRating = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={[
                              { value: 1, label: 1 },
                              { value: 2, label: 2 },
                              { value: 3, label: 3 },
                              { value: 4, label: 4 },
                              { value: 5, label: 5 }]} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            <button className="btn btn-primary "
                              onClick={(e) => updatingIndex === null && handleSaveData(index)} >
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
                            {deliverable?.client?.brideName}
                            <div
                              style={{
                                fontSize: '12px',
                                marginRight: '10px',
                                marginBottom: '5px',
                              }}
                            >
                              <img src={Heart} />
                              <br />
                              {deliverable?.client?.groomName}
                            </div>
                          </td>
                          <td className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            <div>
                              {deliverable?.deliverableName} : {deliverable?.quantity}
                            </div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            {deliverable?.editor?.firstName}
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2"   >
                            {deliverable?.companyDeadline}
                          </td> 
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2"   >
                            {deliverable?.status}
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
            <Overlay rootClose={true}
              onHide={() => setShow(false)}
              target={target.current}
              show={show}
              placement="bottom">
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

export default PreWedDeliverables;
