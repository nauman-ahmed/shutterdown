import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "../../assets/css/Profile.css";
import Cookies from "js-cookie";
import { updateUserData } from "../../API/userApi";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useLoggedInUser } from "../../config/zStore";
import { fetchUser } from "../../hooks/authQueries";

function Profile() {
  const {userData : stateUser} = useLoggedInUser()
  const [userData, setUserData] = useState(stateUser);

  const [updating, setUpdating] = useState(false);
  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }
  const handleUpdateUserData = async (e) => {
    try {
      if (userData.firstName.length === 0 || userData.lastName.length === 0 || userData.email.length === 0 || userData?.phoneNo.length === 0) {
        toast.error('First Name, Last Name, Email and phone is required!');
      } else {
        setUpdating(true);
        e.preventDefault();
        await updateUserData(userData).catch(err => setUpdating(false));
        setPrimaryModal(false);
        setContactModel(false);
        setAddressModel(false);
        setExperienceModel(false);
        setUpdating(false);
      }
    } catch (error) {
      setUpdating(false);
    }
  }
  const [primaryModal, setPrimaryModal] = useState(false);
  const primary = async () => {
    await fetchUser()
    setPrimaryModal(!primaryModal);
  }
  const closeAll = async () => {
    await fetchUser();
    setUpdating(false);
    setPrimaryModal(false);
    setContactModel(false);
    setAddressModel(false);
    setExperienceModel(false);
  }
  const [contactModel, setContactModel] = useState(false);
  const contact = () => {
    setContactModel(!contactModel);
  }
  const [addressModel, setAddressModel] = useState(false)
  const address = () => {
    setAddressModel(!addressModel)
  }
  const [experienceModel, setExperienceModel] = useState(false)
  const experience = () => {
    setExperienceModel(!experienceModel)
  }

  return (
    <div>
      {
        userData
          ? <>
            <Row className="W90 mb-5">
              <Col xs="12" sm="5" className="pr6">
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
                          <div className="Text10N black mt12">{userData?.firstName}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Middle Name</div>
                          <div className="Text10N black mt12">{userData?.middleName}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Last Name</div>
                          <div className="Text10N black mt12">{userData?.lastName}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Gender</div>
                          <div className="Text10N black mt12">{userData?.gender}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">DOB</div>
                          <div className="Text10N black mt12">{dayjs(userData?.DOB).format('DD-MMM-YYYY')}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Blood Group</div>
                          <div className="Text10N black mt12">{userData?.bloodGroup}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Marital Status</div>
                          <div className="Text10N black mt12">{userData?.maritalStatus}</div>
                        </Col>
                        <Col xs="6" sm="4">
                          <div className="Text10N gray mt12">Physically handicapped</div>
                          <div className="Text10N black mt12">{userData?.physicallyHandicapped}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="12" sm="5" className="pr6">
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
                          <div className="Text10N black mt12">{userData?.workEmail}</div>
                        </Col>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Personal Email</div>
                          <div className="Text10N black mt12">{userData?.email}</div>
                        </Col>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Mobile Phone</div>
                          <div className="Text10N black mt12">{userData?.phoneNo}</div>
                        </Col>
                        <Col xs="6" sm="6">
                          <div className="Text10N gray mt12">Work Phone</div>
                          <div className="Text10N black mt12">{userData?.workPhone}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="12" sm="5" className="pr6">
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
                          <div className="Text10N black mt12">{userData?.currentAddress}</div>
                        </Col>
                        <Col xs="12" sm="12">
                          <div className="Text10N gray mt12">Permanent Address</div>
                          <div className="Text10N black mt12">{userData?.permanentAddress}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="12" sm="5" className="pr6">
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
                          <div className="Text10N black mt12">{userData?.experience}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </>
          : <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
            <div className="spinner"></div>
          </div>
      }
      <Modal isOpen={primaryModal} primary={primary} centered={true} size="lg">
        <ModalHeader primary={primary}>Primary Details</ModalHeader>
        <ModalBody>
          <div>
            <Row>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">First Name</div>
                <input type="text" name="firstName" placeholder="First_Name" defaultValue={userData?.firstName} className="PrimaryModel" onChange={handleChange} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Middle Name</div>
                <input type="text" name="middleName" className="PrimaryModel" defaultValue={userData?.middleName} placeholder="Middle_Name" onChange={handleChange} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Last Name</div>
                <input type="text" name="lastName" placeholder="Last_Name" defaultValue={userData?.lastName} className="PrimaryModel" onChange={handleChange} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Gender</div>
                <select name="gender" className="PrimaryModelDrop" defaultValue={userData?.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">DOB</div>
                <input type="date" name="DOB" placeholder="Date_Of_Birth" value={dayjs(userData?.DOB).format('DD-MMM-YYYY')} className="PrimaryModel" onChange={handleChange} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Blood Group</div>
                <input type="text" name="bloodGroup" className="PrimaryModel" defaultValue={userData?.bloodGroup} placeholder="Blood_Group" onChange={handleChange} />
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Marital Status</div>
                <select name="maritalStatus" placeholder="Marital_Status" defaultValue={userData?.maritalStatus} className="PrimaryModelDrop" onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </Col>
              <Col xl="4" sm="6" className="p-2">
                <div className="label">Physically Handicapped</div>
                <select name="physicallyHandicapped" className="PrimaryModelDrop" defaultValue={userData?.physicallyHandicapped} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Col>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn btnWidth Update" onClick={!updating && handleUpdateUserData}>
            {updating ? (
              <div className='w-100'>
                <div className="smallSpinner mx-auto"></div>
              </div>
            ) : (
              'Update'
            )}
          </Button>
          <Button color="danger" onClick={closeAll}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Primary Modal Section End */}


      {/* This is Contact Model Section Start */}

      <Modal isOpen={contactModel} contact={contact} centered={true} size="lg"  >
        <ModalHeader contact={contact}>Contact Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Work Email</div>
              <input type="email" name="workEmail" placeholder="Work_Email" defaultValue={userData?.workEmail} className="ContactModel" onChange={handleChange} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Personal Email</div>
              <input type="email" name="email" placeholder="Personal_Email" defaultValue={userData?.email} className="ContactModel" onChange={handleChange} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Mobile Phone</div>
              <input type="text" name="phoneNo" className="ContactModel" defaultValue={userData?.phoneNo} placeholder="Mobile_Phone" onChange={handleChange} />
            </Col>
            <Col xl="6" sm="6" className="p-2">
              <div className="label">Work Phone</div>
              <input type="text" name="workPhone" placeholder="Work_Phone" defaultValue={userData?.workPhone} className="ContactModel" onChange={handleChange} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn btnWidth" onClick={!updating && handleUpdateUserData}>
            {updating ? (
              <div className='w-100'>
                <div className="smallSpinner mx-auto"></div>
              </div>
            ) : (
              'Update'
            )}
          </Button>
          <Button color="danger" onClick={closeAll}>
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
              <div className="label">Current Address</div>
              <input type="text" name="currentAddress" placeholder="Current_Address" defaultValue={userData?.currentAddress} className="ContactModel" onChange={handleChange} />
            </Col>
            <Col xl="12" sm="12" className="p-2">
              <div className="label">Permanent_Address</div>
              <input type="text" name="permanentAddress"
                placeholder="Permanent_Address" className="ContactModel" defaultValue={userData?.permanentAddress} onChange={handleChange} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="Update_btn Update" onClick={!updating && handleUpdateUserData}>
            {updating ? (
              <div className='w-100'>
                <div className="smallSpinner mx-auto"></div>
              </div>
            ) : (
              'Update'
            )}
          </Button>
          <Button color="danger" onClick={closeAll}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Address Model Section End */}

      {/* This is Experience Model Section Start */}

      <Modal isOpen={experienceModel} experience={experience} centered={true} size="sm">
        <ModalHeader experience={experience}>Experience</ModalHeader>
        <ModalBody>

          <Row>
            <Col xl="12" sm="12">
              <div className="label">Experience</div>
              <select onChange={handleChange} className="PrimaryModelDrop" name="experience" defaultValue={userData?.experience}>
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
          <Button className="Update_btn Update" onClick={!updating && handleUpdateUserData}>
            {updating ? (
              <div className='w-100'>
                <div className="smallSpinner mx-auto"></div>
              </div>
            ) : (
              'Update'
            )}
          </Button>
          <Button color="danger" onClick={closeAll}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* This is Experience Model Section End */}

    </div>
  );
}

export default Profile;
