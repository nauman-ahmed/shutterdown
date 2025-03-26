import React from "react";
import { Navigate, Route } from "react-router-dom";
import Signup from "../screens/signup/Signup";
import ResetPassword from "../screens/resetPassword/ResetPassword";
import EmailVerification from "../screens/EmailVerification/EmailVerification";
import LoginWithGoogle from "../screens/login/LoginWithGoogle";
import Login from "../screens/login/Login";
import { useLoggedInUser } from "../config/zStore";
import PrivacyPolicy from "../screens/privacyPolicy";

const AuthRoutes = ({ user }) => {
    return (
        <>
            <Route
                path="/"
                element={user ? <Navigate to="/profile" replace /> : <Login />}
            />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-verify" element={<EmailVerification />} />
            <Route path="/signIn-with-google" element={<LoginWithGoogle />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </>
    )
};

export default AuthRoutes;
