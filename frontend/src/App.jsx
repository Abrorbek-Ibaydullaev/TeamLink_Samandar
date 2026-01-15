import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Workspaces from './pages/Workspaces'
import CreateWorkspace from './pages/CreateWorkspace'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
import Board from './pages/Board'
import AllProjects from './pages/AllProjects'
import EditProject from './pages/EditProjects'
// ... your existing imports ...

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <AuthProvider>  {/* ← ADD THIS WRAPPER */}
      <BrowserRouter>
        <Routes>
          {/* Your existing routes */}
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} />} />
          <Route path="/projects" element={<AllProjects darkMode={darkMode} setDarkMode={setDarkMode} />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <Workspaces darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspaces/create"
            element={
              <ProtectedRoute>
                <CreateWorkspace darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspaces/:workspaceId/projects"
            element={
              <ProtectedRoute>
                <Projects darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspaces/:workspaceId/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />
{/* jsjsjjs */}
          <Route
            path="/workspaces/:workspaceId/projects/:projectId"
            element={
              <ProtectedRoute>
                <Board darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces/:workspaceId/projects/:projectId/update"
            element={
              <ProtectedRoute>
                <EditProject darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider> 
  )
}

export default App
