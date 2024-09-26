import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import { getClientById } from "../../API/Client";
import { getAllTheDeadline } from "../../API/Deliverables";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";


function Deliverable(props) {
  const { clientId } = useParams();
  const [preWedDeliverables, setPreWedDeliverables] = useState(null);
  const [otherDeliverables, setOtherDeliverables] = useState(null);
  const [weddingDate, setWeddingDate] = useState(null);
  const [deadlineDays, setDeadlineDays] = useState([]);

  const getIdData = async () => {
    try {
      const res = await getClientById(clientId)
      console.log(res);
      
      const deadline = await getAllTheDeadline();
      setDeadlineDays(deadline[0])
      const preWedDeliverable = res.deliverables?.filter(deliverable => deliverable.deliverableName === 'Pre-Wedding Photos' || deliverable.deliverableName === 'Pre-Wedding Videos');
      setPreWedDeliverables(preWedDeliverable);
      const otherDeliverable = res.deliverables?.filter(deliverable => deliverable.deliverableName !== 'Pre-Wedding Photos' && deliverable.deliverableName !== 'Pre-Wedding Videos')
      setOtherDeliverables(otherDeliverable);
      const wedDate = res.events.filter((event) => event.isWedding)

      setWeddingDate(wedDate?.length > 0 ? wedDate[0] : res.events[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIdData();
  }, [])

  const getrelevantDeadline = (title) => {
    if (title == "Promo") {
      return deadlineDays.promo
    }
    else if (title == "Long Film") {
      return deadlineDays.longFilm
    }
    else if (title == "Reel") {
      return deadlineDays.reel
    }
    else if (title == "Photos") {
      return deadlineDays.photo
    }
    else if (title == "Pre-Wedding Photos") {
      return deadlineDays.preWedPhoto
    }
    else if (title == "Pre-Wedding Videos") {
      return deadlineDays.preWedVideo
    }

    return deadlineDays.album

  }

  const getWeddingDate = (obj) => {
    return "2024-09-02T22:00:00.000+00:00"
  }

  
  
  return (
    <div>
      {preWedDeliverables?.length > 0 && (
        <div>
          <div style={{ display: "flex" }}>
            <div
              className="Text12Semi daysView"
              style={{
                background:
                  "#040A80"
                //  : i.id == 2 ? "#9D9A9A" : "#FF9797",
              }}
            >
              Pre-Wedding Deliverables
            </div>
          </div>
          <Table bordered hover responsive>
            <thead>
              <tr className="logsHeader Text16N1">
                <th>Deliverable</th>
                <th>Editor</th>
                <th>Wedding Date</th>
                <th>Client Deadline</th>
                <th>Current Status</th>
                <th>First Delivery Date</th>
                <th>Final Delivery Date</th>
                <th>Client Rating</th>
              </tr>
            </thead>
            <tbody
              className="Text12 primary2"
              style={{
                textAlign: "center",
                borderWidth: '1px 1px 1px 1px',
                // background: "#EFF0F5",
              }}
            >
              {preWedDeliverables.map((deliverable, i) => {
                
                
                return (
                  <tr>
                    <td className="textPrimary Text14Semi tablePlaceContent">{deliverable?.deliverableName}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.editor?.firstName || 'Not Assigned'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{dayjs(weddingDate?.eventDate).format('DD-MMM-YYYY')}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" > {dayjs(new Date(weddingDate?.eventDate).setDate(new Date(weddingDate?.eventDate).getDate() - getrelevantDeadline(deliverable?.deliverableName))).format('DD-MMM-YYYY')}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.status || 'Pending'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.firstDeliveryDate ? dayjs(deliverable?.firstDeliveryDate).format('DD-MMM-YYYY') : 'Not Assigned'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.finalDeliverDate ? dayjs(deliverable?.finalDeliveryDate).format('DD-MMM-YYYY') : 'Not Assigned'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.clientRating || 'Not Assigned'}</td>
                  </tr>
                )
              })}

            </tbody>
          </Table>
        </div>
      )}

      {otherDeliverables?.length > 0 && (
        <div>
          <div style={{ display: "flex" }}>
            <div
              className="Text12Semi daysView"
              style={{
                background:
                  // "#040A80"
                  "#FF9797",
              }}
            >
              Other Deliverables
            </div>
          </div>
          <Table bordered hover responsive>
            <thead>
              <tr className="logsHeader Text16N1">
                <th>Deliverable</th>
                <th>Editor</th>
                <th>Wedding Date</th>
                <th>Client Deadline</th>
                <th>Current Status</th>
                <th>First Delivery Date</th>
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
              {otherDeliverables.map((deliverable, i) => {
                return (
                  <tr>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.deliverableName}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.editor?.firstName || 'Not Assigned'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{dayjs(weddingDate?.eventDate).format('DD-MMM-YYYY')}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{dayjs(new Date(weddingDate?.eventDate).setDate(new Date(weddingDate?.eventDate).getDate() - getrelevantDeadline(deliverable?.deliverableName))).format('DD-MMM-YYYY')}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.status || 'Pending'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.firstDeliveryDate ? dayjs(deliverable?.firstDeliveryDate).format('DD-MMM-YYYY') : 'Not Assigned'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.finalDeliveryDate ? dayjs(deliverable?.finalDeliveryDate).format('DD-MMM-YYYY') : 'Not Assigned'}</td>
                    <td className="textPrimary Text14Semi tablePlaceContent" >{deliverable?.clientRating || 'Not Assigned'}</td>
                  </tr>
                )
              })}

            </tbody>
          </Table>
        </div>
      )}

    </div>
  );
}

export default Deliverable;
