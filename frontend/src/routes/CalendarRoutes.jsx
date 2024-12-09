import React from "react";
import { Route, Navigate } from "react-router-dom";
import CalenderView from "../screens/Calender";
import Calender from "../screens/Calender/Calender";
import ListView from "../screens/Calender/ListView";
import PreWedShoot from "../screens/PreWedShoot";
import PreWedShootScreen from "../screens/PreWedShoot/PreWedShootScreen";
import { useLoggedInUser } from "../config/zStore";
import { hasAccess } from "../helpers/roleValidation";

const CalendarRoutes = ({userData}) => {
  return <>
    <Route
      exact
      path="/calendar"
      element={hasAccess(userData, ['Manager', 'Shooter', 'Production Manager']) ? <CalenderView /> : <Navigate to="/" replace />}
    >
      <Route
        path="calendar-view"
        element={<Calender />}
      />
      <Route
        path="list-view"
        element={<ListView />}
      />
      <Route
        path="list-view/client/:clientIdd"
        element={<ListView />}
      />
    </Route>
    <Route
      exact
      path="/pre-wed-shoots"
      element={hasAccess(userData, ['Manager', 'Shooter', 'Production Manager']) ? <PreWedShoot /> : <Navigate to="/" replace />}
    >
      <Route
        path="screen"
        element={<PreWedShootScreen />}
      />
    </Route>
  </>

};

export default CalendarRoutes;
