import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./screens/login/Login";
import Signup from "./screens/signup/Signup";
import MyProfile from "./screens/myProfile/MyProfile";
import About from "./screens/myProfile/About";
import ResetPassword from "./screens/resetPassword/ResetPassword";
import Profile from "./screens/myProfile/Profile";
import Job from "./screens/myProfile/Job";
import Documents from "./screens/myProfile/Documents";
import Assets from "./screens/myProfile/Assets";
import AddClient from "./screens/AddClient";
import FormOptions from "./screens/FormOptions";
import Whatsapp from "./screens/Whatsapp";

import Account from "./screens/Account";
import AccountCreated from "./screens/Account/AccountCreated";
import UserTable from "./screens/Account/UserDetails";

import FormI from "./screens/AddClient/Form-I";
import FormII from "./screens/AddClient/Form-II";
import Preview from "./screens/AddClient/Preview";
import ViewClient from "./screens/ViewClient/ViewClient";
import Client from "./screens/ViewClient";
import ParticularClient from "./screens/ViewClient/ParticularClient";
import ClientInfo from "./screens/ViewClient/ClientInfo";
import ShootDetails from "./screens/ViewClient/ShootDetails";
import Deliverable from "./screens/ViewClient/Deliverable";
import CalenderView from "./screens/Calender";
import Deliverables from "./screens/Deliverables";
import Cinematography from "./screens/Deliverables/Cinematography";
import Photos from "./screens/Deliverables/Photos";
import Albums from "./screens/Deliverables/Albums";
import Tasks from "./screens/Tasks";
import DailyTasks from "./screens/Tasks/DailyTasks";
import ReportsScreen from "./screens/Reports";
import TeamScreen from "./screens/Team";
import Calender from "./screens/Calender/Calender";
import ListView from "./screens/Calender/ListView";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import CheckListsPage from "./screens/CheckLists";
import PreWedShoot from "./screens/PreWedShoot";
import PreWedShootScreen from "./screens/PreWedShoot/PreWedShootScreen";
import MobileAttendence from "./screens/MobileAttendence/Attendence";
import WebClock from "./screens/MobileAttendence/WebClock";
import WFHome from "./screens/MobileAttendence/WFH";
import Summary from "./screens/MobileAttendence/Summary";
import Holidays from "./screens/MobileAttendence/Holidays";
import EmailVerification from "./screens/EmailVerification/EmailVerification";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./config/context";
import LoginWithGoogle from "./screens/login/LoginWithGoogle";
import UserAttendence from "./screens/Attendence/Attendence";
import Cookies from "js-cookie";
import PreWedDeliverables from "./screens/Deliverables/PreWeds";
import DeliverablesDeadline from "./screens/Deadlines";

