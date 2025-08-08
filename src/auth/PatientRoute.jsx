import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PatientRoute = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const location = useLocation();

  return userInfo && userInfo.role === 2 ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
};

export default PatientRoute;
