import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import ClientHeader from "../../components/ClientHeader";
import { getEditorTasks, getPendingTasks, updateTaskData } from "../../API/TaskApi";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

function DailyTasks(props) {
  const [allTasks, setAllTasks] = useState(null);
  const [tasksToShow, setTasksToShow] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const currentUser = JSON.parse(Cookies.get("currentUser"));

  const getTaskData = async () => {
    try {
      if (currentUser.rollSelect === "Manager") {
        const allData = await getPendingTasks();
        setAllTasks(allData);
        setTasksToShow(allData);
      } else if (currentUser.rollSelect === "Editor") {
        const editorTasks = await getEditorTasks();
        setAllTasks(editorTasks);
        setTasksToShow(editorTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTaskData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTask = async (index) => {
    const taskDataToUpdate = tasksToShow[index];
    if (!taskDataToUpdate.deadlineDate) {
      window.notify("Please Provide Deadline Date!", "error");
      return;
    }
    setUpdatingIndex(index);
    await updateTaskData(taskDataToUpdate);
    await getTaskData();
    setUpdatingIndex(null);
  };

  const getUsersForFilters = (propertyName) => {
    const seenUsers = new Set();
    return allTasks?.map((taskObj, i) => ({
        title: `${taskObj?.[propertyName]?.firstName}`,
        id: i,
        userId: taskObj?.[propertyName]?._id,
      })).filter(taskObj => {
        if (taskObj?.userId && !seenUsers.has(taskObj?.userId)) {
          seenUsers.add(taskObj?.userId);
          return true;
        }
        return false;
      });
  }
  const filterOptions = [
    {
      title: "Assign By",
      id: 1,
      filters: getUsersForFilters('assignBy')
    },
    {
      title: "Assign To",
      id: 2,
      filters: getUsersForFilters('assignTo')
    },
  ];
  

  // Define priority for parentTitle
  const priority = {
    "Assign By": 1,
    "Assign To": 2,
  };

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      setTasksToShow(allTasks);
    }
    setFilterBy(filterType);
  };

  const applyFilterNew = (filterValue) => {
    if(filterValue.length){
      let notVisited = true
      let fullData = []
      filterValue.map((obj) => {
        if(obj.parentTitle == "Assign By"){
          console.log("obj",allTasks,obj)
          const newData = allTasks.filter(task => task.assignBy.firstName === obj.title)
          fullData = [...fullData,...newData]
          notVisited = false
        }else if(obj.parentTitle == "Assign To"){
          const newData = allTasks.filter(task => task.assignTo.firstName === obj.title)
          const common = fullData.filter(o1 => newData.some(o2 => o1._id === o2._id));
          fullData = notVisited ? [...fullData,...newData] : [...common]
        }
      })
      setTasksToShow(fullData)
    }else{
      setTasksToShow(allTasks)
    }
  }

  const applyFilter = (filterValue) => {
    if(filterValue == null){
      setTasksToShow(allTasks)
      return
    }
    if (filterBy === "Assign By") {
      setTasksToShow(allTasks.filter(task => task.assignBy._id === filterValue.userId))
    } else if (filterBy === "Assign To") {
      setTasksToShow(allTasks.filter(task => task.assignTo._id === filterValue.userId))
    }
  };

  return (
    <>
      <ToastContainer />
      <ClientHeader selectFilter={changeFilter} currentFilter={filterBy} priority={priority} applyFilter={applyFilterNew} options={filterOptions} title={"Daily Tasks"} updateData={getTaskData} filter />
      {tasksToShow ? (
        <Table
          hover
          bordered
          responsive
          className="tableViewClient"
          style={{ width: "100%", marginTop: "15px" }}
        >
          <>
            <thead>
              {currentUser.rollSelect === "Manager" && (
                <tr className="logsHeader Text16N1">
                  <th className="tableBody">Client</th>
                  <th className="tableBody">Task</th>
                  <th className="tableBody">Assign To</th>
                  <th className="tableBody">Assign By</th>
                  <th className="tableBody">Deadline</th>
                  <th className="tableBody">Completion Date</th>
                  <th className="tableBody">End Task</th>
                  <th className="tableBody">Save</th>
                </tr>
              )}
              {currentUser.rollSelect === "Editor" && (
                <tr className="logsHeader Text16N1">
                  <th className="tableBody">Client</th>
                  <th className="tableBody">Task</th>
                  <th className="tableBody">Assign By</th>
                  <th className="tableBody">Deadline</th>
                  <th className="tableBody">Completion Date</th>
                  <th className="tableBody">Save</th>
                </tr>
              )}
            </thead>
          </>

          <tbody
            className="Text12"
            style={{
              textAlign: "center",
              borderWidth: '1px 1px 1px 1px',
            }}
          >
            <>
              {tasksToShow?.map((task, index) => (
                <>
                  <div
                    style={
                      index === 0 ? { marginTop: "15px" } : { marginTop: "0px" }
                    }
                  />
                  {currentUser.rollSelect === "Manager" && (
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
                        {task.client?.brideName}
                        <br />
                        <img src={Heart} alt="" />
                        <br />
                        {task.client?.groomName}
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
                        {task.assignTo.firstName} {task.assignTo.lastName}
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
                        <input
                          type="date"
                          name="deadlineDate"
                          className="JobInput w-100"
                          onChange={(e) => {
                            let temp = [...tasksToShow];
                            temp[index]["deadlineDate"] = e.target.value;
                            setTasksToShow(temp);
                          }}
                          value={
                            task.deadlineDate
                              ? dayjs(new Date(task.deadlineDate)).format(
                                  "YYYY-MM-DD"
                                )
                              : null
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
                          name="completion_date"
                          className="JobInput w-100"
                          onChange={(e) => {
                            let temp = [...tasksToShow];
                            temp[index]["completionDate"] = e.target.value;
                            setTasksToShow(temp);
                          }}
                          value={
                            task.completionDate
                              ? dayjs(task.completionDate).format("YYYY-MM-DD")
                              : null
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
                          type="checkbox"
                          name="endTask"
                          className="JobInput"
                          onChange={(e) => {
                            let temp = [...tasksToShow];
                            temp[index]["ended"] = e.target.checked;
                            setTasksToShow(temp);
                          }}
                          checked={task.ended}
                        />
                      </td>
                      <td className="tablePlaceContent">
                        <button
                          style={{
                            backgroundColor: "#FFDADA",
                            borderRadius: "5px",
                            border: "none",
                            height: "30px",
                          }}
                          onClick={() =>
                            updatingIndex === null && updateTask(index)
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
                  {currentUser.rollSelect === "Editor" && (
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
                        {task.client?.brideName}
                        <br />
                        <img src={Heart} alt="" />
                        <br />
                        {task.client?.groomName}
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
                        {task.assignBy.firstName} {task.assignBy.lastName}
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
                        <input
                          type="date"
                          name="completion_date"
                          className="JobInput"
                          onChange={(e) => {
                            let temp = [...tasksToShow];
                            temp[index]["completionDate"] = e.target.value;
                            setTasksToShow(temp);
                          }}
                          value={
                            task.completionDate
                              ? dayjs(task.completionDate).format("YYYY-MM-DD")
                              : null
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="mt-3"
                          style={{
                            backgroundColor: "#FFDADA",
                            borderRadius: "5px",
                            border: "none",
                            height: "30px",
                          }}
                          onClick={() =>
                            updatingIndex === null && updateTask(index)
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
                </>
              ))}
            </>
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

export default DailyTasks;
