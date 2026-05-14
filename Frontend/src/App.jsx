import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

// Components
import Layout from './components/Layout';
const Login = React.lazy(() => import('./components/Login'));
const FacultyLogin = React.lazy(() => import('./components/FacultyLogin'));
const AdminLogin = React.lazy(() => import('./components/AdminLogin'));
const Register = React.lazy(() => import('./components/Register'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Submissions = React.lazy(() => import('./components/Submissions'));
const Portfolio = React.lazy(() => import('./components/Portfolio'));
const TeacherPanel = React.lazy(() => import('./components/TeacherPanel'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const PortfolioPreview = React.lazy(() => import('./components/PortfolioPreview'));
const Profile = React.lazy(() => import('./components/Profile'));
const Calendar = React.lazy(() => import('./components/Calendar'));
const Notifications = React.lazy(() => import('./components/Notifications'));
const Analytics = React.lazy(() => import('./components/Analytics'));
const Tasks = React.lazy(() => import('./components/Tasks'));
const TeacherDashboard = React.lazy(() => import('./components/TeacherDashboard'));
const TaskManager = React.lazy(() => import('./components/TaskManager'));
const UserManagement = React.lazy(() => import('./components/UserManagement'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading HUB OS...</p>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppRoutes />
      </Router>
    </HelmetProvider>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Wrapped in Layout) */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />
          <Route 
            path="/submissions" 
            element={
              <Layout>
                <Submissions key={location.search} />
              </Layout>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <Layout>
                <Portfolio />
              </Layout>
            } 
          />
          <Route 
            path="/teacher" 
            element={
              <Layout>
                <TeacherPanel />
              </Layout>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <Layout>
                <AdminPanel />
              </Layout>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <Layout>
                <Profile />
              </Layout>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <Layout>
                <Calendar />
              </Layout>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <Layout>
                <Notifications />
              </Layout>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <Layout>
                <Analytics />
              </Layout>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <Layout>
                <Tasks />
              </Layout>
            } 
          />
          <Route 
            path="/teacher-dashboard" 
            element={
              <Layout>
                <TeacherDashboard />
              </Layout>
            } 
          />
          <Route 
            path="/teacher/tasks" 
            element={
              <Layout>
                <TaskManager />
              </Layout>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <Layout>
                <UserManagement />
              </Layout>
            } 
          />
          <Route 
            path="/portfolio-preview" 
            element={<PortfolioPreview />} 
          />
          <Route 
            path="/portfolio/:username" 
            element={<PortfolioPreview />} 
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

export default App;
