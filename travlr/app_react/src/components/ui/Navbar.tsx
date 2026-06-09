import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';
import { useTheme } from '../../features/theme/ThemeContext';

/**
 * Navigation header component that provides global page links and handles
 * authentication session view state changes.
 *
 * @returns A JSX element rendering the responsive application navigation bar.
 */
export default function Navbar(): React.JSX.Element {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleLogoutClick = (): void => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* --- LEFT SIDE: Brand & Desktop Links --- */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/assets/images/logo.png"
                alt="Travlr Vacations Logo"
                height="100"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation Links (Hidden on small screens) */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Home/Trips
              </Link>
              <Link
                to="/pokemon"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                PokéDex
              </Link>
              <Link
                to="/hunts"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Hunts
              </Link>
            </div>
          </div>

          {/* --- RIGHT SIDE: Desktop Auth & Theme --- */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Slider */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Dark Mode"
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-gray-900 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-blue-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>

            {user ? (
              <>
                <span className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                  Admin: {user.name || user.email}
                </span>
                <Link
                  to="/add-trip"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                >
                  New Trip
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* --- MOBILE: Hamburger & Theme Toggle --- */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Dark Mode"
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-indigo-900' : 'bg-blue-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>

            {/* Custom Tailwind Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none p-2"
              aria-label="Open main menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE: Dropdown Menu Content --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Home/Trips
            </Link>
            <Link
              to="/pokemon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              PokéDex
            </Link>
            <Link
              to="/hunts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hunts
            </Link>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-slate-700 px-4">
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Logged in as Admin: {user.name || user.email}
                  </span>
                  <Link
                    to="/add-trip"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    New Trip
                  </Link>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium border border-gray-300 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
