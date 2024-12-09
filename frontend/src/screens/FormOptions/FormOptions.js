import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/common.css";
import "../../assets/css/Profile.css";
import "../../assets/css/tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { updateClintData } from "../../redux/clientBookingForm";
import { FaEdit } from "react-icons/fa";
import { getAllEventOptions, updateAllEventOptions } from "../../API/FormEventOptionsAPI";
import { getAllDeliverableOptions, updateAllDeliverableOptions } from "../../API/FormDeliverableOptionsAPI";
import {
  Button,
  Input,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { LuPlus } from "react-icons/lu";

function FormOptions() {
 
  const [newEventModel, setNewEventModel] = useState(false);
  const [deliverableEdit, setDeliverableEdit] = useState(false);
  const [addNewValue, setAddNewValue] = useState(null);
  const [storedObjKey, setStoredObjKey] = useState(null);
  const [eventOptionsKeyValues, setEventOptionsKeyValues] = useState(null);
  const [deliverableOptionsKeyValues, setDeliverableOptionsKeyValues] = useState(null);
  const [editableOptions, setEditableOptions] = useState(
    {label: "Photographers", values:[
      {label: "1", value:"1"},
      {label: "2", value:"2"},
      {label: "3", value:"3"},
      {label: "4", value:"4"},
      {label: "5", value:"5"},
    ]}
  );

  const eventOptionObjectKeys = ["travelBy", "shootDirector", "photographers", "cinematographers", "drones", "sameDayPhotoEditors", "sameDayVideoEditors"]
  const deliverablePreWeddingOptionObjectKeys = ["assistants", "photographers", "cinematographers", "drones"]
  const deliverableAlbumOptionObjectKeys = ["albums"]
  const deliverableOptionObjectKeys = ["promos", "longFilms", "reels", "hardDrives", "performanceFilms"]

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
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };

  const target = useRef(null);

  const deleteOption = (objectToBeDeleted) => {
    editableOptions.values = editableOptions.values.filter(value => value._id !== objectToBeDeleted._id)

    if(deliverableEdit){ // If any of the deliverable field is being edited
      // Update state with new option
      setEditableOptions(prevOptions => ({
        ...prevOptions,
        values: editableOptions.values
      }));
      setDeliverableOptionsKeyValues(prevOptions => ({
        ...prevOptions,
        [storedObjKey]:{
          ...prevOptions[storedObjKey],
          values: editableOptions.values
        }
      }))
      return 
    }


    // Update state with new option
    setEditableOptions(prevOptions => ({
      ...prevOptions,
      values: editableOptions.values
    }));
    setEventOptionsKeyValues(prevOptions => ({
      ...prevOptions,
      [storedObjKey]:{
        ...prevOptions[storedObjKey],
        values: editableOptions.values
      }
    }))

  };

  const addOption = () => {

    if(deliverableEdit){
      // Update state with new option
      setEditableOptions(prevOptions => ({
        ...prevOptions,
        values: [...prevOptions.values, { label: addNewValue, value: addNewValue }]
      }));
      setDeliverableOptionsKeyValues(prevOptions => ({
        ...prevOptions,
        [storedObjKey]:{
          ...prevOptions[storedObjKey],
          values: [...prevOptions[storedObjKey].values, { label: addNewValue, value: addNewValue }]
        }
      }))
      return
    }

    // Update state with new option
    setEditableOptions(prevOptions => ({
      ...prevOptions,
      values: [...prevOptions.values, { label: addNewValue, value: addNewValue }]
    }));
    setEventOptionsKeyValues(prevOptions => ({
      ...prevOptions,
      [storedObjKey]:{
        ...prevOptions[storedObjKey],
        values: [...prevOptions[storedObjKey].values, { label: addNewValue, value: addNewValue }]
      }
    }))
  };

  const getAllFormOptionsHandler = async () => {
    const eventOptions = await getAllEventOptions();
    const deliverableOptions = await getAllDeliverableOptions();

    setEventOptionsKeyValues(eventOptions)
    setDeliverableOptionsKeyValues(deliverableOptions)
  }

  useEffect(() => {
    getAllFormOptionsHandler()
  },[])

  useEffect(() => {
    addNewFormOptions();
  },[editableOptions])

  const updateAllEventOptionsHandler = async () => {
    const res = await updateAllEventOptions(eventOptionsKeyValues);
    if(res && res.status && res.status === 200){
      window.notify("Options successfully updated", "success");
      return
    }
    if(res && res.status && res.status !== 200){
      window.notify("Something went wrong", "error");
    }

  }

  const updateAllDeliverableOptionsHandler = async () => {
    const res = await updateAllDeliverableOptions(deliverableOptionsKeyValues);
    if(res && res.status && res.status === 200){
      window.notify("Options successfully updated", "success");
      return
    }
    if(res && res.status && res.status !== 200){
      window.notify("Something went wrong", "error");
    }

  }

  useEffect(() => {
    // It will run when the modal is closed
    if(!newEventModel){
      if(deliverableEdit){
        updateAllDeliverableOptionsHandler()
        return
      }
      updateAllEventOptionsHandler()
    }

  },[newEventModel])

  const addNewFormOptions = () => {
    setAddNewValue(null)
  }

  const editableOptionsHandler = (Objkey) => {
    setEditableOptions(eventOptionsKeyValues[Objkey])
    setNewEventModel(true)
    setStoredObjKey(Objkey)
  }

  const editableDeliverableOptionsHandler = (Objkey) => {
    setEditableOptions(deliverableOptionsKeyValues[Objkey])
    setNewEventModel(true)
    setStoredObjKey(Objkey)
  }

  return (
    <>
    
      <div className="mt18">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Row>
            {eventOptionObjectKeys.map((Objkey) => 
              <Col xs="12" sm="6">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    {eventOptionsKeyValues && eventOptionsKeyValues[Objkey].label}
                  </div>
                  <div className="d-flex align-items-center">
                    <Select
                      // ref={travelSelect}
                      name="travelBy"
                      className="w-50 "
                      styles={customStyles}
                      options={eventOptionsKeyValues && eventOptionsKeyValues[Objkey].values}
                      required={true}
                    />
                    <FaEdit className=" fs-5 cursor-pointer" style={{ marginLeft: "10px" }} onClick={() => editableOptionsHandler(Objkey)}/>
                    </div>
                </div>
              </Col>
            )}
          </Row>
        </Form>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mt25">
            <div className="Text16N" style={{ marginTop: "6px" }}>
              <h4>Deliverables</h4>
            </div>
          </div>
          {
            <>
              <p className=" text16N mb-0 fw-bold">For Pre-Wedding:</p>
              <Row>
                {deliverablePreWeddingOptionObjectKeys.map((Objkey) => 
                  <Col xs="12" sm="3">
                    <div className="mt25">
                      <div className="Text16N" style={{ marginBottom: "6px" }}>
                        {deliverableOptionsKeyValues && deliverableOptionsKeyValues[Objkey].label}
                      </div>
                      <div className="d-flex align-items-center">
                        <Select
                          // ref={travelSelect}
                          name="travelBy"
                          className="w-50"
                          styles={customStyles}
                          options={deliverableOptionsKeyValues && deliverableOptionsKeyValues[Objkey].values}
                          required={true}
                        />
                        <FaEdit className=" fs-5 cursor-pointer" style={{ marginLeft: "10px" }} onClick={() => {editableDeliverableOptionsHandler(Objkey); setDeliverableEdit(true);}}/>
                        </div>
                    </div>
                  </Col>
                )}
              </Row>
            </>
          }

          <Row>
            {deliverableAlbumOptionObjectKeys.map((Objkey) => 
              <Col xs="12" sm="3">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    {deliverableOptionsKeyValues && deliverableOptionsKeyValues[Objkey].label}
                  </div>
                  <div className="d-flex align-items-center">
                    <Select
                      // ref={travelSelect}
                      name="travelBy"
                      className="w-50"
                      styles={customStyles}
                      options={deliverableOptionsKeyValues && deliverableOptionsKeyValues[Objkey].values}
                      required={true}
                    />
                    <FaEdit className=" fs-5 cursor-pointer" style={{ marginLeft: "10px" }} onClick={() => {editableDeliverableOptionsHandler(Objkey); setDeliverableEdit(true);}}/>
                    </div>
                </div>
              </Col>
            )}
          </Row>
          <Row style={{ marginBottom: "100px" }}>
            {deliverableOptionObjectKeys.map((Objkey) => 
              <Col xs="12" sm="3">
                <div className="mt25">
                  <div className="Text16N" style={{ marginBottom: "6px" }}>
                    {deliverableOptionsKeyValues && deliverableOptionsKeyValues[Objkey].label}
                  </div>
                  <div className="d-flex align-items-center">
                    <Select
                      // ref={travelSelect}
                      name="travelBy"
                      className="w-50"
                      styles={customStyles}
                      options={deliverableOptionsKeyValues && deliverableOptionsKeyValues[Objkey].values}
                      required={true}
                    />
                    <FaEdit className=" fs-5 cursor-pointer" style={{ marginLeft: "10px" }} onClick={() => {editableDeliverableOptionsHandler(Objkey); setDeliverableEdit(true);}}/>
                    </div>
                </div>
              </Col>
            )}
          </Row>
        </Form>
      </div>
      <Modal isOpen={newEventModel} centered={true} size="md" fullscreen="md">
        <ModalHeader>{editableOptions.label}</ModalHeader>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }} 
        >
          <ModalBody>
            <div style={{height: "300px", overflow: "scroll"}}>
            {editableOptions && 
              editableOptions.values.map((options) =>
              <Row ref={target} >
                <Col  xl="6" sm="6" className="mt-3 d-flex justify-content-center ">
                  <Input
                    type="text"
                    name={options.label}
                    disabled={false}
                    className="forminput w-75"
                    value={options.value}
                    placeholder={"Value..."}
                  />
                </Col>
                <Col xl="6" sm="6" className="mt-3 d-flex justify-content-center">
                  <Button type="submit" color="danger" onClick={() => deleteOption(options)}>
                    Delete
                  </Button>
                 </Col>
              </Row>  
              )
            }
            </div>
            <Row ref={target} className="d-flex align-items-center justify-content-center">
              <Col  xl="6" sm="6" className="mt-3 d-flex justify-content-center" >
                <Input
                  type="text"
                  name="eventType"
                  disabled={false}
                  className="forminput w-75"
                  value={addNewValue || ""}
                  placeholder={"Value..."}
                  onChange={(e) => setAddNewValue(e.target.value)}
                />
              </Col>
              <Col xl="6" sm="6" className="mt-3 d-flex justify-content-center">
                <div
                  className="fs-3 mx-1 d-flex cursor-pointer justify-content-center align-items-center"
                  onClick={addOption}
                  style={{
                    backgroundColor: "rgb(102, 109, 255)",
                    color: "white",
                    width: "30PX",
                    height: "30px",
                    borderRadius: "100%",
                  }}
                >
                  <LuPlus />
                 </div>
             </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            
            <Button
              className="Update_btn"
              onClick={() => {
                setNewEventModel(false);
              }}
            >
              Update
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}

export default FormOptions;
