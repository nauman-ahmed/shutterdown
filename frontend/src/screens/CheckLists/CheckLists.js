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

function CheckLists(props) {
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
  useEffect(() => {
    setClientsForShow(allClients);
  }, [allClients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const clients = await getClients(
        1,
        startDate,
        endDate,
        null
      );
      setClientsForShow(clients.data);
      setHasMore(true);
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
          page,
          startDate,
          endDate,
          null
        );
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;

    if (bottomOfWindow) {
      fetchClientsAgain();
    }
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [handleScroll]);
  const yesNoOptions = [
    {
      label: "Yes",
      value: "Yes",
    },
    {
      label: "No",
      value: "No",
    },
  ];

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
      const client = allClients[index];
      setUpdatingIndex(index);
      await updateClient(client);
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
                        setMonthForData(months[currentDate.getMonth()]  + " " + currentDate.getFullYear());
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
            style={{ width: "120%", marginTop: "15px" }}
          >
            <thead>
              <tr className="logsHeader Text16N1">
                <th className="tableBody sticky-column">Client</th>
                <th className="tableBody">WhatsApp Group</th>
                <th className="tableBody">SOP Date</th>
                <th className="tableBody">Questionnaire Date</th>
                <th className="tableBody">Itinerary Status</th>
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
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          width: "170px",
                        }}
                      >
                        <Select
                          value={
                            client.checklistDetails?.whatsAppGroup
                              ? {
                                value:
                                  client?.checklistDetails?.whatsAppGroup,
                                label:
                                  client?.checklistDetails?.whatsAppGroup,
                              }
                              : null
                          }
                          onChange={(selected) => {
                            const updatedClients = [...allClients];
                            updatedClients[index].checklistDetails =
                              client.checklistDetails || {};
                            updatedClients[
                              index
                            ].checklistDetails.whatsAppGroup = selected.value;
                            setAllClients(updatedClients);
                          }}
                          styles={customStyles}
                          options={yesNoOptions}
                          required
                        />
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                      >
                        <input
                          type="Date"
                          onChange={(e) => {
                            const updatedClients = [...allClients];
                            updatedClients[index].checklistDetails =
                              client.checklistDetails || {};
                            updatedClients[index].checklistDetails.sopSentDate =
                              e.target.value;
                            setAllClients(updatedClients);
                          }}
                          style={{
                            border: "none",
                            BackgroundColor: "transparent",
                          }}
                          value={client?.checklistDetails?.sopSentDate}
                        />
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                      >
                        <input
                          type="Date"
                          onChange={(e) => {
                            const updatedClients = [...allClients];
                            updatedClients[index].checklistDetails =
                              client.checklistDetails || {};
                            updatedClients[
                              index
                            ].checklistDetails.questionsSentDate =
                              e.target.value;
                            setAllClients(updatedClients);
                          }}
                          style={{ border: "none" }}
                          value={client?.checklistDetails?.questionsSentDate}
                        />
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          width: "170px",
                        }}
                      >
                        <Select
                          value={
                            client.checklistDetails?.iternaryCollection
                              ? {
                                value:
                                  client?.checklistDetails
                                    ?.iternaryCollection,
                                label:
                                  client?.checklistDetails
                                    ?.iternaryCollection,
                              }
                              : null
                          }
                          onChange={(selected) => {
                            const updatedClients = [...allClients];
                            updatedClients[index].checklistDetails =
                              client.checklistDetails || {};
                            updatedClients[
                              index
                            ].checklistDetails.iternaryCollection =
                              selected.value;
                            setAllClients(updatedClients);
                          }}
                          styles={customStyles}
                          options={yesNoOptions}
                          required
                        />
                      </td>
                      <td className="tableBody Text14Semi Primary2">
                        <button
                          style={{
                            backgroundColor: "#FFDADA",
                            borderRadius: "5px",
                            border: "none",
                            height: "30px",
                          }}
                          onClick={() => handleSaveData(index)}
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
          {!hasMore && (
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
          )}
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

export default CheckLists;
