import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import AuthRoutes from "./routes/AuthRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import CalendarRoutes from "./routes/CalendarRoutes";
import DeliverableRoutes from "./routes/DeliverableRoutes";
import GeneralRoutes from "./routes/GeneralRoutes";
import { useLoggedInUser } from "./config/zStore";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { fetchUser} from "./hooks/authQueries";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/common.css";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const [loading, setloading] = useState(true)
  const token = Cookies.get("userKeys") ? JSON.parse(Cookies.get("userKeys")).userToken : null;
  const [data, setData] = useState(null)
  const { updateUserData } = useLoggedInUser()

  const { userData } = useLoggedInUser()
  const getUser = async () => {
    await fetchUser(token).then((data) => {
      updateUserData(data.user)
      setData(data)
      // Set cookie with 30-day expiration when user data is fetched
      Cookies.set("currentUser", JSON.stringify(data.user), { expires: 365 })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setloading(false)
    })
  }
  useEffect(() => {
    if (token) {
      getUser()
    } else {
      setloading(false)
    }
  }, [])

  if (loading) {
    return <div className="loader">Loading...</div>; // Replace with your loader component
  }

  return (
    <>
      {data?.user || userData ?
        <>
          <Header />
          <SideBar />
          <div style={{ paddingTop: "10px" }} />
          <Routes>
            {CalendarRoutes({ userData })}
            {ProfileRoutes()}
            {AdminRoutes({ userData })}
            {ClientRoutes({ userData })}
            {DeliverableRoutes({ userData })}
            {GeneralRoutes({ userData })}
            <Route exact path="*" element={<Navigate to="/calendar/calendar-view" replace />} />
          </Routes>
        </>
        :
        <Routes>
          {/* Unauthenticated Routes */}
          {AuthRoutes({ data })}
          <Route exact path="*" element={<Navigate to="/" replace />} />
        </Routes>
      }
      <ToastContainer theme="colored" />
    </>
  );
}

export default App;
