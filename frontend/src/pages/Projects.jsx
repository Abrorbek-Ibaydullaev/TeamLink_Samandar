import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'

export default function Projects(){
  const [projects, setProjects] = useState([])

  useEffect(()=>{
    let mounted = true
    api.get('/projects/').then(r=>{ if(mounted) setProjects(r.data) }).catch(()=>{})
    return ()=> mounted = false
  },[])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{p.name}</h3>
            <Link to={`/board/${p.id}`} className="text-blue-600 text-sm">Open board</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
