import React,{useState,useEffect} from "react";
import "../../assets/css/Profile.css";
import ShiftStart from "../../assets/Profile/ShiftStart.svg";
import ShiftLocate from "../../assets/Profile/ShiftLocate.svg";
import ShiftOut from "../../assets/Profile/ShiftOut.svg";
import GreenCircle from "../../assets/Profile/GreenCircle.svg";
import RedCircle from "../../assets/Profile/RedCircle.svg";
import { Table } from 'reactstrap';
import '../../assets/css/Profile.css';

import axios from "axios";
function WebClock(props) {
const [editor,setEditor]=useState(false)
const [shooter,setShooter]=useState(false)
const [CheckInTime,setCheckInTime]=useState()
const [CheckInCurrentDate,setCheckInCurrentDate]=useState()
const [CheckOutCurrentDate,setCheckOutCurrentDate]=useState()
const [CheckOutTime,setCheckOutTime]=useState()
const [editorData,setEditorData]=useState()
const [shooterData,setShooterData]=useState()
const [userID,setUserID]=useState()
const [loading,setLoading] = useState(false)

useEffect(()=>{
const loginUser=JSON.parse(localStorage.getItem("loginUser"))
const id=JSON.parse(localStorage.getItem('userEmail'))
setUserID(id)
if (loginUser?.data?.User?.rollSelect==="Editor") {
  setEditor(true)
  setShooter(false)
}
else if (loginUser?.data?.User?.rollSelect==="Shooter") {
  setShooter(true)
  setEditor(false)
}
else{
  setShooter(false)
  setEditor(false)
}
},[shooter,editor])
const saveButtonAllAttendenceData=async()=>{
  try {
    const id=JSON.parse(localStorage.getItem('userEmail'))
    const res=await axios.get(`http://localhost:5001/Attendee/WebClock/${id}`,{
      Headers:{
        "Content-Type":"application/json"
      }
    })
    setLoading(false)
    setEditorData(res.data.Editor)
    setShooterData(res.data.shooter)
  } catch (error) {
    
  }
}

const EditorAttendenceData = async (data) => {
  try {
    const res = await axios.post('http://localhost:5001/Attendee/WebClock', {
      Headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
    if (res.status===200) {
      alert("You are Checked In SuccessFully")
    }
  } catch (error) {}
};
const ShooterAttendenceData = async (data) => {
  try {
    const res = await axios.post('http://localhost:5001/Attendee/WebClock', {
      Headers: {
        'Content-Type': 'application/json',
      },
      data,
    });
    if (res.status===200) {
      alert("You are Checked in Successfully")
    }
  } catch (error) {}
};
const ShooterUpdateData=(data)=>{
  const id=JSON.parse(localStorage.getItem("userEmail"))
  try {
    const res=axios.put(`http://localhost:5001/Attendee/WebClock/${id}`,{
      Headers:{
        "Content-Type":"application/json"
      },
      data
    })
    if (res.status===200) {
      alert("you are Checked OUt Successfully")
    }
  } catch (error) {
    
  }
}
const EditorUpdateData=async(data)=>{
  const id=JSON.parse(localStorage.getItem('userEmail'))
  try {
    const res=await axios.put(`http://localhost:5001/Attendee/WebClock/${id}`,{
      Headers:{
        "Content-Type":"application/json"
      },
      data
    })
    if (res.status===200) {
      alert("you are Checked out Successfully")
    }
    
  } catch (error) {
    
  }
}
const handleCheckInTimeFunction=()=>{
  const id=JSON.parse(localStorage.getItem('userEmail'))
  let date = new Date().toLocaleDateString();
  setCheckInCurrentDate(date)
  let time = new Date().toLocaleTimeString();
  setCheckInTime(time)
  const data={
    shooter:"true",
    currentTime:time,
    currentDate:date,
    userID:id
  }
  const datas={
    Editor:"true",
    currentTime:time,
    currentDate:date,
    userID:id
  }
  if (shooter) {
    ShooterAttendenceData(data)
    alert("You are Checked in Successfully")
  }
   if (editor) {
    EditorAttendenceData(datas)
    alert("you are Checked in Successfully")
  }
}
const handleCheckOutTimeFunction=()=>{
  const id=JSON.parse(localStorage.getItem('userEmail'))
  let date = new Date().toLocaleDateString();
  setCheckOutCurrentDate(date)
  let time = new Date().toLocaleTimeString();
  setCheckOutTime(time)
  const data={
    shooter:shooter?"true":null,
    Editor:editor?"true":null,
    updated:"updated",
    currentTime:CheckInTime,
    currentDate:CheckInCurrentDate,
    CheckoutCurrentTime:time,
    CheckoutCurrentDate:date,
    userID:id
  }
 
  if (shooter) {
    ShooterUpdateData(data);
    alert("you are Check out Successfully")
  }
   else if (editor) {
    EditorUpdateData(data);
    alert('you are Check out Successfully')
  }
}


const handleSaveButton=async()=>{
  if (!CheckInTime||!CheckOutTime) {
    alert("please Select Time")
  }
  else{
    if (shooter) {
      
      await saveButtonAllAttendenceData()
      alert("you Attendence has been saved")
    }
else if (editor) {
  await saveButtonAllAttendenceData()
  alert("your Attendence has been saved")
}
  }
}
useEffect(()=>{
saveButtonAllAttendenceData()
},[shooter,editor])
  return (
    <div
      className="About_mobile_View ClockMobileView"
      style={{ flexDirection: 'column' }}
    >
      <div className="Text14Semi">Shift Today - 11:00 AM - 7:00 PM</div>
      <div className="R_A_Justify Text6S mt40" style={{width:'50%'}}>
        <div className="d-flex align-items-center flex-column">
          <div
            className="mb8 "
            aria-disabled={true}
            onClick={handleCheckInTimeFunction}
          >
            <img src={GreenCircle} />
            <img src={ShiftStart} style={{  width: 25, marginLeft: -37, position: 'absolute', marginTop: 18}}/>
          </div>
          {(editor && editor) || (shooter && shooter) ? (
            <>
              <span style={{fontSize:9}}>
                CHECK IN
              </span>
            </>
          ) : (
            'DAY START 11:00 AM'
          )}
        </div>
        <div className="UpwardBorder"><p className="shift_time">0h 0m / 7h 0m</p></div>
        {shooter || editor ? (
          ''
        ) : (
          <>
            <div>
              <div className="mb8">
                <img src={GreenCircle} style={{ marginRight: '-36px' }} />
                <img src={ShiftLocate} />
              </div>
              PUNCH LOCATION
            </div>
          </>
        )}

        <div
          style={{ textAlign: 'end', marginRight: '80px' }}
          className=""
          onClick={handleCheckOutTimeFunction}
        >
          <div className="mb8">
            <img src={RedCircle}  style={{position:'relative'}}/>
            <img src={ShiftOut} style={{marginLeft: -38,marginTop: 18,position:'absolute'}}/>
          </div>
          <span>CHECK OUT</span>
        </div>
      </div>
      {/* <Button
          type="submit"
          className="submit_btn"
          style={{ width:'20%',marginLeft:15,marginTop:40 }}                
          onClick={()=>handleSaveButton()}
        >
          <span>Save</span>
     </Button> */}
      {editor || shooter ? (
        ''
      ) : (
        <>
          <div className="Text14Semi mt40">TIME LOG TODAY</div>
          <div className="rowalign2 mt12">
            <div
              className="circleClock Text14Semi white centerAlign"
              style={{ marginRight: '10px' }}
            >
              IN
            </div>
            <div className="Text14Semi black">
              <div>11:00:52</div>
              <div className="gray">Ashok Vihar, Full address here</div>
            </div>
          </div>
        </>
      )}
      {shooter ? (
        <>
          <div className="Profile_Web_hide" style={{marginTop:50}}>
            <div className="Text18S mt25 ">Logs & Requests</div>
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
                  {/* <th className="tableBody">Arrival</th> */}
                  {/* <th className="tableBody">LOG</th> */}
                </tr>
              </thead>
              <tbody
                className="Text12"
                style={{ textAlign: 'center', borderWidth: '0px 1px 0px 1px' }}
              >
                {shooterData?.map((data, index) => (
                  <tr>
                    <td
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                      className="tableBody"
                    >
                      {data.CheckIncurrentDate}
                    </td>

                    <td
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                      className="tableBody"
                    >
                      {data.CheckIncurrentTime}
                    </td>
                    <td
                      className="tableBody"
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                    >
                      {data.CheckOutCurrentTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : editor ? (
        <>
          <div className="Profile_Web_hide" style={{marginTop:50}}>
            <div className="Text18S mt25">Logs & Requests</div>
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
                  {/* <th className="tableBody">Arrival</th> */}
                  {/* <th className="tableBody">LOG</th> */}
                </tr>
              </thead>
              <tbody
                className="Text12"
                style={{ textAlign: 'center', borderWidth: '0px 1px 0px 1px' }}
              >
                {editorData?.map((data, index) => (
                  <tr>
                    <td
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                      className="tableBody"
                    >
                      {data.CheckIncurrentDate}
                    </td>

                    <td
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                      className="tableBody"
                    >
                      {data.CheckIncurrentTime}
                    </td>
                    <td
                      className="tableBody"
                      style={{ paddingTop: '15px', paddingBottom: '15px' }}
                    >
                      {data.CheckOutCurrentTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default WebClock;
