import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Form, Input } from 'reactstrap';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from "react-redux";
import { updateClintData } from "../../redux/clientBookingForm";
import PhoneInput from 'react-phone-input-2';
import Select from 'react-select'

function FormI() {
  const dispatch = useDispatch();
  const clientData = useSelector(state => state.clientData);
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    setFormValues(clientData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const updateValues = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues?.phoneNumber?.length > 8) {
      dispatch(updateClintData({ ...clientData, ...formValues, form1Submitted: true }))
      navigate('/MyProfile/AddClient/Form-II');
    } else {
      return window.notify("Please provide phone Number!", "error")
    }
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
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };
  
  let bookingOptions = [
    {
      value: 'Yes',
      label: 'Yes',
    },
    {
      value: 'No',
      label: 'No',
    },
  ];
  let paymentOptions = [
    {
      value: 'Advance',
      label: 'Advance',
    },
    {
      value: 'Full Payment',
      label: 'Full Payment',
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="mt18">
      <Form onSubmit={(e) => { handleSubmit(e) }}>
        <Row>
          <Col xs="12" sm="6" className="pr6">
            <div>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Bride Name
              </div>
              <Input
                type="text"
                name="brideName"
                disabled={false}
                className='forminput'
                value={formValues?.brideName}
                required={true}
                onChange={(e) => updateValues(e)}
                placeholder={'Bride Name'}
              />
            </div>
          </Col>
          <Col xs="12" sm="6">
            <div>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Groom Name
              </div>
              <Input
                type="text"
                name="groomName"
                disabled={false}
                className='forminput'
                value={formValues?.groomName}
                required={true}
                onChange={(e) => updateValues(e)}
                placeholder={'Groom Name'}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" className="pr6">
            <div className='mt25'>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Phone Number
              </div>
              {/* <div style={{ display: 'flex' }}> */}
                <PhoneInput
                  country='in'
                  name="phoneNumber"
                  id="exampleEmail"
                  required={true}
                  onChange={(value) => {
                    setFormValues({ ...formValues, phoneNumber: value })
                  }}
                  value={formValues?.phoneNumber}
                  placeholder="Phone Number"
                  inputClass={'forminput phoneinput'}
                />
              {/* </div> */}
            </div>
          </Col>
          <Col xs="12" sm="6">
            <div className='mt25'>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Email Id
              </div>
              <Input
                type='email'
                name="email"
                disabled={false}
                value={formValues?.email}
                onChange={(e) => updateValues(e)}
                className='forminput'
                style={{ color: '#666DFF !important' }}
                required={true}
                placeholder={'Email Id'}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg='6' className="pr6">
            <div className='mt25'>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Booking Confirmed
              </div>
              <Select value={formValues?.bookingStatus ? { value: formValues?.bookingStatus, label: formValues?.bookingStatus } : null} name='bookingStatus' className='w-50' onChange={(selected) => {
                setFormValues({ ...formValues, bookingStatus: selected.value })
              }} styles={customStyles} options={bookingOptions} required />
            </div>
          </Col>
          <Col xs="12" lg='6' sm="6">
            <div className='mt25'>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Payment Status
              </div>
              <Select value={formValues?.paymentStatus ? { value: formValues?.paymentStatus, label: formValues?.paymentStatus } : null} name='paymentStatus' onChange={(selected) => {
                setFormValues({ ...formValues, paymentStatus: selected.value })
              }} className='w-50' styles={customStyles} options={paymentOptions} required />
            </div>
          </Col>
        </Row>
        <div className="centerAlign mt40">
          <Button type="submit" className="submit_btn submit">
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default FormI;
