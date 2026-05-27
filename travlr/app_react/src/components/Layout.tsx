import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';

/**
 * Overall layout template that positions the shared Navbar and embeds child page views.
 *
 * @returns A JSX element serving as the standardized UI structural wrapper.
 */
export default function Layout(): React.JSX.Element {
  return (
    <div className="site-wrapper d-flex flex-column min-vh-100 bg-light">
      {/* Global Application Header */}
      <Navbar />

      {/* Main Page Body Frame Shell */}
      <main className="flex-grow-1 container px-4 py-4">
        <Outlet />
      </main>

      {/* Standardized Application Footer */}
      <footer className="bg-white border-top text-center py-3 mt-auto text-muted small">
        <div className="container">
          &copy; {new Date().getFullYear()} Travlr Vacations Dashboard. Built
          with React 19 & TypeScript.
        </div>
      </footer>
    </div>
  );
}
