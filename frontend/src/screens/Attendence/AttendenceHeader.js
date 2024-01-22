import React, { useState, useEffect } from 'react';
import { Button, Col, Modal, ModalBody, Progress, Row } from 'reactstrap';
import '../../assets/css/Profile.css';
import CommonInput from '../../components/CommonInput';
import RemoteClock from '../../assets/Profile/RemoteClock.svg';
import Holiday from '../../assets/Profile/Holiday.svg';
import AttendenceHistory from '../../assets/Profile/AttendenceHistory.svg';
import Home from '../../assets/Profile/Home.svg';
import WebClock from '../../assets/Profile/WebClock.svg';
import { useNavigate } from 'react-router-dom';
import CoomonDropDown from '../../components/CoomonDropDown';
import CommonDropText from '../../components/CommonDropText';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function AttendenceHeader(props) { 
  const { attendenceSettings } = props;
  let Data = [
    {
      title: 'First Name',
      subTitle: 'Manmeet ',
      id: 1,
    },
    {
      title: 'Middle Name',
      subTitle: '___',
      id: 2,
    },
    {
      title: 'Last Name',
      subTitle: 'Singh ',
      id: 3,
    },
  ];
  let Data2 = [
    {
      title: 'Start Date',
      subTitle: 'Select Date ',
      id: 1,
    },
    {
      title: '0 days WFH',
      id: 2,
    },
    {
      title: 'End Date',
      subTitle: 'Select Date ',
      id: 3,
    },
  ];
  let MobileData = [
    {
      title: 'Web Clock In',
      subTitle: 'SHIFT TODAY',
      subTitle2: '11:00 AM- 7:00 PM',
      img: WebClock,
      link: '/MyProfile/Attendee/WebClock',
      id: 1,
    },
    {
      title: 'Remote Clock In',
      subTitle: 'SHIFT TODAY',
      subTitle2: '11:00 AM- 7:00 PM',
      img: RemoteClock,
      link: '/MyProfile/Attendee/WebClock',
      id: 2,
    },
    {
      title: 'Work from home',
      subTitle: 'You can request work from home from here',
      subTitle2: '',
      link: '/MyProfile/Attendee/WFHome',
      img: Home,
      id: 3,
    },
    {
      title: 'Attendence History',
      subTitle: 'View Attendence history and other statistics',
      subTitle2: '',
      link: '/MyProfile/Attendee/Summary',
      img: AttendenceHistory,
      id: 4,
    },
    {
      title: 'Holidays',
      subTitle: 'NEXT HOLIDAY',
      link: '/MyProfile/Attendee/Holidays',
      subTitle2: 'Dussehra',
      img: Holiday,
      id: 5,
    },
  ];

  let weekDays = [{day:'MON',isChecked:false}, {day:'TUE',isChecked:false}, {day:'WED',isChecked:false}, {day:'THU',isChecked:false}, {day:'FRI',isChecked:false}, 
  {day:'SAT',isChecked:false},{day:'SUN',isChecked:false}]
  const [isVisible, setVisible] = useState(false);
  const [checkInTime,setCheckInTime]=useState()
  const [checkOutTime,setCheckOutTime]=useState()
  const [saveUpdate, setSaveUpdate] = useState([]);
  const [defaultWeek,setDefaultWeek] = useState([])
  const [loading,setLoading] = useState(false)
  const [Id,setId]=useState()
  const toggle = () => setVisible(!isVisible);
  const navigate = useNavigate();


const allAttendenceDataFunction = async () => {
  try {
    const id = JSON.parse(localStorage.getItem('userEmail'));
    setId(id);
    const response = await axios.get(
      `http://localhost:5001/MyProfile/AttendenceSettings/${id}`,{Headers: {'Content-Type': 'application/json'},}
    );
    if(response.data[0]!=undefined){
    setCheckInTime(response.data[0].checkInTimeSettings)
    setCheckOutTime(response.data[0].checkOutTimeSettings)
    setDefaultWeek(response.data[0].daysSelected);
    setSaveUpdate('Update')
   }else{
    setSaveUpdate('Save')
   }
  } catch (error) {
    console.log(error, 'error');
  }
};
  useEffect(() => {
  setDefaultWeek(weekDays)
  allAttendenceDataFunction();
  }, []);

  const handleDaysCheckedChange=async(e,day)=>{
   let i =  defaultWeek.findIndex(x => x.day === day.day);
   defaultWeek[i].isChecked == false ? defaultWeek[i].isChecked  = true : defaultWeek[i].isChecked = false
  const copy = [...defaultWeek]
   setDefaultWeek(copy)
  }
  const handleCheckInTime=(e)=>{
    setCheckInTime(e.target.value)
  }
  const handleCheckOutTime=(e)=>{
   setCheckOutTime(e.target.value)
  }
const handleSubmitButton=async()=>{
if (!checkInTime) {
  alert("Please Select Check In time")
}else if (!checkOutTime) {
  alert("Please Select Check OUt time")
}
else{
  setLoading(true)
  const id=JSON.parse(localStorage.getItem('userEmail'))
  const data={
    userID:id,
    checkInTime:checkInTime,
    checkOutTime:checkOutTime,
    daysSelected:defaultWeek
  }
  setTimeout(() => {
  setLoading(false)
  alert("You settings has been saved")
  }, 2000);
try {
  const res = await axios.post(
    'http://localhost:5001/MyProfile/AttendenceSettings',
    {
      Headers: {
        'Content-Type': 'application/json',
      },
      data,
    }
  );
  if(res.status===200){
    alert("You settings has been saved")
  }
  setLoading(false)
  setSaveUpdate('Update')
} catch (error) {}

}

}
  return (
    <>
      <>
        {attendenceSettings === 'attendenceSettings' ? (
          <>
            <div className="W90 Profile_Web_hide">
              <Row>
                <Col
                  xs="12"
                  sm="10"
                  className="ms-5 mb-3"
                  style={{
                    paddingRight: '25px',
                    paddingTop: '25px',
                    paddingBottom: '25px',
                  }}
                >
                  <div
                    className="profileCard"
                    style={{ paddingTop: '15px', paddingBottom: '15px',width:'80%' }}
                  >
                    <div className="R_A_Justify p5">
                      <div className="Text14Semi" style={{marginLeft:10,paddingBottom:10}}>Days</div>
                    </div>
                    <div className="line" />
                    <div className="p12 R_A_Justify">
                      {defaultWeek.map(
                        (i) => (
                          <div
                            className=" black centerAlign"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <input
                              type="checkbox"
                              className="me-2"
                              name={i.day}
                              id=""
                              onChange={(e) => handleDaysCheckedChange(e, i)}
                              checked={i.isChecked}
                            
                            />
                            <span style={{fontFamily:'Roboto Medium',fontSize:12}}> {i.day}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs="12"
                  sm="7"
                  style={{ paddingRight: '25px', marginLeft: '40px' }}
                >
                  <div className="profileCard" style={{marginLeft:10,width:'80%',paddingTop:6,paddingBottom:10}}>
                    <div className="R_A_Justify p10">
                      <div className="Text14Semi">Timmings</div>
                    </div>
                    <div className="line" />

                    <div className="plt12" style={{ paddingTop: '15px' }}>
                      <Row>
                        <Col xs={4} sm={6} className>
                          <div className="Text10N black mt10 mb-1 label_input">
                            Check In
                          </div>
                            <input
                              type="time"
                              name=""
                              id=""
                              value = {checkInTime}
                              className="checkinInput"
                              onChange={handleCheckInTime}
                            />
                            {/* <CommonDropText /> */}
                        </Col>
                        <Col xs={4} sm={6}>
                          <div className="Text10N black mt10 mb-1 label_input">
                            Check Out
                          </div>                          
                            <input
                              type="time"
                              name=""
                              id=""
                              value = {checkOutTime}
                              onChange={handleCheckOutTime}
                              className="checkinInput"
                            />  
                            {/* <CommonDropText /> */}
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="p12">
            <Button
                type="submit"
                className="submit_btn"
                style={{ width:'35%',marginLeft:35,marginTop:40 }}                
                onClick={()=>handleSubmitButton()}
              >
               {!loading ? 
                <span>{saveUpdate}</span>
               :
               <Spinner animation="border" role="status">
               </Spinner>
               }
              </Button>
          </div>
          </>
        ) : (
          <>
            <div className="W90 Profile_Web_hide">
              <Row>
                <Col xs="12" sm="6" style={{ paddingRight: '25px' }}>
                  <div className="profileCard">
                    <div className="R_A_Justify p10">
                      <div className="Text14Semi">Timmings</div>
                    </div>
                    <div className="line" />
                    <div className="p12 R_A_Justify">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((i) => (
                        <div className="dayCircle Text8S black centerAlign">
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="plt12">
                      <Row>
                        {Data.map((i) => (
                          <Col xs={4} sm={4} key={i.id}>
                            <div className="Text10N gray mt12">{i.title}</div>
                            <div className="Text10N black mt12">
                              {i.subTitle}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                    <div className="p12">
                      <div className="Text10S mt12">
                        Today (11:00 AM - 7:00 PM)
                      </div>
                      <Progress value="25" className="mt12" />
                    </div>
                  </div>
                </Col>
                <Col xs="12" sm="6" style={{ paddingRight: '25px' }}>
                  <div className="profileCard">
                    <div className="R_A_Justify p10">
                      <div className="Text14Semi">Actions</div>
                    </div>
                    <div className="line" />
                    <div className="p12 R_A_Justify1 W_70">
                      <div className="Text10N gray ">Sat 03, Sep 2022</div>
                      <div style={{ cursor: 'pointer' }}>
                        <div className="Text10S primary1 " onClick={toggle}>
                          Web Clock-In
                        </div>
                        <div className="Text10S primary1 mt12" onClick={toggle}>
                          Remote-Clock In
                        </div>
                        <div className="Text10S primary1 mt12" onClick={toggle}>
                          Work From Home
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="About_mobile_View timeView">
              <Row>
                {MobileData.map((i, index) => (
                  <Col
                    xs="6"
                    style={{ paddingRight: '20px', marginBottom: '20px' }}
                  >
                    <div className="timeBox " onClick={() => navigate(i.link)}>
                      <div className="rowalign2">
                        <img src={i.img} style={{ marginRight: '10px' }} />
                        <div className="Text12Semi black">{i.title}</div>
                      </div>
                      <div className="Text8S gray mt12">{i.subTitle}</div>
                      <div className="Text8S black mt7">{i.subTitle2}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </>

      <Modal isOpen={isVisible} toggle={toggle} backdrop={toggle} centered>
        {/* <ModalHeader toggle={toggle}></ModalHeader> */}
        <div className="Text16N white p12 bgG">Work from home Request</div>
        <ModalBody>
          <div className="modalDateBox R_A_Justify">
            {Data2.map((i) => (
              <div key={i.id}>
                {i.id == 2 ? (
                  <div className="Text12 white bgG1 modalWorkBox centerAlign">
                    {i.title}
                  </div>
                ) : (
                  <>
                    <div className="Text12 gray">{i.title}</div>
                    <div className="Text14 black">{i.subTitle}</div>
                  </>
                )}
              </div>
            ))}
          </div>
          <CommonInput
            placeholder="Reason"
            style="input mt25 Text10N inPutWidthModal"
          />
          <div className="Text12 gray mt25">Notify</div>
          <input
            type="text"
            name="name"
            placeholder="Reason"
            className="input2 Text10N W_70"
          />
        </ModalBody>
        <div className="rightAlign mb15 mt12">
          <Button
            className="submit_btn submit cancelBtn"
            style={{ marginRight: '10px' }}
            onClick={toggle}
          >
            Cancel
          </Button>
          <Button
            className="submit_btn submit"
            style={{ marginRight: '10px' }}
            onClick={toggle}
          >
            Request
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AttendenceHeader;
