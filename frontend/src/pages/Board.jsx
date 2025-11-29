import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import Chat from '../components/Chat'
import Search from '../components/Search'
import Notifications from '../components/Notifications'
import ExportCSV from '../components/ExportCSV'

export default function Board(){
  const { projectId } = useParams()
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    let mounted = true
    Promise.all([
      api.get(`/columns/?project=${projectId}`),
      api.get(`/tasks/?project=${projectId}`),
    ]).then(([cols, tks])=>{
      if(!mounted) return
      setColumns(cols.data)
      setTasks(tks.data)
    }).catch(()=>{})
    return ()=> mounted = false
  },[projectId])

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId)
  }

  const onDrop = async (e, columnId) => {
    const taskId = e.dataTransfer.getData('text/plain')
    // optimistic UI update
    setTasks(prev => prev.map(t => t.id === Number(taskId) ? { ...t, column: columnId } : t))
    try{
      await api.patch(`/tasks/${taskId}/`, { column: columnId })
    }catch(err){
      // TODO: revert on failure
    }
  }

  const allowDrop = (e) => e.preventDefault()

  const tasksForColumn = (colId) => tasks.filter(t => t.column === colId)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Project {projectId} — Kanban</h2>
      <div className="mb-4 flex gap-2">
        <ExportCSV projectId={projectId} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <div className="flex gap-4">
            {columns.map(col => (
              <div key={col.id} className="bg-white p-4 rounded shadow w-64" onDragOver={allowDrop} onDrop={(e)=>onDrop(e, col.id)}>
                <h3 className="font-semibold mb-2">{col.title}</h3>
                <div className="flex flex-col gap-2">
                  {tasksForColumn(col.id).map(task => (
                    <div key={task.id} draggable onDragStart={(e)=>onDragStart(e, task.id)} className="p-2 border rounded bg-gray-50">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.assignee || ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Chat />
          <Search projectId={projectId} />
          <Notifications />
        </div>
      </div>
    </div>
  )
}
