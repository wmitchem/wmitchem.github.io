import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './ui/Navbar';

/**
 * Overall layout template that positions the shared Navbar and embeds child page views.
 *
 * @returns A JSX element serving as the standardized UI structural wrapper.
 */
export default function Layout(): React.JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Global Application Header */}
      <Navbar />

      {/* Main Page Body Frame Shell */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Standardized Application Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 text-center py-4 mt-auto text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
        <div className="w-full max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Travlr Vacations Dashboard. Built
          with React 19 & TypeScript.
        </div>
      </footer>
    </div>
  );
}
