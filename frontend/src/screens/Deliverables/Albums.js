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

function Albums(props) {
  const [editors, setEditors] = useState(null);
  const [allClients, setAllClients] = useState(null);
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const [clientsForShow, setClientsForShow] = useState([]);
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
  const target = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setClientsForShow(allClients)
  }, [allClients])
  const fetchData = async () => {
    try {
      const data = await getClients();
      const res = await getEditors();
      console.log(res.editors);
      setAllClients(data)
      setClientsForShow(data)
      setEditors(res.editors)
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
      const client = allClients[index];
      if (!client.albumsDeliverables) {
        window.notify('Please Select the values!', 'error');
        return
      } else if (!client.albumsDeliverables.editor) {
        window.notify('Please Select Editor!', 'error');
        return
      } else if (!client.albumsDeliverables.status) {
        window.notify('Please Select any Status!', 'error');
        return
      }
      await addAlbumsDeliverables(client)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* {editor ? (
        <>
          <div style={{ overflowX: 'hidden', width: '100%' }}>
            <Table
              hover
              borderless
              responsive
              className="tableViewClient"
              style={{ width: '100%', marginTop: '15px' }}
            >
              <thead>
                <tr className="logsHeader Text16N1">
                  <th className="tableBody">Client:</th>
                  <th className="tableBody">Deliverable</th>
                  <th className="tableBody">Wedding Date</th>
                  <th className="tableBody">Company Deadline</th>
                  <th className="tableBody">Client Deadline</th>
                  <th className="tableBody">Status</th>
                  <th className="tableBody">Suggestions</th>
                  <th className="tableBody">Client Revisions</th>

                </tr>
              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                }}
              >
                {DeliverableData &&
                  DeliverableData.map((item) =>

                    <>

                      {item == 1 && <div style={{ marginTop: '15px' }} />}
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
                          {item.Client.BrideName}
                          <div
                            style={{
                              fontSize: '12px',
                              marginRight: '10px',
                              marginBottom: '5px',
                            }}
                          >
                            <img src={Heart} />
                            <br />
                            {item.Client.GroomName}
                          </div>
                        </td>
                        <td
                          className="tableBody Text14Semi primary2"
                          style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }}
                        >
                          {item.CinematographerSelect}
                        </td>

                        <td
                          className="tableBody Text14Semi primary2"
                          style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }}
                        >
                          {dayjs(item.dates).format('DD-MMM-YYYY')}
                        </td>
                        <td
                          className="tableBody Text14Semi primary2"
                          style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }}
                        >
                          {item.companyDate}
                        </td>
                        <td
                          className="tableBody Text14Semi primary2"
                          style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }}
                        >
                          {item.ClientDate}
                        </td>
                        <td
                          style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }}
                          className="tableBody Text14Semi primary2"
                        >
                          {item.Status}
                        </td>
                        <td
                          style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                            width: '10%',
                          }}
                          className="tableBody"
                        >
                          {item.suggestion}
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
                          {item.ClientRevision}
                        </td>


                      </tr>
                      <div style={{ marginTop: '15px' }} />
                    </>

                  )}
              </tbody>
            </Table>
          </div>
        </>
      ) : ( */}
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
            style={{ width: '100%', marginTop: '15px' }}
          >
            <thead>
              <tr className="logsHeader Text16N1">
                <th className="tableBody">Client</th>
                <th className="tableBody">No. of Albums</th>
                <th className="tableBody">Editor</th>
                <th className="tableBody">Status</th>
                <th className="tableBody">Action</th>
                <th className="tableBody">Save</th>
              </tr>
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
                          {client.albums?.map((album, i) => {
                            return (
                              <>
                                {i + 1}) {album}<br />
                              </>
                            )
                          })}

                        </div>

                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }} >

                        <Select value={client.albumsDeliverables?.editor ? { value: client?.albumsDeliverables?.editor.firstName, label: client?.albumsDeliverables?.editor?.firstName } : null} name='editor' onChange={(selected) => {
                          const updatedClients = [...allClients];
                          updatedClients[index].albumsDeliverables = client.albumsDeliverables || {};
                          updatedClients[index].albumsDeliverables.editor = selected.value;
                          setAllClients(updatedClients)
                        }} styles={customStyles} options={editors?.map(editor => {
                          return ({ value: editor, label: editor.firstName })
                        })} required />
                      </td>


                      <td
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                        className="tableBody Text14Semi primary2"   >
                        <Select value={client.albumsDeliverables?.status ? { value: client?.albumsDeliverables?.status, label: client?.albumsDeliverables?.status } : null} name='albumsDeliverablesStatus' onChange={(selected) => {
                          const updatedClients = [...allClients];
                          updatedClients[index].albumsDeliverables = client.albumsDeliverables || {};
                          updatedClients[index].albumsDeliverables.status = selected.value;
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
                        }}
                        className="tableBody Text14Semi primary2"
                      >
                        Reminder/Yes or No
                      </td>

                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }} >
                        <button className="btn btn-primary "
                          onClick={(e) => handleSaveData(index)} >
                          Save
                        </button>
                      </td>
                    </tr>
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
      {/* )} */}

    </>
  );
}

export default Albums;
