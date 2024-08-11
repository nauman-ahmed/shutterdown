import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import ClientHeader from "../../components/ClientHeader";
import {
  getDeadlinesDays,
  getEditorTasks,
  getPendingTasks,
  updateDeadlines,
  updateTaskData,
} from "../../API/TaskApi";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { Form } from "react-router-dom";
import Select from "react-select";

function DeadlineDays(props) {
  const [deadlinesData, setDeadlinesData] = useState(null);
  const [tempDeadlines, setTempDeadlines] = useState(null);
  const [updating, setUpdating] = useState(false);
  const currentUser = JSON.parse(Cookies.get("currentUser"));
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setTempDeadlines(deadlinesData);
    setModal(!modal);
  };
  const getDeadlineDaysData = async () => {
    try {
      if (currentUser.rollSelect === "Admin") {
        const deadline = await getDeadlinesDays();
        setDeadlinesData(deadline);
        setTempDeadlines(deadline);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateTempDeadlines = (e) => {
    setTempDeadlines({ ...tempDeadlines, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getDeadlineDaysData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = async () => {
    setUpdating(true);
    await updateDeadlines(tempDeadlines);
    // await getTaskData();
    setUpdating(false);
    setDeadlinesData(tempDeadlines);
    setModal(false);
    getDeadlineDaysData();
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex justify-content-end w-100">
        <div
          style={{ backgroundColor: "#666DFF" }}
          className="btn btn-primary me-1"
          onClick={toggle}
        >
          Edit Deadlines
        </div>
      </div>
      {deadlinesData ? (
        <>
          <Table
            hover
            // bordered
            responsive
            className="tableViewClient"
            style={{ width: "100%", marginTop: "15px" }}
          >
            <>
              <thead>
                {currentUser.rollSelect === "Admin" && (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody primary2">Deliverable</th>
                    <th className="tableBody primary2">Deadline Days</th>
                  </tr>
                )}
              </thead>
            </>

            <tbody
              className="Text12"
              style={{
                textAlign: "center",
                borderWidth: "1px 1px 1px 1px",
              }}
            >
              <>
                <div style={{ marginTop: "15px" }} />
                {currentUser.rollSelect === "Admin" && (
                  <>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Long Films
                      </td>

                      <td className="tableBody Text14Semi tablePlaceContent">
                        {deadlinesData.longFilm}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Reels
                      </td>

                      <td className="tableBody Text14Semi  tablePlaceContent">
                        {deadlinesData.reel}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Promos
                      </td>

                      <td className="tableBody Text14Semi  tablePlaceContent">
                        {deadlinesData.promo}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Photos
                      </td>

                      <td className="tableBody Text14Semi  tablePlaceContent">
                        {deadlinesData.photo}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Albums
                      </td>

                      <td className="tableBody Text14Semi  tablePlaceContent">
                        {deadlinesData.album}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Pre-Wedding Photos
                      </td>

                      <td className="tableBody Text14Semi  tablePlaceContent">
                        {deadlinesData.preWedPhoto}
                      </td>
                    </tr>
                    <tr>
                      <td className="tableBody Text14Semi  tablePlaceContent">
                        Pre-Wedding Videos
                      </td>

                      <td className="tableBody Text14Semi  tablePlaceContent">
                        {deadlinesData.preWedVideo}
                      </td>
                    </tr>
                  </>
                )}
              </>
            </tbody>
          </Table>

          <Modal
            isOpen={modal}
            toggle={toggle}
            centered={true}
            fullscreen="sm"
            size="lg"
          >
            <ModalHeader>Edit Deliverables Deadline Days</ModalHeader>

            <ModalBody>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Long Films</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="longFilm"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.longFilm}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Reels</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="reel"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.reel}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Promos</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="promo"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.promo}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Photos</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="photo"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.photo}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Albums</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="album"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.album}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Pre-Wedding Photos</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="preWedPhoto"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.preWedPhoto}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col xl="2" sm="2" lg="2" className="p-2">
                  <div className="label">Pre-Wedding Videos</div>
                </Col>
                <Col xl="4" sm="4" lg="4" className="p-2">
                  <div className="label">
                    <input
                      type="number"
                      name="preWedVideo"
                      onChange={updateTempDeadlines}
                      value={tempDeadlines?.preWedVideo}
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button onClick={updateData} className="Update_btn">
                {updating ? "Updating.." : "ADD"}
              </Button>
              <Button type="button" color="danger" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </>
      ) : (
        <div
          style={{ height: "400px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <div class="spinner"></div>
        </div>
      )}
    </>
  );
}

export default DeadlineDays;
