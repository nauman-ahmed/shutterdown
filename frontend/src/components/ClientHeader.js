import React, { useRef, useState } from 'react';
import '../assets/css/clients.css';
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
import { addTask } from '../API/TaskApi';
import Cookies from 'js-cookie'
import { getClients } from '../API/Client';
import Heart from '../assets/Profile/Heart.svg';
import Select from 'react-select';
import { getEditors } from '../API/userApi';


function ClientHeader(props) {
  const [list, setList] = useState(true);
  const navigate = useNavigate();
  const target = useRef(null);
  const [taskData, setTaskData] = useState({});
  const [allClients, setAllClients] = useState();
  const [editors, setEditors] = useState();

  const [show, setShow] = useState(false);
  const [filterType, setFilterType] = useState(1);

  // This is Model section function and state Start...
  const currentUser = JSON.parse(Cookies.get('currentUser'))

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const fetchClientsData = async () => {
    const clients = await getClients();
    const res = await getEditors();
    console.log(res);
    setEditors(res.editors);
    setAllClients(clients);
  }
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
    menu: (defaultStyles) => ({ ...defaultStyles, zIndex: 9999 }), // Set a higher zIndex
    menuList: (defaultStyles) => ({ ...defaultStyles, zIndex: 9999 }), // Set a higher zIndex
    menuPortal: (defaultStyles) => ({ ...defaultStyles, zIndex: 9999 }), // Set a higher zIndex
  };
  const route = window.location.href.split('/MyProfile');

  useEffect(() => {
    if (route[1].startsWith('/Tasks/DailyTasks') && currentUser.rollSelect === 'Manager') {
      fetchClientsData()
    }
  }, [])

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

  const handleTaskSubmit = async () => {
    setModal(!modal);
    await addTask({ ...taskData, assignBy: currentUser });
    setTaskData(null);
    props.updateData();
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
              }} >
              <img src={Filter} />
            </div>
          )}
          {(currentUser.rollSelect === 'Manager' && route[1].startsWith('/Tasks/DailyTasks')) ? (
            <>
              <div className="btn btn-primary me-1" onClick={toggle}>
                Add Task
              </div>
            </>
          ) : null}
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
        <Form onSubmit={(e) => {
          e.preventDefault();
          handleTaskSubmit();
        }}>
          <ModalBody>
            <Row className="p-3">
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Client</div>
                <Select value={taskData?.client ? { value: taskData?.client, label: <div className='d-flex justify-content-around'><span>{taskData?.client.brideName}</span>  <img src={Heart} /> <span>{taskData?.client.groomName}</span></div> } : null} onChange={(selected) => {
                  setTaskData({ ...taskData, client: selected.value })
                }} styles={customStyles} options={allClients?.map(client => {
                  return { value: client, label: <div className='d-flex justify-content-around'><span>{client.brideName}</span>  <img src={Heart} /> <span>{client.groomName}</span></div> }
                })} required />
              </Col>
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Assign To</div>
                <Select value={taskData?.assignTo ? { value: taskData?.assignTo, label: <div>{taskData?.assignTo.firstName} {taskData?.assignTo?.lastName}</div> } : null} onChange={(selected) => {
                  setTaskData({ ...taskData, assignTo: selected.value })
                }} styles={customStyles} options={editors?.map(editor => {
                  return { value: editor, label: <div>{editor.firstName} {editor.lastName}</div> }
                })} required />
              </Col>

            </Row>
            <Row className="p-3">
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Deadline Date</div>
                <input
                  type="date"
                  name="deadlineDate"
                  className="JobInput"
                  value={taskData?.deadlineDate || null}
                  onChange={(e) => {
                    setTaskData({ ...taskData, deadlineDate: e.target.value });
                  }}
                  required
                />
              </Col>
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Task Name</div>
                <input
                  type="text"
                  name="taskName"
                  className="JobInput"
                  placeholder="Task Name"
                  value={taskData?.taskName}
                  onChange={(e) => {
                    setTaskData({ ...taskData, taskName: e.target.value });
                  }}
                  required
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type='submit' className="Update_btn" >
              ADD
            </Button>
            <Button type='button' color="danger" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}

export default ClientHeader;
