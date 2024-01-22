import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom';
import Login from './screens/login/Login';
import Signup from './screens/signup/Signup';
import MyProfile from './screens/myProfile/MyProfile';
import About from './screens/myProfile/About';
import ResetPassword from './screens/resetPassword/ResetPassword';
import Profile from './screens/myProfile/Profile';
import Job from './screens/myProfile/Job';
import Documents from './screens/myProfile/Documents';
import Assets from './screens/myProfile/Assets';
import Attendence from './screens/Attendence/Attendence';
import AddClient from './screens/AddClient';
import FormI from './screens/AddClient/Form-I';
import FormII from './screens/AddClient/Form-II';
import Preview from './screens/AddClient/Preview';
import ViewClient from './screens/ViewClient/ViewClient';
import Client from './screens/ViewClient';
import ViewClient1 from './screens/ViewClient/ViewClient1';
import ParticularClient from './screens/ViewClient/ParticularClient';
import ClientInfo from './screens/ViewClient/ClientInfo';
import ShootDetails from './screens/ViewClient/ShootDetails';
import Deliverable from './screens/ViewClient/Deliverable';
import CalenderView from './screens/Calender';
import Deliverables from './screens/Deliverables';
import Cinematography from './screens/Deliverables/Cinematography';
import Photos from './screens/Deliverables/Photos';
import Albums from './screens/Deliverables/Albums';
import Tasks from './screens/Tasks';
import DailyTasks from './screens/Tasks/DailyTasks';
import ReportsScreen from './screens/Reports';
import TeamScreen from './screens/Team';
import Calender from './screens/Calender/Calender';
import ListView from './screens/Calender/ListView';
import Header from './components/Header';
import SideBar from './components/Sidebar';
import CheckListsPage from './screens/CheckLists';
import PreWedShoot from './screens/PreWedShoot';
import PreWedShootScreen from './screens/PreWedShoot/PreWedShootScreen';
import MobileAttendence from './screens/MobileAttendence/Attendence';
import WebClock from './screens/MobileAttendence/WebClock';
import WFHome from './screens/MobileAttendence/WFH';
import Summary from './screens/MobileAttendence/Summary';
import Holidays from './screens/MobileAttendence/Holidays';
import EmailVerification from './screens/EmailVerification/EmailVerification';
import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './config/context';
import LoginWithGoogle from './screens/login/LoginWithGoogle';
import AttendenceSettings from './screens/Attendence/AttendenceSettings';
import EditorAttendence from './screens/Attendence/EditorAttendence';
import ShooterAttendence from './screens/Attendence/ShooterAttendence';
function App() {
  const location = useLocation();
  const [shooter, setShooter] = useState(false);
  const [editor, setEditor] = useState(false);
  const [manager, setManager] = useState(false)
  useEffect(() => {
    global.BASEURL = 'http://localhost:5001';
    const shooter = JSON.parse(localStorage.getItem('loginUser'));
    if (shooter?.data?.User?.rollSelect === 'Shooter') {
      setShooter(true);
    } else if (shooter?.data?.User?.rollSelect === 'Editor') {
      setEditor(true);
    }
    else {
      setManager(true)
    }
    // global.BASEURL = 'https://drab-erin-iguana-tux.cyclic.app'
  }, []);
  return (
    <AuthContextProvider>
      <>
        {location.pathname == '/' ||
          location.pathname == '/Signup' ||
          location.pathname == '/ResetPassword' ||
          location.pathname == '/emailVerify' ||
          location.pathname == '/signInWithGoogle' ? null : (
          <>
            <Header />
            <SideBar />
            <div style={{ paddingTop: '10px' }} />
          </>
        )}
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
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
          <Route exact path="/MyProfile" element={<MyProfile />}>
            <Route path="About" element={<About />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="Job" element={<Job />} />
            <Route path="Documents" element={<Documents />} />
            <Route path="Assets" element={<Assets />} />
          </Route>

          {shooter ? (
            <>
              {' '}
              <Route
                exact
                path="/Photographer-CalenderView"
                element={<CalenderView />}
              >
                <Route path="View" element={<Calender />} />
                <Route path="ListView" element={<ListView />} />
              </Route>
              <Route exact path="/Photographer" element={<Tasks />}>
                <Route path="DailyTasks" element={<DailyTasks />} />
              </Route>
              <Route
                exact
                path="/Attendence"
                element={<AttendenceSettings />}
              ></Route>
              <Route exact path="/Attendee" element={<MobileAttendence />}>
                <Route path="WebClock" element={<WebClock />} />
                <Route path="WFHome" element={<WFHome />} />
                <Route path="Summary" element={<Summary />} />
                <Route path="Holidays" element={<Holidays />} />
              </Route>
            </>
          ) : (
            ''
          )}
          <Route path="/Attendee" element={<MobileAttendence />} />
          <Route
            path="Myprofile/AttendenceSettings"
            element={<AttendenceSettings />}
          />
          <Route path="/Myprofile/Attendence" element={<EditorAttendence />} />
          <Route exact path="/MyProfile/AddClient" element={<AddClient />}>
            <Route path="Form-I" element={<FormI />} />
            <Route path="Form-II" element={<FormII />} />
            <Route path="Preview" element={<Preview />} />
          </Route>
          <Route exact path="/MyProfile/Client" element={<Client />}>
            <Route path="ViewClient" element={<ViewClient />} />
            <Route path="ViewClient-I" element={<ViewClient1 />} />
            <Route path="ParticularClient" element={<ParticularClient />}>
              <Route path="ClientInfo/:clientId" element={<ClientInfo />} />
              <Route path="ShootDetails/:clientId" element={<ShootDetails />} />
              <Route path="Deliverable/:clientId" element={<Deliverable />} />
            </Route>
          </Route>
          <Route exact path="/MyProfile/Calender" element={<CalenderView />}>
            <Route path="View" element={<Calender />} />
            <Route path="ListView" element={<ListView />} />
          </Route>
          <Route exact path="/MyProfile/PreWedShoot" element={<PreWedShoot />}>
            <Route path="View" element={<Calender />} />
            <Route path="PreWedShootScreen" element={<PreWedShootScreen />} />
          </Route>
          {editor ? (
            <>
              <Route exact path="/Deliverables" element={<Deliverables />}>
                <Route path="Cinematography" element={<Cinematography />} />
                <Route path="Photos" element={<Photos />} />
                <Route path="Albums" element={<Albums />} />
              </Route>
              <Route exact path="/Editor" element={<Tasks />}>
                <Route path="DailyTasks" element={<DailyTasks />} />
              </Route>
              <Route exact path="/Attendee" element={<MobileAttendence />}>
                <Route path="WebClock" element={<WebClock />} />
                <Route path="WFHome" element={<WFHome />} />
                <Route path="Summary" element={<Summary />} />
                <Route path="Holidays" element={<Holidays />} />
              </Route>
            </>
          ) : (
            <>
              <Route
                exact
                path="/MyProfile/Attendee"
                element={<MobileAttendence />}
              >
                <Route path="WebClock" element={<WebClock />} />
                <Route path="WFHome" element={<WFHome />} />
                <Route path="Summary" element={<Summary />} />
                <Route path="Holidays" element={<Holidays />} />
              </Route>
              <Route
                exact
                path="/MyProfile/Deliverables"
                element={<Deliverables />}
              >
                <Route path="Cinematography" element={<Cinematography />} />
                <Route path="Photos" element={<Photos />} />
                <Route path="Albums" element={<Albums />} />
              </Route>
            </>
          )}

          <Route exact path="/MyProfile/Tasks" element={<Tasks />}>
            <Route path="DailyTasks" element={<DailyTasks />} />
          </Route>
          <Route
            exact
            path="/MyProfile/CheckLists"
            element={<CheckListsPage />}
          ></Route>
          <Route exact path="/MyProfile/Reports" element={<ReportsScreen />} />
          <Route exact path="/MyProfile/Team" element={<TeamScreen />} />
          <Route
            exact
            path="/ResetPassword"
            element={<ResetPassword />}
          ></Route>
        </Routes>
        <ToastContainer theme='colored' />
      </>
    </AuthContextProvider>
  );
}

export default App;
