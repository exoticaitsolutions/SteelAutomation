import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const tokenKey = 'userToken';
  const token = localStorage.getItem(tokenKey);

  return token ? <Outlet/> : <Navigate to="/"/>;
};

export default PrivateRoute;
