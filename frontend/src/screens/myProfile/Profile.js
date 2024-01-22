import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios"
import "../../assets/css/Profile.css";
import { useAuthContext } from "../../config/context";
import Cookies from "js-cookie";


function Profile() {
  
  
  
  // const [profileData, setProfileData] = useState()

  const [primaryValue, setPrimaryValue] = useState({})

  const [contactValue, setContactValue] = useState({})

  const [addressValue, setAddressValue] = useState({})

  const [experienceValue, setExperienceValue] = useState({})

  // This is Function Model of Primary Start....

  const handlePrimary = e => {
    setPrimaryValue(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleUpdatePrimary = async (e) => {
    e.preventDefault();

    try {
      let user = JSON.parse(Cookies.get('currentUser'))
      let id = user._id

      const res = await axios.put(
        `http://localhost:5001/MyProfile/Profile/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          primaryValue
        }
      );
      if (res !== null) {
        GetDataProfile();
      }
    } catch (error) {
      console.log(error, "error")
    }
    setPrimaryModal(!primaryModal);
  }

  // This is Function Model of Primary End....

  const handleContact = e => {
    setContactValue(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleUpdateContact = async (e) => {
    e.preventDefault();

    try {
      let user = JSON.parse(Cookies.get('currentUser'))
      let id = user._id

      const res = await axios.put(
        `http://localhost:5001/MyProfile/Profile/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          contactValue
        }
      );
      if (res !== null) {
        GetDataProfile();
      }
    } catch (error) {
      console.log(error, "error")
    }

    setContactModel(!contactModel)

  }

  // This is function Model of Contact start.....

  const handleAddress = e => {
    setAddressValue(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    try {
      let user = JSON.parse(Cookies.get('currentUser'))
      let id = user._id

      const res = await axios.put(
        `http://localhost:5001/MyProfile/Profile/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          addressValue
        }
      );
      if (res !== null) {
        GetDataProfile();
      }
    } catch (error) {
      console.log(error, "error")
    }

    setAddressModel(!addressModel)
  }

  // This is function Model of Contact End.....

  // This is Function Model of Experience Start....

  const handleExperience = e => {
    setExperienceValue(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleUpdateExperience = async (e) => {
    e.preventDefault();
    try {
      let user = JSON.parse(Cookies.get('currentUser'))
      let id = user._id

      const res = await axios.put(
        `http://localhost:5001/MyProfile/Profile/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          experienceValue
        }
      );
      if (res !== null) {
        GetDataProfile();
      }
    } catch (error) {
      console.log(error, "error")
    }
    
    setExperienceModel(!experienceModel)

  }


  // This is Function Model of Experience End....

  // This is Modal State Start....

  const [primaryModal, setPrimaryModal] = useState(false);
  const primary = () => {
    setPrimaryValue(profileData)
    setPrimaryModal(!primaryModal);
  }

  const [contactModel, setContactModel] = useState(false);
  const contact = () => {
    setContactValue(profileData)
    setContactModel(!contactModel);
  }
  
  const [addressModel, setAddressModel] = useState(false)
  const address = () => {
    setAddressValue(profileData)
    setAddressModel(!addressModel)
  }

  const [experienceModel, setExperienceModel] = useState(false)
  const experience = () => {
    setExperienceValue(profileData)
    setExperienceModel(!experienceModel)
  }


  // This is Modal State End....


  // This is Get Data of User Profile start......

  const {profileData,GetDataProfile} = useAuthContext();

  useEffect(() => {
    GetDataProfile();
  }, [])

  // This is Get Data of User Profile End......

  return (
    <div className="">
      {
        profileData
          ? <>
            <Row className="W90 mb-5">
              <Col xs="12" sm="6" className="pr6">
                <div className="profileCard mt40">
                  <div className="R_A_Justify p10">
                    <div className="Text14Semi">Primary Details</div>
                    <div className="Text10N gray primaryColor" style={{ cursor: "pointer" }} onClick={primary}>Edit</div>
                  </div>
                  <div className="line" />
                  <div className="plt12">
                    <div>
                      <Row>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">First Name</div>
                          <div className="Text10N black mt12">{profileData?.firstName}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Middle Name</div>
                          <div className="Text10N black mt12">{profileData?.middleName}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Last Name</div>
                          <div className="Text10N black mt12">{profileData?.lastName}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Gender</div>
                          <div className="Text10N black mt12">{profileData?.Gender}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">DOB</div>
                          <div className="Text10N black mt12">{profileData?.DOB}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Blood Group</div>
                          <div className="Text10N black mt12">{profileData?.BloodGroup}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Marital Status</div>
                          <div className="Text10N black mt12">{profileData?.maritalStatus}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Physically handicapped</div>
                          <div className="Text10N black mt12">{profileData?.physicalHandicaped}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="12" sm="6" className="pr6">
                <div className="profileCard mt40">
                  <div className="R_A_Justify p10">
                    <div className="Text14Semi">Contact Details</div>
                    <div className="Text10N gray primaryColor" style={{ cursor: "pointer" }} onClick={contact} >Edit</div>
                  </div>
                  <div className="line" />
                  <div className="plt12">
                    <div>
                      <Row>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Work Email</div>
                          <div className="Text10N black mt12">{profileData?.workEmail}</div>
                        </Col>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Personal Email</div>
                          <div className="Text10N black mt12">{profileData?.email}</div>
                        </Col>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Mobile Phone</div>
                          <div className="Text10N black mt12">{profileData.phoneNo}</div>
                        </Col>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Work Phone</div>
                          <div className="Text10N black mt12">{profileData?.workPhone}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="12" sm="6" className="pr6">
                <div className="profileCard mt40">
                  <div className="R_A_Justify p10">
                    <div className="Text14Semi">Address Details</div>
                    <div className="Text10N gray primaryColor" style={{ cursor: "pointer" }} onClick={address}>Edit</div>
                  </div>
                  <div className="line" />
                  <div className="plt12">
                    <div>
                      <Row>
                        <Col xs="12" sm="12">
                          <div className="Text10N gray mt12">Current Address</div>
                          <div className="Text10N black mt12">{profileData?.currentAddress}</div>
                        </Col>
                        <Col xs="12" sm="12">
                          <div className="Text10N gray mt12">Permanent Address</div>
                          <div className="Text10N black mt12">{profileData?.permanentAddress}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="12" sm="6" className="pr6">
                <div className="profileCard mt40">
                  <div className="R_A_Justify p10">
                    <div className="Text14Semi">Experience</div>
                    <div className="Text10N gray primaryColor" style={{ cursor: "pointer" }} onClick={experience}>Edit</div>
                  </div>
                  <div className="line" />
                  <div className="plt12">
                    <div>
                      <Row>
                        <Col xs="12" sm="12">
                          <div className="Text10N black mt12">{profileData?.Experience}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </>
          : <></>
      }


      {/* This is Primary Modal Section Start */}

      <Modal isOpen={primaryModal} primary={primary} centered={true} fullscreen="md" size="lg">
        <ModalHeader primary={primary}>Primary Details</ModalHeader>
        <ModalBody>
          <div>
            <Row>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">First_Name</div>
                <input type="text" name="first_name" placeholder="First_Name" defaultValue={primaryValue.firstName} className="PrimaryModel" onChange={handlePrimary} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Middle_Name</div>
                <input type="text" name="middle_name" className="PrimaryModel" defaultValue={primaryValue.middle_name} placeholder="Middle_Name" onChange={handlePrimary} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Last_Name</div>
                <input type="text" name="last_name" placeholder="Last_Name" defaultValue={primaryValue.lastName} className="PrimaryModel" onChange={handlePrimary} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Gender</div>
                <select name="gender" className="PrimaryModelDrop" defaultValue={primaryValue.Gender} onChange={handlePrimary}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">DOB</div>
                <input type="date" name="DOB" placeholder="Date Of Birth" defaultValue={primaryValue.DOB} className="PrimaryModel" onChange={handlePrimary} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Blood_Group</div>
                <input type="text" name="blood_group" className="PrimaryModel" defaultValue={primaryValue.BloodGroup} placeholder="blood_group" onChange={handlePrimary} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Marital_Status</div>
                <select name="marital_status" placeholder="Marital_Status" defaultValue={primaryValue.maritalStatus} className="PrimaryModelDrop" onChange={handlePrimary}>
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Physically_handicapped</div>
                <select name="physically_handicapped" className="PrimaryModelDrop" defaultValue={primaryValue.physicalHandicaped} onChange={handlePrimary}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Col>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn Update" onClick={handleUpdatePrimary}>
            Update
          </Button>
          <Button color="danger" onClick={primary}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Primary Modal Section End */}


      {/* This is Contact Model Section Start */}

      <Modal isOpen={contactModel} contact={contact} centered={true} size="lg" fullscreen="md" >
        <ModalHeader contact={contact}>Contact Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Work_Email</div>
              <input type="email" name="work_email" placeholder="Work_Email" defaultValue={contactValue.workEmail} className="ContactModel" onChange={handleContact} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Personal_Email</div>
              <input type="email" name="personal_email" placeholder="Personal_Email" defaultValue={contactValue.email} className="ContactModel" onChange={handleContact} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Mobile_Phone</div>
              <input type="text" name="mobile_phone" className="ContactModel" defaultValue={contactValue.phoneNo} placeholder="Mobile_Phone" onChange={handleContact} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Work_Phone</div>
              <input type="text" name="work_phone" placeholder="Work_Phone" defaultValue={contactValue.workPhone} className="ContactModel" onChange={handleContact} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn" onClick={handleUpdateContact}>
            Update
          </Button>
          <Button color="danger" onClick={contact}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Contact Model Section End */}

      {/* This is Address Model Section Start */}

      <Modal isOpen={addressModel} address={address} centered={true}>
        <ModalHeader address={address}>Address Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Current_Address</div>
              <input type="text" name="current_address" placeholder="Current_Address" defaultValue={addressValue.currentAddress} className="ContactModel" onChange={handleAddress} />
            </Col>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Permanent_Address</div>
              <input type="text" name="permanent_address"
                placeholder="Permanent_Address" className="ContactModel" defaultValue={addressValue.permanentAddress} onChange={handleAddress} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn Update" onClick={handleUpdateAddress}>
            Update
          </Button>
          <Button color="danger" onClick={address}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Address Model Section End */}

      {/* This is Experience Model Section Start */}

      <Modal isOpen={experienceModel} experience={experience} centered={true} fullscreen="sm" size="sm">
        <ModalHeader experience={experience}>Experience</ModalHeader>
        <ModalBody>

          <Row>
            <Col xl="12" sm="12">
              <div className="label">Experience</div>
              <select onChange={handleExperience} className="PrimaryModelDrop" name="experience" defaultValue={experienceValue.Experience}>
                <option value="">Select</option>
                <option value="0 to 1 year">0 to 1 year</option>
                <option value="1 to 2 year">1 to 2 year</option>
                <option value="2 to 3 year">2 to 3 year</option>
                <option value="3 to 4 year">3 to 4 year</option>
              </select>
            </Col>
          </Row>

        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn Update" onClick={handleUpdateExperience}>
            Update
          </Button>
          <Button color="danger" onClick={experience}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Experience Model Section End */}

    </div>
  );
}

export default Profile;
