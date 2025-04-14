import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Form, Input, InputGroup, InputGroupText, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from "react-redux";
import { updateClintData } from "../../redux/clientBookingForm";
import PhoneInput from 'react-phone-input-2';
import Select from 'react-select';
import { FiPlus, FiMinus, FiChevronDown } from 'react-icons/fi';


export const saveDraftClientData = (data) => {
  try {
    // Check if data is empty
    if (!data ||
      (typeof data === 'object' && Object.keys(data).length === 1) || !data.brideName) {
      console.log('No data to save as draft');
      return false;
    }

    // Convert the data object to a JSON string
    const jsonData = JSON.stringify(data);

    // Save the JSON string to localStorage with the key 'draftClientData'
    localStorage.setItem('draftClientData', jsonData);

    console.log('Client data draft saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving client data draft:', error);
    return false;
  }
};


export const getDraftClientData = () => {
  try {
    const jsonData = localStorage.getItem('draftClientData');
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error('Error retrieving draft client data:', error);
    return null;
  }
};
function FormI() {
  const dispatch = useDispatch();
  const clientData = useSelector(state => state.clientData);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    // Initialize the phoneNumbers array if it doesn't exist in clientData
    const data = getDraftClientData()
    if (data) {
      setFormValues(data);
      dispatch(updateClintData(data));
    } else {
      setFormValues({
        ...clientData,
        phoneNumbers: clientData.phoneNumbers || [{ number: '', belongsTo: 'Bride' }]
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveDraftClientData(formValues)
  }, [formValues])

  useEffect(() => {
    const data = getDraftClientData()
    if (data) {
      setFormValues(data);
      dispatch(updateClintData(data));

    }
  }, [])

  const updateValues = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const updatePhoneNumber = (value, index) => {
    try {
      const updatedPhoneNumbers = [...(formValues.phoneNumbers || [])];
      updatedPhoneNumbers[index] = {
        ...updatedPhoneNumbers[index],
        number: value
      };
      setFormValues({ ...formValues, phoneNumbers: updatedPhoneNumbers });
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };

  const updatePhoneOwner = (value, index) => {
    try {
      const updatedPhoneNumbers = [...(formValues.phoneNumbers || [])];
      updatedPhoneNumbers[index] = {
        ...updatedPhoneNumbers[index],
        belongsTo: value
      };
      setFormValues({ ...formValues, phoneNumbers: updatedPhoneNumbers });
    } catch (error) {
      console.error("Error updating phone owner:", error);
    }
  };


  const addPhoneNumber = () => {
    try {
      setFormValues({
        ...formValues,
        phoneNumbers: formValues.phoneNumbers ?
          [...formValues.phoneNumbers, { number: '', belongsTo: 'Bride' }] :
          [{ number: '', belongsTo: 'Bride' }]
      });
    } catch (error) {
      console.error("Error adding phone number:", error);
    }
  };

  const removePhoneNumber = () => {
    try {
      if (formValues.phoneNumbers && formValues.phoneNumbers.length > 1) {
        const updatedPhoneNumbers = [...formValues.phoneNumbers];
        updatedPhoneNumbers.pop(); // Remove the last phone number
        setFormValues({ ...formValues, phoneNumbers: updatedPhoneNumbers });
      }
    } catch (error) {
      console.error("Error removing phone number:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if at least one phone number is valid
    const hasValidPhone = formValues.phoneNumbers.some(phone => phone.number && phone.number.length > 8);

    if (hasValidPhone) {
      // Get the first valid phone number for backward compatibility
      const primaryPhone = formValues.phoneNumbers.find(phone => phone.number && phone.number.length > 8)?.number || '';

      dispatch(updateClintData({
        ...clientData,
        ...formValues,
        phoneNumber: primaryPhone, // Keep for backward compatibility
        form1Submitted: true
      }));
      saveDraftClientData({
        ...clientData,
        ...formValues,
        phoneNumber: primaryPhone, // Keep for backward compatibility
        form1Submitted: true
      })
      navigate('/clients/add-client/form-2');
    } else {
      return window.notify("Please provide at least one valid phone number!", "error");
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
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  let paymentOptions = [
    { value: 'Advance', label: 'Advance' },
    { value: 'Full Payment', label: 'Full Payment' },
    { value: 'Others', label: 'Others' },
  ];

  const navigate = useNavigate();

  return (
    <div className="mt18">
      <Form onSubmit={(e) => { handleSubmit(e) }}>
        <Row>
          <Col xs="12" sm="6" className="pr6">
            <div className='mt25'>
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
            <div className='mt25'>
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
          <Col xs="12" sm="6">
            <div className='mt25'>
              <div className="Text16N" style={{ marginBottom: '6px', display: 'flex', justifyContent: 'flex-start', gap: '10px', alignItems: 'center' }}>
                Phone Numbers
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={addPhoneNumber}
                    style={{ borderRadius: '50%', padding: '6px 6px' }}
                  >
                    <FiPlus />
                  </Button>
                  {formValues.phoneNumbers && formValues.phoneNumbers.length > 1 && (
                    <Button
                      color="danger"
                      size="sm"
                      onClick={removePhoneNumber}
                      style={{ borderRadius: '50%', padding: '6px 6px' }}
                    >
                      <FiMinus />
                    </Button>
                  )}
                </div>
              </div>
              {formValues.phoneNumbers?.map((phone, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <InputGroup>
                    <PhoneInput
                      country='in'
                      name={`phoneNumber-${index}`}
                      required={index === 0}
                      onChange={(value) => updatePhoneNumber(value, index)}
                      value={phone.number || ''}
                      placeholder="Phone Number"
                      inputClass='forminput phoneinput'
                      containerStyle={{ width: '75%' }}
                    />
                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        color="light"
                        style={{
                          backgroundColor: '#EFF0F5',
                          borderRadius: '0',
                          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15)',
                          borderLeft: 'none',
                          color: '#666DFF'
                        }}
                      >
                        {phone.belongsTo || 'Bride'} <FiChevronDown size={14} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => updatePhoneOwner('Bride', index)}>Bride</DropdownItem>
                        <DropdownItem onClick={() => updatePhoneOwner('Groom', index)}>Groom</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </InputGroup>
                </div>
              ))}
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
                required={false}
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
              <Select
                value={formValues?.bookingStatus ? { value: formValues?.bookingStatus, label: formValues?.bookingStatus } : null}
                name='bookingStatus'
                className='w-50'
                onChange={(selected) => {
                  setFormValues({ ...formValues, bookingStatus: selected.value })
                }}
                styles={customStyles}
                options={bookingOptions}
                required
              />
            </div>
          </Col>
          <Col xs="12" lg='6' sm="6">
            <div className='mt25'>
              <div className="Text16N" style={{ marginBottom: '6px' }}>
                Payment Status
              </div>
              <Select
                value={formValues?.paymentStatus ? { value: formValues?.paymentStatus, label: formValues?.paymentStatus } : null}
                name='paymentStatus'
                onChange={(selected) => {
                  setFormValues({ ...formValues, paymentStatus: selected.value })
                }}
                className='w-50'
                styles={customStyles}
                options={paymentOptions}
                required
              />
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