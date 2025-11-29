import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Board from './pages/Board'
import Projects from './pages/Projects'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between">
          <h1 className="font-bold">TaskLink</h1>
          <nav className="flex gap-4">
            <Link to="/projects">Projects</Link>
            <Link to="/">Sign in</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/board/:projectId" element={<Board/>} />
        </Routes>
      </main>
    </div>
  )
}
