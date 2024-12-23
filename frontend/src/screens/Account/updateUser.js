import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Select from 'react-select';
import { LuPlus } from "react-icons/lu";
import { CgMathMinus } from "react-icons/cg";
import { updateUserData } from "../../API/userApi"

function UpdateUser(props) {

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

  let roleOptions = [
    {
      value: 'Manager',
      label: 'Manager',
      index: 0
    },
    {
      value: 'Production Manager',
      label: 'Production Manager',
      index: 1
    },
    {
      value: 'Shooter',
      label: 'Shooter',
      index: 2
    },
    {
      value: 'Editor',
      label: 'Editor',
      index: 3
    }
  ]
  let subRoleOptions = [
    {
      value: 'Shoot Director',
      label: 'Shoot Director',
      index: 0
    },
    {
      value: 'Assistant',
      label: 'Assistant',
      index: 1
    },
    {
      value: 'Photographer',
      label: 'Photographer',
      index: 2
    },
    {
      value: 'Cinematographer',
      label: 'Cinematographer',
      index: 3
    },
    {
      value: 'Drone Flyer',
      label: 'Drone Flyers',
      index: 4
    },

    {
      value: 'Manager',
      label: 'Manager',
      index: 5
    },
    {
      value: 'Video Editor',
      label: 'Video Editor',
      index: 6
    },
    {
      value: 'Photo Editor',
      label: 'Photo Editor',
      index: 7
    },
    {
      value: 'Production',
      label: 'Production',
      index: 8
    },
  ];

  const [currentUserDetails, setCurrentUserDetails] = useState(props.userDetails)

  const onSubmitHandler = async () => {
    await updateUserData(currentUserDetails);
    toggle()
  }
  const toggle = () => props.setModal(false);

  return (
    <>
      {console.log("Data", currentUserDetails)}
      <Modal
        isOpen={props.modal}
        toggle={toggle}
        centered={true}
        fullscreen="sm"
        size="lg"
      >
        <ModalHeader>Update Details</ModalHeader>
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSubmitHandler();
        }}>
          <ModalBody>
            <Row className="p-3">
              <Col xl="6" sm="6" lg="6" className="p-2">
                <div className="label">First Name</div>
                <input
                  type="text"
                  name={currentUserDetails.firstName}
                  className="userInput"
                  value={currentUserDetails?.firstName}
                  onChange={(e) => {
                    setCurrentUserDetails({ ...currentUserDetails, firstName: e.target.value });
                  }}
                  required
                />
              </Col>
              <Col xl="6" sm="6" lg="6" className="p-2">
                <div className="label">Last Name</div>
                <input
                  type="text"
                  name={currentUserDetails.lastName}
                  className="userInput"
                  value={currentUserDetails?.lastName}
                  onChange={(e) => {
                    setCurrentUserDetails({ ...currentUserDetails, lastName: e.target.value });
                  }}
                  required
                />
              </Col>
              <Col xl="4" sm="4" lg="4" className="p-2 mb-2">
                <div className="label">User Role</div>
                <Select
                  value={{ value: currentUserDetails.rollSelect, label: currentUserDetails.rollSelect }}
                  styles={customStyles}
                  options={roleOptions}
                  onChange={(selected) => {
                    setCurrentUserDetails({ ...currentUserDetails, rollSelect: selected?.value })
                  }}
                  required />
              </Col>
              <Row >
                <div className="label">Sub Roles </div>
                {currentUserDetails.subRole.map((role, i) =>
                  <Col xl="3" sm="3" lg="3" className="p-2">
                    <Select
                      value={{ value: role, label: role }}
                      styles={customStyles}
                      options={subRoleOptions}
                      onChange={(selected) => {
                        let subRoleDummy = [...currentUserDetails.subRole]
                        subRoleDummy[i] = selected?.value;
                        setCurrentUserDetails({ ...currentUserDetails, subRole: [...subRoleDummy] })
                      }}
                      required />
                  </Col>
                )}
                <Col xl="3" sm="3" lg="3" className="p-2">
                  <div className="d-flex fex-row">
                    {currentUserDetails?.subRole?.length > 0 && (
                      <div
                        style={{
                          backgroundColor: "rgb(102, 109, 255)",
                          color: "white",
                          width: "30PX",
                          height: "30px",
                          borderRadius: "100%",
                        }}
                        className="fs-3 mx-1 d-flex justify-content-center align-items-center"
                        onClick={() => {
                          let subRoleDummy = [...currentUserDetails.subRole]
                          subRoleDummy.pop();
                          setCurrentUserDetails({ ...currentUserDetails, subRole: [...subRoleDummy] })
                        }}
                      >
                        <CgMathMinus />
                      </div>
                    )}
                    <div
                      className="fs-3  mx-1 d-flex justify-content-center align-items-center"
                      onClick={() => setCurrentUserDetails({ ...currentUserDetails, subRole: [...currentUserDetails.subRole, "Photographer"] })}
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
                  </div>
                </Col>
              </Row>
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

export default UpdateUser;
