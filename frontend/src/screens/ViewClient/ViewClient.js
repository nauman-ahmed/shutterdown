import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import "../../assets/css/tableRoundHeader.css";
import Heart from "../../assets/Profile/Heart.svg";
import dayjs from "dayjs";
import { getAllClients, getClients } from "../../API/Client";
import { Overlay } from "react-bootstrap";
import Select from "react-select";
import CalenderImg from "../../assets/Profile/Calender.svg";
import { GrPowerReset } from "react-icons/gr";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { useAtom } from "jotai";
import {
  clientFilterDate,
  clientFilterMonth,
  clientFilterYear,
} from "../../redux/atoms";
import Spinner from "../../components/Spinner";
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

function ViewClient() {
  const navigate = useNavigate();
  const [ascendingWeding, setAscendingWeding] = useState(false);
  const [clients, setClients] = useState(null);
  const onPress = (clientId) => {
    navigate("/clients/view-client/particular-client/client-info/" + clientId);
  };
  const [allClients, setAllClients] = useState([]);
  const toggle = () => {
    setShow(!show);
  };
  const currentDate = new Date();
  const [startDate, setStartDate] = useState( localStorage.getItem("startDate") ? new Date(localStorage.getItem("startDate")) : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [endDate, setEndDate] = useState(localStorage.getItem("endDate") ? new Date(localStorage.getItem("endDate")) : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [monthForData, setMonthForData] = useState(
    localStorage.getItem("startDate") ?
    months[new Date(localStorage.getItem("startDate")).getMonth()] + " " + new Date(localStorage.getItem("startDate")).getFullYear()
    :months[new Date().getMonth()] + " " + new Date().getFullYear()
  );

  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [yearForData, setYearForData] = useAtom(clientFilterYear);
  const [filterClient, setFilterClient] = useState(null);
  const [updateData, setUpdateData] = useState(false);

  const fetchData = async () => {
    try {
      console.log("Fetching data with startDate:", startDate, "endDate:", endDate, "filterClient:", filterClient);
      setLoading(true);
      const data = await getClients(
        startDate,
        endDate,
        filterClient
      );
      setLoading(false);
      applySorting(data.data);
      const completeclients = await getAllClients();
      setAllClients(completeclients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [updateData, filterClient]);




  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "white" : "black",
      fontSize: "90%",
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

  const applySorting = (data = null) => {
    try {

      if (data == null) {
        const sorted = clients.sort((a, b) => {
          const client1 = a.events.filter(event => event.isWedding)
          const client2 = b.events.filter(event => event.isWedding)
          const dateA = client1.length ? new Date(client1[0].eventDate) : new Date()
          const dateB = client2.length ? new Date(client2[0].eventDate) : new Date()
          return !ascendingWeding ? dateB - dateA : dateA - dateB;
        });
        setClients(sorted);
        setAscendingWeding(!ascendingWeding);
      } else {
        const sorted = data.sort((a, b) => {
          const client1 = a.events.filter(event => event.isWedding)
          const client2 = b.events.filter(event => event.isWedding)
          const dateA = client1.length ? new Date(client1[0].eventDate) : new Date()
          const dateB = client2.length ? new Date(client2[0].eventDate) : new Date()
          return !ascendingWeding ? dateA - dateB : dateB - dateA;
        });
        setClients(sorted);
      }
    } catch (error) {
      console.log("applySorting ERROR", error);
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

  return (
    <>
      {clients ? (
        <>
          <div
            className=" ViewClient d-flex flex-row  mx-auto align-items-center"
            style={{ width: '460px', marginTop: '0px' }}
            ref={target}
          >
            <div className="w-100 d-flex flex-row align-items-center">
              <div className="w-50">
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
                        localStorage.removeItem("startDate");
                        localStorage.removeItem("endDate"); 
                        localStorage.removeItem("monthForData");
                      }}
                    />
                  </div>
                </div>
              </div>
              <Select
                className="w-50 mx-3"
                isSearchable={true}
                onChange={(e) =>
                  e.value !== "Reset"
                    ? setFilterClient(e.value)
                    : setFilterClient(null)
                }
                styles={customStyles}
                options={[
                  {
                    value: "Reset",
                    label: (
                      <div className="d-flex justify-content-around">
                        <strong>Reset</strong>
                      </div>
                    ),
                    brideName: "Reset",
                    groomName: "Reset",
                  },
                  ...Array.from(allClients)?.map((client) => {
                    return {
                      value: client._id,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{client.brideName}</span>
                          <img className="mx-1" alt="" src={Heart} />
                          <span>{client.groomName}</span>
                        </div>
                      ),
                      brideName: client.brideName,
                      groomName: client.groomName,
                    };
                  }),
                ]}
                required
                filterOption={(option, searchInput) => {
                  const { brideName, groomName } = option.data;
                  const searchText = searchInput?.toLowerCase();

                  // Perform search on both brideName and groomName
                  return (
                    brideName?.toLowerCase().startsWith(searchText) ||
                    groomName?.toLowerCase().startsWith(searchText)
                  );
                }}
              />
            </div>
          </div>
          <Table bordered hover responsive style={{ marginTop: "15px" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 0 }} >
              <tr className="logsHeader Text16N1">
                <th className="tableBody">Client</th>
                <th className="tableBody" style={{ width: "33%" }} onClick={() => applySorting()}>
                  Wedding Date
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
                <th className="tableBody">Payment Status</th>
                <th className="tableBody">Project Status</th>
              </tr>
            </thead>
            <tbody
              className="Text12 primary2"
              style={{
                textAlign: "center",
                borderWidth: "1px 1px 1px 1px",
                // background: "#EFF0F5",
              }}
            >
              {clients?.map((client, i) => (
                <>

                  <tr
                    key={i}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                    }}
                    className="clientrow"
                  // onClick={() => onPress(client._id)}
                  >
                    <a
                      href={`/clients/view-client/particular-client/client-info/${client._id}`} // Link for right-click "Open in new tab"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior (page reload)
                        onPress(client._id); // Use your existing navigation function
                      }}
                      style={{
                        display: "contents", // Makes the <a> tag behave like it's not there, so the row layout stays intact
                        textDecoration: "none", // Remove underline
                        color: "inherit", // Inherit text color
                        
                      }}
                    >
                      <td
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          width: "33%",
                        }}
                        className="tableBody Text14Semi primary2 textPrimary"
                      >
                        {client.brideName}
                        <br />
                        <img alt="" src={Heart} />
                        <br />
                        {client.groomName}
                      </td>

                      <td
                        className="tableBody Text14Semi primary2 textPrimary tablePlaceContent"
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          width: "33%",
                        }}
                      >
                        {" "}
                        {client.events?.filter((event) => event.isWedding)
                          ?.length !== 0 ? (
                          <>
                            {client.events.find(
                              (eventData) => eventData.isWedding
                            ) && (
                                <p className="mb-0">
                                  {dayjs(
                                    client.events.find(
                                      (eventData) => eventData.isWedding
                                    ).eventDate
                                  ).format("DD-MMM-YYYY")}
                                </p>
                              )}
                          </>
                        ) : (
                          "Not Defined"
                        )}
                      </td>
                      <td
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                        className="tableBody Text14Semi primary2 textPrimary tablePlaceContent"
                      >
                        {client.paymentStatus}

                      </td>
                      <td
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                        className="tableBody Text14Semi primary2 textPrimary tablePlaceContent"
                      >
                        {client.projectStatus}

                      </td>
                    </a>
                  </tr>
                  <div style={{ marginTop: "15px" }} />
                </>
              ))}
            </tbody>
          </Table>
          {loading && <Spinner />}

          <Overlay
            rootClose={true}
            onHide={() => { setShow(false); setUpdateData(!updateData); }}
            target={target.current}
            show={show}
            placement="bottom"
          >
            <div style={{ width: "300px", zIndex: 102}}>
              <RangeCalendarFilter startDate={startDate} updateStartDate={setStartDate} setMonthForData={setMonthForData} endDate={endDate} updateEndDate={setEndDate}/>
            </div>
          </Overlay>
        </>
      ) : <Spinner />}
    </>
  );
}

export default ViewClient;
