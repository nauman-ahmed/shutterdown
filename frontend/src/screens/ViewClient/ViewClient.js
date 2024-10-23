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
import CalenderMultiListView from "../../components/CalendarFilterListView";
import { useAtom } from "jotai";
import {
  clientFilterDate,
  clientFilterMonth,
  clientFilterYear,
} from "../../redux/atoms";
import Spinner from "../../components/Spinner";

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
  const [clients, setClients] = useState(null);
  const onPress = (clientId) => {
    navigate("/MyProfile/Client/ParticularClient/ClientInfo/" + clientId);
  };
  const [allClients, setAllClients] = useState([]);
  const toggle = () => {
    setShow(!show);
  };
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [dateForFilter, setDateForFilter] = useAtom(clientFilterDate);
  const [monthForData, setMonthForData] = useAtom(clientFilterMonth);
  const [yearForData, setYearForData] = useAtom(clientFilterYear);
  const [filterClient, setFilterClient] = useState(null);
  const [updateData, setUpdateData] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getClients(
        1,
        monthForData,
        yearForData,
        dateForFilter,
        filterClient
      );

      setClients(data.data);
      const completeclients = await getAllClients();
      setAllClients(completeclients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setHasMore(true);
    setPage(2);
    fetchData();
  }, [updateData, filterClient]);

  const fetchClients = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const data = await getClients(
          page,
          monthForData,
          yearForData,
          dateForFilter,
          null
        );
        if (data.data.length > 0) {
          setClients([...clients, ...data.data]);
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
    if (clients?.length < 10 && hasMore && !loading && !filterClient) {
      fetchClients();
    }
  }, [clients, hasMore, loading]);

  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;
    if (bottomOfWindow) {
      fetchClients();
    }
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [handleScroll]);

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

  return (
    <>
      {clients ? (
        <>
          <div
            className="widthForFilters ViewClient d-flex flex-row  mx-auto align-items-center"
            style={{}}
            ref={target}
          >
            <div className="w-100 d-flex flex-row align-items-center">
              <div className="w-50">
                <div
                  className={`forminput R_A_Justify1`}
                  style={{ cursor: "pointer" }}
                >
                  <div onClick={toggle}>
                    {dateForFilter ? (
                      dayjs(dateForFilter).format("DD-MMM-YYYY")
                    ) : (
                      <>
                        {monthForData} {yearForData}
                      </>
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    <img alt="" src={CalenderImg} onClick={toggle} />
                    <GrPowerReset
                      className="mx-1"
                      onClick={() => {
                        setDateForFilter(null);
                        setMonthForData(months[new Date().getMonth()]);
                        setYearForData(new Date().getFullYear());
                        setUpdateData(!updateData);
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
            <thead>
              <tr className="logsHeader Text16N1">
                <th className="tableBody">Client</th>
                <th className="tableBody" style={{ width: "33%" }}>
                  Wedding Date
                </th>
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
                      background: "#EFF0F5",
                      borderRadius: "8px",
                    }}
                    onClick={() => onPress(client._id)}
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
                  </tr>
                  <div style={{ marginTop: "15px" }} />
                </>
              ))}
            </tbody>
          </Table>
          {loading && <Spinner/>}
          {!hasMore && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <div>No more data to load.</div>
            </div>
          )}
          {!loading && hasMore && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <button
                onClick={() => fetchClients()}
                className="btn btn-primary"
                style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
              >
                Load More
              </button>
            </div>
          )}
          <Overlay
            rootClose={true}
            onHide={() => {setShow(false); setUpdateData(!updateData);}}
            target={target.current}
            show={show}
            placement="bottom"
          >
            <div style={{ width: "300px" }}>
              <CalenderMultiListView
                monthForData={monthForData}
                dateForFilter={dateForFilter}
                yearForData={yearForData}
                setShow={setShow}
                setMonthForData={setMonthForData}
                setYearForData={setYearForData}
                setDateForFilter={setDateForFilter}
              />
            </div>
          </Overlay>
        </>
      ) : <Spinner/>}
    </>
  );
}

export default ViewClient;
