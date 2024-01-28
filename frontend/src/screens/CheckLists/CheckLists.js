import React, { useEffect, useRef, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import { getClients, updateClient } from "../../API/Client";
import Select from "react-select";
import CalenderImg from '../../assets/Profile/Calender.svg';
import Calendar from 'react-calendar';
import { Overlay } from 'react-bootstrap';
import dayjs from "dayjs";

function CheckLists(props) {
  const [allClients, setAllClients] = useState(null);
  const [filterFor, setFilterFor] = useState('day');
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const toggle = () => {
    setShow(!show);
  };
  const [clientsForShow, setClientsForShow] = useState(null);
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

  const fetchClients = async () => {
    try {
      const clients = await getClients();
      setClientsForShow(clients);
      setAllClients(clients);
    } catch (error) {
      console.log(error, "error")
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const yesNoOptions = [{
    label: 'Yes',
    value: 'Yes'
  },
  {
    label: 'No',
    value: 'No'
  }]

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
      if (!client.checklistDetails) {
        window.notify('Please Select the values!', 'error');
        return
      } else if (!client.checklistDetails.whatsAppGroup) {
        window.notify('Please select whatsApp Group status!', 'error');
        return
      } else if (!client.checklistDetails.sopSentDate) {
        window.notify("Please Select SOP's sent date!", 'error');
        return
      } else if (!client.checklistDetails.questionsSentDate) {
        window.notify("Please Select questions sent date!", 'error');
        return
      } else if (!client.checklistDetails.iternaryCollection) {
        window.notify("Please Select iternary Collection!", 'error');
        return
      }
      setUpdatingIndex(index);
      await updateClient(client)
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
          <Table
            bordered
            hover
            // borderless
            responsive
            style={{ width: '100%', marginTop: '15px' }}
          >
            <thead>
              <tr className="logsHeader Text16N1">
                <th className="tableBody">Client:</th>
                <th className="tableBody">Created OnBo. W’App Group</th>
                <th className="tableBody">Light SOP Sent Date</th>
                <th className="tableBody">Quesnr. sent date</th>
                <th className="tableBody">Iternary Collection</th>
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
                    <tr
                      style={{
                        borderRadius: '8px',
                      }}
                    >
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {client.brideName}
                        <br />
                        <img src={Heart} alt="" />
                        <br />
                        {client.groomName}
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                          width: '170px'
                        }}
                      >
                        <Select value={client.checklistDetails?.whatsAppGroup ? { value: client?.checklistDetails?.whatsAppGroup, label: client?.checklistDetails?.whatsAppGroup } : null} onChange={(selected) => {
                          const updatedClients = [...allClients];
                          updatedClients[index].checklistDetails = client.checklistDetails || {};
                          updatedClients[index].checklistDetails.whatsAppGroup = selected.value;
                          setAllClients(updatedClients)
                        }} styles={customStyles} options={yesNoOptions} required />
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        <input
                          type="Date"
                          onChange={(e) => {
                            const updatedClients = [...allClients];
                            updatedClients[index].checklistDetails = client.checklistDetails || {};
                            updatedClients[index].checklistDetails.sopSentDate = e.target.value;
                            setAllClients(updatedClients);
                          }}
                          style={{ border: 'none', BackgroundColor: 'transparent' }}
                          value={client?.checklistDetails?.sopSentDate}
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
                          type="Date"
                          onChange={(e) => {
                            const updatedClients = [...allClients];
                            updatedClients[index].checklistDetails = client.checklistDetails || {};
                            updatedClients[index].checklistDetails.questionsSentDate = e.target.value;
                            setAllClients(updatedClients);
                          }}
                          style={{ border: 'none' }}
                          value={client?.checklistDetails?.questionsSentDate}
                        />
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                          width: '170px'
                        }}
                      >
                        <Select value={client.checklistDetails?.iternaryCollection ? { value: client?.checklistDetails?.iternaryCollection, label: client?.checklistDetails?.iternaryCollection } : null} onChange={(selected) => {
                          const updatedClients = [...allClients];
                          updatedClients[index].checklistDetails = client.checklistDetails || {};
                          updatedClients[index].checklistDetails.iternaryCollection = selected.value;
                          setAllClients(updatedClients)
                        }} styles={customStyles} options={yesNoOptions} required />
                      </td>
                      <td className="tableBody Text14Semi Primary2">
                        <button
                          style={{
                            backgroundColor: '#FFDADA',
                            borderRadius: '5px',
                            border: 'none',
                            height: '30px',
                          }}
                          onClick={() => handleSaveData(index)} >
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
                  </>
                );
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
        </>
      ) : (
        <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      )}


    </>
  );
}

export default CheckLists;
