import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import "../../assets/css/tableRoundHeader.css";
import ClientHeader from "../../components/ClientHeader";
import { getAllTasks, getEditorTasks, updateTaskData } from "../../API/TaskApi";
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";


function DailyTasks(props) {
  const [tasks, setTasks] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);

  const currentUser = JSON.parse(Cookies.get('currentUser'));

  const getTaskData = async () => {
    try {
      if (currentUser.rollSelect === 'Manager') {
        const allTasks = await getAllTasks()
        setTasks(allTasks)
      } else if (currentUser.rollSelect === 'Editor') {
        const editorTasks = await getEditorTasks();
        setTasks(editorTasks);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTaskData();
  }, [])

  const updateTask = async (index) => {
    const taskDataToUpdate = tasks[index];
    if (!taskDataToUpdate.deadlineDate) {
      window.notify('Please Provide Deadline Date!', 'error');
      return
    }
    setUpdatingIndex(index);
    await updateTaskData(taskDataToUpdate);
    await getTaskData();
    setUpdatingIndex(null)
  }



  return (
    <>
      <ToastContainer />
      <ClientHeader
        filter
        title={'Daily Tasks'}
        updateData={getTaskData}
      />
      {tasks ? (
        <Table
          hover
          borderless
          responsive
          className="tableViewClient"
          style={{ width: '100%', marginTop: '15px' }}
        >

          <>
            <thead>
              {currentUser.rollSelect === 'Manager' && (
                <tr className="logsHeader Text16N1">
                  <th className="tableBody">Client:</th>
                  <th className="tableBody">Task</th>
                  <th className="tableBody">Assign To</th>
                  <th className="tableBody">Assign By</th>
                  <th className="tableBody">Deadline</th>
                  <th className="tableBody">Completion Date</th>
                  <th className="tableBody">Save</th>
                </tr>
              )}
              {currentUser.rollSelect === 'Editor' && (
                <tr className="logsHeader Text16N1">
                  <th className="tableBody">Client:</th>
                  <th className="tableBody">Task</th>
                  <th className="tableBody">Assign By</th>
                  <th className="tableBody">Deadline</th>
                  <th className="tableBody">Completion Date</th>
                </tr>
              )}
            </thead>
          </>

          <tbody
            className="Text12"
            style={{
              textAlign: 'center',
              borderWidth: '0px 1px 0px 1px',
            }}
          >
            <>
              {tasks?.map((task, index) => (
                <>
                  <div style={index === 0 ? { marginTop: '15px' } : {marginTop : '0px'}} />
                  {currentUser.rollSelect === 'Manager' && (
                    <tr
                      style={{
                        background: '#EFF0F5',
                        borderRadius: '8px',
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
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {task.taskName}
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {task.assignTo.firstName} {task.assignTo.lastName}
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {task.assignBy.firstName} {task.assignBy.lastName}
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        <input
                          type="date"
                          name="deadlineDate"
                          className="JobInput"
                          onChange={(e) => {
                            let temp = [...tasks]
                            temp[index]["deadlineDate"] = e.target.value
                            setTasks(temp)
                          }}
                          value={task.deadlineDate ? dayjs(new Date(task.deadlineDate)).format('YYYY-MM-DD') : null}
                        />
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        <input
                          type="date"
                          name="completion_date"
                          className="JobInput"
                          onChange={(e) => {
                            let temp = [...tasks]
                            temp[index]["completionDate"] = e.target.value
                            setTasks(temp)
                          }}
                          value={task.completionDate ? dayjs(task.completionDate).format('YYYY-MM-DD') : null}
                        />
                      </td>
                      <td>
                        <button className="mt-3"
                          style={{ backgroundColor: '#FFDADA', borderRadius: '5px', border: 'none', height: '30px' }}
                          onClick={() => updatingIndex === null && updateTask(index)}
                        >
                          {updatingIndex === index ? (
                            <div className='w-100'>
                              <div class="smallSpinner mx-auto"></div>
                            </div>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </td>
                    </tr>
                  )}
                  {currentUser.rollSelect === 'Editor' && (
                    <tr
                      style={{
                        background: '#EFF0F5',
                        borderRadius: '8px',
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
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {task.taskName}
                      </td>

                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {task.assignBy.firstName} {task.assignBy.lastName}
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {dayjs(task.deadlineDate).format('DD/MM/YYYY')}
                      </td>
                      <td
                        className="tableBody Text14Semi primary2"
                        style={{
                          paddingTop: '15px',
                          paddingBottom: '15px',
                        }}
                      >
                        {task.completionDate ? dayjs(task.completionDate).format('DD/MM/YYYY') : 'Not yet completed'}

                      </td>

                    </tr>
                  )}

                </>
              ))}
            </>
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

export default DailyTasks;
