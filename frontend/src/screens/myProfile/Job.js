import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import "../../assets/css/Profile.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Cookies from "js-cookie";
import { updateUserData } from "../../API/userApi";
import dayjs from "dayjs";


function Job() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    getUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const getUserData = async () => {
    setUserData(currentUser);
  }
  const [updating, setUpdating] = useState(false);
  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }
  const handleUpdateUserData = async (e) => {
    try {
      e.preventDefault();
      setUpdating(true);
      await updateUserData(userData).catch(err => setUpdating(false));
      setModal(false);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
    }
  }
  const [modal, setModal] = useState(false);
  const toggle = async () => {
    setUpdating(false);
    await getUserData();
    setModal(!modal);
  }

  return (
    <div className="">
      {userData ?
        <Row className="W90">
          <Col xs="12" sm="6" style={{ paddingRight: '25px' }}>
            <div className="profileCard mt40">
              <div className="R_A_Justify p10">
                <div className="Text14Semi">Jobs Details</div>
                <div className="Text10N gray" style={{ cursor: "pointer" }} onClick={toggle}>Edit</div>
              </div>
              <div className="line" />
              <div className="plt12">
                <div>
                  <Row>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Employee Number</div>
                      <div className="Text10N black mt12">{userData?.employeeNumber}</div>
                    </Col>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Date of joining</div>
                      <div className="Text10N black mt12">{dayjs(userData?.dateOfJoining).format('DD-MMM-YYYY')}</div>
                    </Col>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Job Title</div>
                      <div className="Text10N black mt12">{userData?.jobTitle}</div>
                    </Col>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Job Type</div>
                      <div className="Text10N black mt12">{userData?.jobType}</div>
                    </Col>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Sub Role</div>
                      <div className="Text10N black mt12">{userData?.subRole}</div>
                    </Col>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Shift Timing</div>
                      <div className="Text10N black mt12">{userData?.shiftTiming}</div>
                    </Col>
                    <Col xs="6" sm="6">
                      <div className="Text10N gray mt12">Leave Plan</div>
                      <div className="Text10N black mt12">{userData?.leavePlan}</div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        : <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      }

      {/* This is Model Sections Start */}

      <Modal isOpen={modal} toggle={toggle} centered={true} fullscreen="lg" size="md">
        <ModalHeader >Job Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Employee Number</div>
              <input type="text" name="employeeNumber" placeholder="Employee_Number" defaultValue={userData?.employeeNumber} className="JobInput" onChange={handleChange} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Date of Joining</div>
              <input type="date" name="dateOfJoining" className="JobInput" placeholder="Date_of_Joining" defaultValue={dayjs(userData?.dateOfJoining).format('DD-MMM-YYYY')} onChange={handleChange} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Job Title</div>
              <input type="text" name="jobTitle" className="JobInput" placeholder="Job_Title" defaultValue={userData?.jobTitle} onChange={handleChange} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Job Type</div>
              <select name="jobType" className="JobInputDrop" placeholder="Job_Type" defaultValue={userData?.jobType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Sub Role</div>
              <select name="subRole" className="JobInputDrop" placeholder="Job_Type" defaultValue={userData?.subRole} onChange={handleChange}>
                <option value="">Select</option>
                {currentUser.rollSelect === 'Editor' && (
                  <>
                    <option value="Videographer">Videographer</option>
                    <option value="Photographer">Photographer</option>
                  </>
                )}
                {currentUser.rollSelect === 'Shooter' && (
                  <>
                    <option value="Videographer">Cinematographer</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Photographer">Drone Flyer</option>
                  </>
                )}
              </select>
            </Col>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Shift Timing</div>
              <input type="text" name="shiftTiming" placeholder="Shift_Timing" className="JobInput" defaultValue={userData?.shiftTiming} onChange={handleChange} />
            </Col>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Leave Plan</div>
              <input type="text" name="leavePlan" className="JobInput" placeholder="Leave_Plan" defaultValue={userData?.leavePlan} onChange={handleChange} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn btnWidth Update" onClick={!updating && handleUpdateUserData}>
            {updating ? (
              <div className='w-100'>
                <div class="smallSpinner mx-auto"></div>
              </div>
            ) : (
              'Update'
            )}
          </Button>
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Model Sections End */}

    </div>
  );
}

export default Job;
