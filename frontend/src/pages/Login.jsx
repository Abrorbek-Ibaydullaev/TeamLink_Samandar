import React, { useState } from 'react'
import api from '../lib/api'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const resp = await api.post('/auth/token/', { username: email, password })
      localStorage.setItem('access', resp.data.access)
      localStorage.setItem('refresh', resp.data.refresh)
      // navigate to a demo board (project id 1) - adapt after projects list
      nav('/board/1')
    }catch(err){
      setError('Invalid credentials')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={submit}>
        <label className="block">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" />
        <label className="block">Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full p-2 border rounded mb-3" />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign in</button>
          <Link to="/register" className="px-4 py-2 border rounded">Register</Link>
        </div>
      </form>
    </div>
  )
}
