// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Logged in, allow access
  return <>{children}</>;
};

export default PrivateRoute;
