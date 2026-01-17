import api from '../api/axios'

export const projectService = {
    // ✅ Dashboard methods - FIXED URLs
    getDashboardStats: async () => {
        const response = await api.get('/projects/dashboard/stats/')  // ✅ REMOVE leading /api/
        return response.data
    },

    getActiveProjects: async () => {
        const response = await api.get('/projects/dashboard/active-projects/')  // ✅ REMOVE leading /api/
        return response.data
    },

    getDashboard: async () => {
        const response = await api.get('/projects/dashboard/')  // ✅ REMOVE leading /api/
        return response.data
    },

    // Project CRUD
    getAll: async (workspaceId) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/`)
        return response.data
    },

    getById: async (workspaceId, projectId) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/`)
        return response.data
    },

    create: async (workspaceId, data) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/`, data)
        return response.data
    },

    update: async (workspaceId, projectId, data) => {
        const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/`, data)
        return response.data
    },

    delete: async (workspaceId, projectId) => {
        await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/`)
    },

    // Columns
    getColumns: async (workspaceId, projectId) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/`)
        return response.data
    },

    createColumn: async (workspaceId, projectId, data) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/`, data)
        return response.data
    },

    updateColumn: async (workspaceId, projectId, columnId, data) => {
        const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/`, data)
        return response.data
    },

    deleteColumn: async (workspaceId, projectId, columnId) => {
        await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/`)
    },

    // Tasks
    getTasks: async (workspaceId, projectId, columnId = null) => {
        if (columnId) {
            const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/`)
            return response.data
        } else {
            const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks/`)
            return response.data
        }
    },

    createTask: async (workspaceId, projectId, columnId, data) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/`, data)
        return response.data
    },

    updateTask: async (workspaceId, projectId, columnId, taskId, data) => {
        const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`, data)
        return response.data
    },

    deleteTask: async (workspaceId, projectId, columnId, taskId) => {
        await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`)
    },

    // Move task between columns
    moveTask: async (workspaceId, projectId, columnId, taskId, newColumnId, position = null) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/move/`, {
            column_id: newColumnId,
            position: position
        })
        return response.data
    },

    // Project Members
    getMembers: async (workspaceId, projectId) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/members/`)
        return response.data
    },

    addMember: async (workspaceId, projectId, data) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/members/`, data)
        return response.data
    },

    removeMember: async (workspaceId, projectId, memberId) => {
        await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/members/${memberId}/`)
    },

    // Direct project tasks endpoint
    getAllProjectTasks: async (workspaceId, projectId) => {
        try {
            const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks/`)
            return response.data
        } catch (error) {
            return { data: [] }
        }
    }
}