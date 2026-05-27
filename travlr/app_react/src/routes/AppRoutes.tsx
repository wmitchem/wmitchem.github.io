import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthContext';

// Feature Pages and Components
import Layout from '../components/Layout';
import TripListing from '../pages/TripListing';
import AddTrip from '../pages/AddTrip';
import EditTrip from '../pages/EditTrip';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

/**
 * Props configuration for the ProtectedRoute guard component.
 */
interface ProtectedRouteProps {
  /** The protected view element that will render if the user has an active session. */
  children: React.JSX.Element;
}

/**
 * Route guard component that restricts access to authenticated users.
 * Redirects unauthorized requests back to the login screen.
 *
 * @param props - Component properties holding the restricted layout tree.
 * @returns A JSX element containing either the child view or a route redirect.
 */
function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const { user } = useAuthContext();

  // Redirect to login if there is no active user session
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Root routing table mapping application endpoint paths to page views wrapped inside a master layout shell.
 *
 * * @returns A JSX element detailing the structural route configurations.
 */
export default function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      {/* Nesting all functional views inside the unified global layout wrapper */}
      <Route element={<Layout />}>
        {/* Public Views */}
        <Route path="/" element={<TripListing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Administrative Dashboard Operations */}
        <Route
          path="/add-trip"
          element={
            <ProtectedRoute>
              <AddTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-trip/:code"
          element={
            <ProtectedRoute>
              <EditTrip />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all Wildcard Route Fault Guard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
