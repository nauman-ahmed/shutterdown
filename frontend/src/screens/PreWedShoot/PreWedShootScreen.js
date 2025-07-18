import React, { useState, useEffect, useRef } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { addPreWedData, getPreWedClients } from "../../API/Client";
import Select from "react-select";
import CalenderImg from "../../assets/Profile/Calender.svg";
import Calendar from "react-calendar";
import { Overlay } from "react-bootstrap";
import { getShooters, getAllUsers } from "../../API/userApi";
import ShootDropDown from "../../components/ShootDropDown";
import ClientHeader from "../../components/ClientHeader";
import { GrPowerReset } from "react-icons/gr";
import { useDispatch } from "react-redux";
import "react-calendar/dist/Calendar.css";
import Edit from "../../assets/Profile/Edit.svg";
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

function PreWedShootScreen() {
  const [preWedClients, setPreWedClients] = useState(null);
  const { userData: currentUser } = useLoggedInUser();
  const [clientsForShow, setClientsForShow] = useState(null);
  const [rangeFor, setRangeFor] = useState(-1);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [filterCondition, setFilterCondition] = useState(null);
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [shooters, setShooters] = useState([]);
  const dispatch = useDispatch();
  const toggle = () => {
    setShow(!show);
  };
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [loading, setLoading] = useState(false);
  const [assistant, setAssistant] = useState([]);
  const [photographer, setPhotographer] = useState([]);
  const [cinematographer, setCinematographer] = useState([]);
  const [flyer, setFlyer] = useState([]);
  const [dateForFilter, setDateForFilter] = useState(null);
  const [monthForData, setMonthForData] = useState(
    months[new Date().getMonth()] + " " + new Date().getFullYear()
  );
  const [yearForData, setYearForData] = useState(new Date().getFullYear());

  const filterOptions = [
    {
      title: "Date Filter",
      id: 1,
      filters: [
        {
          title: "Date Assigned",
          id: 2,
        },
        {
          title: "Date Unassigned",
          id: 3,
        },
      ],
    },
  ];

  // Define priority for parentTitle
  const priority = {
    "Date Filter": 1,
  };

  const getFilterdUsers = (users) => {
    const AssitantsDummy = users.filter((user) =>
      user.subRole.includes("Assistant")
    );
    const PhotographerDummy = users.filter((user) =>
      user.subRole.includes("Photographer")
    );
    const CinematographerDummy = users.filter((user) =>
      user.subRole.includes("Cinematographer")
    );
    const FlyerDummy = users.filter((user) =>
      user.subRole.includes("Drone Flyer")
    );

    setAssistant(AssitantsDummy);
    setPhotographer(PhotographerDummy);
    setCinematographer(CinematographerDummy);
    setFlyer(FlyerDummy);
  };

  const getClients = async () => {
    setLoading(true);
    try {
      const allPreWedClients = await getPreWedClients(
        startDate,
        endDate,
      );
      const res = await getShooters();
      const usersData = await getAllUsers();
      setShooters(res.shooters);
      getFilterdUsers(usersData.users);
      if (currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") {
        setPreWedClients(allPreWedClients.data);
        setClientsForShow(allPreWedClients.data);
      } else if (currentUser?.rollSelect === "Shooter" || currentUser?.rollSelect === "Editor") {
        const clientsToShow = allPreWedClients.data.filter((client) => {
          return (
            client.preWeddingDetails?.photographers?.some(
              (photographer) => photographer._id === currentUser?._id
            ) ||
            client.preWeddingDetails?.cinematographers?.some(
              (cinematographer) => cinematographer._id === currentUser?._id
            ) ||
            client.preWeddingDetails?.assistants?.some(
              (assistant) => assistant._id === currentUser?._id
            ) ||
            client.preWeddingDetails?.droneFlyers?.some(
              (flyer) => flyer._id === currentUser?._id
            )
          );
        });

        for (
          let client_index = 0;
          client_index < clientsToShow.length;
          client_index++
        ) {
          if (
            clientsToShow[client_index]?.preWeddingDetails.photographers?.some(
              (photographer) => photographer._id === currentUser?._id
            )
          ) {
            clientsToShow[client_index].userRole = "Photographer";
            break;
          } else if (
            clientsToShow[client_index]?.preWeddingDetails.photographers?.some(
              (cinematographer) => cinematographer._id === currentUser?._id
            )
          ) {
            clientsToShow[client_index].userRole = "Cinematographer";
            break;
          } else if (
            clientsToShow[client_index]?.preWeddingDetails.photographers?.some(
              (flyer) => flyer._id === currentUser?._id
            )
          ) {
            clientsToShow[client_index].userRole = "Drone Flyer";
            break;
          } else if (
            clientsToShow[client_index]?.preWeddingDetails.photographers?.some(
              (assistant) => assistant === currentUser?._id
            )
          ) {
            clientsToShow[client_index].userRole = "Assistant";
            break;
          } else {
            clientsToShow[client_index].userRole = "Not Assigned";
          }
        }
        setPreWedClients(clientsToShow);
        setClientsForShow(clientsToShow);
      }
    } catch (error) {
      console.log(error, "error");
    }
    setLoading(false);
  };
  useEffect(() => {
    getClients();
  }, [updateData]);


  const applyFilterNew = (filterValue) => {
    if (filterValue.length) {
      let conditionAssigned = null;
      let conditionUnassigned = null;
      filterValue.map((obj) => {
        if (obj.parentTitle == "Date Filter") {
          if (obj.title === "Date Assigned") {
            conditionAssigned = conditionAssigned
              ? conditionAssigned +
              " || client.preWeddingDetails?.shootStartDate && client.preWeddingDetails?.shootEndDate"
              : "client.preWeddingDetails?.shootStartDate && client.preWeddingDetails?.shootEndDate";
          } else if (obj.title === "Date Unassigned") {
            conditionUnassigned = conditionUnassigned
              ? conditionUnassigned +
              " || !client.preWeddingDetails?.shootStartDate && !client.preWeddingDetails?.shootEndDat"
              : " !client.preWeddingDetails?.shootStartDate && !client.preWeddingDetails?.shootEndDat";
          }
        }
      });
      let finalCond = null;
      if (conditionAssigned) {
        if (conditionUnassigned) {
          finalCond =
            "(" +
            conditionAssigned +
            ")" +
            " || " +
            "(" +
            conditionUnassigned +
            ")";
        } else {
          finalCond = "(" + conditionAssigned + ")";
        }
      } else {
        finalCond = "(" + conditionUnassigned + ")";
      }
      setFilterCondition(finalCond);
      const newData = preWedClients.filter((client) => eval(finalCond));
      setClientsForShow(newData);
    } else {
      setClientsForShow(preWedClients);
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

  const handleSaveData = async (index) => {
    try {
      const client = clientsForShow[index];
      setUpdatingIndex(index);
      await addPreWedData(client);
      client.preWeddingDetails?.photographers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "Pre-Wed Shoot",
              data: client,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: client._id,
            },
          },
        });
      });
      client.preWeddingDetails?.cinematographers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "Pre-Wed Shoot",
              data: client,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: client._id,
            },
          },
        });
      });
      client.preWeddingDetails?.assistants?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "Pre-Wed Shoot",
              data: client,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: client._id,
            },
          },
        });
      });
      client.preWeddingDetails?.droneFlyers?.forEach((userObj) => {
        dispatch({
          type: "SOCKET_EMIT_EVENT",
          payload: {
            event: "add-notification",
            data: {
              notificationOf: "Pre-Wed Shoot",
              data: client,
              forManager: false,
              forUser: userObj._id,
              read: false,
              dataId: client._id,
            },
          },
        });
      });
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  const rangeRef = useRef(null);

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

  return (
    <>
      <ClientHeader
        priority={priority}
        applyFilter={applyFilterNew}
        options={filterOptions}
        filter={currentUser?.rollSelect == "Manager" || currentUser?.rollSelect == "Production Manager"}
        title="Pre-Wedding"
      />
      {clientsForShow ? (
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
                  <div className="d-flex align-items-center">
                    <img alt="" src={CalenderImg} onClick={toggle} />
                    <GrPowerReset
                      className="mx-1"
                      onClick={() => {
                        setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
                        setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
                        setMonthForData(months[currentDate.getMonth()] + " " + currentDate.getFullYear());
                        setUpdateData(!updateData);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
          >
            <ToastContainer />
            <Table
              hover
              bordered
              responsive
              style={{ width: "150%", marginTop: "15px" }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 101 }} >

                <tr className="logsHeader Text16N1">
                  <th className="tableBody sticky-column-prewed">Couple</th>
                  <th className="tableBody ">Wedding Date</th>
                  <th className="tableBody">Photographers</th>
                  <th className="tableBody">Cinematographers</th>
                  <th className="tableBody">Assistants</th>
                  <th className="tableBody">Drone Flyers</th>
                  <th className="tableBody">Shoot Date</th>
                  <th className="tableBody">Status</th>
                  {(currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") && (
                    <th className="tableBody">Save</th>
                  )}
                </tr>

              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: "center",
                  borderWidth: "1px 1px 1px 1px",
                }}
              >
                {clientsForShow?.map((client, index) => {
                  return (
                    <>
                      {(currentUser?.rollSelect === "Manager" || currentUser?.rollSelect === "Production Manager") && (
                        <tr
                          key={index}
                          style={{
                            background: index % 2 === 0 ? "" : "#F6F6F6",
                          }}
                        >
                          <td className="tableBody Text14Semi sticky-column-prewed primary2 tablePlaceContent">
                            {client.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {client.groomName}
                          </td>
                          <td className="tableBody Text14Semi  primary2 tablePlaceContent">
                            <>
                              {dayjs(
                                client.events.find(
                                  (event) => event.isWedding === true
                                )?.eventDate
                              ).format("DD-MMM-YYYY")}
                              <br />
                            </>
                          </td>
                          {/* <td className="tableBody Text14Semi primary2">
                            {client.userID?.firstName}{' '}{client.userID?.lastName}
                          </td> */}
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              fromPreWed={true}
                              preWedDetails={
                                preWedClients[index]?.preWeddingDetails
                              }
                              allowedPersons={client.preWedphotographers}
                              usersToShow={photographer}
                              message="phtotographer"
                              existedUsers={
                                client?.preWeddingDetails?.photographers || []
                              }
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails =
                                  { ...client.preWeddingDetails } || {};
                                updatedClients[
                                  index
                                ].preWeddingDetails.photographers =
                                  Array.isArray(
                                    client?.preWeddingDetails?.photographers
                                  )
                                    ? [
                                      ...client?.preWeddingDetails
                                        ?.photographers,
                                      userObj,
                                    ]
                                    : [userObj];
                                setPreWedClients(updatedClients);
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (
                                  updatedClients[index].preWeddingDetails
                                    ?.photographers
                                ) {
                                  updatedClients[
                                    index
                                  ].preWeddingDetails.photographers =
                                    updatedClients[
                                      index
                                    ].preWeddingDetails.photographers.filter(
                                      (photographer) =>
                                        photographer._id !== userObj._id
                                    );
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(
                              client?.preWeddingDetails?.photographers
                            ) &&
                              client?.preWeddingDetails?.photographers?.map(
                                (photographer) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {photographer.firstName}{" "}
                                      {photographer.lastName}
                                    </p>
                                  );
                                }
                              )}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              fromPreWed={true}
                              message="cinematographer"
                              preWedDetails={
                                preWedClients[index]?.preWeddingDetails
                              }
                              allowedPersons={client?.preWedcinematographers}
                              usersToShow={cinematographer}
                              existedUsers={
                                client?.preWeddingDetails?.cinematographers ||
                                []
                              }
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails =
                                  { ...client.preWeddingDetails } || {};
                                updatedClients[
                                  index
                                ].preWeddingDetails.cinematographers =
                                  Array.isArray(
                                    client?.preWeddingDetails?.cinematographers
                                  )
                                    ? [
                                      ...client?.preWeddingDetails
                                        ?.cinematographers,
                                      userObj,
                                    ]
                                    : [userObj];
                                setPreWedClients(updatedClients);
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (
                                  updatedClients[index].preWeddingDetails
                                    ?.cinematographers
                                ) {
                                  updatedClients[
                                    index
                                  ].preWeddingDetails.cinematographers =
                                    updatedClients[
                                      index
                                    ].preWeddingDetails.cinematographers.filter(
                                      (cinematographer) =>
                                        cinematographer._id !== userObj._id
                                    );
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(
                              client?.preWeddingDetails?.cinematographers
                            ) &&
                              client?.preWeddingDetails?.cinematographers?.map(
                                (cinematographer) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {cinematographer.firstName}{" "}
                                      {cinematographer.lastName}
                                    </p>
                                  );
                                }
                              )}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              fromPreWed={true}
                              message="assistant"
                              preWedDetails={
                                preWedClients[index]?.preWeddingDetails
                              }
                              allowedPersons={client?.preWedassistants}
                              usersToShow={assistant}
                              existedUsers={
                                client?.preWeddingDetails?.assistants || []
                              }
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails =
                                  { ...client.preWeddingDetails } || {};
                                updatedClients[
                                  index
                                ].preWeddingDetails.assistants = Array.isArray(
                                  client?.preWeddingDetails?.assistants
                                )
                                    ? [
                                      ...client?.preWeddingDetails?.assistants,
                                      userObj,
                                    ]
                                    : [userObj];
                                setPreWedClients(updatedClients);
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (
                                  updatedClients[index].preWeddingDetails
                                    ?.assistants
                                ) {
                                  updatedClients[
                                    index
                                  ].preWeddingDetails.assistants =
                                    updatedClients[
                                      index
                                    ].preWeddingDetails.assistants.filter(
                                      (assistant) =>
                                        assistant._id !== userObj._id
                                    );
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(
                              client?.preWeddingDetails?.assistants
                            ) &&
                              client?.preWeddingDetails?.assistants?.map(
                                (assistant) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {assistant.firstName} {assistant.lastName}
                                    </p>
                                  );
                                }
                              )}
                          </td>

                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <ShootDropDown
                              teble={true}
                              fromPreWed={true}
                              message="drone flyer"
                              preWedDetails={
                                preWedClients[index]?.preWeddingDetails
                              }
                              allowedPersons={client?.preWeddrones}
                              usersToShow={flyer}
                              existedUsers={
                                client?.preWeddingDetails?.droneFlyers || []
                              }
                              userChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                client.preWeddingDetails =
                                  { ...client.preWeddingDetails } || {};
                                updatedClients[
                                  index
                                ].preWeddingDetails.droneFlyers = Array.isArray(
                                  client?.preWeddingDetails?.droneFlyers
                                )
                                    ? [
                                      ...client?.preWeddingDetails?.droneFlyers,
                                      userObj,
                                    ]
                                    : [userObj];
                                setPreWedClients(updatedClients);
                              }}
                              userUnChecked={(userObj) => {
                                const updatedClients = [...preWedClients];
                                if (
                                  updatedClients[index].preWeddingDetails
                                    ?.droneFlyers
                                ) {
                                  updatedClients[
                                    index
                                  ].preWeddingDetails.droneFlyers =
                                    updatedClients[
                                      index
                                    ].preWeddingDetails.droneFlyers.filter(
                                      (flyer) => flyer._id !== userObj._id
                                    );
                                }
                                setPreWedClients(updatedClients);
                              }}
                            />
                            {Array.isArray(
                              client?.preWeddingDetails?.droneFlyers
                            ) &&
                              client?.preWeddingDetails?.droneFlyers?.map(
                                (flyer) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {flyer.firstName} {flyer.lastName}
                                    </p>
                                  );
                                }
                              )}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <div className="d-flex flex-column position-relative">
                              {client?.preWeddingDetails?.shootStartDate &&
                                client?.preWeddingDetails?.shootEndDate && (
                                  <>
                                    <p className="mb-0">
                                      {dayjs(
                                        client?.preWeddingDetails
                                          ?.shootStartDate
                                      ).format("DD-MMM-YYYY")}
                                    </p>
                                    <p className=" text-center mb-0 my-1">TO</p>
                                    <p className=" mb-0">
                                      {dayjs(
                                        client?.preWeddingDetails?.shootEndDate
                                      ).format("DD-MMM-YYYY")}
                                    </p>
                                  </>
                                )}
                              <div ref={rangeRef}>
                                <div
                                  onClick={() =>
                                    setRangeFor(rangeFor === index ? -1 : index)
                                  }
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <img
                                    style={{ cursor: "pointer" }}
                                    alt=""
                                    src={Edit}
                                  />
                                </div>

                                {rangeFor === index && (
                                  <div
                                    style={{
                                      zIndex: 200,
                                      top: client?.preWeddingDetails
                                        ?.shootStartDate
                                        ? "90px"
                                        : "30px",
                                      right: "0px",
                                      transition: "0.5s ease-in-out",
                                    }}
                                    className={`position-absolute transition-calendar ${rangeFor === index
                                      ? "fade-in"
                                      : "fade-out"
                                      }`}
                                  >
                                    <Calendar
                                      selectRange
                                      value={[
                                        client?.preWeddingDetails
                                          ?.shootStartDate
                                          ? new Date(
                                            client?.preWeddingDetails?.shootStartDate
                                          )
                                          : new Date(),
                                        client?.preWeddingDetails?.shootEndDate
                                          ? new Date(
                                            client?.preWeddingDetails?.shootEndDate
                                          )
                                          : new Date(),
                                      ]}
                                      onChange={(value) => {
                                        const updatedClients = [
                                          ...preWedClients,
                                        ];
                                        updatedClients[
                                          index
                                        ].preWeddingDetails =
                                          client.preWeddingDetails || {};
                                        updatedClients[
                                          index
                                        ].preWeddingDetails.shootStartDate =
                                          dayjs(new Date(value[0])).format(
                                            "YYYY-MM-DD"
                                          );
                                        updatedClients[
                                          index
                                        ].preWeddingDetails.shootEndDate =
                                          dayjs(new Date(value[1])).format(
                                            "YYYY-MM-DD"
                                          );
                                        setPreWedClients(updatedClients);
                                        setRangeFor(-1);
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {currentUser?.rollSelect === "Manager" ? (
                              <Select
                                value={
                                  client.preWeddingDetails?.status
                                    ? {
                                      value:
                                        client?.preWeddingDetails?.status,
                                      label:
                                        client?.preWeddingDetails?.status,
                                    }
                                    : {
                                      value: "Unassigned",
                                      label: "Unassigned",
                                    }
                                }
                                name="preWeddingDetailsStatus"
                                onChange={(selected) => {
                                  const updatedClients = [...preWedClients];
                                  updatedClients[index].preWeddingDetails =
                                    client.preWeddingDetails || {};
                                  updatedClients[
                                    index
                                  ].preWeddingDetails.status = selected.value;
                                  setPreWedClients(updatedClients);
                                }}
                                styles={customStyles}
                                options={[
                                  { value: "Unassigned", label: "Unassigned" },
                                  { value: "Assigned", label: "Assigned" },
                                  { value: "Shot", label: "Shot" },
                                  { value: "Delivered", label: "Delivered" },
                                ]}
                                required
                              />
                            ) : (
                              <>
                                {client.preWeddingDetails?.status ||
                                  "Not Filled"}
                              </>
                            )}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <button
                              style={{
                                backgroundColor: "#FFDADA",
                                borderRadius: "5px",
                                border: "none",
                                height: "30px",
                              }}
                              onClick={() =>
                                updatingIndex == null && handleSaveData(index)
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
                      {(currentUser?.rollSelect === "Shooter" || currentUser?.rollSelect === "Shooter") && (
                        <tr
                          key={index}
                          style={{
                            background: index % 2 === 0 ? "" : "#F6F6F6",
                          }}
                        >
                          <td className="tableBody Text14Semi sticky-column-prewed primary2 tablePlaceContent">
                            {client.brideName}
                            <br />
                            <img alt="" src={Heart} />
                            <br />
                            {client.groomName}
                          </td>
                          <td className="tableBody Text14Semi  primary2 tablePlaceContent">
                            <>
                              {dayjs(
                                client.events.find(
                                  (event) => event.isWedding === true
                                )?.eventDate
                              ).format("DD-MMM-YYYY")}
                              <br />
                            </>
                          </td>

                          <td className="tableBody Text14Semi primary2 tablePlaceContent">

                            {(Array.isArray(client?.preWeddingDetails?.photographers) && client?.preWeddingDetails?.photographers?.length > 0) ?
                              client?.preWeddingDetails?.photographers?.map(
                                (photographer) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {photographer.firstName}{" "}
                                      {photographer.lastName}
                                    </p>
                                  );
                                }
                              ) : "None"}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {(Array.isArray(client?.preWeddingDetails?.cinematographers) && client?.preWeddingDetails?.cinematographers?.length > 0) ?
                              client?.preWeddingDetails?.cinematographers?.map(
                                (cinematographer) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {cinematographer.firstName}{" "}
                                      {cinematographer.lastName}
                                    </p>
                                  );
                                }
                              ) : "None"}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {(Array.isArray(client?.preWeddingDetails?.assistants) && client?.preWeddingDetails?.assistants?.length > 0) ?
                              client?.preWeddingDetails?.assistants?.map(
                                (assistant) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {assistant.firstName} {assistant.lastName}
                                    </p>
                                  );
                                }
                              ) : "None"}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            {(Array.isArray(client?.preWeddingDetails?.droneFlyers) && client?.preWeddingDetails?.droneFlyers?.length > 0) ?
                              client?.preWeddingDetails?.droneFlyers?.map(
                                (flyer) => {
                                  return (
                                    <p
                                      style={{
                                        marginBottom: 0,
                                        fontFamily: "Roboto Regular",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {flyer.firstName} {flyer.lastName}
                                    </p>
                                  );
                                }
                              ) : "None"}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">
                            <div className="d-flex flex-column position-relative">
                              {(client?.preWeddingDetails?.shootStartDate &&
                                client?.preWeddingDetails?.shootEndDate) ? (
                                <>
                                  <p className="mb-0">
                                    {dayjs(
                                      client?.preWeddingDetails
                                        ?.shootStartDate
                                    ).format("DD-MMM-YYYY")}
                                  </p>
                                  <p className=" text-center mb-0 my-1">TO</p>
                                  <p className=" mb-0">
                                    {dayjs(
                                      client?.preWeddingDetails?.shootEndDate
                                    ).format("DD-MMM-YYYY")}
                                  </p>
                                </>
                              ) : "Not Set Yet"}

                            </div>
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent">

                            <>
                              {client.preWeddingDetails?.status ||
                                "Not Filled"}
                            </>

                          </td>

                        </tr>
                        // <tr
                        //   style={{
                        //     background: index % 2 === 0 ? "" : "#F6F6F6",
                        //   }}
                        // >
                        //   <td className="tableBody Text14Semi primary2 tablePlaceContent">
                        //     {client.brideName}
                        //     <br />
                        //     <img alt="" src={Heart} />
                        //     <br />
                        //     {client.groomName}
                        //   </td>
                        //   {/* <td className="tableBody Text14Semi primary2">
                        //     <>
                        //       {client.userID?.firstName}{' '}{client.userID?.lastName}
                        //     </>
                        //   </td> */}
                        //   <td className="tableBody Text14Semi primary2 tablePlaceContent">
                        //     <>
                        //       {client.preWeddingDetails?.shootStartDate
                        //         ? new Date(
                        //           client.preWeddingDetails.shootStartDate
                        //         )
                        //           .toISOString()
                        //           .split("T")[0]
                        //         : "Not Available"}{" "}
                        //       to{" "}
                        //       {client.preWeddingDetails?.shootStartDate
                        //         ? new Date(
                        //           client.preWeddingDetails.shootStartDate
                        //         )
                        //           .toISOString()
                        //           .split("T")[0]
                        //         : "Not Available"}
                        //     </>
                        //   </td>
                        //   <td className="tableBody Text14Semi primary2 tablePlaceContent">
                        //     <>{client.userRole}</>
                        //   </td>
                        //   <td className="tableBody Text14Semi primary2 tablePlaceContent">
                        //     <>
                        //       {client.preWeddingDetails?.status || "Not Filled"}
                        //     </>
                        //   </td>
                        // </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </Table>
            {loading && <Spinner />}
          
            
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
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default PreWedShootScreen;
