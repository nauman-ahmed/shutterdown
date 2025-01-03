import React, { useCallback, useRef, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { getEditors } from "../../API/userApi";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import ClientHeader from "../../components/ClientHeader";
import {
  getAlbums,
  updateDeliverable,
  getAllTheDeadline,
} from "../../API/Deliverables";
import { getAllWhatsappText } from "../../API/Whatsapp";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useDispatch } from "react-redux";
import { GrPowerReset } from "react-icons/gr";
import CalenderImg from "../../assets/Profile/Calender.svg";
import CalenderMultiListView from "../../components/CalendarFilterListView";
import { Overlay } from "react-bootstrap";
import Spinner from "../../components/Spinner";
import { useLoggedInUser } from "../../config/zStore";
import RangeCalendarFilter from "../../components/common/RangeCalendarFilter";

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

function Albums(props) {
  const [editors, setEditors] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const { userData: currentUser } = useLoggedInUser();
  const [deliverablesForShow, setDeliverablesForShow] = useState([]);
  const [ascendingWeding, setAscendingWeding] = useState(false);
  const [filterCondition, setFilterCondition] = useState(null);
  const [editorState, setEditorState] = useState({
    albumTextGetImmutable: EditorState.createEmpty(),
    cinematographyTextGetImmutable: EditorState.createEmpty(),
    _id: null,
  });
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [deadlineDays, setDeadlineDays] = useState([]);
  const [dateForFilter, setDateForFilter] = useState(null);
  const [updateData, setUpdateData] = useState(false);
  const [monthForData, setMonthForData] = useState(
    months[new Date().getMonth()] + " " + new Date().getFullYear()
  );
  const [yearForData, setYearForData] = useState(new Date().getFullYear());
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const target = useRef(null);
  const extractText = () => {
    const contentState = editorState.albumTextGetImmutable.getCurrentContent();
    return contentState.getPlainText("\u0001"); // Using a delimiter, if needed
  };
  const loadEditorContent = (rawContent) => {
    const contentState = convertFromRaw(JSON.parse(rawContent));
    return EditorState.createWithContent(contentState);
    // Use `newEditorState` in your editor component
  };

  const getAllWhatsappTextHandler = async () => {
    const res = await getAllWhatsappText();
    const newEditorStateAlbum = loadEditorContent(
      res.data[0].albumTextGetImmutable
    );
    const newEditorStatecinematography = loadEditorContent(
      res.data[0].cinematographyTextGetImmutable
    );

    setEditorState({
      _id: res.data[0]._id,
      albumTextGetImmutable: newEditorStateAlbum,
      cinematographyTextGetImmutable: newEditorStatecinematography,
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAlbums(1, startDate, endDate);
      const res = await getEditors();
      const deadline = await getAllTheDeadline();
      setDeadlineDays(deadline[0]);
      setEditors(
        res.editors.filter((user) => user.subRole.includes("Photo Editor"))
      );
      await getAllWhatsappTextHandler();
      if (currentUser?.rollSelect === "Manager") {
        setAllDeliverables(data?.data);
        setDeliverablesForShow(
          data?.data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return ascendingWeding ? dateB - dateA : dateA - dateB;
          })
        );
      } else if (currentUser?.rollSelect === "Editor") {
        const deliverablesToShow = data.data.filter(
          (deliverable) => deliverable?.editor?._id === currentUser?._id
        );
        setAllDeliverables(deliverablesToShow);
        setDeliverablesForShow(
          deliverablesToShow.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return ascendingWeding ? dateB - dateA : dateA - dateB;
          })
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    setHasMore(true);
    setPage(2);
    fetchData();
  }, [updateData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAlbums = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const data = await getAlbums(
          page,
          startDate,
          endDate
        );
        if (data.data.length > 0) {
          let dataToAdd;
          if (currentUser?.rollSelect === "Manager") {
            setAllDeliverables([...deliverablesForShow, ...data.data]);
            if (filterCondition) {
              dataToAdd = data.data.filter((deliverable) =>
                eval(filterCondition)
              );
            } else {
              dataToAdd = data.data;
            }
            setDeliverablesForShow(
              [...deliverablesForShow, ...dataToAdd].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return ascendingWeding ? dateB - dateA : dateA - dateB;
              })
            );
          } else if (currentUser?.rollSelect === "Editor") {
            const deliverablesToShow = data.data.filter(
              (deliverable) => deliverable?.editor?._id === currentUser?._id
            );
            setAllDeliverables([...allDeliverables, ...deliverablesToShow]);
            if (filterCondition) {
              dataToAdd = deliverablesForShow.filter((deliverable) =>
                eval(filterCondition)
              );
            } else {
              dataToAdd = deliverablesToShow;
            }
            setDeliverablesForShow(
              [...deliverablesForShow, ...dataToAdd].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return ascendingWeding ? dateB - dateA : dateA - dateB;
              })
            );
          }
        }
        if (data.hasMore) {
          setPage(page + 1);
        }
        setHasMore(data.hasMore);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (deliverablesForShow?.length < 10 && hasMore && !loading) {
      fetchAlbums();
    }
  }, [deliverablesForShow, hasMore, loading]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;
    if (bottomOfWindow) {
      console.log("at bottom");
      fetchAlbums();
    }
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [handleScroll]);

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
          ],
        },
      ];

  // Define priority for parentTitle
  const priority = {
    "Assigned Editor": 1,
    "Current Status": 2,
  };

  const applySorting = (wedding = false) => {
    try {
      if (wedding) {
        const sorted = deliverablesForShow.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return !ascendingWeding ? dateB - dateA : dateA - dateB;
        });
        setDeliverablesForShow(sorted);
        setAscendingWeding(!ascendingWeding);
      }
    } catch (error) {
      console.log("applySorting ERROR", error);
    }
  };

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      if (filterType === "Unassigned Editor") {
        setDeliverablesForShow(
          allDeliverables
            .filter((deliverable) => !deliverable.editor)
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return ascendingWeding ? dateB - dateA : dateA - dateB;
            })
        );
      } else {
        if (
          filterType !== "Wedding Date sorting" &&
          filterType !== "Deadline sorting"
        ) {
          setDeliverablesForShow(
            allDeliverables?.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return ascendingWeding ? dateB - dateA : dateA - dateB;
            })
          );
        }
      }
    }
    setFilterBy(filterType);
  };

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
              " || deliverable.firstName === '" +
              obj.title +
              "'"
              : " deliverable.firstName === '" + obj.title + "'";
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
            // eslint-disable-next-line no-useless-concat
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
      setDeliverablesForShow(newData);
    } else {
      setDeliverablesForShow(allDeliverables);
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
            notificationOf: "Albums Deliverable",
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

  const openWhatsAppChat = (contact, message) => {
    // const chatUrl = `whatsapp://send?abid=${contactParam}&text=Hello%2C%20World!`;
    // window.open(chatUrl, '_blank');
    const baseUrl = "https://web.whatsapp.com/";
    const contactParam = encodeURIComponent(contact);
    const messageParam = encodeURIComponent(message);
    const chatUrl = `${baseUrl}send?phone=${contactParam}&text=${messageParam}`;
    window.open(chatUrl, "_blank");
  };

  const getrelevantDeadline = (title) => {
    return deadlineDays.album;
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
        title="Albums"
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
                currentUser?.rollSelect === "Manager"
                  ? { width: "150%", marginTop: "15px" }
                  : { width: "100%", marginTop: "15px" }
              }
            >
              <thead>
                {currentUser?.rollSelect === "Editor" ? (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client</th>
                    <th className="tableBody">Albums</th>
                    <th className="tableBody">Editor</th>
                    <th className="tableBody">Editor Deadline</th>
                    <th className="tableBody">Status</th>
                  </tr>
                ) : currentUser?.rollSelect === "Manager" ? (
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody sticky-column">Client</th>
                    <th className="tableBody ">Albums</th>
                    <th className="tableBody">Editor</th>
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
                    <th className="tableBody">Status</th>
                    <th className="tableBody">Action</th>
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
                  // background: "#EFF0F5",
                }}
              >
                {deliverablesForShow?.map((deliverable, index) => {
                  return (
                    <>
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
                              width: "10%",
                            }}
                            className="tableBody Text14Semi primary2 sticky-column tablePlaceContent"
                          >
                            {deliverable.client?.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {deliverable?.client?.groomName}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <div>{deliverable.deliverableName}</div>
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
                                    value: deliverable?.editor?.firstName,
                                    label: deliverable?.editor?.firstName,
                                  }
                                  : ""
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
                              ]}
                              required
                            />
                          </td>
                          <td
                            onClick={() =>
                              openWhatsAppChat(
                                deliverable.client.phoneNumber,
                                extractText()
                              )
                            }
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                          >
                            Send Reminder
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
                                  <div className="smallSpinner mx-auto"></div>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </td>
                        </tr>
                      )}
                      {currentUser?.rollSelect === "Editor" && (
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
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                          >
                            <div>
                              {deliverable?.deliverableName} :{" "}
                              {deliverable?.quantity}
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
                            style={{
                              paddingTop: "15px",
                              paddingBottom: "15px",
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                          >
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
                        </tr>
                      )}
                      <div style={{ marginTop: "15px" }} />
                    </>
                  );
                })}
              </tbody>
            </Table>
            {loading && <Spinner />}
            {!hasMore && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <div>No more data to load.</div>
              </div>
            )}
            {!loading && hasMore && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <button
                  onClick={() => fetchAlbums()}
                  className="btn btn-primary"
                  style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
                >
                  Load More
                </button>
              </div>
            )}
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
            <div style={{ width: "300px" }}>
              <RangeCalendarFilter startDate={startDate} setMonthForData={setMonthForData} updateStartDate={setStartDate} updateEndDate={setEndDate} endDate={endDate} />
              {/* <CalenderMultiListView
                monthForData={monthForData}
                dateForFilter={dateForFilter}
                yearForData={yearForData}
                setShow={setShow}
                setMonthForData={setMonthForData}
                setYearForData={setYearForData}
                setDateForFilter={setDateForFilter}
              /> */}
            </div>
          </Overlay>
        </>
      ) : (
        <div
          style={{ height: "400px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
}

export default Albums;
