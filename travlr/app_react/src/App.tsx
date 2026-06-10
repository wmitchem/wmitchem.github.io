import React from 'react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './features/theme/ThemeContext';

// Instantiating the global TanStack Query state engine
const queryClient = new QueryClient();

/**
 * Core root component initializing all global state contexts, network clients,
 * and routing layouts.
 *
 * @returns A JSX element wrapping the primary application execution nodes.
 */
export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
