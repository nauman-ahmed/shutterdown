import React from "react";
import { Route, Navigate } from "react-router-dom";
import Tasks from "../screens/Tasks";
import DailyTasks from "../screens/Tasks/DailyTasks";
import CheckListsPage from "../screens/CheckLists";
import ReportsScreen from "../screens/Reports";
import TeamScreen from "../screens/Team";
import UserAttendence from "../screens/Attendence/Attendence";
import { hasAccess } from "../helpers/roleValidation";

const GeneralRoutes = ({userData}) => (
  <>
    <Route
      path="/attendance"
      element={hasAccess(userData, ['Manager', 'Editor', 'Shooter', 'Production Manager']) ? <UserAttendence /> : <Navigate to="/" replace />}
    />
    <Route
      exact
      path="/tasks"
      element={hasAccess(userData, ['Manager', 'Editor']) ? <Tasks /> : <Navigate to="/" replace />}
    >
      <Route
        path="daily-tasks"
        element={<DailyTasks />}
      />
      <Route
        path="reports"
        element={<ReportsScreen />}
      />
    </Route>


    <Route
      exact
      path="/checklists"
      element={hasAccess(userData, ['Manager']) ? <CheckListsPage /> : <Navigate to="/" replace />}
    ></Route>
    <Route
      exact
      path="/team"
      element={hasAccess(userData, ['Manager']) ? <Tasks /> : <Navigate to="/" replace />}
    >
      <Route
        path="reports"
        element={<ReportsScreen />}
      />
     
    </Route>


    <Route
      exact
      path="/teams"
      element={hasAccess(userData, ['Manager', 'Editor', 'Shooter']) ? <TeamScreen /> : <Navigate to="/" replace />}
    />
  </>
);

export default GeneralRoutes;
