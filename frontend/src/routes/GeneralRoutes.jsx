import React from "react";
import { Route, Navigate } from "react-router-dom";
import Tasks from "../screens/Tasks";
import DailyTasks from "../screens/Tasks/DailyTasks";
import CheckListsPage from "../screens/CheckLists";
import ReportsScreen from "../screens/Reports";
import TeamScreen from "../screens/Team";
import UserAttendence from "../screens/Attendence/Attendence";
import { hasAccess } from "../helpers/roleValidation";
import ChecklistDeliverables from "../screens/CheckLists/Deliverables";
import CheckLists from "../screens/CheckLists/CheckLists";
import Reports from "../screens/Tasks/Reports";
import EditorsReports from "../screens/Reports/Reports";

const GeneralRoutes = ({ userData }) => (
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
        element={<Reports />}
      />
    </Route>


    <Route
      path="/checklists"
      element={hasAccess(userData, ['Manager'])
        ? <CheckListsPage />
        : <Navigate to="/" replace />
      }
    >
      <Route path="logistics" element={<CheckLists />} />
      <Route path="deliverables" element={<ChecklistDeliverables />} />

    </Route>

    <Route exact path="/reports" element={hasAccess(userData, ['Manager']) ? <ReportsScreen /> : <Navigate to="/" replace />} >
      <Route
        path="editors-reports"
        element={<EditorsReports />}
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
