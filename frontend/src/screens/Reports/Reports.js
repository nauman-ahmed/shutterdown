import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import { getAllTasks } from "../../API/TaskApi";
import dayjs from "dayjs";

function Reports(props) {

  const [allTasks, setAllTasks] = useState(null);

  const getTaskData = async () => {
    try {
      const tasks = await getAllTasks()
      setAllTasks(tasks)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTaskData();
  }, [])


  return (
    <>
      {allTasks ? (
        <Table
          // bordered
          hover
          borderless
          responsive
          // striped
          className="tableViewClient"
          style={{ width: '130%', marginTop: '15px' }}
        >
          <thead>
            <tr className="logsHeader Text16N1">
              <th className="tableBody">Client:</th>
              <th className="tableBody">Task Assigned</th>
              <th className="tableBody">Task Assigned Date</th>
              <th className="tableBody">Assigned By</th>
              <th className="tableBody">Assigned To</th>
              <th className="tableBody">Status</th>
              <th className="tableBody">Deadline</th>
              <th className="tableBody">Completion Date</th>
              <th className="tableBody">Delay</th>
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
            {allTasks?.map((task, index) => (
              <>
                <div style={{ marginTop: "15px" }} />
                <tr
                  style={{
                    background: "#EFF0F5",
                    borderRadius: "8px",
                  }}
                >

                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: '15px',
                      paddingBottom: '15px',
                    }}
                  >
                    {task.client.brideName}
                    <br />
                    <img src={Heart} alt="" />
                    <br />
                    {task.client.groomName}
                  </td>

                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.taskName}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {dayjs(task.assignDate).format('DD/MM/YYYY')}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.assignBy.firstName} {task.assignBy.lastName}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.assignTo.firstName} {task.assignTo.lastName}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.completionDate ?
                      dayjs(task.completionDate).startOf('day').isBefore(dayjs(task.deadlineDate).startOf('day')) ? 'Completed' : 'Overdue'
                      : dayjs().startOf('day').isBefore(dayjs(task.deadlineDate).startOf('day')) ? 'In Progress' : 'Closed'}


                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {dayjs(task.deadlineDate).format('DD/MM/YYYY')}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.completionDate ? dayjs(task.completionDate).format('DD/MM/YYYY') : 'Not yet Completed'}
                  </td>
                  <td
                    className="tableBody Text14Semi primary2"
                    style={{
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {task.completionDate ? dayjs(task.deadlineDate).diff(task.completionDate, 'day') : 0}

                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      ) : (
        <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      )}

    </>
  );
}

export default Reports;
