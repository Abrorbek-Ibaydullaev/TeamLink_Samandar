import React, { useState } from 'react'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function CreateProject(){
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const resp = await api.post('/projects/', { name, workspace: 1 })
      nav(`/board/${resp.data.id}`)
    }catch(err){
      setError('Failed to create project')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Project</h2>
      <form onSubmit={submit}>
        <label className="block">Project Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded mb-3" placeholder="e.g. My First Project" required />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  )
}
