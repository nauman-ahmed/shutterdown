import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import DropDownOvalActive from "../assets/Profile/DropDownOvalActive.svg";
import DropDownOvalUnActive from "../assets/Profile/DropDownOvalUnActive.svg";
import PropTypes from "prop-types";
import { propTypes } from "react-bootstrap/esm/Image";

function DeleiveryDropDown({
  direction,
  table = false,
  Placeholder,
  selection,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelect, setDropdownSelect] = useState("Deliverables");
  let data = [
    {
      title: "Photography",
      id: 1,
    },
    {
      title: "Videography",
      id: 2,
    },
    {
      title: "Post-Shoot",
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
            className={
              selection ? "DropDownBox2 colorDropDown" : "DropDownBox2"
            }
            style={{
              fontSize: !dropdownOpen ? "" : "12px",
              width: !dropdownOpen ? "" : "128px",
              textAlign: dropdownOpen ? "left" : "center",
              paddingLeft: dropdownOpen ? "14px" : "",
            }}
          >
            Deliverables
          </DropdownToggle>
          <DropdownMenu
            className="dropOpenBox2"
            style={{ background: "#666DFF" }}
          >
            {data.map((i) => {
              const background = dropdownSelect == i.title ? true : false;
              return (
                <DropdownItem
                  key={i.id}
                  onClick={() => handleChange(i.title)}
                  style={{
                    background: background ? "white" : "",
                    color: background ? "#666DFF" : "white",
                    width: "90px",
                    marginLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "8px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <img
                    src={background ? DropDownOvalActive : DropDownOvalUnActive}
                    style={{ marginRight: "5px" }}
                  />
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

DeleiveryDropDown.propTypes = {
  direction: PropTypes.string,
};

export default DeleiveryDropDown;
