import React from "react";
import { Route, Navigate } from "react-router-dom";
import Deliverables from "../screens/Deliverables";
import Cinematography from "../screens/Deliverables/Cinematography";
import Photos from "../screens/Deliverables/Photos";
import Albums from "../screens/Deliverables/Albums";
import PreWedDeliverables from "../screens/Deliverables/PreWeds";
import { hasAccess } from "../helpers/roleValidation";

const DeliverableRoutes = ({userData}) => (
    <>
        <Route
            exact
            path="/deliverables"
            element={hasAccess(userData, ['Manager', 'Editor']) ? <Deliverables /> : <Navigate to="/" replace />}
        >
            <Route
                path="cinema"
                element={<Cinematography />}
            />
            <Route
                path="photos"
                element={<Photos />}
            />
            <Route
                path="albums"
                element={<Albums />}
            />
            <Route
                path="pre-wed-deliverables"
                element={<PreWedDeliverables />}
            />
        </Route>
    </>

);

export default DeliverableRoutes;
