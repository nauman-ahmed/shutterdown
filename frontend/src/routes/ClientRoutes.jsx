import React from "react";
import { Route, Navigate } from "react-router-dom";
import Client from "../screens/ViewClient";
import ViewClient from "../screens/ViewClient/ViewClient";
import ParticularClient from "../screens/ViewClient/ParticularClient";
import ClientInfo from "../screens/ViewClient/ClientInfo";
import ShootDetails from "../screens/ViewClient/ShootDetails";
import Deliverable from "../screens/ViewClient/Deliverable";
import AddClient from "../screens/AddClient";
import FormI from "../screens/AddClient/Form-I";
import FormII from "../screens/AddClient/Form-II";
import Preview from "../screens/AddClient/Preview";
import { hasAccess } from "../helpers/roleValidation";

const ClientRoutes = ({ userData }) => (
  <>
    <Route
      exact
      path="/clients/add-client"
      element={hasAccess(userData, ['Manager']) ? <AddClient /> : <Navigate to="/" replace />}
    >
      <Route
        path="form-1"
        element={<FormI />}
      />
      <Route
        path="form-2"
        element={<FormII />}
      />
      <Route
        path="preview"
        element={<Preview />}
      />
    </Route>


    <Route
      exact
      path="/clients/view-client/"
      element={hasAccess(userData, ['Manager']) ? <Client /> : <Navigate to="/" replace />}
    >
      <Route
        path="all-clients"
        element={<ViewClient />}
      />
      <Route
        path="particular-client"
        element={<ParticularClient />}
      >
        <Route
          path="client-info/:clientId"
          element={<ClientInfo />}
        />
        <Route
          path="shoot-details/:clientId"
          element={<ShootDetails />}
        />
        <Route
          path="deliverables/:clientId"
          element={<Deliverable />}
        />
      </Route>
    </Route>
  </>
);

export default ClientRoutes;
