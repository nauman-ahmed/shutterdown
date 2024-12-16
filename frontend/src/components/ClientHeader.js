import React, { useRef, useState } from "react";
import "../assets/css/clients.css";
import UnactiveCalender from "../assets/Profile/ActiveCalender.svg";
import UnactiveListView from "../assets/Profile/ListView.svg";
import ActiveCalender from "../assets/Profile/UnactiveCalender.svg";
import ListView from "../assets/Profile/ActiveListView.svg";
import ActiveFilter from "../assets/Profile/ActiveFilter.svg";
import Filter from "../assets/Profile/Filter.svg";
import UnactiveFilter from "../assets/Profile/UnactiveFilter.svg";
import { useNavigate } from "react-router-dom";
import { Overlay, Tooltip, Navbar, Nav, NavDropdown } from "react-bootstrap";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Row,
  Col,
  Input,
} from "reactstrap";
import { useEffect } from "react";
import { addTask } from "../API/TaskApi";
import Cookies from "js-cookie";
import { getAllClients, getClients } from "../API/Client";
import Heart from "../assets/Profile/Heart.svg";
import Select from "react-select";
import { getEditors } from "../API/userApi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import { useLoggedInUser } from "../config/zStore";

function ClientHeader(props) {
  const [list, setList] = useState(
    window.location.pathname === "/calendar/calendar-view" ? false : true
  );
  const navigate = useNavigate();
  const target = useRef(null);
  const [taskData, setTaskData] = useState({});
  const [allClients, setAllClients] = useState();
  const [editors, setEditors] = useState();
  const [parentFilter, setParentFilter] = useState(null);
  const [childFilter, setChildFilter] = useState(null);
  const [show, setShow] = useState(false);
  const [childFilterNauman, setChildFilterNauman] = useState([]);
  const [selfAssigned, setSelfAssigned] = useState(false);

  const { userData: currentUser } = useLoggedInUser();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const fetchClientsData = async () => {
    const clients = await getAllClients();
    const res = await getEditors();
    setEditors(res.editors);
    setAllClients(clients);
  };
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
  const route = window.location.href.split("/MyProfile");

  useEffect(() => {
    if (
      route[1] &&
      route[1]?.startsWith("/Tasks/DailyTasks") &&
      currentUser?.rollSelect === "Manager"
    ) {
      fetchClientsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.applyFilter && props.applyFilter(childFilterNauman);
  }, [childFilterNauman]);

  const handleChildFilter = (value, optionObj) => {
    const obj = { title: value.title, parentTitle: optionObj.title };
    if (childFilterNauman.length) {
      const exists = childFilterNauman.some(
        (el) => el.title === obj.title && el.parentTitle === obj.parentTitle
      );
      if (exists) {
        setChildFilterNauman((prevState) =>
          prevState.filter(
            (el) => el.title !== obj.title || el.parentTitle !== obj.parentTitle
          )
        );
      } else {
        const beforeSorted = [...childFilterNauman, obj];
        // Custom sort function
        beforeSorted.sort((a, b) => {
          // First, compare by parentTitle using the priority map
          if (props.priority[a.parentTitle] < props.priority[b.parentTitle]) {
            return -1;
          }
          if (props.priority[a.parentTitle] > props.priority[b.parentTitle]) {
            return 1;
          }

          // If parentTitle is the same, then sort by title
          return a.title.localeCompare(b.title);
        });
        setChildFilterNauman(beforeSorted);
      }
    } else {
      setChildFilterNauman((prevState) => [...prevState, obj]);
    }
  };

  const handleParentFilter = (value) => {
    if (
      value === "All" ||
      value === "Date Assigned" ||
      value === "Date Unassigned" ||
      value === null
    ) {
      props.applyFilter(value);
      setShow(false);
    } else {
      if (value === "Unassigned Editor") {
        setShow(false);
      }
      props.selectFilter(value);
    }
  };

  const handleTaskSubmit = async () => {
    setModal(!modal);
    await addTask({ ...taskData, assignBy: currentUser });
    setTaskData(null);
    props.updateData();
  };
  const options = props.options;
  const currentFilter = props.currentFilter;

  return (
    <>
      <div className="R_A_Justify mb15">
        <div className="clientBtn Text24Semi d-sm-none d-md-block">
          {props.title}
        </div>
        <div className="R_A_Justify">
          {props.filter && (
            <div
              style={{ marginRight: "20px", cursor: "pointer" }}
              ref={target}
              onClick={() => {
                setShow(!show);
              }}
            >
              <img alt="" src={Filter} />
            </div>
          )}
          {currentUser?.rollSelect === "Manager" &&
          route[1]?.startsWith("/Tasks/DailyTasks") ? (
            <>
              <div
                style={{ backgroundColor: "#666DFF" }}
                className="btn btn-primary me-1"
                onClick={toggle}
              >
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
                  setList(false);
                  navigate("/calendar/calendar-view");
                }}
              >
                <img alt="" src={list ? UnactiveCalender : ActiveCalender} />
              </div>
              <div
                className="calenderBox1 point"
                onClick={() => {
                  setList(true);
                  navigate("/calendar/list-view");
                }}
              >
                <img alt="" src={list ? UnactiveListView : ListView} />
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
          <Tooltip key={1} id="overlay-example" {...props}>
            <div
              className="nav_popover"
              style={{ width: "200px", paddingTop: "10px" }}
            >
              {options.map((optionObj, i) => {
                const selected = optionObj.id === parentFilter ? true : false;
                return (
                  <>
                    {
                      <div
                        key={i}
                        className={`rowalign d-flex flex-row justify-content-between`}
                        onClick={() => {
                          if (parentFilter == optionObj.id) {
                            setParentFilter(null);
                          } else {
                            setParentFilter(optionObj.id);
                          }
                        }}
                        style={{
                          width: "200px",
                          height: "40px",
                          padding: "10px",
                          cursor: "pointer",
                          background: selected ? "#666DFF" : "",
                          paddingLeft: "4px",
                        }}
                      >
                        <img
                          alt=""
                          src={selected ? ActiveFilter : UnactiveFilter}
                        />
                        <div
                          className="Text16N "
                          style={{
                            color: selected ? "white" : "black",
                            marginLeft: "15px",
                          }}
                        >
                          {optionObj.title}
                        </div>
                        {selected ? (
                          <IoIosArrowUp className="text-black" />
                        ) : (
                          <IoIosArrowDown className="text-black" />
                        )}
                      </div>
                    }
                    {selected && (
                      <>
                        {optionObj?.filters?.map((option, i) => {
                          const childSelected = childFilterNauman.some(
                            (el) => el.title === option.title
                          );
                          return (
                            <div
                              className="rowalign d-flex align-item-center justify-content-end "
                              onClick={() => {
                                handleChildFilter(option, optionObj);
                              }}
                              style={{
                                width: "200px",
                                height: "45px",
                                padding: "8px",
                                cursor: "pointer",
                                background: childSelected ? "#666DFF" : "",
                                lineHeight: "15px",
                              }}
                            >
                              <img
                                style={{
                                  width: "20%",
                                  height: "23px",
                                }}
                                alt=""
                                src={
                                  childSelected ? ActiveFilter : UnactiveFilter
                                }
                              />
                              <div
                                className="Text16N"
                                style={{
                                  width: "50%",
                                  color: childSelected ? "white" : "",
                                  marginLeft: "15px",
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
                );
              })}
            </div>
          </Tooltip>
        )}
      </Overlay>

      <Overlay
        rootClose={true}
        onHide={() => setShow(false)}
        target={target.current}
        show={false}
        placement="bottom"
      >
        {(props) => (
          <Tooltip key={1} id="overlay-example" {...props}>
            <div
              className="nav_popover"
              style={{ width: "200px", paddingTop: "10px" }}
            >
              {options.map((optionObj, i) => {
                const selected = optionObj.id === parentFilter ? true : false;
                return (
                  <>
                    {optionObj.title !== "clientsFromListView" && (
                      <div
                        key={i}
                        className={`rowalign ${
                          optionObj.title === "All" ||
                          optionObj.title === "Date Assigned" ||
                          optionObj.title === "Date Unassigned"
                            ? " "
                            : " d-flex flex-row justify-content-between"
                        } `}
                        onClick={() => {
                          if (currentFilter !== undefined) {
                            if (currentFilter !== optionObj.title) {
                              setParentFilter(optionObj.id);
                              handleParentFilter(optionObj.title);
                              setChildFilter(null);
                            } else {
                              setParentFilter(null);
                            }
                          } else {
                            if (optionObj.id == parentFilter && selected) {
                              setParentFilter(null);
                              handleParentFilter(null);
                              setChildFilter(null);
                            } else {
                              setParentFilter(optionObj.id);
                              handleParentFilter(optionObj.title);
                              setChildFilter(null);
                            }
                            setShow(false);
                          }
                        }}
                        style={{
                          width: "200px",
                          height: "40px",
                          padding: "10px",
                          cursor: "pointer",
                          background:
                            selected &&
                            (optionObj.title === "All" ||
                              optionObj.title === "Date Assigned" ||
                              optionObj.title === "Date Unassigned")
                              ? "#666DFF"
                              : "",
                          paddingLeft: "4px",
                        }}
                      >
                        {(optionObj.title === "All" ||
                          optionObj.title === "Date Assigned" ||
                          optionObj.title === "Date Unassigned") && (
                          <img
                            alt=""
                            src={selected ? ActiveFilter : UnactiveFilter}
                          />
                        )}
                        <div
                          className="Text16N "
                          style={{
                            color:
                              selected &&
                              (optionObj.title === "All" ||
                                optionObj.title === "Date Assigned" ||
                                optionObj.title === "Date Unassigned")
                                ? "white"
                                : "black",
                            marginLeft: "15px",
                          }}
                        >
                          {optionObj.title}
                        </div>
                        {optionObj.title !== "Unassigned Editor" &&
                          optionObj.title !== "All" &&
                          optionObj.title !== "Date Assigned" &&
                          optionObj.title !== "Date Unassigned" &&
                          (selected ? (
                            <IoIosArrowUp className="text-black" />
                          ) : (
                            <IoIosArrowDown className="text-black" />
                          ))}
                      </div>
                    )}
                    {(selected ||
                      optionObj.title === "clientsFromListView") && (
                      <>
                        {optionObj?.filters?.map((option, i) => {
                          const childSelected =
                            option.id === childFilter &&
                            (selected ||
                              optionObj.title === "clientsFromListView")
                              ? true
                              : false;
                          return (
                            <div
                              className="rowalign d-flex align-item-center"
                              onClick={() => {
                                if (
                                  optionObj.title === "clientsFromListView" ||
                                  optionObj.title === "Assign By" ||
                                  optionObj.title === "Assign To"
                                ) {
                                  handleChildFilter(option);
                                } else {
                                  handleChildFilter(option.title);
                                }
                                if (
                                  option.id === childFilter &&
                                  childSelected
                                ) {
                                  setChildFilter(null);
                                  handleChildFilter(null);
                                } else {
                                  setChildFilter(option.id);
                                }
                                setShow(false);
                              }}
                              style={{
                                width: "200px",
                                height:
                                  optionObj.title === "clientsFromListView"
                                    ? "45px"
                                    : "35px",
                                padding: "8px",
                                cursor: "pointer",
                                background: childSelected ? "#666DFF" : "",
                                paddingLeft: "15px",
                                lineHeight: "15px",
                              }}
                            >
                              <img
                                style={{
                                  height: "23px",
                                }}
                                alt=""
                                src={
                                  childSelected ? ActiveFilter : UnactiveFilter
                                }
                              />
                              <div
                                className="Text16N"
                                style={{
                                  color: childSelected ? "white" : "",
                                  marginLeft: "15px",
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
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleTaskSubmit();
          }}
        >
          <ModalBody>
            <Row className="p-3">
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Client</div>
                <Select
                  value={
                    taskData?.client
                      ? {
                          value: taskData?.client,
                          label: (
                            <div className="d-flex justify-content-around">
                              <span>{taskData?.client.brideName}</span>{" "}
                              <img alt="" src={Heart} />{" "}
                              <span>{taskData?.client.groomName}</span>
                            </div>
                          ),
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setTaskData({ ...taskData, client: selected.value });
                  }}
                  styles={customStyles}
                  options={allClients?.map((client) => {
                    return {
                      value: client,
                      label: (
                        <div className="d-flex justify-content-around">
                          <span>{client.brideName}</span>{" "}
                          <img alt="" src={Heart} />{" "}
                          <span>{client.groomName}</span>
                        </div>
                      ),
                      brideName: client.brideName,
                      groomName: client.groomName,
                    };
                  })}
                  required
                  filterOption={(option, searchInput) => {
                    const { brideName, groomName } = option.data;
                    const searchText = searchInput?.toLowerCase();

                    // Perform search on both brideName and groomName
                    return (
                      brideName?.toLowerCase()?.startsWith(searchText) ||
                      groomName?.toLowerCase()?.startsWith(searchText)
                    );
                  }}
                />
              </Col>
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Assign To</div>
                <Select
                  isDisabled={selfAssigned}
                  value={
                    taskData?.assignTo
                      ? {
                          value: taskData?.assignTo,
                          label: (
                            <div>
                              {taskData?.assignTo.firstName}{" "}
                              {taskData?.assignTo?.lastName}
                            </div>
                          ),
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setTaskData({ ...taskData, assignTo: selected.value });
                  }}
                  styles={customStyles}
                  options={editors?.map((editor) => {
                    return {
                      value: editor,
                      label: (
                        <div>
                          {editor?.firstName} {editor?.lastName}
                        </div>
                      ),
                      firstName: editor?.firstName,
                      lastName: editor?.lastName,
                    };
                  })}
                  required
                  filterOption={(option, searchInput) => {
                    const { firstName, lastName } = option.data;
                    const searchText = searchInput?.toLowerCase();

                    // Perform search on both brideName and groomName
                    return (
                      firstName?.toLowerCase()?.startsWith(searchText) ||
                      lastName?.toLowerCase()?.startsWith(searchText)
                    );
                  }}
                />
              </Col>
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Self Assign</div>
                <Input
                  type="checkbox"
                  checked={selfAssigned}
                  onChange={() => {
                    setSelfAssigned(!selfAssigned);
                    setTaskData({ ...taskData, assignTo: currentUser });
                  }}
                />
              </Col>
            </Row>
            <Row className="p-3">
              <Col xl="4" sm="6" lg="4" className="p-2">
                <div className="label">Deadline</div>
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
            <Button type="submit" className="Update_btn">
              ADD
            </Button>
            <Button type="button" color="danger" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}

export default ClientHeader;
