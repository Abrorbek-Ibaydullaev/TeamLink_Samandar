import api from '../api/axios'

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats/')
    return response.data
  },
  
  getActiveProjects: async () => {
    const response = await api.get('/dashboard/active-projects/')
    return response.data
  },
  
  getRecentActivities: async () => {
    const response = await api.get('/dashboard/recent-activities/')
    return response.data
  }
}