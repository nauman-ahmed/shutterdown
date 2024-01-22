import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Calender from '../assets/Profile/Calender.svg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import dayjs from 'dayjs'
import { tr } from 'date-fns/locale';

function CommonInputText(props) {

  const [getLocalStorageData, setGetLocalStorageData] = useState([]);
  const [defaultBrideName, setDefaultBrideName] = useState([]);
  const [defaultGroomName, setDefaultGroomName] = useState([]);

  const {
    setBrideName,
    brideName,
    setGroomName,
    groomName,
    setBrideHouseAddress,
    brideHouseAddress,
    setGroomHouseAddress,
    groomHouseAddress,
    EmailId,
    setEmailId,
    phoneNo,
    setPhoneNo,
    setClientSuggestions,
    clientSuggestions,
    dates,
    setDates,
    setEventType,
    eventType,
    setLocationSelect,
    locationSelect,
    setTravelBySelect,
    travelBySelect,
    setPhotoGrapher,
    photoGrapher,
    setCinematographerSelect,
    CinematographerSelect,
    setDroneSelect,
    droneSelect,
    setPreWeddingSelect,
    preWeddingSelect,
    sameVideoSelect,
    setAlbumSelect,
    albumSelect,
    setPromoSelect,
    promoSelect,
    longFilmSelect,
    setLongFilmSelect,
    setReelsSelect,
    reelsSelect,
    setHarddriveSelect,
    harddriveSelect,
    updateDate,
    preview,
  } = props;


  const formatDate = () => {
    const month = dates.getMonth() + 1;
    const day = dates.getDate();
    const year = dates.getFullYear();
    return `${day}/${month}/${year}`;
  }


  const handleBrideOnChange = (e) => {
    setBrideName(e.target.value);
    props.setError(false);
  };
  const handleGroomOnChange = (e) => {
    setGroomName(e.target.value);
    props.setError(false);
  };
  const handleBrideHouseOnChange = (e) => {
    setBrideHouseAddress(e.target.value);
    props.setError(false);
  };
  const handleGroomHouseOnChange = (e) => {
    setGroomHouseAddress(e.target.value);
    props.setError(false);
  };
  const handlePhoneNoOnChange = (e) => {
    setPhoneNo(e);
    props.setError(false);
  };

  const handleEmailIdOnChange = (e) => {
    setEmailId(e.target.value);
    props.setError(false);
  };
  const handleAddDatesOnChange = (e) => {
    props.setAddDates(e.target.value);
    props.setError(false);
  };
  const handleEventTypeOnChange = (e) => {
    props.setEventType(e.target.value);
    props.setError(false);
  };
  const handleLocationOnChange = (e) => {
    setLocationSelect(e.target.value);
    // props.setError(false);
  }
  const handleClientSuggestionsOnChange = (e) => {
    setClientSuggestions(e.target.value)
    props.setError(false)
  }

  return (
    <div className={props.divstyle}>
      <div className="Text16N" style={{ marginBottom: '6px' }}>
        {props.name}
      </div>
      {props.phoneInput ? (
        <div style={{ display: 'flex' }}>
          <PhoneInput
            country='in'
            name="Phone_Number"
            id="exampleEmail"
            value={props.name === 'Phone_Number' && getLocalStorageData
              ? getLocalStorageData.phone_Number : ''}
            placeholder="Phone_Number"
            inputClass={
              props.error && props.name === 'Phone_Number'
                ? 'forminput phoneinput border border-danger'
                : 'forminput phoneinput'
            }
            onChange={handlePhoneNoOnChange}
          />
        </div>
      ) : props.calender ? (
        <>
          {
            dates
              ? (<>
                <div
                  className={`forminput R_A_Justify1`}
                  onClick={props.CalenderPress}
                  style={{ cursor: 'pointer' }}
                >
                  {preview ? dayjs(dates).format('DD-MMM-YYYY') : formatDate()}
                  <img src={Calender} />
                </div>
              </>
              ) : updateDate ? (
                <>
                  <div
                    className={`forminput R_A_Justify1`}
                    onClick={props.CalenderPress}
                    style={{ cursor: 'pointer' }}
                  >
                    {updateDate}
                    <img src={Calender} />
                  </div>
                </>
              ) : (<>
                <div
                  className={`forminput R_A_Justify1`}
                  onClick={props.CalenderPress}
                  style={{ cursor: 'pointer' }}
                >
                  Date
                  <img src={Calender} />
                </div>
              </>)
          }
        </>
      ) : (
        <Input
          type="text"
          name="email"
          disabled={props.disabled ? true : false}
          value={
            props.name === "Event_Type"
              ? eventType
              : props.name === "Client_Suggestions_If_Any"
                ? clientSuggestions
                : props.name === "Location"
                  ? locationSelect
                  : props.name === "TravelBy"
                    ? travelBySelect
                    : props.name === "Photographers"
                      ? photoGrapher
                      : props.name === "Cinematographers"
                        ? CinematographerSelect
                        : props.name === "Drone"
                          ? droneSelect
                          : props.name === "Same_Day"
                            ? preWeddingSelect
                              : props.name === "Same_Day_Video"
                              ? sameVideoSelect
                                : props.name === "Album_1"
                                  ? albumSelect
                                  : props.name === "Album_2"
                                    ? albumSelect
                                    : props.name === "Album_3"
                                      ? albumSelect
                                      : props.name === "Promo"
                                        ? promoSelect
                                        : props.name === "Long_Film"
                                          ? longFilmSelect
                                          : props.name === "Reels"
                                            ? reelsSelect
                                            : props.name === "HardDrive"
                                              ? harddriveSelect
                                              : props.name === "Client_Suggestions_If_Any"
                                                ? clientSuggestions
                                                : props.name === 'Bride_Name' && getLocalStorageData
                                                  ? getLocalStorageData.Bride_Name
                                                  : props.name === 'Groom_Name' && getLocalStorageData
                                                    ? getLocalStorageData.Groom_Name
                                                    : props.name === 'Bride_s_House_Address' && getLocalStorageData
                                                      ? getLocalStorageData.Bride_s_House_Address
                                                      : props.name === 'Groom_s_House_Address' && getLocalStorageData
                                                        ? getLocalStorageData.Groom_s_House_Address
                                                        : props.name === 'Phone_Number' && getLocalStorageData
                                                          ? getLocalStorageData.Phone_Number
                                                          : props.name === 'Email_Id' && getLocalStorageData
                                                            ? getLocalStorageData.EmailID
                                                            : null
          }
          id="exampleEmail"
          required={props.name === 'Email_Id' || props.name === "Event_Type" ? true : false}
          placeholder={props.name || props.placeholder}
          className={
            props.textArea
              ? 'forminput h100 alignTop'
              : props.error &&
                props.name === 'Bride_Name' &&
                props.brideName.length < 1
                ? 'forminput border border-danger'
                : props.error &&
                  props.name === 'Groom_Name' &&
                  props.groomName.length < 1
                  ? 'forminput border border-danger'
                  : props.error &&
                    props.name === 'Bride_s_House_Address' &&
                    props.brideHouseAddress.length < 1
                    ? 'forminput border border-danger'
                    : props.error &&
                      props.name === 'Groom_s_House_Address' &&
                      props.groomHouseAddress.length < 1
                      ? 'forminput border border-danger'
                      : props.error &&
                        props.name === 'Email_Id' &&
                        props.EmailId.length < 1
                        ? 'forminput border border-danger'
                        : 'forminput'
          }
          onChange={
            props.name === 'Bride_Name'
              ? handleBrideOnChange
              : props.name === 'Groom_Name'
                ? handleGroomOnChange
                : props.name === 'Bride_s_House_Address'
                  ? handleBrideHouseOnChange
                  : props.name === 'Groom_s_House_Address'
                    ? handleGroomHouseOnChange
                    : props.name === 'Email_Id'
                      ? handleEmailIdOnChange
                      : props.name === 'Phone_Number'
                        ? handlePhoneNoOnChange
                        : props.name === 'Add Dates'
                          ? handleAddDatesOnChange
                          : props.name === 'Event_Type'
                            ? handleEventTypeOnChange
                            :props.name === 'Location'
                             ? handleLocationOnChange
                            : props.name === 'Client_Suggestions_If_Any'
                              ? handleClientSuggestionsOnChange
                              : null
          }
        />
      )}
    </div>
  );
}

export default CommonInputText;
