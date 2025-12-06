import api from './axios';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/token/', { email, password });
        const { access, refresh } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me/');
        return response.data;
    },
};