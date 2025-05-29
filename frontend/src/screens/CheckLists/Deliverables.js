import React, { useEffect, useRef, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import { getClients, updateClient } from "../../API/Client";
import Select from "react-select";
import CalenderImg from "../../assets/Profile/Calender.svg";
import { Overlay } from "react-bootstrap";
import dayjs from "dayjs";
import { GrPowerReset } from "react-icons/gr";
import CalenderMultiListView from "../../components/CalendarFilterListView";
import Spinner from "../../components/Spinner";
import RangeCalendarFilter from "../../components/common/RangeCalendarFilter";
import ClientHeader from "../../components/ClientHeader";


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

function ChecklistDeliverables(props) {
  const [allClients, setAllClients] = useState(null);
  const [dateForFilter, setDateForFilter] = useState(null);
  const [monthForData, setMonthForData] = useState(
    months[new Date().getMonth()] + " " + new Date().getFullYear()
  );
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [yearForData, setYearForData] = useState(new Date().getFullYear());
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [updateData, setUpdateData] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const [clientsForShow, setClientsForShow] = useState(null);

  const target = useRef(null);
  const [show, setShow] = useState(false);
  // useEffect(() => {
  //   setClientsForShow(allClients);
  // }, [allClients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const clients = await getClients(
        startDate,
        endDate,
        null
      );

      setClientsForShow(clients.data);
      setHasMore(clients.hasMore);
      setPage(2);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    fetchClients();
  }, [updateData]);

  const fetchClientsAgain = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const data = await getClients(
          startDate,
          endDate,
          null
        );
        console.log(data);

        if (data.data.length > 0) {
          if (dateForFilter) {
            const clientsToAdd = data.data.filter((clientData) => {
              return clientData.events.some(
                (eventData) =>
                  new Date(eventData.eventDate).getTime() >=
                  new Date(dateForFilter).getTime() &&
                  new Date(eventData.eventDate).getTime() <=
                  new Date(dateForFilter).getTime()
              );
            });
            setClientsForShow([...clientsForShow, ...clientsToAdd]);
          } else {
            setClientsForShow([...clientsForShow, ...data.data]);
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
    if (clientsForShow?.length < 10 && hasMore && !loading) {
      fetchClientsAgain();
    }
  }, [clientsForShow, hasMore, loading]);


  const handleSaveData = async (index) => {
    try {
      const client = clientsForShow[index];
      setUpdatingIndex(index);
      await updateClient(client);
      setUpdatingIndex(null);
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
  return (
    <>
      <ClientHeader title="Client Deliveries" />
      {clientsForShow ? (
        <>
          <div
            className="widthForFilters d-flex flex-row  mx-auto align-items-center"
            ref={target}
          >
            <div className="w-100 d-flex flex-row align-items-center">
              <div className="w-75">
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
          <Table
            bordered
            hover
            // borderless
            responsive
            style={{ width: "100%", marginTop: "15px" }}
          >
            <thead  style={{ position: "sticky", top: 0 }} >
              <tr className="logsHeader Text16N1">
                <th className="tableBody sticky-column">Client</th>
                <th className="tableBody">Raw Photos</th>
                <th className="tableBody">Box</th>
                <th className="tableBody">Pen Drives</th>
                <th className="tableBody">Frames</th>
                <th className="tableBody">Save</th>
              </tr>
            </thead>
            <tbody
              className="Text12"
              style={{
                textAlign: "center",
                borderWidth: "1px 1px 1px 1px",
                // background: "#EFF0F5",
              }}
            >
              {clientsForShow?.map((client, index) => {
                return (
                  <>
                    <tr
                      style={{
                        borderRadius: "8px",
                      }}
                    >
                      <td
                        className="tableBody sticky-column Text14Semi primary2"
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                      >
                        {client.brideName}
                        <br />
                        <img src={Heart} alt="" />
                        <br />
                        {client.groomName}
                      </td>
                      <td className="tableBody">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                          <input
                            type="checkbox"
                            checked={client.rawPhotos || false}
                            onChange={(e) => {
                              const updatedClients = [...clientsForShow];
                              updatedClients[index] = {
                                ...updatedClients[index],
                                rawPhotos: e.target.checked
                              };
                              setClientsForShow(updatedClients);
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </td>
                      <td className="tableBody">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                          <input
                            type="checkbox"
                            checked={client.box || false}
                            onChange={(e) => {
                              const updatedClients = [...clientsForShow];
                              updatedClients[index] = {
                                ...updatedClients[index],
                                box: e.target.checked
                              };
                              setClientsForShow(updatedClients);
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </td>
                      <td className="tableBody">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                          <input
                            type="checkbox"
                            checked={client.penDrives || false}
                            onChange={(e) => {
                              const updatedClients = [...clientsForShow];
                              updatedClients[index] = {
                                ...updatedClients[index],
                                penDrives: e.target.checked
                              };
                              setClientsForShow(updatedClients);
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </td>
                      <td className="tableBody">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                          <input
                            type="checkbox"
                            checked={client.frames || false}
                            onChange={(e) => {
                              const updatedClients = [...clientsForShow];
                              updatedClients[index] = {
                                ...updatedClients[index],
                                frames: e.target.checked
                              };
                              setClientsForShow(updatedClients);
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </td>
                      <td className="tableBody pt-4">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSaveData(index)}
                          disabled={updatingIndex === index}
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
                  </>
                );
              })}
            </tbody>
          </Table>
          {loading && <Spinner />}
          {/* {!hasMore && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <div>No more data to load.</div>
            </div>
          )}
          {!loading && hasMore && (
            <div className="d-flex my-3 justify-content-center align-items-center">
              <button
                onClick={() => fetchClientsAgain()}
                className="btn btn-primary"
                style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
              >
                Load More
              </button>
            </div>
          )} */}
          <Overlay
            rootClose={true}
            onHide={() => { setShow(false); setUpdateData(!updateData) }}
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
          <div class="spinner"></div>
        </div>
      )}
    </>
  );
}

export default ChecklistDeliverables;