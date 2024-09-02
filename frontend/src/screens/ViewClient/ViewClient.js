import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import "../../assets/css/tableRoundHeader.css";
import Heart from "../../assets/Profile/Heart.svg";
import dayjs from "dayjs";
import { getClients } from "../../API/Client";
import { Overlay } from "react-bootstrap";
import Calendar from "react-calendar";
import Select from "react-select";
import CalenderImg from "../../assets/Profile/Calender.svg";
import CalenderMulti from "../../components/Calendar";
import { GrPowerReset } from "react-icons/gr";

function ViewClient() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(null);
  const onPress = (clientId) => {
    navigate("/MyProfile/Client/ParticularClient/ClientInfo/" + clientId);
  };
  const [allClients, setAllClients] = useState();
  const toggle = () => {
    setShow(!show);
  };
  const [filteringDay, setFilteringDay] = useState(null);
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const filterByDates = (
    startDate = null,
    endDate = null,
    view = null,
    reset = false
  ) => {
    if (reset) {
      setShow(false);
      setClients(allClients);
      setFilterStartDate(null);
      setFilterEndDate(null);
      setFilteringDay(null);
      return;
    } else if (view !== "month" && view !== "year") {
      setShow(false);
    }
    setFilteringDay(startDate);
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setClients(
      allClients.filter((clientData) => {
        return clientData.events.some(
          (eventData) =>
            new Date(eventData.eventDate).getTime() >=
              new Date(startDate).getTime() &&
            new Date(eventData.eventDate).getTime() <=
              new Date(endDate).getTime()
        );
      })
    );
  };

  const fetchData = async () => {
    try {
      const data = await getClients(page);
      setClients(data);
      setAllClients(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchClients = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const data = await getClients(page === 1 ? page + 1 : page);
        if (data.length > 0) {
          setAllClients([...allClients, ...data]);
          if (filterStartDate && filterEndDate) {
            const clientsToAdd = data.filter((clientData) => {
              return clientData.events.some(
                (eventData) =>
                  new Date(eventData.eventDate).getTime() >=
                    new Date(filterStartDate).getTime() &&
                  new Date(eventData.eventDate).getTime() <=
                    new Date(filterEndDate).getTime()
              );
            });
            setClients([...clients, ...clientsToAdd]);
          } else {
            setClients([...clients, ...data]);
          }

          setPage(page + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clients?.length < 10 && hasMore && !loading) {
      fetchClients();
    }
  }, [clients]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;

    if (bottomOfWindow) {
      fetchClients();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
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

  const filterByNameHanler = (brideName) => {
    if (brideName == "Reset") {
      setClients(allClients);
      return;
    }
    const seperator = "<";
    brideName = brideName.split(seperator)[0];
    setClients(
      allClients.filter((clientData) => {
        return clientData.brideName == brideName;
      })
    );
  };

  return (
    <>
      {clients ? (
        <>
          <div
            className="widthForFilters d-flex flex-row  mx-auto align-items-center"
            style={{}}
            ref={target}
          >
            <div className="w-100 d-flex flex-row align-items-center">
              <div className="w-50">
                <div
                  className={`forminput R_A_Justify1`}
                  style={{ cursor: "pointer" }}
                >
                  {filteringDay
                    ? dayjs(filteringDay).format("DD-MMM-YYYY")
                    : "Date"}
                  <div className="d-flex align-items-center">
                    <img alt="" src={CalenderImg} onClick={toggle} />
                    <GrPowerReset
                      className="mx-1"
                      onClick={() => filterByDates(null, null, null, true)}
                    />
                  </div>
                </div>
              </div>
              <Select
                className="w-50 mx-3"
                isSearchable={true}
                onChange={(e) => filterByNameHanler(e.value)}
                styles={customStyles}
                options={[
                  {
                    value: "Reset",
                    label: (
                      <div className="d-flex justify-content-around">
                        <strong>Reset</strong>
                      </div>
                    ),
                  },
                  ...allClients?.map((client) => {
                    return {
                      value: client.brideName + "<" + client.groomName,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{client.brideName}</span>{" "}
                          <img alt="" src={Heart} />{" "}
                          <span>{client.groomName}</span>
                        </div>
                      ),
                    };
                  }),
                ]}
                required
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
                      {client.events.map((eventData) => {
                        return (
                          eventData.isWedding && (
                            <p className="mb-0">
                              {dayjs(eventData.eventDate).format("DD-MMM-YYYY")}
                            </p>
                          )
                        );
                      })}
                    </td>
                  </tr>
                  <div style={{ marginTop: "15px" }} />
                </>
              ))}
            </tbody>
          </Table>
          {loading && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <div class="spinner"></div>
            </div>
          )}
          {!hasMore && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <div>No more data to load.</div>
            </div>
          )}
          <Overlay
            rootClose={true}
            onHide={() => setShow(false)}
            target={target.current}
            show={show}
            placement="bottom"
          >
            <div style={{ width: "300px" }}>
              <CalenderMulti filterByDates={filterByDates} />
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

export default ViewClient;
