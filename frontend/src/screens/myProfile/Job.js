import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import "../../assets/css/Profile.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios";
import { useAuthContext } from "../../config/context";
import Cookies from "js-cookie";


function Job() {

  const [jobValue, setJobValue] = useState({})


  //  This is Function of Job Model Start....

  const handleJob = e => {
    setJobValue(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleUpdateJob = async (e) => {
    e.preventDefault();

    try {
      let user = JSON.parse(Cookies.get('currentUser'))
      let id = user._id

      const res = await axios.put(
        `http://localhost:5001/MyProfile/Job/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          jobValue
        }
      );
      if (res !== null) {
        GetDataProfile();
      }
      setModal(!modal);
    } catch (error) {
      console.log(error, "error")
    }
  }

  //  This is Function of Job Model End....

  // This is Show fo Data in Form Function start....

  const { profileData, GetDataProfile } = useAuthContext();

  useEffect(() => {
    GetDataProfile();
  }, [])

  // This is Show fo Data in Form Function End....



  // This is Model State And Function Start....

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setJobValue(profileData)
    setModal(!modal);
  }
  // This is Model State And Function End....


  return (
    <div className="">
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
                    <div className="Text10N black mt12">{profileData?.EmployeeNumber}</div>
                  </Col>
                  <Col xs="6" sm="6">
                    <div className="Text10N gray mt12">Date of joining</div>
                    <div className="Text10N black mt12">{profileData?.DateOfJoining}</div>
                  </Col>
                  <Col xs="6" sm="6">
                    <div className="Text10N gray mt12">Job Title</div>
                    <div className="Text10N black mt12">{jobValue.job_title}</div>
                  </Col>
                  <Col xs="6" sm="6">
                    <div className="Text10N gray mt12">Job Type</div>
                    <div className="Text10N black mt12">{profileData?.jobType}</div>
                  </Col>
                  <Col xs="6" sm="6">
                    <div className="Text10N gray mt12">Shift Timing</div>
                    <div className="Text10N black mt12">{profileData?.shiftTiming}</div>
                  </Col>
                  <Col xs="6" sm="6">
                    <div className="Text10N gray mt12">Leave Plan</div>
                    <div className="Text10N black mt12">{profileData?.leavePlan}</div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* This is Model Sections Start */}

      <Modal isOpen={modal} toggle={toggle} centered={true} fullscreen="lg" size="md">
        <ModalHeader >Job Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Employee_Number</div>
              <input type="text" name="employee_number" placeholder="Employee_Number" defaultValue={profileData?.EmployeeNumber} className="JobInput" onChange={handleJob} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Date_of_Joining</div>
              <input type="date" name="date_of_joining" className="JobInput" placeholder="Date_of_Joining" defaultValue={profileData?.DateOfJoining} onChange={handleJob} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Job_Title</div>
              <input type="text" name="job_title" className="JobInput" placeholder="Job_Title" defaultValue={jobValue.job_title} onChange={handleJob} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Job_Type</div>
              <select name="job_type" className="JobInputDrop" placeholder="Job_Type" defaultValue={profileData?.jobType} onChange={handleJob}>
                <option value="">Select</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            </Col>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Shift_Timing</div>
              <input type="text" name="shift_timing" placeholder="Shift_Timing" className="JobInput" defaultValue={profileData?.shiftTiming} onChange={handleJob} />
            </Col>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Leave_Plan</div>
              <input type="text" name="leave_plan" className="JobInput" placeholder="Leave_Plan" defaultValue={profileData?.leavePlan} onChange={handleJob} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn Update" onClick={handleUpdateJob}>
            Update
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
