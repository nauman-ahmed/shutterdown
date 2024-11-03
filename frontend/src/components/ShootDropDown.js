import React, { useState, useRef, useEffect } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import ShootStar from "../assets/Profile/ShootStar.svg";
import Edit from "../assets/Profile/Edit.svg";

function ShootDropDown(props) {
  const { 
    existedUsers,
    userChecked,
    userUnChecked,
    usersToShow,
    allowedPersons,
    allEvents,
    currentEvent,
    message,
    fromPreWed,
    preWedDetails,
    eventsForShow
  } = props;
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to track the dropdown

  const toggle = () => {
  };

  const iconClickedToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const shooterDatesHandler = (user) => {
    let pushShooter = true;
    if (allEvents && currentEvent) {
      const sameDateEvents = [...allEvents, ...eventsForShow].filter(event => event.eventDate === currentEvent.eventDate && event._id !== currentEvent._id);

      if (sameDateEvents?.length > 0) {
        sameDateEvents.forEach(event => {
          if ([...event?.shootDirectors, ...event?.choosenPhotographers, ...event?.choosenCinematographers, ...event?.droneFlyers, ...event.manager, ...event.assistants, ...event.sameDayPhotoMakers, ...event.sameDayVideoMakers]?.some(preUser => preUser.email === user.email)) {
            pushShooter = false;
          }
        });
      }

      return pushShooter;
    }
    return pushShooter;
  };

  return (
    <div className="d-flex" ref={dropdownRef}> {/* Apply ref to dropdown wrapper */}
      <ButtonDropdown>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            className="DropDownBox tableDropdwn"
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            {props?.data?.length === 0 ? (
              <div style={{ whiteSpace: "nowrap" }}>
                <img alt="" src={ShootStar} style={{ marginRight: "5px" }} />
                Select ({allowedPersons})
              </div>
            ) : (
              <div style={{ whiteSpace: "nowrap" }} onClick={iconClickedToggle}>
                <img alt="" src={Edit} onClick={iconClickedToggle} /> ({allowedPersons})
              </div>
            )}
          </DropdownToggle>
          <DropdownMenu className="dropOpenBox" style={{maxHeight: "35vh", overflow: "scroll"}}>
            {usersToShow?.map((user) => (
              <DropdownItem
                key={user._id}
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  const add = shooterDatesHandler(user);
                  if (fromPreWed) {
                    if (
                      existedUsers?.length > 0 &&
                      existedUsers?.some(
                        (existingUser) => existingUser._id === user._id
                      )
                    ) {
                      userUnChecked(user);
                    } else {
                      if (existedUsers?.length >= allowedPersons) {
                        window.notify(
                          `Maximum Limit is ${allowedPersons}, uncheck previous!`,
                          "error"
                        );
                        return;
                      } else {
                        if (
                          preWedDetails &&
                          [
                            ...(preWedDetails?.photographers || []),
                            ...(preWedDetails?.cinematographers || []),
                            ...(preWedDetails?.assistants || []),
                            ...(preWedDetails?.droneFlyers || [])
                          ].some(preUser => preUser.email === user.email)
                        ) {
                          window.notify(
                            `This ${message} has already been assigned in some other role on the same event!`,
                            "error"
                          );
                        } else {
                          if (add) {
                            userChecked(user);
                          } else {
                            window.notify(
                              `This ${message} has already been assigned in some other event on the same date!`,
                              "error"
                            );
                          }
                        }
                      }
                    }
                  } else {
                    if (
                      existedUsers?.length > 0 &&
                      existedUsers?.some(
                        (existingUser) => existingUser._id == user._id
                      )
                    ) {
                      userUnChecked(user);
                    } else {
                      if (existedUsers?.length >= allowedPersons) {
                        window.notify(
                          `Maximum Limit is ${allowedPersons}, uncheck previous!`,
                          "error"
                        );
                        return;
                      } else {
                        if ([...currentEvent.shootDirectors, ...currentEvent?.choosenPhotographers, ...currentEvent?.choosenCinematographers, ...currentEvent.droneFlyers, ...currentEvent.manager, ...currentEvent.assistants, ...currentEvent.sameDayPhotoMakers, ...currentEvent.sameDayVideoMakers]?.some(preUser => preUser.email === user.email)) {
                          window.notify(
                            `This ${message} has already been assigned in some other role on the same event!`,
                            "error"
                          );
                        } else {
                          if (add) {
                            userChecked(user);
                          } else {
                            window.notify(
                              `This ${message} has already been assigned in some other event on the same date!`,
                              "error"
                            );
                          }
                        }
                      }
                    }
                  }
                }}
              >
                {user.firstName} {user.lastName}
                <input
                  className="ml-2 mx-2"
                  type="checkbox"
                  checked={
                    existedUsers?.length > 0 &&
                    existedUsers?.some(
                      (existingUser) => existingUser._id === user._id
                    )
                  }
                />
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonDropdown>
    </div>
  );
}

export default ShootDropDown;
