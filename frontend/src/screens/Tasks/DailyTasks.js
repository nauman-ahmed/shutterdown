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

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterCondition, setFilterCondition] = useState(null);

  const getTaskData = async () => {
    try {
      if (currentUser.rollSelect === "Manager") {
        const allData = await getPendingTasks(page);
        setAllTasks(allData);
        setTasksToShow(allData);
      } else if (currentUser.rollSelect === "Editor") {
        const editorTasks = await getEditorTasks(page);
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
  const fetchTasks = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        let data;
        if (currentUser.rollSelect === "Manager") {
          data = await getPendingTasks(page === 1 ? page + 1 : page);
         
        } else if (currentUser.rollSelect === "Editor") {
          data = await getEditorTasks(page === 1 ? page + 1 : page);
        }
       
        if (data.length > 0) {
          let dataToAdd;
         
            setAllTasks([...allTasks, ...data])
            if(filterCondition){
              dataToAdd = data.filter(task => eval(filterCondition))
            } else {
              dataToAdd = data
            }
            setTasksToShow([...tasksToShow, ...dataToAdd]);
          

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

  useEffect(()=>{
    if(tasksToShow?.length < 10 && hasMore && !loading){
      fetchTasks()
    }
  }, [tasksToShow])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;

    if (bottomOfWindow) {
      fetchTasks();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
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
      let conditionBy = null
      let conditionTo= null
      filterValue.map((obj) => {
        if(obj.parentTitle == "Assign By"){
          conditionBy = conditionBy ? conditionBy + " || task.assignBy.firstName === '" + obj.title + "'" : "task.assignBy.firstName === '" + obj.title + "'"
        }else if(obj.parentTitle == "Assign To"){
          conditionTo = conditionTo ? conditionTo + " || task.assignTo.firstName === '" + obj.title + "'" : "task.assignTo.firstName === '" + obj.title + "'"
        }
      })
      let finalCond = null
      if(conditionBy){
        if(conditionTo){
          finalCond = "(" + conditionBy +")" + " && " + "(" + conditionTo + ")"
        }else{
          finalCond = "(" + conditionBy +")" 
        }
      }else{
        finalCond = "(" + conditionTo +")" 
      }
      setFilterCondition(finalCond)
      const newData = allTasks.filter(task => eval(finalCond))
      setTasksToShow(newData)
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
         <>
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

export default DailyTasks;
