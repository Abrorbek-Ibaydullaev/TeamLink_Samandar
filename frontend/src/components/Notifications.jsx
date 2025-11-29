import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Notifications(){
  const [notifications, setNotifications] = useState([])

  useEffect(()=>{
    api.get('/notifications/').then(r => setNotifications(r.data)).catch(()=>{})
  }, [])

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark_read/`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const unread = notifications.filter(n => !n.is_read)

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Notifications ({unread.length})</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-2 border rounded ${!notif.is_read ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className="flex justify-between">
              <div className="text-sm">{notif.message}</div>
              {!notif.is_read && (
                <button onClick={() => markAsRead(notif.id)} className="text-xs text-blue-600">Mark read</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
