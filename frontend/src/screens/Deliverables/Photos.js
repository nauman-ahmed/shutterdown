import React, { useEffect, useRef, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { getEditors } from "../../API/userApi";
import Select from "react-select";
import Cookies from "js-cookie";
import ClientHeader from "../../components/ClientHeader";
import {
  getPhotos,
  updateDeliverable,
  getAllTheDeadline,
} from "../../API/Deliverables";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { useDispatch } from "react-redux";
import { GrPowerReset } from "react-icons/gr";
import CalenderImg from "../../assets/Profile/Calender.svg";
import CalenderMultiListView from "../../components/CalendarFilterListView";
import { Overlay } from "react-bootstrap";
import Spinner from "../../components/Spinner";
import { useLoggedInUser } from "../../config/zStore";
import RangeCalendarFilter from "../../components/common/RangeCalendarFilter";
import { groupByClientID } from "./Cinematography";
import { IoWarning } from "react-icons/io5";
import { MdPhotoCameraFront } from "react-icons/md";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Decemeber",
];

function Photos() {
  const [editors, setEditors] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const { userData: currentUser } = useLoggedInUser();
  const [deliverablesForShow, setDeliverablesForShow] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [ascendingWeding, setAscendingWeding] = useState(false);
  const [filterCondition, setFilterCondition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [deadlineDays, setDeadlineDays] = useState([]);
  const [dateForFilter, setDateForFilter] = useState(null);
  const [monthForData, setMonthForData] = useState(
    months[new Date().getMonth()] + " " + new Date().getFullYear()
  );
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [yearForData, setYearForData] = useState(new Date().getFullYear());
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const target = useRef(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPhotos(startDate, endDate);
      const res = await getEditors();
      const deadline = await getAllTheDeadline();
      setDeadlineDays(deadline[0]);
      setEditors(
        res.editors.filter((user) => user.subRole.includes("Photo Editor"))
      );
      if (currentUser?.rollSelect === "Manager") {
        setAllDeliverables(data.data);
        setDeliverablesForShow(groupByClientID(
          data.data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return ascendingWeding ? dateB - dateA : dateA - dateB;
          }))
        );
      } else if (currentUser?.rollSelect === "Editor" || currentUser?.rollSelect === "Shooter") {
        const deliverablesToShow = data.data.filter(
          (deliverable) => deliverable?.editor?._id === currentUser._id
        );
        setAllDeliverables(deliverablesToShow);
        setDeliverablesForShow(groupByClientID(
          deliverablesToShow.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return ascendingWeding ? dateB - dateA : dateA - dateB;
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [updateData]);



  const applyFilterNew = (filterValue) => {
    if (filterValue.length) {
      let conditionDeliverable = null;
      let conditionEditor = null;
      let conditionStatus = null;
      filterValue.map((obj) => {
        if (obj.parentTitle == "Deliverable") {
          conditionDeliverable = conditionDeliverable
            ? conditionDeliverable +
            " || deliverable.deliverableName === '" +
            obj.title +
            "'"
            : "deliverable.deliverableName === '" + obj.title + "'";
        } else if (obj.parentTitle == "Assigned Editor") {
          if (obj.title === "Unassigned Editor") {
            conditionEditor = conditionEditor
              ? conditionEditor + " || deliverable.editor ? false : true"
              : "deliverable.editor ? false : true";
          } else {
            conditionEditor = conditionEditor
              ? conditionEditor +
              " || deliverable.editor?.firstName === '" +
              obj.title +
              "'"
              : " deliverable.editor?.firstName === '" + obj.title + "'";
          }
        } else if (obj.parentTitle == "Current Status") {
          conditionStatus = conditionStatus
            ? conditionStatus + " || deliverable.status === '" + obj.title + "'"
            : " deliverable.status === '" + obj.title + "'";
        }
      });
      let finalCond = null;
      if (conditionDeliverable) {
        if (conditionEditor) {
          if (conditionStatus) {
            finalCond =
              "(" +
              conditionDeliverable +
              ")" +
              " && " +
              "(" +
              conditionEditor +
              ")" +
              " && " +
              "(" +
              conditionStatus +
              ")";
          } else {
            finalCond =
              "(" +
              conditionDeliverable +
              ")" +
              " && " +
              "(" +
              conditionEditor +
              ")";
          }
        } else if (conditionStatus) {
          finalCond =
            "(" +
            conditionDeliverable +
            ")" +
            " && " +
            "(" +
            conditionStatus +
            ")";
        } else {
          finalCond = "(" + conditionDeliverable + ")";
        }
      } else if (conditionEditor) {
        if (conditionStatus) {
          finalCond =
            "(" + conditionEditor + ")" + " && " + "(" + conditionStatus + ")";
        } else {
          finalCond = "(" + conditionEditor + ")";
        }
      } else {
        finalCond = "(" + conditionStatus + ")";
      }
      setFilterCondition(finalCond);
      const newData = allDeliverables.filter((deliverable) => eval(finalCond));
      setDeliverablesForShow(groupByClientID(
        newData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return ascendingWeding ? dateB - dateA : dateA - dateB;
        }))
      );
    } else {
      setDeliverablesForShow(groupByClientID(
        allDeliverables?.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return ascendingWeding ? dateB - dateA : dateA - dateB;
        }))
      );
    }
  };
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
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };

  const applySorting = (wedding = false) => {
    try {
      if (wedding) {
        const sorted = deliverablesForShow.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return !ascendingWeding ? dateB - dateA : dateA - dateB;
        });
        setDeliverablesForShow(groupByClientID(sorted));
        setAscendingWeding(!ascendingWeding);
      }
    } catch (error) {
      console.log("applySorting ERROR", error);
    }
  };

  const filterOptions =
    currentUser?.rollSelect === "Manager"
      ? [
        {
          title: "Assigned Editor",
          id: 1,
          filters: editors && [
            ...editors?.map((editor, i) => {
              return { title: editor.firstName, id: i + 2 };
            }),
            { title: "Unassigned Editor", id: editors.length + 3 },
          ],
        },
        {
          title: "Current Status",
          id: 5,
          filters: [
            {
              title: "Yet to Start",
              id: 2,
            },
            {
              title: "In Progress",
              id: 3,
            },
            {
              title: "Completed",
              id: 4,
            },
            {
              title: "Delivered",
              id: 5,
            },
            {
              title: "Closed",
              id: 6,
            },
          ],
        },
      ]
      : [
        {
          title: "Current Status",
          id: 5,
          filters: [
            {
              title: "Yet to Start",
              id: 2,
            },
            {
              title: "In Progress",
              id: 3,
            },
            {
              title: "Completed",
              id: 4,
            },
            {
              title: "Delivered",
              id: 5,
            },
            {
              title: "Closed",
              id: 6,
            },
          ],
        },
      ];

  // Define priority for parentTitle
  const priority = {
    "Assigned Editor": 1,
    "Current Status": 2,
  };

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      if (filterType === "Unassigned Editor") {
        setDeliverablesForShow(groupByClientID(
          allDeliverables
            .filter((deliverable) => !deliverable.editor)
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return ascendingWeding ? dateB - dateA : dateA - dateB;
            }))
        );
      } else {
        if (
          filterType !== "Wedding Date sorting" &&
          filterType !== "Deadline sorting"
        ) {
          setDeliverablesForShow(groupByClientID(
            allDeliverables?.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return ascendingWeding ? dateB - dateA : dateA - dateB;
            }))
          );
        }
      }
    }
    setFilterBy(filterType);
  };
  const dispatch = useDispatch();

  const handleSaveData = async (index) => {
    try {
      const deliverable = deliverablesForShow[index];
      setUpdatingIndex(index);
      await updateDeliverable(deliverable);
      setUpdatingIndex(null);
      dispatch({
        type: "SOCKET_EMIT_EVENT",
        payload: {
          event: "add-notification",
          data: {
            notificationOf: "Photos Deliverable",
            data: deliverable,
            forManager: false,
            forUser: deliverable?.editor._id,
            read: false,
            dataId: deliverable._id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
        // Select the .table-responsive element
        const tableResponsiveElement = document.querySelector(".table-responsive");
        // Apply the max-height style
        if (tableResponsiveElement) {
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
      }, [document.querySelector(".table-responsive")]);
      
  // Add this function somewhere in your component
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
      return eventIds.includes(eventId) && parseInt(event.sameDayPhotoEditors, 10) > 0;
    });
  };

  const getrelevantDeadline = (title) => {
    if (title == "Photos") {
      return deadlineDays.photo;
    }
    return 45;
  };
  const returnOneRow = (deliverable, prevDeliverable) => {
    if (prevDeliverable) {
      if (deliverable?.client?._id !== prevDeliverable?.client?._id) {
        if (currentUser?.rollSelect === "Manager") {
          return (
            <tr style={{ backgroundColor: "rgb(102, 109, 255)" }}>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
            </tr>
          );
        } else {
          return (
            <tr style={{ backgroundColor: "rgb(102, 109, 255)" }}>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
              <td style={{ backgroundColor: "rgb(102, 109, 255)" }}></td>
            </tr>
          );
        }
      }
    }
  };
  return (
    <>
      <ClientHeader
        selectFilter={changeFilter}
        currentFilter={filterBy}
        priority={priority}
        applyFilter={applyFilterNew}
        options={filterOptions}
        filter
        title="Photos"
      />
      {deliverablesForShow ? (
        <>
          <div
            className="widthForFilters d-flex flex-row  mx-auto align-items-center"
            style={{}}
            ref={target}
          >
            <div className="w-100 d-flex flex-row align-items-center">
              <div className="w-75 ">
                <div
                  className={`forminput R_A_Justify1`}
                  style={{ cursor: "pointer" }}
                >
                  <div onClick={toggle}>

                    <>
                      {monthForData}
                    </>

                  </div>
                  <div
                    className="d-flex align-items-center"
                    style={{ position: "relative" }}
                  >
                    <img alt="" src={CalenderImg} onClick={toggle} />
                    <GrPowerReset
                      className="mx-1"
                      onClick={() => {
                        setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
                        setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
                        setMonthForData(months[currentDate.getMonth()] + " " + currentDate.getFullYear());
                        setUpdateData(!updateData);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ overflowX: "hidden", width: "100%" }}>
            <Table
              hover
              bordered
              responsive
              className="tableViewClient"
              style={
                currentUser.rollSelect === "Manager"
                  ? { width: "150%", marginTop: "15px" }
                  : { width: "100%", marginTop: "15px" }
              }
            >
              <thead  style={{ position: "sticky", top: 0, zIndex: 101 }} >
                {(currentUser?.rollSelect === "Editor" || currentUser?.rollSelect === "Shooter") ? (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client</th>
                    <th className="tableBody">Deliverables</th>
                    <th className="tableBody" style={{ minWidth: "150px" }}>Editor</th>
                    <th className="tableBody">Editor Deadline</th>
                    <th className="tableBody" style={{ minWidth: "150px" }}>Status</th>
                    <th className="tableBody">Delivery URL</th>
                    <th className="tableBody">Save</th>
                  </tr>
                ) : currentUser?.rollSelect === "Manager" ? (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody sticky-column">Client</th>
                    <th className="tableBody">Deliverables</th>
                    <th className="tableBody" style={{ minWidth: "150px" }}>Editor</th>
                    <th
                      className="tableBody"
                      style={{ cursor: "pointer" }}
                      onClick={() => applySorting(true)}
                    >
                      Wedding <br /> Date{" "}
                      {!ascendingWeding ? (
                        <IoIosArrowRoundDown
                          style={{ color: "#666DFF" }}
                          className="fs-4 cursor-pointer"
                        />
                      ) : (
                        <IoIosArrowRoundUp
                          style={{ color: "#666DFF" }}
                          className="fs-4 cursor-pointer"
                        /> 
                      )}
                    </th>
                    <th className="tableBody">Client Deadline</th>
                    <th className="tableBody">Editor Deadline</th>
                    <th className="tableBody">First Delivery Date</th>
                    <th className="tableBody">Final Delivery Date</th>
                    <th className="tableBody" style={{ minWidth: "150px" }}>Status</th>
                    <th className="tableBody">Delivered Url</th>
                    <th className="tableBody">Client Revisions</th>
                    <th className="tableBody">Client Ratings</th>
                    <th className="tableBody">Save</th>
                  </tr>
                ) : null}
              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: "center",
                  borderWidth: "0px 1px 0px 1px",
                }}
              >
                {deliverablesForShow?.map((deliverable, index) => {
                  return (
                    <>
                      {returnOneRow(
                        deliverable,
                        index >= 0 ? deliverablesForShow[index - 1] : null
                      )}
                      {index === 0 && <div style={{ marginTop: "15px" }} />}
                      {currentUser?.rollSelect === "Manager" && (
                        <tr
                          style={{
                            background: "#EFF0F5",
                            borderRadius: "8px",
                          }}
                        >
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi sticky-column primary2 tablePlaceContent"
                          >
                            {deliverable?.client?.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {deliverable.client?.groomName}
                            {checkForSameDayEdit(deliverable) && (
                              <>
                                <br />
                                <MdPhotoCameraFront className="fs-4" />
                                {/* <span className="text-primary fw-bold">Same Day Edit</span> */}
                              </>
                            )}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <div>{deliverable?.deliverableName}{" "}{deliverable?.delivNumber}</div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <Select
                              value={
                                deliverable?.editor
                                  ? {
                                    value: deliverable?.editor.firstName,
                                    label: deliverable?.editor?.firstName,
                                  }
                                  : null
                              }
                              name="editor"
                              onChange={(selected) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].editor =
                                  selected.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              styles={customStyles}
                              options={editors?.map((editor) => {
                                return {
                                  value: editor,
                                  label: editor.firstName,
                                };
                              })}
                              required
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >

                            {dayjs(deliverable?.date).format("DD-MMM-YYYY")}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            {(deliverable?.date && dayjs(
                              new Date(deliverable?.date).setDate(
                                new Date(deliverable?.date).getDate() +
                                getrelevantDeadline(
                                  deliverable?.deliverableName
                                )
                              )
                            ).isBefore(dayjs().startOf("day")) && (deliverable.status === 'Yet to Start' || deliverable.status === 'In Progress')) && (
                                <IoWarning className="text-danger fs-5 me-2" />
                              )}
                            {dayjs(
                              new Date(deliverable?.date).setDate(
                                new Date(deliverable?.date).getDate() +
                                getrelevantDeadline(
                                  deliverable.deliverableName
                                )
                              )
                            ).format("DD-MMM-YYYY")}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            {(deliverable?.companyDeadline && dayjs(deliverable?.companyDeadline).isBefore(dayjs().startOf("day")) && (deliverable.status === 'Yet to Start' || deliverable.status === 'In Progress')) && (
                              <IoWarning className="text-danger fs-5 me-2" />
                            )}
                            <input
                              type="date"
                              name="companyDeadline"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].companyDeadline =
                                  e.target.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              value={
                                deliverable?.companyDeadline
                                  ? dayjs(deliverable?.companyDeadline).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              }
                              min={
                                deliverable?.date
                                  ? dayjs(deliverable?.date).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              }
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <input
                              type="date"
                              name="firstDeliveryDate"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].firstDeliveryDate =
                                  e.target.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              value={
                                deliverable?.firstDeliveryDate
                                  ? dayjs(
                                    deliverable?.firstDeliveryDate
                                  ).format("YYYY-MM-DD")
                                  : ""
                              }
                              min={
                                deliverable?.date
                                  ? dayjs(deliverable?.date).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              }
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <input
                              type="date"
                              name="finalDeliveryDate"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].finalDeliveryDate =
                                  e.target.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              value={
                                deliverable?.finalDeliveryDate
                                  ? dayjs(
                                    deliverable?.finalDeliveryDate
                                  ).format("YYYY-MM-DD")
                                  : ""
                              }
                              min={
                                deliverable?.date
                                  ? dayjs(deliverable?.date).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              }
                            />
                          </td>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                          >
                            <Select
                              value={
                                deliverable?.status
                                  ? {
                                    value: deliverable?.status,
                                    label: deliverable?.status,
                                  }
                                  : null
                              }
                              name="Status"
                              onChange={(selected) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].status =
                                  selected.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              styles={customStyles}
                              options={[
                                {
                                  value: "Yet to Start",
                                  label: "Yet to Start",
                                },
                                { value: "In Progress", label: "In Progress" },
                                { value: "Completed", label: "Completed" },
                                { value: "Delivered", label: "Delivered" },
                                { value: "Closed", label: "Closed" },
                              ]}
                              required
                            />
                          </td>

                          <td
                           
                           style={{
                             paddingTop: "15px",
                             paddingBottom: "15px",
                           }}
                           className="tableBody Text14Semi primary2 tablePlaceContent"
                         >
                           {deliverable.link ? <>
                             <a href={deliverable.link} target="_blank">View</a>
                           </> : <>
                             Not Given
                           </>}
                          
                         </td>

                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody tablePlaceContent"
                          >
                            {" "}
                            <Select
                              value={
                                deliverable?.clientRevision
                                  ? {
                                    value: deliverable?.clientRevision,
                                    label: deliverable?.clientRevision,
                                  }
                                  : null
                              }
                              name="clientRevision"
                              onChange={(selected) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].clientRevision =
                                  selected.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              styles={customStyles}
                              options={[
                                { value: 1, label: 1 },
                                { value: 2, label: 2 },
                                { value: 3, label: 3 },
                                { value: 4, label: 4 },
                                { value: 5, label: 5 },
                                { value: 6, label: 6 },
                              ]}
                              required
                            />
                          </td>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody tablePlaceContent"
                          >
                            {" "}
                            <Select
                              value={
                                deliverable?.clientRating
                                  ? {
                                    value: deliverable?.clientRating,
                                    label: deliverable?.clientRating,
                                  }
                                  : null
                              }
                              name="clientRating"
                              onChange={(selected) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].clientRating =
                                  selected.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              styles={customStyles}
                              options={[
                                { value: 1, label: 1 },
                                { value: 2, label: 2 },
                                { value: 3, label: 3 },
                                { value: 4, label: 4 },
                                { value: 5, label: 5 },
                              ]}
                              required
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <button
                              className="btn btn-primary "
                              onClick={(e) =>
                                updatingIndex === null && handleSaveData(index)
                              }
                            >
                              {updatingIndex === index ? (
                                <div className="w-100">
                                  <div class="smallSpinner mx-auto"></div>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </td>
                        </tr>
                      )}
                      {(currentUser?.rollSelect === "Editor" || currentUser?.rollSelect === "Shooter") && (
                        <tr
                          style={{
                            background: "#EFF0F5",
                            borderRadius: "8px",
                          }}
                        >
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                          >
                            {deliverable?.client?.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {deliverable?.client?.groomName}
                            {checkForSameDayEdit(deliverable) && (
                              <>
                                <br />
                                <MdPhotoCameraFront className="fs-4" />
                                {/* <span className="text-primary fw-bold">Same Day Edit</span> */}
                              </>
                            )}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <div>
                              {deliverable?.deliverableName}{" "}{deliverable?.delivNumber}
                            </div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            {deliverable?.editor?.firstName}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            {(deliverable?.companyDeadline && dayjs(deliverable?.companyDeadline).isBefore(dayjs().startOf("day")) && (deliverable.status === 'Yet to Start' || deliverable.status === 'In Progress')) && (
                              <IoWarning className="text-danger fs-5 me-2" />
                            )}
                            {deliverable?.companyDeadline}
                          </td>
                          <td
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                          >
                            {deliverable?.status}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >

                            <input
                              type="text"
                              name="link"
                              className="p-1"
                              style={{ width: '230px' }}
                              onChange={(e) => {
                                const updatedDeliverables = [
                                  ...deliverablesForShow,
                                ];
                                updatedDeliverables[index].link =
                                  e.target.value;
                                setDeliverablesForShow(updatedDeliverables);
                              }}
                              value={
                                deliverable?.link
                                || ""
                              }

                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <button
                              className="btn btn-primary "
                              onClick={(e) =>
                                updatingIndex === null && handleSaveData(index)
                              }
                            >
                              {updatingIndex === index ? (
                                <div className="w-100">
                                  <div class="smallSpinner mx-auto"></div>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </td>
                        </tr>
                      )}
                      <div style={{ marginTop: "15px" }} />
                    </>
                  );
                })}
              </tbody>
            </Table>
            {loading && <Spinner />}
          </div>
          <Overlay
            rootClose={true}
            onHide={() => {
              setShow(false);
              setUpdateData(!updateData);
            }}
            target={target.current}
            show={show}
            placement="bottom"
          >
            <div style={{ width: "300px", zIndex: 102 }}>
              <RangeCalendarFilter startDate={startDate} setMonthForData={setMonthForData} updateStartDate={setStartDate} updateEndDate={setEndDate} endDate={endDate} />

            </div>
          </Overlay>
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

export default Photos;
