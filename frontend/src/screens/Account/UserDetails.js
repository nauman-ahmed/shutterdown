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

function UserTable() {

  const [accountDetails, setAccountDetails] = useState(null)
  const navigate = useNavigate();

  const getUsertAccountDetailsHandler = async () => {
    const users = await getAllUserAccountDetails()
    setAccountDetails(users)
    console.log("USERS",users)
  }

  useEffect(() => {
    getUsertAccountDetailsHandler()
  },[])
 
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

  return (
    <>
      <ToastContainer />
      <Table
        hover
        striped
        responsive
        style={{ marginTop: '15px' }}
      >
        <thead>
          <tr >
            <th style={{ fontSize:"smaller", textAlign: "center" }}>Name</th>
            <th style={{ fontSize:"smaller", textAlign: "center" }}>Email </th>
            <th style={{ fontSize:"smaller", textAlign: "center" }}>Role</th>
            <th style={{ fontSize:"smaller", textAlign: "center" }}>Phone #</th>
            <th style={{ fontSize:"smaller", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody className="alignCenter">
          { accountDetails && accountDetails.map((user) => {
            return <tr>
              <td
                className="primary2"
                style={{ paddingTop: '15px', paddingBottom: '15px' }}
              > 
                {user.fullname}
              </td>
              <td
                className="primary2"
                style={{ paddingTop: '15px', paddingBottom: '15px' }}
              > 
                {user.email}
              </td>
              <td
                className="primary2"
                style={{ paddingTop: '15px', paddingBottom: '15px' }}
              > 
                {user.rollSelect}
              </td>
              <td
                className="primary2"
                style={{ paddingTop: '15px', paddingBottom: '15px' }}
              > 
                {user.phoneNo}
              </td>
              <td
                className="primary2"
                style={{ paddingTop: '15px', paddingBottom: '15px' }}
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
                  <Button
                    type='button' color="danger"
                    onClick={() => banAccountHandler(user)}
                  >
                    Ban Account
                  </Button>
                }
              </td>
            </tr>
          })
          }
          
        </tbody>
      </Table>
    </>
  );
}

export default UserTable;
