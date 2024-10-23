import React, { useRef, useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/common.css";
import "../../assets/css/Profile.css";
import "../../assets/css/tooltip.css";
import { getAllUserAccountDetails, getUserAccountApproved, getUserAccountbanned, getUserAccountUnbanned } from "../../API/userApi"
import { useNavigate } from 'react-router-dom';
import { Button, Table } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import UpdateUser from "./updateUser";
import FilterComponent from "../../components/filter";
import SearchComponent from "../../components/search";

function UserTable() {

  const [accountDetails, setAccountDetails] = useState(null)
  const [accountDetailsToShow, setAccountDetailsToShow] = useState(null)
  const [modal, setModal] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const getUsertAccountDetailsHandler = async () => {
    const users = await getAllUserAccountDetails()
    setAccountDetails(users)
    setAccountDetailsToShow(users)
  }

  useEffect(() => {
    if(!modal){
      getUsertAccountDetailsHandler()
    }
  },[modal])
 
  const approveAccountHandler = async (users) => {
    const res = await getUserAccountApproved(users)
    if(res.status == 200){
      toast.success(res.data.message);
      getUsertAccountDetailsHandler()
      return
    }
    toast.success("Something went wrong");
  }

  const banAccountHandler = async (users) => {
    const res = await getUserAccountbanned(users)
    if(res.status == 200){
      toast.success(res.data.message);
      getUsertAccountDetailsHandler()
      return
    }
    toast.error("Something went wrong");
  }

  const getUserAccountUnbannedHandler = async (users) => {
    const res = await getUserAccountUnbanned(users)
    if(res.status == 200){
      toast.success(res.data.message);
      getUsertAccountDetailsHandler()
      return
    }
    toast.error("Something went wrong");
  }

  const filterHandler = (filters) => {
    const filteredUsers = accountDetails.filter((user) => {
      let roleMatch = true;
      let subRoleMatch = true;
      let accountStateMatch = true;
  
      // Get the selected filters for Role, Sub Role, and Account State
      const selectedRoles = filters
        .filter((filter) => filter.parentOption === 'Role')
        .map((filter) => filter.subOption);
  
      const selectedSubRoles = filters
        .filter((filter) => filter.parentOption === 'Sub Role')
        .map((filter) => filter.subOption);
  
      const selectedAccountStates = filters
        .filter((filter) => filter.parentOption === 'Account State')
        .map((filter) => filter.subOption);
  
      // Role Match - If any selected role matches user's rollSelect
      if (selectedRoles.length > 0) {
        roleMatch = selectedRoles.includes(user.rollSelect);
      }
  
      // Sub Role Match - If any selected sub-role matches user's subRole array
      if (selectedSubRoles.length > 0) {
        subRoleMatch = selectedSubRoles.some((subRole) => user.subRole.includes(subRole));
      }
  
      // Account State Match - If any selected account state matches user's banAccount status
      if (selectedAccountStates.length > 0) {
        accountStateMatch = selectedAccountStates.some((state) => {
          return (state === 'Ban' && user.banAccount === true) || (state === 'Unban' && user.banAccount === false);
        });
      }
  
      // The user must match all selected filters (Role, Sub Role, and Account State)
      return roleMatch && subRoleMatch && accountStateMatch;
    });
  
    setAccountDetailsToShow(filteredUsers);
  };
  
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value
    const filtered = accountDetails.filter((user) =>
      user.firstName.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setAccountDetailsToShow(filtered);
    setSearchTerm(searchTerm);
  }

  return (
    <>
      {modal && <UpdateUser modal={modal} setModal={setModal} userDetails={userDetails}/>}
      <div className="d-flex align-items-top justify-content-end">
        <SearchComponent handleSearchChange={handleSearchChange} searchTerm= {searchTerm}/>
        <FilterComponent filterHandler={filterHandler}/>
      </div>
      <div style={{ maxHeight: "60vh", overflow: "auto" }}>
        <Table
          hover
          striped
          responsive
          style={{ marginTop: '15px'}}
        >
          <thead>
            <tr >
              <th style={{ fontSize:"smaller", textAlign: "center" }}>Name</th>
              <th style={{ fontSize:"smaller", textAlign: "center" }}>Email </th>
              <th style={{ fontSize:"smaller", textAlign: "center" }}>Role</th>
              <th style={{ fontSize:"smaller", textAlign: "center" }}>Sub Role</th>
              <th style={{ fontSize:"smaller", textAlign: "center" }}>Phone #</th>
              <th style={{ fontSize:"smaller", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody className="alignCenter">
            { accountDetailsToShow && accountDetailsToShow.map((user) => {
              return <tr>
                <td
                  className="primary2 tablePlaceContent"
                > 
                  {user.fullname}
                </td>
                <td
                  className="primary2 tablePlaceContent"
                > 
                  {user.email}
                </td>
                <td
                  className="primary2 tablePlaceContent"
                > 
                  {user.rollSelect}
                </td>
                <td
                  className="primary2 tablePlaceContent"
                > 
                  {user.subRole.length > 0 ? 
                    user.subRole.map(role => (
                      <div>
                        {role}
                      </div>
                    ))
                  : "Not Selected"
                  }
                </td>
                <td
                  className="primary2 tablePlaceContent"
                > 
                  {user.phoneNo}
                </td>
                <td
                  className="primary2 tablePlaceContent"
                > 
                  {/* <FaEdit className="fs-5 cursor-pointer"
                    /> */}
                  {user.accountRequest ? 
                    <Button
                      type='submit' className="Update_btn"
                      onClick={() => approveAccountHandler(user)}
                    >
                      Approve Account
                    </Button>
                  :  user.banAccount ?
                    <Button
                      type='submit' className="Update_btn"
                      onClick={() => getUserAccountUnbannedHandler(user)}
                    >
                      Un Ban Account
                    </Button>
                  :
                    <div className="flex items-center">
                      <Button
                        type='button' color="danger"
                        onClick={() => banAccountHandler(user)}
                      >
                        Ban Account
                      </Button>
                      <FaEdit className="fs-5 cursor-pointer mx-3"
                        onClick={() => {
                          setUserDetails(user)
                          setModal(true)
                        }}
                      />
                    </div>
                  }
                </td>
              </tr>
            })
            }
            
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default UserTable;
