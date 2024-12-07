import React from "react";
import { Route, Navigate } from "react-router-dom";
import MyProfile from "../screens/myProfile/MyProfile";
import About from "../screens/myProfile/About";
import Profile from "../screens/myProfile/Profile";
import Job from "../screens/myProfile/Job";
import Documents from "../screens/myProfile/Documents";
import Assets from "../screens/myProfile/Assets";
import Deliverables from "../screens/Deliverables";

const ProfileRoutes = () => {

  return <>
    <Route
      path="/profile"
      element={
        <MyProfile />
      }
    >
      <Route path="about" element={<About />} />
      <Route path="details" element={<Profile />} />
      <Route path="job" element={<Job />} />
      <Route path="documents" element={<Documents />} />
      <Route path="assets" element={<Assets />} />
      <Route path="deliverables" element={<Deliverables />} />
    </Route>
  </>
};

export default ProfileRoutes;
