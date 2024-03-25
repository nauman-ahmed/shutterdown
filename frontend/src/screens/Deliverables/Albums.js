import React, { useRef, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { addAlbumsDeliverables, getClients } from "../../API/Client";
import { getEditors } from "../../API/userApi";
import CalenderImg from '../../assets/Profile/Calender.svg';
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';
import dayjs from "dayjs";
import Cookies from "js-cookie";
import ClientHeader from "../../components/ClientHeader";
import { getAlbums, updateDeliverable } from "../../API/Deliverables";
import { useNavigate } from "react-router-dom";

function Albums(props) {
  const [editors, setEditors] = useState(null);
  const [allClients, setAllClients] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const [filterBy, setFilterBy] = useState(null)
  const [updatingIndex, setUpdatingIndex] = useState(null);
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
  const target = useRef(null);
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getAlbums();
      const res = await getEditors();
      setEditors(res.editors)
      if (currentUser?.rollSelect == 'Manager') {
        setAllDeliverables(data)
        setDeliverablesForShow(data)
      } else if (currentUser.rollSelect == 'Editor') {
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

  const filterOptions = currentUser?.rollSelect === 'Manager' ? [
    {
      title: 'Assigned Editor',
      id: 1,
      filters: editors && [{ title: 'Any', id: 1 }, ...editors?.map((editor, i) => {
        return { title: editor.firstName, id: i + 2 }
      })]
    },
    {
      title: 'Unassigned Editor',
      id: 2,
      filters: []
    },
    {
      title: 'Wedding Date sorting',
      id: 3,
      filters: [
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
    },
    {
      title: 'Deadline sorting',
      id: 4,
      filters: [
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
    },
    {
      title: 'Current Status',
      id: 5,
      filters: [
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
    },
  ] : [
    {
      title: 'Current Status',
      id: 5,
      filters: [
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
    },
  ]

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      if (filterType === 'Assigned Editor') {
        setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor ? true : false))
      } else if (filterType === 'Unassigned Editor') {
        setDeliverablesForShow(allDeliverables.filter(deliverable => !deliverable.editor))
      } else {
        setDeliverablesForShow(allDeliverables)
      }
    }
    setFilterBy(filterType);
  }

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
      setUpdatingIndex(index);
      await updateDeliverable(deliverable);
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  const openWhatsAppChat = (contact, message) => {

    // const chatUrl = `whatsapp://send?abid=${contactParam}&text=Hello%2C%20World!`;
    // window.open(chatUrl, '_blank');

    const baseUrl = 'https://web.whatsapp.com/';
    const contactParam = encodeURIComponent(contact);
    const messageParam = encodeURIComponent(message);
    const chatUrl = `${baseUrl}send?phone=${contactParam}&text=${messageParam}`;
    window.open(chatUrl, '_blank');

  }
  console.log(deliverablesForShow)

  return (
    <>
      <ClientHeader selectFilter={changeFilter} currentFilter={filterBy} applyFilter={applyFilter} options={filterOptions} filter title="Albums" />
      {deliverablesForShow ? (
        <>
         
          <div style={{ overflowX: 'hidden', width: '100%' }}>
            <Table
              hover
              bordered
              responsive
              className="tableViewClient"
              style={currentUser.rollSelect == 'Manager' ? { width: '175%', marginTop: '15px' } : { width: '100%', marginTop: '15px' }}
            >
              <thead>
                {currentUser?.rollSelect == 'Editor' ?
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client</th>
                    <th className="tableBody">Album</th>
                    <th className="tableBody">Editor</th>
                    <th className="tableBody">Company Deadline</th>
                    <th className="tableBody">Status</th>
                  </tr>
                  : currentUser?.rollSelect == 'Manager' ?
                    <tr className="logsHeader Text16N1">
                      <th className="tableBody">Client</th>
                      <th className="tableBody">Album</th>
                      <th className="tableBody">Editor</th>
                      <th className="tableBody">Wedding Date</th>
                      <th className="tableBody">Client Deadline</th>
                      <th className="tableBody">Company Deadline</th>
                      <th className="tableBody">First Delivery Date</th>
                      <th className="tableBody">Final Delivery Date</th>
                      <th className="tableBody">Status</th>
                      <th className="tableBody">Action</th>
                      <th className="tableBody">Client Ratings</th>
                      <th className="tableBody">Save</th>
                    </tr>
                    : null
                }
              </thead>
              <tbody className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                  // background: "#EFF0F5",
                }}>

                {deliverablesForShow?.map((deliverable, index) => {
                  return (
                    <>
                      {index == 0 && <div style={{ marginTop: '15px' }} />}
                      {currentUser?.rollSelect == 'Manager' && (
                        <tr style={{
                          background: '#EFF0F5',
                          borderRadius: '8px',
                        }}>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: "10%"
                            }}
                            className="tableBody Text14Semi primary2"
                          >
                            {deliverable.client?.brideName}
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
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: "10%"
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
                              width: "20%"
                            }} >

                            <Select value={deliverable?.editor ? { value: deliverable?.editor?.firstName, label: deliverable?.editor?.firstName } : null} name='editor' onChange={(selected) => {
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
                              width: "10%"
                            }}  >
                            {dayjs(new Date(deliverable?.clientDeadline).setDate(new Date(deliverable?.clientDeadline).getDate() - 45)).format('DD-MM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: "10%"
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
                              width: "10%"
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
                          <td
                            onClick={() => openWhatsAppChat(deliverable.client.phoneNumber, "HI This is shutter down ")}
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width: "15%"
                            }}
                            className="tableBody Text14Semi primary2"
                          >
                            Reminder/Yes or No
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
                      {currentUser.rollSelect == 'Editor' && (
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
                })}


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
  )
}

export default Albums;
