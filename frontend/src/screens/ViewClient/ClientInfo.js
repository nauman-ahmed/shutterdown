import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"
import { Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table, Tooltip } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import dayjs from "dayjs";
import { getClientById } from "../../API/Client"
import Calendar from "react-calendar";
import CalenderImg from '../../assets/Profile/Calender.svg';
import Select from 'react-select';
import { addEvent, deleteEvent } from '../../API/Event';
import { MdDelete } from "react-icons/md";

function ClientInfo() {
  const [clientData, setClientData] = useState(null)
  const { clientId } = useParams()
  const [newEventModel, setNewEventModel] = useState(false);
  const [newEvent, setNewEvent] = useState({ client: clientId })
  const [showCalender, setShowCalender] = useState(false);

  const target = useRef(null);
  useEffect(() => {
    getIdData()
  }, [])
  let travelByOptions = [
    {
      value: 'Car',
      label: 'Car',
    },
    {
      value: 'Bus',
      label: 'Bus',
    },
    {
      value: 'By Air',
      label: 'By Air',
    },
    {
      value: 'N/A',
      label: 'N/A',
    },
  ];
  let numberOptions = [
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
  ];
  let yesNoOptions = [
    {
      value: 'Yes',
      label: "Yes",
    },
    {
      value: 'No',
      label: "NO",
    },
  ];
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
  const getIdData = async () => {
    try {
      const res = await getClientById(clientId)
      setClientData(res);
    } catch (error) {
      console.log(error);
    }
  };
  const updateNewEvent = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
  }
  const addNewEvent = async () => {
    try {
      await addEvent(newEvent);
      setNewEvent({client : clientId});
      setNewEventModel(false);
      window.notify('Event added successfully!', 'success');
      getIdData();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Table bordered hover responsive>
        <thead>
          <tr
            className="logsHeader Text16N1"
            style={{ background: '#EFF0F5', borderWidth: '1px !important' }}>
            <th>Client</th>
            <th>Phone number</th>
            <th>POC</th>
            <th>Album: Type</th>
            <th>Pre-wedding Photos</th>
            <th>Pre-wedding Videos</th>
            <th>HDD</th>
            <th>Long-Film</th>
            <th>Reels</th>
            <th>Promo</th>
            <th>Payment status</th>
          </tr>
        </thead>
        <tbody
          className="Text12 primary2"
          style={{
            textAlign: 'center',
            borderWidth: '0px 1px 0px 1px',
          }}>
          <tr>
            <td className="Text14Semi primary2">
              <td
                style={{
                  paddingTop: '15px',
                  paddingBottom: '15px',
                }}
                className="tableBody Text14Semi primary2 fs-6" >
                {clientData?.brideName}
                <div
                  style={{
                    fontSize: '12px',
                    marginRight: '10px',
                    marginBottom: '5px',
                  }}
                >
                  <img src={Heart} />
                  <br />
                  {clientData?.groomName}
                </div>
              </td>
            </td>
            <td className="textPrimary fs-6">{clientData?.phoneNumber}</td>
            <td className="textPrimary fs-6">{clientData?.userID?.firstName} {clientData?.userID?.lastName}</td>
            <td className="textPrimary fs-6">
              {clientData?.albums?.map((val, i) =>
                <div>
                  {i + 1} : {val}
                  <br />
                </div>
              )}
            </td>
            <td className="textPrimary fs-6">{clientData?.deliverables?.preWeddingPhotos ? 'Yes' : 'No'}</td>
            <td className="textPrimary fs-6">{clientData?.deliverables?.preWeddingVideos ? 'Yes' : 'No'}</td>
            <td className="textPrimary fs-6">{clientData?.hardDrives}</td>
            <td className="textPrimary fs-6">{clientData?.longFilms}</td>
            <td className="textPrimary fs-6">{clientData?.reels}</td>
            <td className="textPrimary fs-6">{clientData?.promos}</td>
            <td className="textPrimary fs-6">{clientData?.paymentStatus}</td>
          </tr>
        </tbody>
      </Table>
      <div className="clientBtn d-flex flex-row justify-content-between">
        <h3 className=" my-1 py-1 Text24Semi d-sm-none d-md-block">Events</h3>
        <div>
          <button onClick={() => setNewEventModel(true)} className="btn btn-primary">Add Event</button>
        </div>
      </div>
      <Table bordered hover responsive>
        <thead>
          <tr className="logsHeader Text16N1"
            style={{ background: '#EFF0F5', borderWidth: '1px !important' }} >
            <th>Event Date</th>
            <th>Event Type</th>
            <th>location</th>
            <th>Travel By</th>
            <th>Photographers</th>
            <th>Cinematographers</th>
            <th>Drones</th>
            <th>Same Day Photo Editors</th>
            <th>Same Day Video Editors</th>
            <th>Tentative</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody
          className="Text12 primary2"
          style={{
            textAlign: 'center',
            borderWidth: '0px 1px 0px 1px',
            // background: "#EFF0F5",
          }}>
          {clientData?.events?.map((event, i) => {
            return (
              <tr>
                <td className="textPrimary fs-6">{dayjs(event.eventDate).format('YYYY-MM-DD')}</td>
                <td className="textPrimary fs-6">{event?.eventType}</td>
                <td className="textPrimary fs-6">{event.location}</td>
                <td className="textPrimary fs-6">{event?.travelBy}</td>
                <td className="textPrimary fs-6">{event?.photographers}</td>
                <td className="textPrimary fs-6">{event?.cinematographers}</td>
                <td className="textPrimary fs-6">{event?.drones}</td>
                <td className="textPrimary fs-6">{event?.sameDayPhotoEditor}</td>
                <td className="textPrimary fs-6">{event?.sameDayVideoEditor}</td>
                <td className="textPrimary fs-6">{event?.tentative}</td>
                <td><MdDelete onClick={async ()=>{
                   await deleteEvent(event._id);
                   getIdData();
                   }} className="text-danger cursor-pointer fs-3"/></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Modal isOpen={newEventModel} centered={true} size="lg" fullscreen="md" >
        <ModalHeader>Event Details</ModalHeader>
        <Form onSubmit={(e) => {
          e.preventDefault();
          if (newEvent.eventDate === '' || !newEvent.eventDate) {
            window.notify('Please set event Date!', 'error');
            return
          }
          addNewEvent();
        }}>
          <ModalBody >
            <Row ref={target}>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Event Date</div>
                <div className={`ContactModel d-flex justify-content-between textPrimary`}
                  onClick={() => setShowCalender(!showCalender)}
                  style={{ cursor: 'pointer' }} >
                  {newEvent?.eventDate ? dayjs(newEvent?.eventDate).format('DD-MMM-YYYY') : 'Date'}
                  <img src={CalenderImg} />
                </div>
                {showCalender && (
                  <div style={{
                    zIndex : '5'
                  }} className="position-absolute">
                    <Calendar
                      minDate={new Date(Date.now())}
                      CalenderPress={() => setShowCalender(false)}
                      onClickDay={(date) => {
                        setShowCalender(!showCalender)
                        setNewEvent({ ...newEvent, eventDate: date })
                      }}
                      tileClassName={({ date }) => {
                        let count = 0;
                        for (let index = 0; index < clientData?.events?.length; index++) {
                          const initialDate = new Date(clientData?.events[index].eventDate)
                          const targetDate = new Date(date);
                          const initialDatePart = initialDate.toISOString().split("T")[0];
                          const targetDatePart = targetDate.toISOString().split("T")[0];
                          if (initialDatePart === targetDatePart) {
                            count += 1
                          }
                        }
                        if (count == 1) {
                          return "highlight5"
                        } else if (count == 2) {
                          return "highlight3"
                        } else if (count >= 3) {
                          return "highlight1"
                        }
                      }}
                    />
                  </div>
                )}
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Event Type</div>
                <input value={newEvent?.eventType} onChange={(e) => updateNewEvent(e)} type="name" name="eventType" placeholder="Event_Type" className="ContactModel" required />
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label mt25">Location</div>
                <input value={newEvent?.location} type="text" onChange={(e) => updateNewEvent(e)} name="location" className="ContactModel Text16N" placeholder="Location" required />
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Travel By
                  </div>
                  <Select value={newEvent?.travelBy ? { value: newEvent?.travelBy, label: newEvent?.travelBy } : null} name='travelBy' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, travelBy: selected.value })
                  }} styles={customStyles} options={travelByOptions} required />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Photographers
                  </div>
                  <Select value={newEvent?.photographers ? { value: newEvent?.photographers, label: newEvent?.photographers } : null} name='phtotgraphers' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, photographers: selected.value })
                  }} styles={customStyles} options={numberOptions} required />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Cinematographers
                  </div>
                  <Select value={newEvent?.cinematographers ? { value: newEvent?.cinematographers, label: newEvent?.cinematographers } : null} name='cinematographers' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, cinematographers: selected.value })
                  }} styles={customStyles} options={numberOptions} required />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Drones
                  </div>
                  <Select value={newEvent?.drones ? { value: newEvent?.drones, label: newEvent?.drones } : null} name='drones' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, drones: selected.value })
                  }} styles={customStyles} options={numberOptions} required />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Same day Photo editor
                  </div>
                  <Select value={newEvent?.sameDayPhotoEditor ? { value: newEvent?.sameDayPhotoEditor, label: newEvent?.sameDayPhotoEditor } : null} name='sameDayPhotoEditor' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, sameDayPhotoEditor: selected.value })
                  }} styles={customStyles} options={yesNoOptions} required />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Same day Video editor
                  </div>
                  <Select value={newEvent?.sameDayVideoEditor ? { value: newEvent?.sameDayVideoEditor, label: newEvent?.sameDayVideoEditor } : null} name='sameDayVideoEditor' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, sameDayVideoEditor: selected.value })
                  }} styles={customStyles} options={yesNoOptions} required />
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className='mt25'>
                  <div className="Text16N" style={{ marginBottom: '6px' }}>
                    Tentative
                  </div>
                  <Select value={newEvent?.tentative ? { value: newEvent?.tentative, label: newEvent?.tentative } : null} name='tentative' className='w-75' onChange={(selected) => {
                    setNewEvent({ ...newEvent, tentative: selected.value })
                  }} styles={customStyles} options={yesNoOptions} required />
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" className="Update_btn" >
              ADD
            </Button>
            <Button color="danger" onClick={() => { setNewEventModel(false) }}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
}

export default ClientInfo;
