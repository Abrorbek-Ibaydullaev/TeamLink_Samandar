import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

export default function Chat(){
  const { projectId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    // Get current user info
    api.get('/auth/user/').catch(()=>{})

    // Fetch chat history
    api.get(`/chat-messages/?project=${projectId}`).then(r=>{ setMessages(r.data) }).catch(()=>{})

    // Connect WebSocket
    const token = localStorage.getItem('access')
    const wsUrl = `ws://localhost:8000/ws/projects/${projectId}/?token=${token}`
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setMessages(prev => [...prev, data])
    }

    socket.onerror = (err) => console.error('WebSocket error:', err)
    socket.onclose = () => console.log('WebSocket closed')

    setWs(socket)

    return () => socket.close()
  }, [projectId])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !ws) return

    const userData = localStorage.getItem('user') || 'anonymous'
    ws.send(JSON.stringify({ text: input, sender: userData }))
    setInput('')
  }

  return (
    <div className="bg-white p-4 rounded shadow h-96 flex flex-col">
      <h3 className="font-semibold mb-2">Chat</h3>
      <div className="flex-1 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-medium text-sm">{msg.sender}:</span>
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type message..." />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Send</button>
      </form>
    </div>
  )
}
