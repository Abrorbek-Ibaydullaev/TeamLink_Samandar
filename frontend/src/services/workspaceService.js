// import api from '../api/axios'

// export const workspaceService = {
//     getAll: async () => {
//         const response = await api.get('/workspaces/')
//         return response.data
//     },

//     getById: async (id) => {
//         const response = await api.get(`/workspaces/${id}/`)
//         return response.data
//     },

//     create: async (data) => {
//         const response = await api.post('/workspaces/', data)
//         return response.data
//     },

//     update: async (id, data) => {
//         const response = await api.patch(`/workspaces/${id}/`, data)
//         return response.data
//     },

//     delete: async (id) => {
//         await api.delete(`/workspaces/${id}/`)
//     },

//     getMembers: async (id) => {
//         const response = await api.get(`/workspaces/${id}/members/`)
//         return response
//     },

//     addMember: async (id, userId, role) => {
//         const response = await api.post(`/workspaces/${id}/add_member/`, {
//             user_id: userId,
//             role: role
//         })
//         return response.data
//     },
// }




import api from '../api/axios'

export const workspaceService = {
    // Workspace CRUD
    getAll: async () => {
        const response = await api.get('/workspaces/')
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/workspaces/${id}/`)
        return response.data
    },

    create: async (data) => {
        const response = await api.post('/workspaces/', data)
        return response.data
    },

    update: async (id, data) => {
        const response = await api.patch(`/workspaces/${id}/`, data)
        return response.data
    },

    delete: async (id) => {
        await api.delete(`/workspaces/${id}/`)
    },

    // Workspace Members
    getMembers: async (workspaceId) => {
        const response = await api.get(`/workspaces/${workspaceId}/members/`)
        return response.data
    },

    addMember: async (workspaceId, data) => {
        const response = await api.post(`/workspaces/${workspaceId}/members/`, data)
        return response.data
    },

    removeMember: async (workspaceId, memberId) => {
        await api.delete(`/workspaces/${workspaceId}/members/${memberId}/`)
    },

    // Project Members (Alias methods that call projectService methods)
    getProjectMembers: async (workspaceId, projectId) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/members/`)
        return response.data
    },

    addProjectMember: async (workspaceId, projectId, data) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/members/`, data)
        return response.data
    },

    removeProjectMember: async (workspaceId, projectId, memberId) => {
        await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/members/${memberId}/`)
    }
}