import React, { useState,useEffect } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import axios from "axios";
function Deliverable(props) {
  const [datas,setDatas]=useState()
const fetchDeliverablesData=async()=>{
try {
  const id=JSON.parse(localStorage.getItem('userEmail'))
  const res=await axios.get(`http://localhost:5001/MyProfile/Client/particularClient/Deliverable/${id}`,{
    Headers:{
      "Content-Type":"application/json"
    },

  })
  setDatas(res.data)
} catch (error) {
  console.log(error,"error")
}
}
  useEffect(()=>{
fetchDeliverablesData()
  },[])
  let data = [
    {
      title: "Pre-wedding",
      id: 1,
    },
    {
      title: "Wedding",
      id: 2,
    },
  ];
  return (
    <div>
      {data.map((i) => (
        <div>
          <div style={{ display: "flex" }}>
            <div
              className="Text12Semi daysView"
              style={{
                background:
                  i.id == 1 ? "#040A80" : i.id == 2 ? "#9D9A9A" : "#FF9797",
              }}
            >
              {i.title}
            </div>
          </div>
          <Table bordered hover responsive>
            <thead>
              <tr className="logsHeader Text16N1">
                <th>Client:</th>
                <th>Photo Editor</th>
                <th>Start Date</th>
                <th>Company Deadline</th>
                <th>Client Deadline</th>
                <th>Revision-1 Date</th>
                <th>Revision-2 Date</th>
                <th>Final Delivery Date</th>
                <th>Client Rating</th>
              </tr>
            </thead>
            <tbody
              className="Text12 primary2"
              style={{
                textAlign: "center",
                borderWidth: "0px 1px 0px 1px",
                // background: "#EFF0F5",
              }}
            >
              <tr>
                <td style={{ paddingBottom: "70px" }}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );
}

export default Deliverable;
