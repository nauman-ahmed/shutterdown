import React, { useState, useRef } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import ShootStar from "../assets/Profile/ShootStar.svg";
import { ToastContainer } from "react-toastify";
import Edit from "../assets/Profile/Edit.svg";
import { all } from "axios";

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
  const target = useRef(null);

  const toggle = async () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const shooterDatesHandler = (user) => {
    let pushShooter = true;
    if (allEvents && currentEvent) {
      console.log("Current Event", currentEvent.eventDate)
      const sameDateEvents = [...allEvents, ...eventsForShow].filter(event => event.eventDate === currentEvent.eventDate && event._id !== currentEvent._id)

      if (sameDateEvents?.length > 0) {
        sameDateEvents.forEach(event => {
          if ([...event?.shootDirectors, ...event?.choosenPhotographers, ...event?.choosenCinematographers, ...event?.droneFlyers, ...event.manager, ...event.assistants, ...event.sameDayPhotoMakers, ...event.sameDayVideoMakers]?.some(preUser => preUser.email === user.email)) {
            pushShooter = false
          }
        })
      }

      return pushShooter
      // allEvents?.map((event) => {
      //   if (event.eventDate === currentEvent.eventDate) {
      //     dummy[event.eventDate] = Array.isArray(dummy[event.eventDate])
      //       ? [...dummy[event.eventDate], ...event[role]]
      //       : [...event[role], user];
      //   } else {
      //     dummy[event.eventDate] = event[role];
      //   }
      // });
      // for (const date in dummy) {
      //   const events = dummy[date];
      //   const seen = new Set();
      //   if (events) {
      //     for (const event of events) {
      //       const eventString = JSON.stringify(event);
      //       if (seen.has(eventString)) {
      //         return false; // Duplicate found
      //       }
      //       seen.add(eventString);
      //     }
      //   }
      // }
      // return true; // No duplicates found
    }
    return pushShooter;
  };

  return (
    <div className="d-flex">
      <ToastContainer />
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
              <div style={{ whiteSpace: "nowrap" }}>
                <img alt="" src={Edit} /> ({allowedPersons})
              </div>
            )}
          </DropdownToggle>
          <DropdownMenu className="dropOpenBox">
            {usersToShow?.map((user, index) => (
              <DropdownItem
                key={user._id}
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  const add = shooterDatesHandler(user)
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
                      console.log('unheck User');
                      
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
                  ref={target}
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
