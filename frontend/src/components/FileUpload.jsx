import React, { useState } from 'react'
import api from '../lib/api'

export default function FileUpload({ taskId, onUploadSuccess }){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    if (taskId) formData.append('task', taskId)

    setLoading(true)
    try {
      const resp = await api.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFile(null)
      if (onUploadSuccess) onUploadSuccess(resp.data)
    } catch (err) {
      console.error('Upload failed', err)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleUpload} className="flex gap-2">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
      <button className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50" disabled={loading || !file}>
        Upload
      </button>
    </form>
  )
}
