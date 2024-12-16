import React, { useState } from "react";
import { useEffect } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
function CommonDropText(props) {
  const {
    dropdownSelect,
    setDropdownSelect,
    dropdownOpen,
    setDropdownOpen,
    dropdownSelect1,
    setDropdownSelect1,
    dropdownOpen1,
    setDropdownOpen1,
    setDropdownOpen2,
    dropdownSelect2,
    setDropdownSelect2,
    dropdownOpen2,
    locationSelect,
    OpenLocation,
    travelBySelect,
    travelOpen,
    photoGrapher,
    setPhotoGrapher,
    photoGrapherOpen,
    setPhotoGrapherOpen,
    CinematographerSelect,
    setCinematographerSelect,
    cinematographerOpen,
    setCinematographerOpen,
    droneOpen,
    setDroneOpen,
    droneSelect,
    setDroneSelect,
    preWeddingOpen,
    setPreWeddingOpen,
    setPreWeddingSelect,
    preWeddingSelect,
    albumSelect,
    setAlbumSelect,
    openAlbum,
    setOpenAlbum,
    AlbumType,
    setAlbumType,
    openAlbumType,
    setOpenAlbumType,
    album2Select,
    setAlbum2Select,
    openAlbum2,
    setOpenAlbum2,
    album2Type,
    setAlbum2Type,
    openAlbum2Type,
    setOpenAlbum2Type,
    promoSelect,
    setPromoSelect,
    openPromo,
    setOpenPromo,
    openLongFilm,
    setOpenLongFilm,
    longFilmSelect,
    setLongFilmSelect,
    openReels,
    setOpenReels,
    reelsSelect,
    setReelsSelect,
    openHardDrive,
    setOpenHardDrive,
    harddriveSelect,
    setHarddriveSelect,
    setRollOpen,
    rollOpen,
    setRollSelect,
    rollSelect,
    sameDaySelect,
    setSameDaySelect,
    openSameDay,
    setOpenSameDay,
    sameVideoSelect,
    setSameVideoSelect,
    sameDayVideoOpen,
    setSameDayVideoOpen,
    tentative,
    setTentative,
    tentativeOpen,
    setTentativeOpen,
  } = props;

  const [defaultDropdownValues, setDefalutDropdownValues] = useState([]);

  useEffect(() => {
    setDefalutDropdownValues({
      Booking_confirmed: "Yes",
      Bride_Name: "",
      Bride_s_House_Address: [],
      EmailID: "",
      Groom_Name: "",
      Groom_s_House_Address: [],
      POC: "Select",
      Payment_Status: "Advance",
      phone_Number: "",
      userEmail: "",
    });
  }, []);

  const toggle = () => {
    if (props.name === "Location") {
      props.setOpenLocation((prevState) => !prevState);
    }
    if (props.name === "TravelBy") {
      props.setTravelOpen((prevState) => !prevState);
    }
    if (props.name === "Photographers") {
      setPhotoGrapherOpen((prevState) => !prevState);
    }
    if (props.name === "Cinematographers") {
      setCinematographerOpen((prevState) => !prevState);
    }
    if (props.name === "Drone") {
      setDroneOpen((prevState) => !prevState);
    }
    if (props.name === "Pre-wedding-Shoot") {
      setPreWeddingOpen((prevState) => !prevState);
    }
    if (props.name === "Album_1") {
      setOpenAlbum((prev) => !prev);
    }
    if (props.name === "Album_1_Type") {
      setOpenAlbumType((prevState) => !prevState);
    }
    if (props.name === "Album-2") {
      setOpenAlbum2((prevState) => !prevState);
    }
    if (props.name === "Album-2-Type") {
      setOpenAlbum2Type((prevState) => !prevState);
    }
    if (props.name === "Promo") {
      setOpenPromo((prevState) => !prevState);
    }
    if (props.name === "Long_Film") {
      setOpenLongFilm((prevState) => !prevState);
    }
    if (props.name === "Reels") {
      setOpenReels((prevState) => !prevState);
    }
    if (props.name === "HardDrive") {
      setOpenHardDrive((prevState) => !prevState);
    }
    if (props.name === "Booking_confirmed") {
      setDropdownOpen((prevState) => !prevState);
    }
    if (props.name === "Payment_Status") {
      setDropdownOpen1((prevState) => !prevState);
    }
    if (props.name === "POC") {
      setDropdownOpen2((prevState) => !prevState);
    }
    if (props.name === "Pre-wedding-Shoot") {
      setPreWeddingOpen((prevState) => !prevState);
    }
    if (props.name === "Role") {
      setRollOpen((prevState) => !prevState);
    }
    if (props.name === "Same_Day_Photo") {
      setOpenSameDay((prevState) => !prevState);
    }
    if (props.name === "Same_Day_Video") {
      setSameDayVideoOpen((prevState) => !prevState);
    }
    if (props.name === "Tentative") {
      setTentativeOpen((prevState) => !prevState);
    }
  };
  const handleChange = (i) => {
    if (i.check === "Location") {
      props.setLocationSelect(i.title);
    }
    if (i.check === "Travel") {
      props.setTravelBySelect(i.title);
    }
    if (i.check === "photographers") {
      setPhotoGrapher(i.title);
    }
    if (i.check === "cinemaphotographer") {
      setCinematographerSelect(i.title);
    }
    if (i.check === "Drone") {
      setDroneSelect(i.title);
    }
    if (i.check === "preWedding") {
      setPreWeddingSelect(i.title);
    }
    if (i.check === "album") {
      setAlbumSelect(i.title);
    }
    if (i.check === "albumType") {
      setAlbumType(i.title);
    }
    if (i.check === "album2") {
      setAlbum2Select(i.title);
    }
    if (i.check === "albumType2") {
      setAlbum2Type(i.title);
    }
    if (i.check === "promo") {
      setPromoSelect(i.title);
    }
    if (i.check === "longFilm") {
      setLongFilmSelect(i.title);
    }
    if (i.check === "reels") {
      setReelsSelect(i.title);
    }
    if (i.check === "hardDrive") {
      setHarddriveSelect(i.title);
    }
    if (i.check === "Payment") {
      setDropdownSelect1(i.title);
    }
    if (i.check === "POC" && props.name === "POC") {
      setDropdownSelect2(i.title);
      props.setError(false);
    }
    if (i.check === "Booking") {
      setDropdownSelect(i.title);
      props.setError(false);
    }
    if (props.name === "Booking_confirmed") {
      props.setError(false);
    }
    if (i.check === "roll") {
      setRollSelect(i.title);
      props.setError(false);
    }
    if (i.check === "sameDay") {
      setSameDaySelect(i.title);
    }
    if (i.check === "sameDayVideo") {
      setSameVideoSelect(i.title);
    }
    if (i.check === "tentative") {
      setTentative(i.title);
    }
  };
  return (
    <div className={props.divstyle}>
      <div className="Text16N" style={{ marginBottom: "6px" }}>
        {props.name}
      </div>
      <ButtonDropdown className="dropBox">
        <Dropdown
          isOpen={
            dropdownOpen ||
            travelOpen ||
            OpenLocation ||
            dropdownOpen1 ||
            dropdownOpen2 ||
            photoGrapherOpen ||
            cinematographerOpen ||
            droneOpen ||
            preWeddingOpen ||
            openAlbum ||
            openAlbumType ||
            openAlbum2 ||
            openAlbum2Type ||
            openPromo ||
            openLongFilm ||
            openReels ||
            openHardDrive ||
            preWeddingOpen ||
            rollOpen ||
            openSameDay ||
            sameDayVideoOpen ||
            tentativeOpen
          }
          toggle={toggle}
        >
          <DropdownToggle
            caret
            color="#EFF0F5"
            className={
              props.error
                ? "dropdown-toggle border border-danger"
                : "dropdown-toggle"
            }
            style={{ width: "100%" }}
          >
            {props.name === "Booking_confirmed" &&
            dropdownSelect === "Yes" &&
            defaultDropdownValues
              ? defaultDropdownValues.Booking_confirmed
              : props.name === "Payment_Status" &&
                dropdownSelect1 === "Advance" &&
                defaultDropdownValues
              ? defaultDropdownValues.Payment_Status
              : props.name === "POC" &&
                dropdownSelect2 === "Select" &&
                defaultDropdownValues
              ? defaultDropdownValues.POC
              : dropdownSelect ||
                locationSelect ||
                travelBySelect ||
                dropdownSelect1 ||
                dropdownSelect2 ||
                photoGrapher ||
                CinematographerSelect ||
                droneSelect ||
                preWeddingSelect ||
                albumSelect ||
                AlbumType ||
                album2Select ||
                album2Type ||
                promoSelect ||
                longFilmSelect ||
                reelsSelect ||
                harddriveSelect ||
                preWeddingSelect ||
                rollSelect ||
                sameDaySelect ||
                sameVideoSelect ||
                tentative}
          </DropdownToggle>
          <DropdownMenu
            updateOnSelect
            className="dropOpenBox"
            style={{ background: "#EFF0F5" }}
          >
            {props.data?.map((i) => {
              const background =
                i.check === "Location"
                  ? locationSelect === i.title
                  : i.check === "photographers"
                  ? photoGrapher === i.title
                  : i.check === "Travel"
                  ? travelBySelect === i.title
                  : i.check === "cinemaphotographer"
                  ? CinematographerSelect === i.title
                  : i.check === "Drone"
                  ? droneSelect === i.title
                  : i.check === "preWedding"
                  ? preWeddingSelect === i.title
                  : i.check === "album"
                  ? albumSelect === i.title
                  : i.check === "albumType"
                  ? AlbumType === i.title
                  : i.check === "albumType2"
                  ? album2Type === i.title
                  : i.check === "tentative"
                  ? tentative === i.title
                  : i.check === "album2"
                  ? album2Select === i.title
                  : i.check === "promo"
                  ? promoSelect === i.title
                  : i.check === "longFilm"
                  ? longFilmSelect === i.title
                  : i.check === "reels"
                  ? reelsSelect === i.title
                  : i.check === "hardDrive"
                  ? harddriveSelect === i.title
                  : i.check === "Booking"
                  ? dropdownSelect === i.title1
                  : i.check === "roll"
                  ? rollSelect === i.title
                  : i.check === "Payment"
                  ? dropdownSelect1 === i.title
                  : i.check === "POC"
                  ? dropdownSelect2 === i.title
                  : i.check === "Payment"
                  ? dropdownSelect1 === i.title
                  : i.check === "POC"
                  ? dropdownSelect2 === i.title
                  : i.check === "sameDay"
                  ? sameDaySelect === i.title
                  : i.check === "sameDayVideo"
                  ? sameVideoSelect === i.title
                    ? true
                    : false
                  : dropdownSelect == null;
              return (
                <DropdownItem
                  key={i.id}
                  onClick={() => handleChange(i)}
                  // defaultValue={defaultDropdownValues.Booking_confirmed}
                  style={{
                    background: background ? "#666DFF" : "",
                    color: background ? "white" : "",
                  }}
                  defaultValue={
                    props.name === "Location"
                      ? locationSelect
                      : props.name === "TravelBy"
                      ? travelBySelect
                      : props.name === "Photographers"
                      ? photoGrapher
                      : props.name === "Cinematographers"
                      ? CinematographerSelect
                      : props.name === "Drone"
                      ? droneSelect
                      : props.name === "Same_Day_Photo"
                      ? sameDaySelect
                      : props.name === "Same_Day_Video"
                      ? sameVideoSelect
                      : props.name === "Album_1"
                      ? albumSelect
                      : props.name === "Promo"
                      ? promoSelect
                      : props.name === "Long_Film"
                      ? longFilmSelect
                      : props === "Reels"
                      ? reelsSelect
                      : props.name === "HardDrive"
                      ? harddriveSelect
                      : null
                  }
                >
                  {i.title}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </ButtonDropdown>
    </div>
  );
}
export default CommonDropText;
