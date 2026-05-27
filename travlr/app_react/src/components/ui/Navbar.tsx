import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';

/**
 * Navigation header component that provides global page links and handles
 * authentication session view state changes.
 *
 * @returns A JSX element rendering the responsive application navigation bar.
 */
export default function Navbar(): React.JSX.Element {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  /**
   * Clears the user authentication session and routes the browser back to the homepage.
   *
   * @returns Void.
   */
  const handleLogoutClick = (): void => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4">
        {/* Brand Main App Logo Link */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          {/* Main Logo */}
          <img
            src="/assets/images/logo.png"
            alt="Travlr Vacations Logo"
            height="100"
            className="d-inline-block"
          />
          {/* TODO: I may or may not keep this, I kind of like having both the text and icon. */}
          {/*<span className="fw-bold text-uppercase tracking-wider">Travlr</span>*/}
        </Link>

        {/* Mobile Hamburger Menu Toggle Trigger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNavbarContent"
          aria-controls="appNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
          {/* TODO: Add navigation to other pages in enhancement 2*/}
        </button>

        {/* Primary Collapsible Menu Rows */}
        <div className="collapse navbar-collapse" id="appNavbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home/Trips
              </Link>
            </li>
          </ul>

          {/* Right-aligned Authentication Status Display Panels */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                {/* Restricted Administrative Menu Shortcuts */}
                <span className="navbar-text text-light bg-secondary px-2 py-1 rounded small">
                  Admin: {user.name || user.email}
                </span>
                <Link to="/add-trip" className="btn btn-sm btn-primary">
                  New Trip
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="btn btn-sm btn-outline-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Public Access Entry Gate Shortcuts */}
                <Link to="/login" className="btn btn-sm btn-outline-light">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
