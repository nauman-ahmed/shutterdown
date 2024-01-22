import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import Heart from "../assets/Profile/Heart.svg";
import Oval from "../assets/Profile/Oval.svg";
import Active_Oval from "../assets/Profile/Active_Oval.svg";

import PropTypes from "prop-types";
import { propTypes } from "react-bootstrap/esm/Image";

function RowHeaderDropDown({ direction, table = false, Placeholder,brideName,groomName }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelect, setDropdownSelect] = useState(
    Placeholder || "Add event"
  );
  let data = [
    {
      title: "Add event",
      id: 1,
    },
    {
      title: "Edit event",
      id: 2,
    },
    {
      title: "Delete event",
      id: 3,
    },
  ];

  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleChange = (i) => {
    setDropdownSelect(i);
  };

  return (
    <div className="d-flex">
      <ButtonDropdown>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            caret
            className={
              table
                ? "DropDownBox DropDownBoxRowHeader tableDropdwn"
                : "DropDownBox DropDownBoxRowHeader"
            }
          >
            {/* {dropdownSelect} */}
            {brideName}
          </DropdownToggle>
          <div
            style={{
              fontSize: "12px",
              marginRight: "10px",
              marginBottom: "5px",
            }}
          >
            <img src={Heart} />
            <br />
            {groomName}
          </div>
          <DropdownMenu
            className="dropOpenBox "
            style={{ background: "#EFF0F5" }}
          >
            {data.map((i) => {
              const background = dropdownSelect == i.title ? true : false;
              return (
                <DropdownItem
                  key={i.id}
                  onClick={() => handleChange(i.title)}
                  style={{
                    fontSize: "11px",
                  }}
                >
                  {background ? (
                    <img src={Active_Oval} style={{ marginRight: "5px" }} />
                  ) : (
                    <img src={Oval} style={{ marginRight: "5px" }} />
                  )}
                  {brideName}
                  <img
                    src={Heart}
                    style={{ marginLeft: "7px", marginRight: "7px" }}
                  />
                  {groomName}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </ButtonDropdown>
    </div>
  );
}

RowHeaderDropDown.propTypes = {
  direction: PropTypes.string,
};

export default RowHeaderDropDown;
