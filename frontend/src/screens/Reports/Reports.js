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
import { useLoggedInUser } from "../../config/zStore";

function Reports(props) {
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState(null);
  const [tasksToShow, setTasksToShow] = useState(null);
  const {userData : currentUser} = useLoggedInUser()
  const [filterBy, setFilterBy] = useState(null);

  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterCondition, setFilterCondition] = useState(null);

  const getTaskData = async () => {
    try {
      const tasks = await getAllTasks(1);
      setAllTasks(tasks);
      setTasksToShow(tasks)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      currentUser?.rollSelect === "Editor" ||
      currentUser?.rollSelect === "Shooter"
    ) {
      navigate("/MyProfile/Tasks/DailyTasks");
    }
    getTaskData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        
        const  data = await getAllTasks(page);
         
        
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
      console.log("at bottom");
      fetchTasks();
    }
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [handleScroll]);

  const getUsersForFilters = (propertyName) => {
    const seenUsers = new Set();
    return allTasks
      ?.map((taskObj, i) => ({
        title: `${taskObj?.[propertyName]?.firstName}`,
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



  return (
    <>
      <ClientHeader
        selectFilter={changeFilter}
        currentFilter={filterBy}
        priority={priority} applyFilter={applyFilterNew}
        options={filterOptions}
        title="Reports"
        filter
      />
      {tasksToShow ? (
         <>
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
              borderWidth: '1px 1px 1px 1px',
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
                    {task?.client.brideName}
                    <br />
                    <img src={Heart} alt="" />
                    <br />
                    {task?.client?.groomName}
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
        {(!loading && hasMore) && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <button
                  onClick={() => fetchTasks()}
                  className="btn btn-primary"
                  style={{ backgroundColor: "#666DFF", marginLeft: "5px" }}
                >
                  Load More
                </button>
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

export default Reports;
