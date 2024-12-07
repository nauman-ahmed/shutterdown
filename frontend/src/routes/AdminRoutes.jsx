import React from "react";
import { Route, Navigate } from "react-router-dom";
import FormOptions from "../screens/FormOptions/FormOptions";
import DeliverablesDeadline from "../screens/Deadlines";
import Whatsapp from "../screens/Whatsapp/Whatsapp";
import AccountCreated from "../screens/Account/AccountCreated";
import UserTable from "../screens/Account/UserDetails";
import Account from "../screens/Account";
import { hasAccess } from "../helpers/roleValidation";
import { useLoggedInUser } from "../config/zStore";
import FormOptionsPage from "../screens/FormOptions";
import WhatsAppPage from "../screens/Whatsapp";


const AdminRoutes = ({userData}) => {
    return <>
        <Route
            path="/admin/form-options"
            element={
                hasAccess(userData, ['Admin']) ? <FormOptionsPage /> : <Navigate to="/" replace />
            }
        />
        <Route
            path="/admin/deliverables-deadlines"
            element={
                hasAccess(userData, ['Admin']) ? <DeliverablesDeadline /> : <Navigate to="/" replace />
            }
        />
        <Route
            path="/admin/whatsapp"
            element={
                hasAccess(userData, ['Admin']) ? <WhatsAppPage /> : <Navigate to="/" replace />
            }
        />
        <Route
            path="/admin/accounts"
            element={
                hasAccess(userData, ['Admin']) ? <Account /> : <Navigate to="/" replace />
            }
        >
            <Route
                path="count"
                element={
                    hasAccess(userData, ['Admin']) ? <AccountCreated /> : <Navigate to="/" replace />
                }
            />
            <Route
                path="users"
                element={
                    hasAccess(userData, ['Admin']) ? <UserTable /> : <Navigate to="/" replace />
                }
            />
        </Route>
    </>
};

export default AdminRoutes;
