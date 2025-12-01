import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Board from './pages/Board'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
import Dashboard from './pages/Dashboard'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : true
  })

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home darkMode={darkMode} />} />
      <Route path="/login" element={<Login darkMode={darkMode} />} />
      <Route path="/register" element={<Register darkMode={darkMode} />} />

      {/* Protected Routes - Require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <Projects darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/create-project" element={
        <ProtectedRoute>
          <CreateProject darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />
      <Route path="/board/:projectId" element={
        <ProtectedRoute>
          <Board darkMode={darkMode} setDarkMode={setDarkMode} />
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}