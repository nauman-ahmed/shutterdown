import React, { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import dayjs from "dayjs";

function ViewClient1(props) {
  const [clientInfo,setClientInfo] = useState([])
  const location=useLocation()
  console.log(location);
  useEffect(()=>{
    if(location.state==null){
      let data  = localStorage.getItem('clientInfo')
        setClientInfo(data)
     }else{
       localStorage.setItem('clientInfo',JSON.stringify(location))
       setClientInfo(location.state)
     }
  },[])
  const navigate = useNavigate();
  const handleClientDetail=(data)=>{
   localStorage.setItem("clientId",JSON.stringify(data._id))
     navigate('/MyProfile/Client/ParticularClient/ClientInfo',{state:data});
  }
  return (
    <Table bordered hover responsive>
      <thead>
        <tr
          className="logsHeader Text16N1"
          style={{ background: '#EFF0F5', borderWidth: '1px !important' }}
        >
          <th>Client: Location</th>
          <th>Wedding Date</th>
          <th>Phone number</th>
          <th>Email Id</th>
          <th>Assistant</th>
          <th>POC</th>
          <th>Album: Type</th>
          <th>Pre-wedding Photos</th>
          <th>HDD</th>
          <th>Travel By</th>
          <th>Client Suggestions</th>
          <th>Drone</th>
          <th>Photographer: Cinematographer</th>
          <th>Sameday Photoedit</th>
          <th>Sameday Videoedit</th>
          <th>Payment status</th>
        </tr>
      </thead>
      <tbody
        className="Text12 primary2"
        style={{
          textAlign: 'center',
          borderWidth: '0px 1px 0px 1px',
          // background: "#EFF0F5",
        }}
      >
        {clientInfo?.events?.map((event) => (
         

          <tr
            onClick={()=>handleClientDetail(event) }
          >
            <td className="Text14Semi primary2">
              {event?.locationSelect}
             
            </td>
            <td>{dayjs(event.dates).format("YYYY-MM-DD")}</td>
            <td>{clientInfo?.phone_Number}</td>
            <td>{clientInfo?.EmailID}</td>
            <td>{clientInfo?.assistantName?.length>0 ? clientInfo?.assistantName[0] : ''}</td>
            <td>{clientInfo?.POC}</td>
            <td>
           
              <td>{event.albumSelect}</td>
            </td>

            <td>{event.radioDeliverables == 'Pre_Wedding_Photos' ? 'Yes' :'No'}</td>
            <td>{event.harddriveSelect}</td>
            <td>{event.travelBySelect}</td>
            <td>{event.clientSuggestions} </td>
            <td>{event.droneSelect}</td>

            <td>({event.photoGrapher}:{event.CinematographerSelect})</td>
            <td>{event.sameDaySelect}</td>
            <td>{event.sameDaySelect}</td>
            <td>{clientInfo?.Payment_Status}</td>
          </tr>
        ))
      
      }
      </tbody>
    </Table>
  );
}

export default ViewClient1;
