/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import useAuth from "../Contexts/UseAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
