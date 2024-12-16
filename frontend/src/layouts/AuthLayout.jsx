import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import { useCheckGetUser } from "../hooks/authQueries";

const AuthLayout = ({ children }) => {
  // const { user, loggedIn, isLoading } = useCheckGetUser();

  // // Show a loader while checking authentication
  // if (isLoading) {
  //   return <div className="loader">Loading...</div>; // Replace with your loader component
  // }

  // // Redirect to login if not authenticated
  // if (!loggedIn) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <>
      {/* Render Header and Sidebar for authenticated users */}
      <Header />
      <SideBar />
      <div style={{ paddingTop: "10px" }} />
      {/* Render authenticated routes */}
      {children}
    </>
  );
};

export default AuthLayout;
