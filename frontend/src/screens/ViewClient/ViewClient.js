import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import "../../assets/css/tableRoundHeader.css";
import Heart from "../../assets/Profile/Heart.svg";
import dayjs from "dayjs";
import { getAllClients, getClients } from "../../API/Client";
import { Overlay } from "react-bootstrap";
import Calendar from "react-calendar";
import Select from "react-select";
import CalenderImg from "../../assets/Profile/Calender.svg";
import CalenderMulti from "../../components/Calendar";
import { GrPowerReset } from "react-icons/gr";
import CalenderMultiListView from "../../components/CalendarFilterListView";
import { useAtom } from "jotai";
import { clientFilterDate, clientFilterMonth, clientFilterYear } from "../../redux/atoms";
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']

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
  const [hasMore, setHasMore] = useState(true);
  const [dateForFilter, setDateForFilter] = useAtom(clientFilterDate)
  const [monthForData, setMonthForData] = useAtom(clientFilterMonth)
  const [yearForData, setYearForData] = useAtom(clientFilterYear)
  const [appliedFilterBride, setAppliedFilterBride] = useState(null)


  const fetchData = async () => {
    try {
      const data = await getClients(1, monthForData, yearForData, dateForFilter);
      setClients(data.data);
      
      const completeclients = await getAllClients()
      const seenClients = new Set()
      const uniqueClients = completeclients.filter(client => {
        if (client.brideName && !seenClients?.has(client.brideName)) {
          seenClients.add(client.brideName)
          return true
        } else {
          return false
        }
      });

      setAllClients(uniqueClients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setHasMore(true)
    setPage(2)
    fetchData();
  }, [monthForData, yearForData, dateForFilter]);

  const fetchClients = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const data = await getClients(page, monthForData, yearForData, dateForFilter);
        console.log(data);
        
        if (data.data.length > 0) {

          if (dateForFilter) {
            console.log('apply8ing date filter');
            
            const clientsToAdd = data.data.filter((clientData) => {
              return clientData.events.some(
                (eventData) =>
                  new Date(eventData.eventDate).getTime() >=
                  new Date(dateForFilter).getTime() &&
                  new Date(eventData.eventDate).getTime() <=
                  new Date(dateForFilter).getTime()
              );
            });
            setClients([...clients, ...clientsToAdd]);
          } else {
            console.log(data.data);
            
            setClients([...clients, ...data.data]);
          }
          filterByNameHanler(appliedFilterBride)
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

  const filterByNameHanler = (brideName) => {
   
    
    if (brideName == "Reset" ) {
      setAppliedFilterBride(null)
      setMonthForData(months[new Date().getMonth()])
      setYearForData(new Date().getFullYear())
      setDateForFilter(null)
      fetchData()
      return;
    } else if(brideName === null || brideName === undefined){
      
      return
    }
    const seperator = "<";
    brideName = brideName?.split(seperator)[0];
    setAppliedFilterBride(brideName)
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
                  {dateForFilter
                    ? dayjs(dateForFilter).format("DD-MMM-YYYY")
                    : <>{monthForData}  {yearForData}</>}
                  <div className="d-flex align-items-center">
                    <img alt="" src={CalenderImg} onClick={toggle} />
                    <GrPowerReset
                      className="mx-1"
                      onClick={() => {
                        setDateForFilter(null)
                        setMonthForData(months[new Date().getMonth()])
                        setYearForData(new Date().getFullYear())
                       
                      }}
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
                  ...Array.from(allClients)?.map((client) => {
                    return {
                      value: client.brideName + "<" + client.groomName,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{client.brideName}</span>
                          <img className="mx-1" alt="" src={Heart} />
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
                    > {(client.events?.filter(event => event.isWedding))?.length !== 0 ? (
                      <>
                        {client.events.find(eventData => eventData.isWedding) && (
                          <p className="mb-0">
                            {dayjs(client.events.find(eventData => eventData.isWedding).eventDate).format("DD-MMM-YYYY")}
                          </p>
                        )}
                      </>
                    ) : (
                      'Not Defined'
                    )}
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
              <CalenderMultiListView monthForData={monthForData} dateForFilter={dateForFilter}  yearForData={yearForData} setShow={setShow} setMonthForData={setMonthForData} setYearForData={setYearForData} setDateForFilter={setDateForFilter} />
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
