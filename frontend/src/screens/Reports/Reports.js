import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import { getAllTasks } from "../../API/TaskApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ClientHeader from "../../components/ClientHeader";
import { useLoggedInUser } from "../../config/zStore";
import { getEditorsData, getEditorsList } from "../../API/Deliverables";
import Select from "react-select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { MdPhotoCameraFront } from "react-icons/md";

ChartJS.register(ArcElement, Tooltip, Legend);

function EditorsReports(props) {
  const navigate = useNavigate();
  const target = useRef(null);
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState(null);
  const { userData: currentUser } = useLoggedInUser()
  const [allEditors, setAllEditors] = useState([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterEditorId, setFilterEditorId] = useState(null);
  const [selectedEditorData, setSelectedEditorData] = useState(null)
  const [editorDataModal, setEditorDataModal] = useState(false)

  const getData = async () => {
    try {

      const res = await getEditorsData(page, filterEditorId);
      setAllData(res)
      if (!filterEditorId) {
        setData(data ? [...data, ...res.data] : res.data);
      } else {
        setData(res.data)
      }
      setLoading(false)
      if (res.pagination.currentPage < res.pagination.totalPages) {
        setHasMore(true)
      }
      
      // setTasksToShow(tasks)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      currentUser?.rollSelect === "Editor" ||
      currentUser?.rollSelect === "Shooter"
    ) {
      navigate("/MyProfile");
    }
    getData();
    if (allEditors?.length === 0) {
      getEditorsForFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterEditorId]);





  const getEditorsForFilters = async () => {
    const editorsList = await getEditorsList();

    setAllEditors(editorsList.data)
  };


  useEffect(() => {
    // Select the .table-responsive element
    const tableResponsiveElement = document.querySelector(".table-responsive");
    // Apply the max-height style
    if (target.current) {
      tableResponsiveElement.style.maxHeight = "75vh";
      tableResponsiveElement.style.overflowY = "auto";
    }

    // Clean up style when the component unmounts
    return () => {
      if (tableResponsiveElement) {
        tableResponsiveElement.style.maxHeight = "";
        tableResponsiveElement.style.overflowY = "";
      }
    };

  }, [document.querySelector(".table-responsive"), target.current]);


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
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };

  const checkForSameDayEdit = (deliverable) => {
    // Check if deliverable and necessary properties exist
    if (!deliverable?.client?.events || !deliverable?.forEvents) {
      return false;
    }

    // Get the event IDs from forEvents array
    const eventIds = deliverable.forEvents.map(eventId =>
      typeof eventId === 'object' ? eventId._id : eventId
    );

    // Check if any event in client.events that matches forEvents has sameDayVideoEditors > 0
    return deliverable.client.events.some(event => {
      const eventId = typeof event._id === 'string' ? event._id : event._id.toString();
      return eventIds.includes(eventId) && parseInt(event.sameDayVideoEditors, 10) > 0;
    });
  };


  return (
    <>
      <ClientHeader

        title="Editors Reports"
      // filter
      />
      {data ? (
        <>
          <div
            className="widthForFilters d-flex flex-row  mx-auto align-items-center"
            style={{}}
          >
            <div className="w-100 d-flex flex-row align-items-center">
              <div className="w-75 ">
                <Select
                  isSearchable={true}
                  onChange={(e) => {

                    setLoading(true)
                    if (e.value !== 'Reset') {
                      setFilterEditorId(e.value)
                    } else {
                      setFilterEditorId(null)
                    }
                  }}
                  styles={{ ...customStyles, zIndex: 1000, width: "300px" }}
                  options={[
                    {
                      value: "Reset",
                      label: (
                        <div className="d-flex justify-content-around">
                          <strong>Reset</strong>
                        </div>
                      )
                    },
                    ...Array.from(allEditors)?.map((editor) => {
                      return {
                        value: editor._id,
                        label: (
                          <div className="d-flex justify-content-around">
                            <span>{editor.firstName + " " + editor.lastName}</span>
                          </div>
                        )
                      };
                    }),
                  ]}
                  // filterOption={(option, searchInput) => {
                  //   const { value } = option.data;
                  //   const searchText = searchInput?.toLowerCase();
                  //   if (value === 'Reset') {

                  //     return true
                  //   }
                  //   // // Perform search on both brideName and groomName
                  //   // return (
                  //   //   brideName?.toLowerCase().startsWith(searchText) ||
                  //   //   groomName?.toLowerCase().startsWith(searchText)
                  //   // );
                  // }}
                  required
                />
              </div>
            </div>
          </div>
          <Table
            ref={target}
            hover
            bordered
            responsive
            className="tableViewClient table-responsive"
            style={{ width: "100%", marginTop: "15px" }}
          >
            <thead style={{ position: "sticky", top: 0}} >
              <tr className="logsHeader Text16N1">
                <th className="tableBody">Editor</th>
                <th className="tableBody">Email</th>
                <th className="tableBody">Yes to Start</th>
                <th className="tableBody">In Progress</th>
                <th className="tableBody">Completed</th>
                <th className="tableBody">Overdue</th>
                {/* <th className="tableBody">Status</th>
              <th className="tableBody">Deadline</th>
              <th className="tableBody">Completion Date</th>
              <th className="tableBody">Task Ended</th>
              <th className="tableBody">Delays</th> */}
              </tr>
            </thead>
            <tbody
              className="Text12"
              style={{
                textAlign: "center",
                borderWidth: '1px 1px 1px 1px',
                // background: "#EFF0F5",
              }}
            >
              {data?.map((data, index) => (
                <>
                  <div style={{ marginTop: "15px" }} />
                  <tr
                    style={{
                      background: "#EFF0F5",
                      borderRadius: "8px",
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedEditorData(data)
                      setEditorDataModal(true)
                    }}
                  >
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {data?.editor.firstName + " " + data?.editor?.lastName}
                      {/* <br />
                    <img src={Heart} alt="" />
                    <br /> */}

                    </td>

                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {data.editor.email}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {data.deliverables.yetToStartDelivs.length}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {data.deliverables.inProgressDelivs.length}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {data.deliverables.completedDelivs.length}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {data.deliverables.overdueDelivs.length}
                    </td>
                    {/* <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {task.completionDate
                        ? dayjs(task.completionDate)
                          .startOf("day")
                          .isBefore(dayjs(task.deadlineDate).startOf("day"))
                          ? "Completed"
                          : "Overdue"
                        : dayjs()
                          .startOf("day")
                          .isBefore(dayjs(task.deadlineDate).startOf("day"))
                          ? "In Progress"
                          : "Closed"}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {dayjs(task.deadlineDate).format("DD-MMM-YYYY")}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {task.completionDate
                        ? dayjs(task.completionDate).format("DD-MMM-YYYY")
                        : "Not Yet Completed"}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {task.ended ? "Yes" : "No"}
                    </td>
                    <td
                      className="tableBody Text14Semi primary2 tablePlaceContent"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                      }}
                    >
                      {task.completionDate
                        ? dayjs(task.completionDate).isBefore(task.deadlineDate)
                          ? 0
                          : Math.abs(
                            dayjs(task.deadlineDate).diff(
                              task.completionDate,
                              "day"
                            )
                          )
                        : 0}
                    </td> */}
                  </tr>
                </>
              ))}
            </tbody>
          </Table>
          {loading && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <div class="spinner"></div>
            </div>
          )}
          {allData?.pagination.currentPage == allData?.pagination.totalPages && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <div>No more data to load.</div>
            </div>
          )}
          {(!filterEditorId && !loading && allData.pagination.currentPage < allData.pagination.totalPages) && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <button
                onClick={() => {
                  setPage(page + 1);
                  setLoading(true)
                }}
                className="btn btn-primary"
                style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          style={{ height: "400px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <div class="spinner"></div>
        </div>
      )}
      <Modal isOpen={editorDataModal} centered={true} size="lg" >
        <ModalHeader>Editor Report</ModalHeader>
        {selectedEditorData &&
          <ModalBody>
            <Row>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Editor Name</div>
                <div className={`textPrimary`}>
                  {selectedEditorData?.editor.firstName + " " + selectedEditorData?.editor.lastName}
                </div>
              </Col>
              <Col xl="6" sm="6" className="p-2">
                <div className="label">Editor Email</div>
                <div className={`textPrimary`}>
                  {selectedEditorData.editor.email}
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <div className="label mb-3">Deliverables Overview</div>
                <div style={{ height: "300px" }}>
                  <Pie
                    data={{
                      labels: ['Yet to Start', 'In Progress', 'Completed', 'Overdue'],
                      datasets: [{
                        data: [
                          selectedEditorData.deliverables.yetToStartDelivs.length || 0,
                          selectedEditorData.deliverables.inProgressDelivs.length || 0,
                          selectedEditorData.deliverables.completedDelivs.length || 0,
                          selectedEditorData.deliverables.overdueDelivs.length || 0
                        ],
                        backgroundColor: ['#FFD700', '#4169E1', '#32CD32', '#FF0000'],
                        borderColor: ['#FFD700', '#4169E1', '#32CD32', '#FF0000'],
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </Col>
            </Row>

            {/* Yet to Start Deliverables Table */}
            {selectedEditorData.deliverables.yetToStartDelivs.length > 0 &&
              <Row className="mt-4">
                <Col>
                  <div className="label mb-3 fs-5 text-center primary2">Yet to Start Deliverables</div>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Deliverable Name</th>
                        <th>Deliverable Date</th>
                        <th>Deadline Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEditorData.deliverables.yetToStartDelivs.map((deliv, index) => (
                        <tr className="Text14Semi" key={index}>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 "
                          >
                            {deliv?.client?.brideName + " "}

                            <img alt="" src={Heart} />

                            {" " + deliv?.client?.groomName}
                            <br />
                            {checkForSameDayEdit(deliv) && (
                              <>
                                <br />
                                <MdPhotoCameraFront className="fs-4" />
                                {/* <span className="text-primary fw-bold">Same Day Edit</span> */}
                              </>
                            )}
                          </td>
                          <td className="tableBody Text14Semi">{deliv.isAlbum ? `Album (${deliv.deliverableName})` : deliv.deliverableName}</td>

                          <td className="tableBody Text14Semi" >{dayjs(deliv.date).format('DD-MMM-YYYY')}</td>
                          <td className="tableBody Text14Semi" >{dayjs(deliv.deadlineDate).format('DD-MMM-YYYY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            }


            {/* In Progress Deliverables Table */}
            {selectedEditorData.deliverables.inProgressDelivs.length > 0 &&
              <Row className="mt-4">
                <Col>
                  <div className="label mb-3 fs-5 text-center primary2">In Progress Deliverables</div>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Deliverable Name</th>
                        <th>Deliverable Date</th>
                        <th>Deadline Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEditorData.deliverables.inProgressDelivs.map((deliv, index) => (
                        <tr className="Text14Semi" key={index}>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 "
                          >
                            {deliv?.client?.brideName + " "}

                            <img alt="" src={Heart} />

                            {" " + deliv?.client?.groomName}
                            <br />
                            {checkForSameDayEdit(deliv) && (
                              <>
                                <br />
                                <MdPhotoCameraFront className="fs-4" />
                                {/* <span className="text-primary fw-bold">Same Day Edit</span> */}
                              </>
                            )}
                          </td>
                          <td className="tableBody Text14Semi">{deliv.isAlbum ? `Album (${deliv.deliverableName})` : deliv.deliverableName}</td>

                          <td className="tableBody Text14Semi" >{dayjs(deliv.date).format('DD-MMM-YYYY')}</td>
                          <td className="tableBody Text14Semi" >{dayjs(deliv.deadlineDate).format('DD-MMM-YYYY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            }


            {/* Completed Deliverables Table */}
            {selectedEditorData.deliverables.completedDelivs.length > 0 &&
              <Row className="mt-4">
                <Col>
                  <div className="label mb-3 fs-5 text-center primary2">Completed Deliverables</div>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Deliverable Name</th>
                        <th>Deliverable Date</th>
                        <th>Deadline Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEditorData.deliverables.completedDelivs.map((deliv, index) => (
                        <tr className="Text14Semi" key={index}>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 "
                          >
                            {deliv?.client?.brideName + " "}

                            <img alt="" src={Heart} />

                            {" " + deliv?.client?.groomName}
                            <br />
                            {checkForSameDayEdit(deliv) && (
                              <>
                                <br />
                                <MdPhotoCameraFront className="fs-4" />
                                {/* <span className="text-primary fw-bold">Same Day Edit</span> */}
                              </>
                            )}
                          </td>
                          <td className="tableBody Text14Semi">{deliv.isAlbum ? `Album (${deliv.deliverableName})` : deliv.deliverableName}</td>
                          <td className="tableBody Text14Semi" >{dayjs(deliv.date).format('DD-MMM-YYYY')}</td>
                          <td className="tableBody Text14Semi" >{dayjs(deliv.deadlineDate).format('DD-MMM-YYYY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            }


            {/* Overdue Deliverables Table */}
            {selectedEditorData.deliverables.overdueDelivs.length > 0 &&
              <Row className="mt-4">
                <Col>
                  <div className="label mb-3 fs-5 text-center primary2">Overdue Deliverables</div>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Deliverable Name</th>
                        <th>Deliverable Date</th>
                        <th>Deadline Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEditorData.deliverables.overdueDelivs.map((deliv, index) => (
                        <tr className="Text14Semi" key={index}>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 "
                          >
                            {deliv?.client?.brideName + " "}

                            <img alt="" src={Heart} />

                            {" " + deliv?.client?.groomName}
                            <br />
                            {checkForSameDayEdit(deliv) && (
                              <>
                                <br />
                                <MdPhotoCameraFront className="fs-4" />
                                {/* <span className="text-primary fw-bold">Same Day Edit</span> */}
                              </>
                            )}
                          </td>
                          <td className="tableBody Text14Semi">{deliv.isAlbum ? `Album (${deliv.deliverableName})` : deliv.deliverableName}</td>
                          <td className="tableBody Text14Semi" >{dayjs(deliv.date).format('DD-MMM-YYYY')}</td>
                          <td className="tableBody Text14Semi" >{dayjs(deliv.deadlineDate).format('DD-MMM-YYYY')}</td>
                          <td className="tableBody Text14Semi">{deliv.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            }

          </ModalBody>
        }
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              setSelectedEditorData(null);
              setEditorDataModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>

      </Modal>
    </>
  );
}

export default EditorsReports;
