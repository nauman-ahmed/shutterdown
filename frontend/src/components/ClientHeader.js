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
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


function ClientHeader(props) {
  const [list, setList] = useState(true);
  const navigate = useNavigate();
  const target = useRef(null);
  const [taskData, setTaskData] = useState({});
  const [allClients, setAllClients] = useState();
  const [editors, setEditors] = useState();
  const [parentFilter, setParentFilter] = useState(null)
  const [childFilter, setChildFilter] = useState(null)
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
  const handleChildFilter = (value) => {
    props.applyFilter(value)
  }
  const handleParentFilter = (value) => {
    if (value === 'All' || value === 'Date Assigned' || value === 'Date Unassigned') {
      props.applyFilter(value);
      setShow(false)
    } else {
      if(value === 'Unassigned Editor'){
        setShow(false)
      }
      props.selectFilter(value)
    }
  }


  const handleTaskSubmit = async () => {
    setModal(!modal);
    await addTask({ ...taskData, assignBy: currentUser });
    setTaskData(null);
    props.updateData();
  };
  const options = props.options;
  const currentFilter = props.currentFilter
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
              {options.map((optionObj, i) => {
                const selected = optionObj.id == parentFilter ? true : false;
                return (
                  <>
                    <div
                      className={`rowalign ${(optionObj.title === 'All' || optionObj.title === 'Date Assigned' || optionObj.title === 'Date Unassigned') ? " " : " d-flex flex-row justify-content-between"} `}
                      onClick={() => {
                        if (currentFilter !== optionObj.title) {
                          setParentFilter(optionObj.id);
                          handleParentFilter(optionObj.title);
                          setChildFilter(null)
                        } else {
                          setParentFilter(null)
                        }
                      }}
                      style={{
                        width: '200px',
                        height: '40px',
                        padding: '10px',
                        cursor: 'pointer',
                        background: (selected && (optionObj.title === 'All' || optionObj.title === 'Date Assigned' || optionObj.title === 'Date Unassigned')) ? '#666DFF' : '',
                        paddingLeft: '4px',
                      }}
                    >
                      {(optionObj.title === 'All' || optionObj.title === 'Date Assigned' || optionObj.title === 'Date Unassigned') && (
                        <img src={selected ? ActiveFilter : UnactiveFilter} />
                      )}
                      <div
                        className="Text16N "
                        style={{
                          color: (selected && (optionObj.title === 'All' || optionObj.title === 'Date Assigned' || optionObj.title === 'Date Unassigned')) ? 'white' : 'black',
                          marginLeft: '15px',
                        }}
                      >
                        {optionObj.title}
                      </div>
                      {optionObj.title !== 'Unassigned Editor' && optionObj.title !== 'All' && optionObj.title !== 'Date Assigned' && optionObj.title !== 'Date Unassigned' && (
                        selected ? <IoIosArrowUp className='text-black' /> : <IoIosArrowDown className='text-black' />
                      )}
                    </div>
                    {selected && (
                      <>
                        {optionObj?.filters?.map((option, i) => {
                          const childSelected = (option.id == childFilter && selected) ? true : false;
                          return (
                            <div
                              className="rowalign d-flex align-item-center"
                              onClick={() => {
                                handleChildFilter(option.title)
                                setChildFilter(option.id);
                                setShow(false)
                              }}
                              style={{
                                width: '200px',
                                height: '35px',
                                padding: '8px',
                                cursor: 'pointer',
                                background: childSelected ? '#666DFF' : '',
                                paddingLeft: '15px',
                              }}
                            >
                              <img src={childSelected ? ActiveFilter : UnactiveFilter} />
                              <div
                                className="Text16N"
                                style={{
                                  color: childSelected ? 'white' : '',
                                  marginLeft: '15px',
                                }}
                              >
                                {option.title}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}

                  </>
                )
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
