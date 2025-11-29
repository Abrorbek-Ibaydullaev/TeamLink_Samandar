import React from 'react'
import api from '../lib/api'

export default function ExportCSV({ projectId }){
  const downloadCSV = async () => {
    try {
      const resp = await api.get('/export/tasks_csv/', {
        params: { project: projectId },
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(resp.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tasks.csv'
      a.click()
    } catch (err) {
      console.error('Export failed', err)
    }
  }

  return (
    <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded">
      Export CSV
    </button>
  )
}
