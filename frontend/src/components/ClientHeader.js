import React, { useRef, useState } from 'react';
import '../assets/css/clients.css';
import CoomonDropDown from './CoomonDropDown';
import ActiveCalender from '../assets/Profile/ActiveCalender.svg';
import ListView from '../assets/Profile/ListView.svg';
import UnactiveCalender from '../assets/Profile/UnactiveCalender.svg';
import ActiveListView from '../assets/Profile/ActiveListView.svg';
import ActiveFilter from '../assets/Profile/ActiveFilter.svg';
import Filter from '../assets/Profile/Filter.svg';
import UnactiveFilter from '../assets/Profile/UnactiveFilter.svg';
import { useNavigate } from 'react-router-dom';
import { Overlay, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import Toast from 'reactstrap';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Row,
  Col,
} from 'reactstrap';
import { useEffect } from 'react';
import { assignTaskFunction } from '../API/TaskApi';
function ClientHeader(props) {
  const [list, setList] = useState(true);
  const navigate = useNavigate();
  const target = useRef(null);

  const [show, setShow] = useState(false);
  const [filterType, setFilterType] = useState(1);
  const [clientData, setClientData] = useState();
  const [userData, setUserData] = useState();
  const [groomName, setGroomName] = useState();
  const [brideName, setBrideName] = useState();
  const [assignto, setAssignto] = useState();
  const [assignBy, setAssignBy] = useState();
  const [companyDate, setCompanyData] = useState();
  const [completionDate, setCompletionDate] = useState();
  const [taskName, setTaskName] = useState();
  const [idHidden, setIdHidden] = useState(false);
  const [EditorHidden, setEditorHidden] = useState(false);
  const [location,setLocation]=useState()
  const [Arraydata,setArrayData]=useState()
  const [SubmitApi,setSubmitApi]=useState(false)
  // This is Model section function and state Start...
 

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const getClientData = async () => {
    try {
      const localStorageData = JSON.parse(localStorage.getItem('userEmail'));
      const res = await axios.get(
        `http://localhost:5002/MyProfile/Tasks/DailyTasks/${localStorageData}`,
        {
          Headers: {
            'Content-Type': 'application/Json',
          },
        }
      );
      setClientData(res.data.ClientData);

      setUserData(res.data.userData);
    } catch (error) {}
  };
  useEffect(() => {
  
   const Data = window.location.href.split('/MyProfile');
   setLocation(Data[1])
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    if (loginUser.data.User.rollSelect === 'Shooter') {
      setIdHidden(true);
    }
    if (loginUser.data.User.rollSelect === 'Editor') {
      setEditorHidden(true);
    } else {
      getClientData();
    }
  }, []);
  // This is Model section function and state End...

  // This is Dropdown Function and State Start.....

  // This is Dropdown Function and State End.....

  const data = [
    {
      title: 'Date',
      id: 1,
    },
    {
      title: 'Task Unassigned',
      id: 2,
    },
    {
      title: 'Client',
      id: 3,
    },
    {
      title: 'Task',
      id: 4,
    },
  ];
  useEffect(() => {
    'dsflksflkslfjf';
  }, ['dsflksflkslfjf']);
  const handleGroomNameChange = (e) => {
    setGroomName(e.target.value);
  };
  const handleBrideNameChange = (e) => {
    setBrideName(e.target.value);
  };
  const handleAssigntoChange = (e) => {
    setAssignto(e.target.value);
  };
  const handleAssignByChange = (e) => {
    setAssignBy(e.target.value);
  };
  const handleCompanyDataChange = (e) => {
    setCompanyData(e.target.value);
  };
  const completionDateChange = (e) => {
    setCompletionDate(e.target.value);
  };
  const taskNameChange = (e) => {
    setTaskName(e.target.value);
  };
let array=[]
  const handleTaskSubmit = async () => {
    if (brideName === undefined) {
      alert('please Select Bridename');
    } else if (groomName === undefined) {
      alert('please Select Groom Name');
    } else if (companyDate === undefined) {
      alert('Please Select CompanyDate');
    } else if (completionDate === undefined) {
      alert('Please Select Completion Date');
    } else if (assignto === undefined) {
      alert('Please Select Assign to ');
    } else if (assignBy === undefined) {
      alert('Please Select Assign By');
    } else if (taskName === undefined) {
      alert('Please Select Task Name');
    } else {
      setModal(!modal);
      // alert('Success');
      const id=JSON.parse(localStorage.getItem("userEmail"))
      const taskData = {
        id,
        brideName,
        groomName,
        companyDate,
        completionDate,
        assignto,
        assignBy,
        taskName,
      };
      
      setArrayData(array)

      await assignTaskFunction(taskData);
      try {
        const res=await axios.get('http://localhost:5002/MyProfile/Tasks/DailyTasks',{
          Headers:{
            'Content-Type':"application/json"
          }
        })
        props.TaskDataFunction(res.data.taskData)
        props.setSubmitApi(true)
      } catch (error) {
        
      }

    }
  };
  return (
    <>
      <div className="R_A_Justify mb15">
        <div className="clientBtn Text24Semi d-sm-none d-md-block">{props.title}</div>
        <div className="R_A_Justify">
          {props.filter && (
            <div
              style={{ marginRight: '20px', cursor: 'pointer' }}
              ref={target}
              onClick={() => {
                setShow(!show);
              }}
            >
              <img src={Filter} />
            </div>
          )}
          {idHidden ? null : EditorHidden ? null : location==="/Tasks/DailyTasks"? (  
            <>
              <div className="btn btn-primary me-1" onClick={toggle}>
                Add
              </div>
            </>
          ):null}
          {/* <CoomonDropDown AddEvent /> */}
          {props.calender && (
            <>
              <div
                className="calenderBox point"
                onClick={() => {
                  setList(true);
                  navigate('/MyProfile/Calender/View');
                }}
              >
                <img src={!list ? ActiveCalender : UnactiveCalender} />
              </div>
              <div
                className="calenderBox1 point"
                onClick={() => {
                  setList(false);
                  navigate('/MyProfile/Calender/ListView');
                }}
              >
                <img src={list ? ActiveListView : ListView} />
              </div>
            </>
          )}
        </div>
      </div>

      <Overlay
        rootClose={true}
        onHide={() => setShow(false)}
        target={target.current}
        show={show}
        placement="bottom"
      >
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <div
              className="nav_popover"
              style={{ width: '200px', paddingTop: '10px' }}
              >
              {data.map((i) => {
                const selected = i.id == filterType ? true : false;
                return (
                  <div
                    className="rowalign"
                    onClick={() => setFilterType(i.id)}
                    style={{
                      width: '200px',
                      padding: '10px',
                      cursor: 'pointer',
                      background: selected ? '#666DFF' : '',
                      paddingLeft: '15px',
                    }}
                  >
                    <img src={selected ? ActiveFilter : UnactiveFilter} />
                    <div
                      className="Text16N"
                      style={{
                        color: selected ? 'white' : '',
                        marginLeft: '15px',
                      }}
                    >
                      {i.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </Tooltip>
        )}
      </Overlay>

      {/* This is Model section */}

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered={true}
        fullscreen="sm"
        size="lg"
      >
        <ModalHeader>Add Task</ModalHeader>
        <ModalBody>
          <Form>
            <Row className="p-3">
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Groom_Name</div>
                <select
                  name="GroomName"
                  className="JobInputDrop p-2"
                  onChange={(e) => handleGroomNameChange(e)}
                >
                  <option value="">Select</option>
                  {clientData &&
                    clientData.map((data) => {
                      return (
                        <>
                          <option>{data.Groom_Name}</option>
                        </>
                      );
                    })}

                  {/* <option value="Part Time">Part Time</option> */}
                </select>
              </Col>
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Bride_Name</div>
                <select
                  name="BrideName"
                  className="JobInputDrop p-2"
                  onChange={(e) => handleBrideNameChange(e)}
                >
                  <option value="">Select</option>
                  {clientData &&
                    clientData.map((data) => {
                      return (
                        <>
                          <option>{data.Bride_Name}</option>
                        </>
                      );
                    })}

                  {/* <option value="Part Time">Part Time</option> */}
                </select>
              </Col>
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Assign_To</div>
                <select
                  name="BrideName"
                  className="JobInputDrop p-2"
                  onChange={(e) => handleAssigntoChange(e)}
                >
                  <option value="">Select</option>
                  {userData &&
                    userData.map((data) => {
                      return (
                        <>
                          <option value={data.firstName + ',' + data._id}>
                            {data.firstName}{' '}
                          </option>
                        </>
                      );
                    })}
                </select>
              </Col>
            </Row>
            <Row className="p-3">
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Assign_By</div>
                <select
                  name="BrideName"
                  className="JobInputDrop p-2"
                  onChange={(e) => handleAssignByChange(e)}
                >
                  <option value="">Select</option>
                  {clientData &&
                    clientData.map((data) => {
                      return (
                        <>
                          <option>{data.POC}</option>
                        </>
                      );
                    })}
                </select>
              </Col>
              <Col className="p-2" xl="4" sm="6">
                <div className="label">Deadline_Date</div>
                <input
                  type="date"
                  name="deadline_date"
                  className="JobInput"
                  onChange={(e) => handleCompanyDataChange(e)}
                />
              </Col>
              <Col className="p-2" xl="4" sm="6">
                <div className="label">Completion_Date</div>
                <input
                  type="date"
                  name="completion_date"
                  className="JobInput"
                  onChange={(e) => completionDateChange(e)}
                />
              </Col>
            </Row>
            <Row className="p-3">
              <Col>
                <div className="label">Task_Name</div>
                <input
                  type="text"
                  name="Task"
                  className="JobInput"
                  placeholder="Task Name"
                  onChange={(e) => taskNameChange(e)}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn" onClick={handleTaskSubmit}>
            Update
          </Button>
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ClientHeader;
