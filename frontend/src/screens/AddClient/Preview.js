import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Input, Row, Table } from "reactstrap";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/common.css";
import "../../assets/css/tooltip.css";
import "../../assets/css/Profile.css";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { SaveClientForm } from "../../API/Client";
import CalenderImg from "../../assets/Profile/Calender.svg";
import { updateClintData } from "../../redux/clientBookingForm";
import { getEvents } from "../../API/Event";
import { updateAllEvents } from "../../redux/eventsSlice";
import Cookies from "js-cookie";

function Preview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [requesting, setRequesting] = useState(false);
  const clientData = useSelector((state) => state.clientData);
  useEffect(() => {
    if (!clientData || !clientData.events) {
      navigate("/MyProfile/AddClient/Form-I");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientData]);
  useEffect(() => {
    if (!clientData || !clientData.events) {
      navigate("/MyProfile/AddClient/Form-I");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentUser =
    Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));
  const [eventIndex, setEventIndex] = useState(0);
  const submitClient = async () => {
    if (requesting === false) {
      setRequesting(true);
      const saveResult = await SaveClientForm(clientData);
      setRequesting(false);
      dispatch({
        type: "SOCKET_EMIT_EVENT",
        payload: {
          event: "add-notification",
          data: {
            notificationOf: "client",
            data: saveResult.data,
            forManager: true,
            read: false,
            readBy: [currentUser._id],
          },
        },
      });
      const storedEvents = await getEvents();
      dispatch(updateAllEvents(storedEvents.data));
      dispatch(updateClintData({ albums: [""] }));
      if (saveResult.result) {
        navigate("/MyProfile/AddClient/Form-I");
      }
    }
  };
  const target = useRef(null);

  return (
    <>
      <div className="mt18">
        <Row>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div ref={target}>
              <div>
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Event Date
                </div>
                <div
                  className={`forminput R_A_Justify1`}
                  // onClick={toggle}
                  style={{ cursor: "pointer" }}
                >
                  {clientData?.events &&
                    dayjs(clientData?.events[eventIndex]?.eventDate).format(
                      "DD-MMM-YYYY"
                    )}
                  <img alt="" src={CalenderImg} />
                </div>
              </div>
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div>
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Event Type
              </div>
              <Input
                type="text"
                name="eventType"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events &&
                  clientData?.events[eventIndex]?.eventType
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Event_Type"}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4">
            <div className="Text16N" style={{ marginBottom: "25px" }}>
              Is This a Wedding Event
            </div>
            <input
              type="checkbox"
              name="isWedding"
              checked={
                clientData?.events && clientData?.events[eventIndex]?.isWedding
              }
              disabled={true}
            />
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Location
              </div>
              <Input
                type="text"
                name="location"
                disabled={true}
                className="forminput"
                value={
                  (clientData?.events &&
                    clientData?.events[eventIndex]?.location) ||
                  ""
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>

          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Travel By
              </div>
              <Input
                type="text"
                name="travelBy"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events && clientData?.events[eventIndex]?.travelBy
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Shoot Directors
              </div>
              <Input
                type="text"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events &&
                  clientData?.events[eventIndex]?.shootDirector
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Shoot Directors"}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Photographers
              </div>
              <Input
                type="text"
                name="photographers"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events &&
                  clientData?.events[eventIndex]?.photographers
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Cinematographers
              </div>
              <Input
                type="text"
                name="cinematoraphers"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events &&
                  clientData?.events[eventIndex]?.cinematographers
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Drones
              </div>
              <Input
                type="text"
                name="drones"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events && clientData?.events[eventIndex]?.drones
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Same Day Photo Editor
              </div>
              <Input
                type="text"
                name="sameDayPhotoEditor"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events &&
                  clientData?.events[eventIndex]?.sameDayPhotoEditors
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Same Day Video Editor
              </div>
              <Input
                type="text"
                name="sameDayVideoEditor"
                disabled={true}
                className="forminput"
                value={
                  clientData?.events &&
                  clientData?.events[eventIndex]?.sameDayVideoEditors
                }
                required={true}
                // onChange={(e) => updateEventValues(e)}
                placeholder={"Location"}
              />
            </div>
          </Col>
        </Row>
        <div className="mt-5">
          <Table
            bordered
            hover
            striped
            responsive
            style={{ marginTop: "15px", width: "700px" }}
          >
            <thead>
              <tr className="Text14Semi gray3 alignCenter">
                <th></th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Travel By</th>
                <th>Wedding Event</th>
              </tr>
            </thead>
            <tbody className="Text14Semi alignCenter">
              {clientData?.events?.map((event, i) => (
                <tr>
                  <td className="primary2 alignCenter">
                    <div
                      class="form-check"
                      style={{ display: "contents", justifyContent: "center" }}
                    >
                      <input
                        style={{ marginLeft: "20px" }}
                        class="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        checked={eventIndex === i}
                        onChange={(e) => setEventIndex(i)}
                      />
                    </div>
                  </td>
                  <td>{event.eventType}</td>
                  <td className="primary2">
                    {dayjs(event.eventDate).format("DD-MMM-YYYY")}
                  </td>
                  <td className="primary2">{event.location}</td>
                  <td className="primary2">{event.travelBy}</td>
                  <td className="primary2">{event.isWedding ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="Text16N mt25" style={{ marginBottom: "6px" }}>
          Deliverables
        </div>
        <div className="mt25">
          <div className="Text16N d-flex flex-row flex-wrap gap-3">
            <div>
              <input
                type="checkbox"
                name="preWeddingPhotos"
                checked={clientData?.deliverables?.preWeddingPhotos}
                disabled={true}
              />
              {"   "}
              Pre Wedding Photos
            </div>
            <div>
              <input
                type="checkbox"
                name="preWeddingVideos"
                style={{ marginLeft: "20px" }}
                checked={clientData?.deliverables?.preWeddingVideos}
                disabled={true}
              />
              {"   "}
              Pre Wedding Videos
            </div>
          </div>
        </div>
        {(clientData?.deliverables?.preWeddingVideos ||
          clientData?.deliverables?.preWeddingPhotos) && (
          <Row>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Photographers
                </div>
                <Input
                  type="text"
                  name="preWedAssistants"
                  disabled={true}
                  className="forminput"
                  value={clientData?.preWedphotographers}
                  required={true}
                />
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Cinematograpers
                </div>
                <Input
                  type="text"
                  name="preWedCinematographers"
                  disabled={true}
                  className="forminput"
                  value={clientData?.preWedcinematographers}
                  required={true}
                />
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Assistants
                </div>
                <Input
                  type="text"
                  name="preWedAssistants"
                  disabled={true}
                  className="forminput"
                  value={clientData?.preWedassistants}
                  required={true}
                />
              </div>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="4" className="pr5">
              <div className="mt25">
                <div className="Text16N" style={{ marginBottom: "6px" }}>
                  Drone Flyers
                </div>
                <Input
                  type="text"
                  name="preWedDroneFlyerss"
                  disabled={true}
                  className="forminput"
                  value={clientData?.preWeddrones}
                  required={true}
                />
              </div>
            </Col>
          </Row>
        )}
        <Row>
          {clientData?.albums?.map((albumValue, i) => {
            return (
              <Col xs="12" sm="6" className="pr5" key={i}>
                <div className="Drop">
                  <h4 className="LabelDrop">Album {i + 1}</h4>
                  <Input
                    type="text"
                    name="album"
                    disabled={true}
                    className="forminput"
                    value={albumValue}
                    required={true}
                    // onChange={(e) => updateEventValues(e)}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Promo
              </div>
              <Input
                type="text"
                name="promo"
                disabled={true}
                className="forminput"
                value={clientData?.promos}
                required={true}
                // onChange={(e) => updateEventValues(e)}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Long Films
              </div>
              <Input
                type="text"
                name="longFilms"
                disabled={true}
                className="forminput"
                value={clientData?.longFilms}
                required={true}
                // onChange={(e) => updateEventValues(e)}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Reels
              </div>
              <Input
                type="text"
                name="reels"
                disabled={true}
                className="forminput"
                value={clientData?.reels}
                required={true}
                // onChange={(e) => updateEventValues(e)}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" lg="6" xl="4" className="pr5">
            <div className="mt25">
              <div className="Text16N" style={{ marginBottom: "6px" }}>
                Hard Drives
              </div>
              <Input
                type="text"
                name="hardDrives"
                disabled={true}
                className="forminput"
                value={clientData?.hardDrives}
                required={true}
                // onChange={(e) => updateEventValues(e)}
              />
            </div>
          </Col>
        </Row>
        <div className="mt25">
          <div className="Text16N" style={{ marginBottom: "6px" }}>
            Client Suggestions If Any
          </div>
          <Input
            type="text"
            name="suggestion"
            disabled={true}
            className="forminput h100 alignTop"
            value={clientData?.suggestion || ""}
            required={false}
            // onChange={(e) => dispatch(updateClintData({ ...clientData, [e.target.name]: e.target.value }))}
            placeholder={"Write notes here..."}
          />
        </div>
        <Row className="centerAlign">
          <Col xs="3" sm="2" className="me-3">
            <div className="centerAlign mt40 mb15">
              <Button
                className="submit_btn submit"
                onClick={() => navigate("/MyProfile/AddClient/Form-II")}
              >
                Edit
              </Button>
            </div>
          </Col>
          <Col xs="3" sm="2" className="me-3">
            <div className="centerAlign mt40 mb15">
              <Button className="submit_btn submit" onClick={submitClient}>
                {requesting ? (
                  <div className="w-100">
                    <div class="smallSpinner mx-auto"></div>
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      {/* <Overlay
        rootClose={true}
        onHide={() => setShow(false)}
        target={target.current}
        show={show}
        placement="bottom"
      >
        {(props) => (
          <Tooltip id="overlay-example" bsPrefix="tooltipBg" {...props}>
            <div style={{ width: '300px' }} className="tooltipBg">
              <Calendar onChange={setDate} value={date} />
            </div>
          </Tooltip>
        )}
      </Overlay> */}
    </>
  );
}

export default Preview;
