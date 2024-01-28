import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'reactstrap';
import '../../assets/css/Profile.css';
import '../../assets/css/tableRoundHeader.css';
import Heart from '../../assets/Profile/Heart.svg';
import dayjs from 'dayjs'
import { getClients } from "../../API/Client"
import { Overlay } from 'react-bootstrap';
import Calendar from 'react-calendar';
import Select from 'react-select'
import CalenderImg from '../../assets/Profile/Calender.svg';

function ViewClient() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(null)
  const onPress = (clientId) => {
    navigate('/MyProfile/Client/ParticularClient/ClientInfo/' + clientId);
  };
  const [allClients, setAllClients] = useState()
  const [filterFor, setFilterFor] = useState('day')
  const toggle = () => {
    setShow(!show);
  };
  const [filteringDay, setFilteringDay] = useState(null);
  const filterByDay = (date) => {
    setFilteringDay(date)
    setShow(!show)
    setClients(allClients.filter(clientData => {
      return clientData.events.some(eventData => (new Date(eventData.eventDate)).getTime() === (new Date(date)).getTime())
    }))
  }
  const fetchData = async () => {
    try {
      const data = await getClients()
      setClients(data)
      setAllClients(data)
    } catch (error) {
      console.log(error)
    }
  }
  const filterByMonth = (date) => {
    setClients(allClients.filter(clientData => {
      return clientData.events.some(eventData => new Date(eventData.eventDate).getFullYear() === date.getFullYear() && new Date(eventData.eventDate).getMonth() === date.getMonth())
    }))
  }
  const target = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

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


  return (
    <>
      {clients ? (
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
                    setClients(allClients);
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
          <Table
            bordered
            hover
            borderless
            responsive
            style={{ marginTop: '15px' }}
            className="ViewClientWidth tableViewClient"
          >
            <thead>
              <tr className="logsHeader Text16N1">
                <th className="tableBody">Client</th>
                <th className="tableBody" style={{ width: '33%' }}>
                  Wedding Dates
                </th>
                <th className="tableBody"></th>
              </tr>
            </thead>
            <tbody
              className="Text12"
              style={{
                textAlign: 'center',
                borderWidth: '0px 1px 0px 1px',
              }}
            >
              {clients?.map((client, i) => (
                <>
                  <tr
                    style={{
                      background: '#EFF0F5',
                      borderRadius: '8px',
                    }}
                    onClick={() => onPress(client._id)}
                  >
                    <td
                      style={{
                        paddingTop: '15px',
                        paddingBottom: '15px',
                        width: '33%',
                      }}
                      className="tableBody Text14Semi primary2 textPrimary"
                    >
                      {client.brideName}
                      <br />
                      <img src={Heart} />
                      <br />
                      {client.groomName}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 textPrimary"
                      style={{
                        paddingTop: '15px',
                        paddingBottom: '15px',
                        width: '33%',
                      }}
                    >
                      {client.events.map((eventData) => {
                        return (
                          <p className='mb-0'>
                            {dayjs(eventData.eventDate).format('DD-MMM-YYYY')}
                          </p>
                        )
                      })}
                    </td>
                    <td
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                      className="tableBody"
                    ></td>
                  </tr>
                  <div style={{ marginTop: '15px' }} />
                </>
              ))}
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
        </>
      ) : (
        <div style={{height : '400px'}} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      )}
    </>
  );
}

export default ViewClient;
