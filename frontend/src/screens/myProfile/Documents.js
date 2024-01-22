import React, { useState, useRef } from "react";
import {
  Button,
  Col,
  Row,
} from "reactstrap";
import "../../assets/css/Profile.css";
import Plus from "../../assets/Profile/Plus.svg";
import axios from "axios";
import Cookies from "js-cookie";

function Documents() {

  // This is Get the ID Of user form the Local Storage

  let user = JSON.parse(Cookies.get('currentUser'))
  let id = user._id


  // This is Adhar Card Function and state Start.....
  const [adhar, setAdhar] = useState();
  const adharCard = useRef(null);

  const handleUploadAdhar = () => {
    adharCard.current?.click();
  };

  const handleChangeAdhar = async (e) => {
    const reader = new FileReader(),
      files = e.target.files
    setAdhar(files[0])
    reader.onload = async function () {
      return await SendAdharCard(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendAdharCard = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }


  // This is Adhar Card Function and state End.....

  // This is Pan card Function and state start.....

  const [pan, setPan] = useState();
  const panCard = useRef(null);


  const handleUploadPan = () => {
    panCard.current?.click();
  };

  const handleChangePan = e => {
    const reader = new FileReader(),
      files = e.target.files
    setPan(files[0])
    reader.onload = async function () {
      return await SendPanCard(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendPanCard = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }

  // This is Pan card Function and state End.....

  // This is Driving License Function and state Start.....

  const [drivingLicense, setDrivingLicense] = useState();
  const drivingLicenseCard = useRef(null);


  const handleUploadDrivingLicense = () => {
    drivingLicenseCard.current?.click();
  };

  const handleChangeDrivingLicense = e => {
    const reader = new FileReader(),
      files = e.target.files
    setDrivingLicense(files[0])
    reader.onload = async function () {
      return await SendDrivingLicenseCard(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendDrivingLicenseCard = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }

  // This is Driving License Function and state End.....

  // This is Voter ID Card Function and state Start.....

  const [voterID, setVoterID] = useState();
  const VoterIDCard = useRef(null);


  const handleUploadVoterIDCard = () => {
    VoterIDCard.current?.click();
  };

  const handleChangeVoterIDCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setVoterID(files[0])
    reader.onload = async function () {
      return await SendVoterIDCardCard(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendVoterIDCardCard = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }



  // This is Voter ID Card Function and state End.....

  // This is Passport Function and state Start.....

  const [passport, setPassport] = useState();
  const passportCard = useRef(null);


  const handleUploadPassportCard = () => {
    passportCard.current?.click();
  };

  const handleChangePassportCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setPassport(files[0])
    reader.onload = async function () {
      return await SendPasswordCard(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendPasswordCard = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }


  // This is Passport Function and state End.....

  // This is Photo Function and state Start.....

  const [photo, setPhoto] = useState();
  const photoCard = useRef(null);


  const handleUploadPhotoCard = () => {
    photoCard.current?.click();
  };

  const handleChangePhotoCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setPhoto(files[0])
    reader.onload = async function () {
      return await SendPhoto(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendPhoto = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }


  // This is Photo Function and state End.....

  // This is Signature Function and state End.....

  const [signature, setSignature] = useState();
  const signatureCard = useRef(null);


  const handleUploadSignatureCard = () => {
    signatureCard.current?.click();
  };

  const handleChangeSignatureCard = e => {
    const reader = new FileReader(),
      files = e.target.files
    setSignature(files[0])
    reader.onload = async function () {
      return await SendSignature(reader.result)
    }
    reader.readAsDataURL(files[0])
  };

  const SendSignature = async (file) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/MyProfile/Documents/${id}`,
        {
          Headers: {
            'Content-Type': 'application/json',
          },
          file
        }
      );
    } catch (error) {
      console.log(error)
    }
  }


  // This is Signature Function and state End.....

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
                          onChange={handleChangeAdhar}
                          // onChange={(e) => {
                          //   e.target.files[0].onChange(e.target.files)

                          // }}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadAdhar}>Upload Adhar</div>
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
                          onChange={handleChangePan}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadPan}>Upload Pan</div>
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
                          onChange={handleChangeDrivingLicense}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadDrivingLicense}>Upload Pan</div>
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
                          onChange={handleChangeVoterIDCard}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadVoterIDCard}>Upload Pan</div>
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
                          onChange={handleChangePassportCard}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadPassportCard}>Upload Pan</div>
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
                          onChange={handleChangePhotoCard}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadPhotoCard}>Upload Pan</div>
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
                          onChange={handleChangeSignatureCard}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="detailsBox mt12">
                        <img src={Plus} />
                        <div className="Text10N gray" onClick={handleUploadSignatureCard}>Upload Pan</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Documents;