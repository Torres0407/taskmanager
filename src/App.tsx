/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Store from './pages/Store';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-brand-black">
    <Navigation />
    <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-brand-black border-4 border-brand-gold flex overflow-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="flex flex-1 overflow-hidden h-full">
                  <Navigation />
                  <main className="flex-1 overflow-y-auto bg-brand-black">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Placeholders for following phases with Layout-like wrapping */}
            <Route path="/tasks" element={<ProtectedRoute><div className="flex h-full w-full overflow-hidden"><Navigation /><main className="flex-1 overflow-y-auto bg-brand-black"><Tasks /></main></div></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><div className="flex h-full w-full overflow-hidden"><Navigation /><main className="flex-1 overflow-y-auto bg-brand-black"><Achievements /></main></div></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><div className="flex h-full w-full overflow-hidden"><Navigation /><main className="flex-1 overflow-y-auto bg-brand-black"><Leaderboard /></main></div></ProtectedRoute>} />
            <Route path="/store" element={<ProtectedRoute><div className="flex h-full w-full overflow-hidden"><Navigation /><main className="flex-1 overflow-y-auto bg-brand-black"><Store /></main></div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><div className="flex h-full w-full overflow-hidden"><Navigation /><main className="flex-1 overflow-y-auto bg-brand-black"><Profile /></main></div></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute><div className="flex h-full w-full overflow-hidden"><Navigation /><main className="flex-1 overflow-y-auto bg-brand-black"><AdminDashboard /></main></div></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

