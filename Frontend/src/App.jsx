import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Layout from './components/Layout';
import Login from './components/Login';
import FacultyLogin from './components/FacultyLogin';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Submissions from './components/Submissions';
import Portfolio from './components/Portfolio';
import TeacherPanel from './components/TeacherPanel';
import AdminPanel from './components/AdminPanel';
import PortfolioPreview from './components/PortfolioPreview';
import Profile from './components/Profile';
import Calendar from './components/Calendar';
import Notifications from './components/Notifications';
import Analytics from './components/Analytics';
import Tasks from './components/Tasks';
import TeacherDashboard from './components/TeacherDashboard';
import TaskManager from './components/TaskManager';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
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
    </>
  );
}

export default App;
