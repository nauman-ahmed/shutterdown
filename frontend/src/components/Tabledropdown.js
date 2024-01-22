import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import Bookadd from "../assets/Profile/Bookadd.svg";
import EditBook from "../assets/Profile/EditBook.svg";
import DeleteBook from "../assets/Profile/DeleteBook.svg";
import Dotts from "../assets/Profile/Dotts.svg";
import PropTypes from "prop-types";

function Tabledropdown({ direction, table = false, Placeholder, AddEvent }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelect, setDropdownSelect] = useState(Placeholder || "Add");
  let data = [
    {
      title: "Add",
      id: 1,
    },
    {
      title: "Edit",
      id: 2,
    },
  ];

  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleChange = (i) => {
    setDropdownSelect(i);
  };
  const getIcon = (i) => {
    switch (i) {
      case 1:
        return <img src={Bookadd} style={{ marginRight: "10px" }} />;
        break;
      case 2:
        return <img src={EditBook} style={{ marginRight: "10px" }} />;
        break;
      default:
        break;
    }
  };

  return (
    <div className="d-flex">
      <ButtonDropdown>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            className={table ? "DropDownBox tableDropdwn" : "DropDownBox"}
          >
            <img src={Dotts} style={{ cursor: "pointer" }} />
          </DropdownToggle>
          <DropdownMenu
            className="dropOpenBox2"
            style={{ background: "#EFF0F5" }}
          >
            {data.map((i) => {
              const background = dropdownSelect == i.title ? true : false;
              return (
                <DropdownItem
                  key={i.id}
                  onClick={() => handleChange(i.title)}
                  style={{
                    background: background ? "#666DFF" : "",
                    color: background ? "white" : "",
                  }}
                >
                  {AddEvent && getIcon(i.id)}
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

Tabledropdown.propTypes = {
  direction: PropTypes.string,
};

export default Tabledropdown;
