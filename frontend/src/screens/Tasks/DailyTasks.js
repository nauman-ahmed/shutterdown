import React,{useState,useEffect} from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import CoomonDropDown from "../../components/CoomonDropDown";
import RowHeaderDropDown from "../../components/RowHeaderDropDown";
import "../../assets/css/tableRoundHeader.css";
import ClientHeader from "../../components/ClientHeader";
import axios from "axios";
import { updatedAssignTaskData, getTaskDataHandler, saveTaskDataHandler } from "../../API/TaskApi";

import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function DailyTasks(props) {

  const [taskData,setTaskData]=useState()
  const [shootHide,setShootHide]=useState(false)
  const [EditorHide,setEditorHide]=useState(false)
  const [EditorData,setEditorData]=useState()
  const [manager,setManager]=useState()
  const [editorList,setEditorList]=useState()
  const [userId,setUserId]=useState()
  const [submitApi,setSubmitApi]=useState(false)
  const [submitData,setSubmitData]=useState()
  const [editorSelect,setEditorSelect]=useState()
  const [assignBySelect,setAssignBySelect]=useState()

  const getTaskData=async()=>{
    try {
      const id=JSON.parse(localStorage.getItem('userEmail'))

      setUserId(id)
      const res = await getTaskDataHandler()

      setTaskData(res.taskData)
      setEditorData(res.user)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    const loginUser=JSON.parse(localStorage.getItem('loginUser'))
    if (loginUser.data.User.rollSelect==="Shooter") {
      setShootHide(true)
    }
    else if (loginUser.data.User.rollSelect==="Editor") {
      setEditorHide(true)
    }
    else {
      getTaskData()
    }
  },[userId])



  const TaskDataFunction=(data)=>{
    // setSubmitData(data)
  }

  const onSubmitHandler = async (index) => {

    
    if(taskData[index].taskName == null || taskData[index].taskName == undefined || taskData[index].taskName == ""){
      toast.error('Please add data to taskName');
      return
    }
    if(taskData[index].assignTo == null || taskData[index].assignTo == undefined){
      toast.error('Please add data to assignTo');
      return
    }
    if(taskData[index].companyDate == null || taskData[index].companyDate == undefined){
      toast.error('Please add data to companyDate');
      return
    }
    if(taskData[index].completionDate == null || taskData[index].completionDate == undefined){
      toast.error('Please add data to completionDate');
      return
    }

    await saveTaskDataHandler(taskData[index])
    toast.success('Submitted Data Successfully');

  }

  return (
    <>
      <ToastContainer />
      <ClientHeader
        filter
        title={'Daily Tasks'}
        TaskDataFunction={TaskDataFunction}
        sumbitApi={submitApi}
        setSubmitApi={setSubmitApi}
      />
        
          <Table
            hover
            borderless
            responsive
            className="tableViewClient"
            style={{ width: '100%', marginTop: '15px' }}
          >
            
              <>
                <thead>
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client:</th>
                    <th className="tableBody">Task</th>
                    <th className="tableBody">Assign To</th>
                    <th className="tableBody">Deadline</th>
                    <th className="tableBody">Completion Date</th>
                    <th className="tableBody">Save</th>
                  </tr>
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
                  {taskData &&
                    taskData.map((data,index) => (
                      <>
                        <div style={{ marginTop: '15px' }} />
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
                            {data.ClientId.Bride_Name}
                            <br />
                            <img src={Heart} alt="" />
                            <br />
                            {data.ClientId.Groom_Name}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                             <input
                                type="text"
                                name="Task"
                                className="JobInput"
                                placeholder={data.taskName ? data.taskName : "Task Name"} 
                                onChange={(e) => {
                                  let temp = [...taskData]
                                  temp[index]["taskName"] = e.target.value
                                  setTaskData(temp)
                                }}
                                value = {data.taskName}
                              />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                             <CoomonDropDown
                               table
                               assigntoStringManager = {'assigntoStringManager'}
                               valueType = {'assigntoStringManager'}
                               EditorData={EditorData}
                               value={data.assignTo ? data.assignTo.firstName : null}
                               setEditorSelect={(i) => {
                                let temp = [...taskData]
                                temp[index]["assignTo"] = i
                                setTaskData(temp)
                               }}
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
                              name="deadline_date"
                              className="JobInput"
                              onChange={(e) => {
                                let temp = [...taskData]
                                temp[index]["companyDate"] = e.target.value
                                setTaskData(temp)
                              }}
                              value={data.companyDate ? data.companyDate : null}
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
                                let temp = [...taskData]
                                temp[index]["completionDate"] = e.target.value
                                setTaskData(temp)
                              }}
                              value={data.completionDate ? data.completionDate : null}
                            />
                          </td>
                          <td>
                        <button 
                          style={{backgroundColor:'#FFDADA',borderRadius:'5px',border:'none',height:'30px'}} 
                          onClick={()=>onSubmitHandler(index)}
                        >
                          Save
                        </button>
                      </td>
                        </tr>
                      </>
                    ))}
                </>
            </tbody>
          </Table>
    </>
  );
}

export default DailyTasks;
