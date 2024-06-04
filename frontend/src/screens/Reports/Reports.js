import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import { getAllTasks } from "../../API/TaskApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ClientHeader from "../../components/ClientHeader";

function Reports(props) {
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState(null);
  const [tasksToShow, setTasksToShow] = useState(null);
  const currentUser =
    Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));
  const [filterBy, setFilterBy] = useState(null);

  const getTaskData = async () => {
    try {
      const tasks = await getAllTasks();
      setAllTasks(tasks);
      setTasksToShow(tasks)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentUser);
    if (
      currentUser.rollSelect === "Editor" ||
      currentUser.rollSelect === "Shooter"
    ) {
      navigate("/MyProfile/Tasks/DailyTasks");
    }
    getTaskData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsersForFilters = (propertyName) => {
    const seenUsers = new Set();
    return allTasks
      ?.map((taskObj, i) => ({
        title: `${taskObj?.[propertyName]?.firstName} ${taskObj?.[propertyName]?.lastName}`,
        id: i,
        userId: taskObj?.[propertyName]?._id,
      }))
      .filter((taskObj) => {
        if (taskObj.userId && !seenUsers.has(taskObj.userId)) {
          seenUsers.add(taskObj.userId);
          return true;
        }
        return false;
      });
  };
  const filterOptions = [
    {
      title: "Assign By",
      id: 1,
      filters: getUsersForFilters("assignBy"),
    },
    {
      title: "Assign To",
      id: 2,
      filters: getUsersForFilters("assignTo"),
    },
  ];

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      setTasksToShow(allTasks);
    }
    setFilterBy(filterType);
  };

  const applyFilter = (filterValue) => {
    // setTaksToShow(null);
    if(filterValue == null){
      setTasksToShow(allTasks)
      return
    }
    if (filterBy === "Assign By") {
      setTasksToShow(
        allTasks.filter((task) => task.assignBy._id === filterValue.userId)
      );
    } else if (filterBy === "Assign To") {
      setTasksToShow(
        allTasks.filter((task) => task.assignTo._id === filterValue.userId)
      );
    }
  };

  return (
    <>
      <ClientHeader
        selectFilter={changeFilter}
        currentFilter={filterBy}
        applyFilter={applyFilter}
        options={filterOptions}
        title="Reports"
        filter
      />
      {tasksToShow ? (
        <Table
          bordered
          hover
          borderless
          responsive
          // striped
          className="tableViewClient"
          style={{ width: "130%", marginTop: "15px" }}
        >
          <thead>
            <tr className="logsHeader Text16N1">
              <th className="tableBody">Client</th>
              <th className="tableBody">Task</th>
              <th className="tableBody">Task Assigned Date</th>
              <th className="tableBody">Assigned By</th>
              <th className="tableBody">Assigned To</th>
              <th className="tableBody">Status</th>
              <th className="tableBody">Deadline</th>
              <th className="tableBody">Completion Date</th>
              <th className="tableBody">Task Ended</th>
              <th className="tableBody">Delays</th>
            </tr>
          </thead>
          <tbody
            className="Text12"
            style={{
              textAlign: "center",
              borderWidth: "0px 1px 0px 1px",
              // background: "#EFF0F5",
            }}
          >
            {tasksToShow?.map((task, index) => (
              <>
                <div style={{ marginTop: "15px" }} />
                <tr
                  style={{
                    background: "#EFF0F5",
                    borderRadius: "8px",
                  }}
                >
                  <td
                    className="tableBody Text14Semi primary2 tablePlaceContent"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.client.brideName}
                    <br />
                    <img src={Heart} alt="" />
                    <br />
                    {task.client.groomName}
                  </td>

                  <td
                    className="tableBody Text14Semi primary2 tablePlaceContent"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.taskName}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2 tablePlaceContent"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {dayjs(task.assignDate).format("DD-MMM-YYYY")}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2 tablePlaceContent"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.assignBy.firstName} {task.assignBy.lastName}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2 tablePlaceContent"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.assignTo.firstName} {task.assignTo.lastName}
                  </td>
                  <td
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
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
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

export default Reports;
