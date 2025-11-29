import React, { useState, useEffect } from 'react'
import api from '../lib/api'

export default function Search({ projectId }){
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [type, setType] = useState('tasks') // tasks or messages

  const search = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      const endpoint = type === 'tasks' ? '/search/tasks/' : '/search/messages/'
      const resp = await api.get(endpoint, {
        params: { q: query, project: projectId }
      })
      setResults(resp.data)
    } catch (err) {
      console.error('Search failed', err)
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <form onSubmit={search} className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 p-2 border rounded"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded">
          <option value="tasks">Tasks</option>
          <option value="messages">Messages</option>
        </select>
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Search</button>
      </form>
      <div className="space-y-2">
        {results.map(item => (
          <div key={item.id} className="p-2 border rounded bg-gray-50">
            <div className="font-medium">{item.title || item.text || item.message}</div>
            {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
