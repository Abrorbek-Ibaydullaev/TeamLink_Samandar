import api from '../api/axios'

export const workspaceService = {
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

    getMembers: async (id) => {
        const response = await api.get(`/workspaces/${id}/members/`)
        return response
    },

    addMember: async (id, userId, role) => {
        const response = await api.post(`/workspaces/${id}/add_member/`, {
            user_id: userId,
            role: role
        })
        return response.data
    },
}