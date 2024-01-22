import React,{useEffect,useState} from "react";
import { Button, Col, Row, Table } from 'reactstrap';
import "../../assets/css/Profile.css";
import axios from "axios";
import { postAttendenceData, getMyAttendence, checkInUser, checkOutUser, getUserAttendence } from "../../API/AttendenceApi"
import { format } from 'date-fns';

function Logs(props) {
  const [attendaces, setAttendaces] = useState(null);
  const getUserAttendaces = async ()=>{
    try {
      const userAttendaces = await getUserAttendence();
      setAttendaces(userAttendaces);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getUserAttendaces();
  },[])

  return (
    <div className="Profile_Web_hide">
      <Row>
                <Col
                  xs="12"
                  style={{paddingRight:"10%"}}
                >
                  <div className="profileCard" style={{marginLeft:10,width:'100%',paddingTop:6,paddingBottom:10}}>
                    <div className="R_A_Justify p10">
                      <div className="Text14Semi">Mark Attendence</div>
                    </div>
                    <div className="line" />

                    <div className="plt12" style={{ paddingTop: '15px' }}>
                      <Row>
                        <Col xs={4} sm={6} className>
                          {/* <div className="Text10N black mt10 mb-1 label_input">
                          Check In
                          </div> */}
                          <Button  className="submit_btn submit" onClick={checkInUser}>
                            Check In
                          </Button>
                        </Col>
                        <Col xs={4} sm={6}>
                          {/* <div className="Text10N black mt10 mb-1 label_input">
                            Check Out
                          </div>                           */}
                          <Button type="submit" className="submit_btn submit" onClick={checkOutUser}>
                            Check Out
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
      {/* <div className="Text18S mt25">Logs & Requests</div> */}
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
            {/* <th className="tableBody">Name</th> */}
            <th className="tableBody">Checked In Time</th>
            <th className="tableBody">Checked Out Time</th>
            {/* <th className="tableBody">Arrival</th> */}
            {/* <th className="tableBody">LOG</th> */}
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
                {attendace.checkInTime == "Not Marked" ? attendace.checkInTime : format(new Date(attendace.checkInTime), 'HH:mm:ss')}
              </td>
              <td
                className="tableBody"
                style={{ paddingTop: '15px', paddingBottom: '15px' }}
              >
                {attendace.checkOutTime == "Not Marked" ? attendace.checkOutTime : format(new Date(attendace.checkOutTime), 'HH:mm:ss')}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Logs;
