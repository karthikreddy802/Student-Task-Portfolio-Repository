import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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
              <Submissions />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
