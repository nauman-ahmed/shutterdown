import React, { useEffect, useState } from "react";
import "../../assets/css/Profile.css";
import { checkInUser, checkOutUser, getUserAttendence } from "../../API/AttendenceApi"
import { format } from 'date-fns';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Row,
  Col,
  Table,
} from 'reactstrap';

function Logs(props) {
  const [attendaces, setAttendaces] = useState(null);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);


  const getUserAttendaces = async () => {
    try {
      const userAttendaces = await getUserAttendence();
      setAttendaces(userAttendaces);
    } catch (error) {
      console.log(error);
    }
  }

  // Function to calculate distance between two points using Haversine formula
  const  calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Function to convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  useEffect(() => {
    getUserAttendaces();
  }, [])

  const fetchGeolocation = async () => {
    try {

      const response = await axios.get('https://ipapi.co/json/');
      const org_lat = 52.5167; // Latitude of point 1
      const org_lng = 13.3833; // Longitude of point 1
      const lat2 = response.data.latitude; // Latitude of point 2
      const lon2 = response.data.longitude; // Longitude of point 2
      const distance = calculateDistance(org_lat, org_lng, lat2, lon2);
      return distance

    } catch (error) {
      console.error('Error fetching geolocation:', error);
    }
  };

  const checkInHandler = async (data=null) => {
    if(data == null){
      const distance = await fetchGeolocation();
      if(distance >430){
        setModal(true)
      }
      return
    }
    await checkInUser(data);
    getUserAttendaces();
  }

  return (
    <div className="Profile_Web_hide">
      {attendaces ? (
        <>
          <Row>
            <Col
              xs="12"
              style={{ paddingRight: "10%" }}
            >
              <div className="profileCard" style={{ marginLeft: 10, width: '100%', paddingTop: 6, paddingBottom: 10 }}>
                <div className="R_A_Justify p10">
                  <div className="Text14Semi">Mark Attendence</div>
                </div>
                <div className="line" />

                <div className="plt12" style={{ paddingTop: '15px' }}>
                  <Row>
                    <Col xs={4} sm={6} className>
                      <Button className="submit_btn submit" onClick={() => checkInHandler()}>
                        Check In
                      </Button>
                      <Button type="submit" className="submit_btn submit" style={{ marginLeft:"5px" }} onClick={async () => {
                        await checkOutUser();
                        getUserAttendaces();
                      }}>
                        Check Out
                      </Button>
                    </Col>
                    <Col xs={4} sm={6}>
                      <Button className="submit" style={{ width:"auto" }} onClick={() => checkInHandler({home:"yes"})}>
                        Check In From Home
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
          <Table
            // bordered
            hover
            borderless
            responsive
            style={{ width: '95%', marginTop: '15px' }}
          >
            <thead>
              <tr className="logsHeader Text16N1 gray2">
                <th className="tableBody">Dates</th>
                <th className="tableBody">Checked In Time</th>
                <th className="tableBody">Checked Out Time</th>
                <th className="tableBody">Checked In From Home</th>
              </tr>
            </thead>
            <tbody
              className="Text12"
              style={{ textAlign: 'center', borderWidth: '0px 1px 0px 1px' }}
            >
              {attendaces?.map((attendace, index) => (
                <tr>
                  <td
                    style={{ paddingTop: '15px', paddingBottom: '15px' }}
                    className="tableBody"
                  >
                    {attendace.currentDate}
                  </td>
                  <td
                    className="tableBody"
                    style={{ paddingTop: '15px', paddingBottom: '15px' }}
                  >
                    {attendace.checkInTime == "Not Marked" ? attendace.checkInTime : new Date(attendace.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                  <td
                    className="tableBody"
                    style={{ paddingTop: '15px', paddingBottom: '15px' }}
                  >
                    {attendace.checkOutTime == "Not Marked" ? attendace.checkOutTime : new Date(attendace.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                  <td
                    className="tableBody"
                    style={{ paddingTop: '15px', paddingBottom: '15px' }}
                  >
                    {attendace.fromHome? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal
            isOpen={modal}
            toggle={toggle}
            centered={true}
            fullscreen="sm"
            size="sm"
          >
            <Form onSubmit={(e) => {
              e.preventDefault();
              checkInHandler({home:"yes"})
              setModal(false)
            }}>
              <ModalBody>
                <Row className="p-3">
                  <Col xl="12" sm="12" lg="12" className="p-2">
                    <div className="label">Are you working from home?</div>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type='submit' className="Update_btn" >
                  Yes
                </Button>
                <Button type='button' color="danger" onClick={toggle}>
                  No
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      ) : (
        <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      )}

    </div>
  );
}

export default Logs;