function App() {
  const location = useLocation();
  const currentUser =  Cookies.get("currentUser") && JSON.parse(Cookies.get("currentUser"));
  const Version = "1.0.8"

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const checkVersion = async () => {
      try {
       
        const currentVersion = localStorage.getItem('appVersion');
        
        if (currentVersion !== Version) {
          localStorage.setItem('appVersion', Version);
          window.location.reload(true);
        }
      } catch (error) {
        console.error('Error checking version:', error);
      }
    };

    checkVersion();
  }, []);

  return (
    <AuthContextProvider>
      <>
        {location.pathname === "/" ||
        location.pathname === "/Signup" ||
        location.pathname === "/ResetPassword" ||
        location.pathname === "/emailVerify" ||
        location.pathname === "/signInWithGoogle" ? null : (
          <>
            {currentUser ? (
              <>
                <Header />
                <SideBar />
                <div style={{ paddingTop: "10px" }} />
              </>
            ) : (
              <Navigate to="/" replace />
            )}
          </>
        )}
        <Routes>
          <Route
            exact
            path="/"
            element={
              currentUser ? <Navigate to="/MyProfile" replace /> : <Login />
            }
          ></Route>
          <Route exact path="*" element={<Navigate to="/" replace />}></Route>
          <Route
            exact
            path="/signInWithGoogle"
            element={<LoginWithGoogle />}
          ></Route>
          <Route exact path="/Signup" element={<Signup />}></Route>

          <Route
            exact
            path="/emailVerify"
            element={<EmailVerification />}
          ></Route>
          <Route
            exact
            path="/MyProfile"
            element={currentUser ? <MyProfile /> : <Navigate to="/" replace />}
          >
            <Route
              path="About"
              element={currentUser ? <About /> : <Navigate to="/" replace />}
            />
            <Route
              path="Profile"
              element={currentUser ? <Profile /> : <Navigate to="/" replace />}
            />
            <Route
              path="Job"
              element={currentUser ? <Job /> : <Navigate to="/" replace />}
            />
            <Route
              path="Documents"
              element={
                currentUser ? <Documents /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="Assets"
              element={currentUser ? <Assets /> : <Navigate to="/" replace />}
            />
          </Route>
          <Route
            path="/Myprofile/FormOptions"
            element={
              currentUser ? <FormOptions /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/Myprofile/Deadlines"
            element={
              currentUser ? <DeliverablesDeadline /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/Myprofile/Whatsapp"
            element={
              currentUser ? <Whatsapp /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/Myprofile/Accounts"
            element={
              currentUser ? <Account /> : <Navigate to="/" replace />
            }
          >
            <Route
              path="Count"
              element={
                currentUser ? <AccountCreated /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="Users"
              element={
                currentUser ? <UserTable /> : <Navigate to="/" replace />
              }
            />
          </Route>
          <Route
            path="/Myprofile/Attendence"
            element={
              currentUser ? <UserAttendence /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/MyProfile/AddClient"
            element={currentUser ? <AddClient /> : <Navigate to="/" replace />}
          >
            <Route
              path="Form-I"
              element={currentUser ? <FormI /> : <Navigate to="/" replace />}
            />
            <Route
              path="Form-II"
              element={currentUser ? <FormII /> : <Navigate to="/" replace />}
            />
            <Route
              path="Preview"
              element={currentUser ? <Preview /> : <Navigate to="/" replace />}
            />
          </Route>
          <Route
            exact
            path="/MyProfile/Client"
            element={currentUser ? <Client /> : <Navigate to="/" replace />}
          >
            <Route
              path="ViewClient"
              element={
                currentUser ? <ViewClient /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="ParticularClient"
              element={
                currentUser ? <ParticularClient /> : <Navigate to="/" replace />
              }
            >
              <Route
                path="ClientInfo/:clientId"
                element={
                  currentUser ? <ClientInfo /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="ShootDetails/:clientId"
                element={
                  currentUser ? <ShootDetails /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="Deliverable/:clientId"
                element={
                  currentUser ? <Deliverable /> : <Navigate to="/" replace />
                }
              />
            </Route>
          </Route>
          <Route
            exact
            path="/MyProfile/Calender"
            element={
              currentUser ? <CalenderView /> : <Navigate to="/" replace />
            }
          >
            <Route
              path="View"
              element={currentUser ? <Calender /> : <Navigate to="/" replace />}
            />
            <Route
              path="ListView"
              element={currentUser ? <ListView /> : <Navigate to="/" replace />}
            />
            <Route
              path="ListView/:clientIdd"
              element={currentUser ? <ListView /> : <Navigate to="/" replace />}
            />
          </Route>
          <Route
            exact
            path="/MyProfile/PreWedShoot"
            element={
              currentUser ? <PreWedShoot /> : <Navigate to="/" replace />
            }
          >
            <Route
              path="PreWedShootScreen"
              element={
                currentUser ? (
                  <PreWedShootScreen />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Route>

          <>
            <Route
              exact
              path="/MyProfile/Attendee"
              element={
                currentUser ? <MobileAttendence /> : <Navigate to="/" replace />
              }
            >
              <Route
                path="WebClock"
                element={
                  currentUser ? <WebClock /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="WFHome"
                element={currentUser ? <WFHome /> : <Navigate to="/" replace />}
              />
              <Route
                path="Summary"
                element={
                  currentUser ? <Summary /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="Holidays"
                element={
                  currentUser ? <Holidays /> : <Navigate to="/" replace />
                }
              />
            </Route>
            <Route
              exact
              path="/MyProfile/Deliverables"
              element={
                currentUser ? <Deliverables /> : <Navigate to="/" replace />
              }
            >
              <Route
                path="Cinematography"
                element={
                  currentUser ? <Cinematography /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="Photos"
                element={currentUser ? <Photos /> : <Navigate to="/" replace />}
              />
              <Route
                path="Albums"
                element={currentUser ? <Albums /> : <Navigate to="/" replace />}
              />
              <Route
                path="PreWed-Deliverables"
                element={
                  currentUser ? (
                    <PreWedDeliverables />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Route>
          </>
          <Route
            exact
            path="/MyProfile/Tasks"
            element={currentUser ? <Tasks /> : <Navigate to="/" replace />}
          >
            <Route
              path="DailyTasks"
              element={
                currentUser ? <DailyTasks /> : <Navigate to="/" replace />
              }
            />
          </Route>
          <Route
            exact
            path="/MyProfile/CheckLists"
            element={
              currentUser ? <CheckListsPage /> : <Navigate to="/" replace />
            }
          ></Route>
          <Route
            exact
            path="/MyProfile/Reports"
            element={
              currentUser ? <ReportsScreen /> : <Navigate to="/" replace />
            }
          />

          <Route
            exact
            path="/MyProfile/Tasks/Reports"
            element={
              currentUser ? <ReportsScreen /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/MyProfile/Team"
            element={currentUser ? <TeamScreen /> : <Navigate to="/" replace />}
          />
          <Route
            exact
            path="/ResetPassword"
            element={
              currentUser ? <ResetPassword /> : <Navigate to="/" replace />
            }
          ></Route>
        </Routes>
        <ToastContainer theme="colored" />
      </>
    </AuthContextProvider>
  );
}

export default App;
