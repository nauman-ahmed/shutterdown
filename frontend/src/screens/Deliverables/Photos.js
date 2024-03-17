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
import { getPhotos, updateDeliverable } from '../../API/Deliverables';


function Photos() {

  const [editors, setEditors] = useState(null);
  const [allClients, setAllClients] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const [filterBy, setFilterBy] = useState(null)
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

  const sortingOptions = [
    {
      title: 'No Sorting',
      id: 1
    },
    {
      title: 'Ascending',
      id: 2
    },
    {
      title: 'Descending',
      id: 3
    }
  ]
  const statusOptions = [
    {
      title: 'Any',
      id: 1
    },
    {
      title: 'Yet to Start',
      id: 2
    },
    {
      title: 'In Progress',
      id: 3
    },
    {
      title: 'Completed',
      id: 4
    },
  ]
  const editorsOptions = editors && [{ title: 'Any', id: 1 }, ...editors?.map((editor, i) => {
    return { title: editor.firstName, id: i + 2 }
  })]

  const [updatingIndex, setUpdatingIndex] = useState(null);
  const target = useRef(null);
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getPhotos();
      const res = await getEditors();
      setEditors(res.editors.filter(user => user.subRole === 'Photographer'));
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

  const applyFilter = (filterValue) => {
    setDeliverablesForShow(null)
    if (filterBy === 'Assigned Editor') {
      filterValue === 'Any' ? setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor ? true : false)) : setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor?.firstName === filterValue))
    } else if (filterBy === 'Current Status') {
      filterValue === 'Any' ? setDeliverablesForShow(allDeliverables) : setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.status === filterValue))
    } else if (filterBy === 'Deadline sorting') {
      console.log(filterValue);
      let sortedArray;
      if (filterValue === 'No Sorting') {
        sortedArray = [...allDeliverables]; // Create a new array
      } else {
        sortedArray = [...allDeliverables].sort((a, b) => {
          const dateA = new Date(a.clientDeadline);
          const dateB = new Date(b.clientDeadline);
          return filterValue === 'Ascending' ? dateA - dateB : dateB - dateA;
        });
      }
      setDeliverablesForShow([...sortedArray]);
    }else if (filterBy === 'Wedding Date sorting') {
      console.log(filterValue);
      let sortedArray;
      if (filterValue === 'No Sorting') {
        sortedArray = [...allDeliverables]; // Create a new array
      } else {
        sortedArray = [...allDeliverables].sort((a, b) => {
          const dateA = new Date(a.clientDeadline).setDate(new Date(a?.clientDeadline).getDate() - 45);
          const dateB = new Date(b.clientDeadline).setDate(new Date(b?.clientDeadline).getDate() - 45);
          return filterValue === 'Ascending' ? dateA - dateB : dateB - dateA;
        });
      }
      setDeliverablesForShow([...sortedArray]);
    }
  }
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
      <ClientHeader options={filterBy === 'Assigned Editor' ? editorsOptions : filterBy === 'Wedding Date sorting' || filterBy === 'Deadline sorting' ? sortingOptions : filterBy === 'Current Status' ? statusOptions : [{ title: 'No any filter Choosen', id: null }]} applyFilter={applyFilter} filter title="Photos" />
      {deliverablesForShow ? (
        <>
        <div className='w-75 d-flex flex-row  mx-auto align-items-end justify-content-end' style={{
            marginTop: '-50px',
            // marginBottom: '30px'
          }} ref={target}>

            <div className='w-50 d-flex flex-row align-items-center justify-content-end'>
              <div style={{ width: '300px' }} className=' ms-2 d-flex justify-content-end'>
                <p className='Text16N1 fw-bold pt-2'>Filter By :</p>
                <Select value={{ value: filterBy || null, label: filterBy || 'Filter By...' }} className='w-75' onChange={(selected) => {
                  if (selected.value !== filterBy) {
                    if (selected.value === 'Assigned Editor') {
                      setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor ? true : false))
                    } else if (selected.value === 'Unassigned Editor') {
                      setDeliverablesForShow(allDeliverables.filter(deliverable => !deliverable.editor))
                    }
                  }
                  setFilterBy(selected.value);
                }} styles={customStyles}
                options={currentUser?.rollSelect === 'Manager' ? [
                    { value: 'Assigned Editor', label: 'Assigned Editor' },
                    { value: 'Unassigned Editor', label: 'Unassigned Editor' },
                    { value: 'Wedding Date sorting', label: 'Wedding Date sorting' },
                    { value: 'Deadline sorting', label: 'Deadline sorting' },
                    { value: 'Current Status', label: 'Current Status' },
                  ] : [
                    { value: 'Current Status', label: 'Current Status' },
                  ]} />
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
                  :
                  null
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
                              width:"10%"
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
                              width:"20%"
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
                              width:"10%"
                            }}  >
                            {dayjs(new Date(deliverable?.clientDeadline).setDate(new Date(deliverable?.clientDeadline).getDate() - 45)).format('DD-MM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width:"10%"
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
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
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

export default Photos;
