import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Row } from "reactstrap";
import "../../assets/css/Profile.css";
import Plus from "../../assets/Profile/Plus.svg";
import axios from "axios";
import Cookies from "js-cookie";
import BASE_URL from "../../API";
import { GetUserData } from "../../API/userApi";
import { IoMdDownload } from "react-icons/io";
import { ImNewTab } from "react-icons/im";

function Documents() {
  const [user, setUser] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const getUserData = async () => {
    const currentUser = JSON.parse(Cookies.get('currentUser'));
    setUser(currentUser)
  }
  useEffect(() => {
    getUserData();
  }, [])

  const [adhar, setAdhar] = useState();
  const adharCard = useRef(null);
  const handleUploadAdhar = () => {
    adharCard.current?.click();
  };
  const handleChangeAdhar = async (e) => {
    const reader = new FileReader(),
      files = e.target.files
    setAdhar(files[0])
    reader.readAsDataURL(files[0])
  };

  const [pan, setPan] = useState();
  const panCard = useRef(null);
  const handleUploadPan = () => {
    panCard.current?.click();
  };
  const handleChangePan = e => {
    const reader = new FileReader(),
      files = e.target.files
    setPan(files[0])
    reader.readAsDataURL(files[0])
  };

  const [drivingLicense, setDrivingLicense] = useState();
  const drivingLicenseCard = useRef(null);
  const handleUploadDrivingLicense = () => {
    console.log(drivingLicenseCard.current);
    drivingLicenseCard.current?.click();
  };
  const handleChangeDrivingLicense = e => {
    const reader = new FileReader(),
      files = e.target.files
    setDrivingLicense(files[0])
    reader.readAsDataURL(files[0])
  };

  const [voterID, setVoterID] = useState();
  const VoterIDCard = useRef(null);
  const handleUploadVoterIDCard = () => {
    VoterIDCard.current?.click();
  };
  const handleChangeVoterIDCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setVoterID(files[0])
    reader.readAsDataURL(files[0])
  };

  const [passport, setPassport] = useState();
  const passportCard = useRef(null);
  const handleUploadPassportCard = () => {
    passportCard.current?.click();
  };
  const handleChangePassportCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setPassport(files[0])
    reader.readAsDataURL(files[0])
  };

  const [photo, setPhoto] = useState();
  const photoCard = useRef(null);
  const handleUploadPhotoCard = () => {
    photoCard.current?.click();
  };
  const handleChangePhotoCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setPhoto(files[0])
    reader.readAsDataURL(files[0])
  };

  const [signature, setSignature] = useState();
  const signatureCard = useRef(null);
  const handleUploadSignatureCard = () => {
    signatureCard.current?.click();
  };
  const handleChangeSignatureCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setSignature(files[0])
    reader.readAsDataURL(files[0])
  };

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <Row className="W90">
          <Col xs="12" sm="6">
            <div className="profileCardDocument mt40">
              <div className="R_A_Justify p10">
                <div className="Text14Semi">Identity Documents</div>
              </div>
              <div className="line" />
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!uploadingFiles) {
                  setUploadingFiles(true)
                  const filesData = new FormData(e.target);
                  axios.post(BASE_URL + '/upload-files/' + user?._id, filesData).then(async (res) => {
                    await GetUserData();
                    getUserData();
                    setAdhar(null);
                    setPan(null);
                    setDrivingLicense(null);
                    setPassport(null);
                    setPhoto(null);
                    setSignature(null);
                    setVoterID(null);
                    window.notify('Files uploaded', 'success');
                  }).catch(err => {
                    console.log(err)
                  }).finally(setUploadingFiles(false))
                }
              }}>
                <div className="plt12">
                  <div>
                    <Row>
                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {adhar ? `${adhar?.name}` : 'Adhar Card'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={adharCard}
                            name="adharCard"
                            onChange={handleChangeAdhar}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between flex-row">
                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadAdhar}>Upload</div>
                          </div>
                          {user?.adharCard && (
                            <div>
                              <a href={BASE_URL + '/' + user?.adharCard} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.adharCard} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {pan ? `${pan.name}` : 'Pan Card'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={panCard}
                            name="panCard"
                            onChange={handleChangePan}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between">

                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadPan}>Upload</div>
                          </div>
                          {user?.panCard && (
                            <div>
                              <a href={BASE_URL + '/' + user?.panCard} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.panCard} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {drivingLicense ? `${drivingLicense.name}` : 'Driving License'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={drivingLicenseCard}
                            name="drivingLicense"
                            onChange={handleChangeDrivingLicense}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadDrivingLicense}>Upload</div>
                          </div>
                          {user?.drivingLicense && (
                            <div>
                              <a href={BASE_URL + '/' + user?.drivingLicense} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.drivingLicense} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {voterID ? `${voterID.name}` : 'Voter ID Card'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={VoterIDCard}
                            name="voterID"
                            onChange={handleChangeVoterIDCard}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadVoterIDCard}>Upload</div>
                          </div>
                          {user?.voterID && (
                            <div>
                              <a href={BASE_URL + '/' + user?.voterID} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.voterID} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {passport ? `${passport.name}` : 'Passport'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={passportCard}
                            name="passport"
                            onChange={handleChangePassportCard}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadPassportCard}>Upload</div>
                          </div>
                          {user?.passport && (
                            <div>
                              <a href={BASE_URL + '/' + user?.passport} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.passport} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>


                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {photo ? `${photo.name}` : 'Photo'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={photoCard}
                            accept=".jpg, .jpeg, .png"
                            name="photo"
                            onChange={handleChangePhotoCard}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between">

                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadPhotoCard}>Upload</div>
                          </div>
                          {user?.photo && (
                            <div>
                              <a href={BASE_URL + '/' + user?.photo} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.photo} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col xs="12">
                        <div className="R_A_Justify mt12">
                          <div className="Text12 gray"> {signature ? `${signature.name}` : 'Signature'}</div>
                          <div className="Mandatory Text8S">MANDATORY</div>
                        </div>
                        <div>
                          <input type="file"
                            ref={signatureCard}
                            name="signature"
                            onChange={handleChangeSignatureCard}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="d-flex justify-content-between">

                          <div className="detailsBox mt12">
                            <img src={Plus} />
                            <div className="Text10N gray" onClick={handleUploadSignatureCard}>Upload</div>
                          </div>
                          {user?.signature && (
                            <div>
                              <a href={BASE_URL + '/' + user?.signature} download={user?.firstName + '-Adhar'}>
                                <IoMdDownload className="fs-3 me-1 text-primary mt-2" />
                              </a>
                              <a href={BASE_URL + '/preview/' + user?.signature} target="_blank">
                                <ImNewTab className="fs-4 me-3 text-primary mt-2" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <Button className="m-1 btnWidth" type="submit">
                    {uploadingFiles ? (
                      <div className='w-100'>
                        <div class="smallSpinner mx-auto"></div>
                      </div>
                    ) : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Documents;