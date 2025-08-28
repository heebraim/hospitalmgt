import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorRoute = () => {
  const { userInfo } = useSelector((state) => state.users);
  const location = useLocation();

  return userInfo && userInfo.role === 1 ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
};

export default DoctorRoute;
