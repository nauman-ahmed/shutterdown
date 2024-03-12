import React, { useState, useEffect } from 'react';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from 'reactstrap';
import Bookadd from '../assets/Profile/Bookadd.svg';
import EditBook from '../assets/Profile/EditBook.svg';
import DeleteBook from '../assets/Profile/DeleteBook.svg';
import ShootStar from '../assets/Profile/ShootStar.svg';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import Edit from '../assets/Profile/Edit.svg';

function ShootDropDown(props) {
  const { table, existedUsers, userChecked, userUnChecked, usersToShow, allowedPersons } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const toggle = async () => {
    setDropdownOpen((prevState) => !prevState);
  };


  return (
    <div className="d-flex">
      <ToastContainer />

      <ButtonDropdown>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            className='DropDownBox tableDropdwn'
            style={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            {
              props?.data?.length == 0 ?
                <div style={{ whiteSpace: 'nowrap' }}>
                  <img src={ShootStar} style={{ marginRight: '5px' }} />
                  Select ({allowedPersons})
                </div>
                :
                <div style={{ whiteSpace: 'nowrap' }}>
                  <img src={Edit} /> ({allowedPersons})
                </div>
            }

          </DropdownToggle>
          <DropdownMenu
            className="dropOpenBox"
          >
            {usersToShow?.map((user, index) => (
              <DropdownItem
                key={user._id}
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {user.firstName} {user.lastName}
                <input
                  className='ml-2 mx-2'
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (existedUsers?.length >= allowedPersons){
                        window.notify(`Maximum Limit is ${allowedPersons}, uncheck previous!`, 'error');
                        return
                      } else {
                        console.log("Checked")
                        userChecked(user);
                      }
                    } else {
                      console.log("Un Checked")
                      userUnChecked(user)
                    }
                  }}
                  checked={existedUsers?.length > 0 && existedUsers?.some(existingUser => existingUser._id == user._id)}
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
