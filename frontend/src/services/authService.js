import api from '../api/axios';

export const authService = {
    // Register
    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        if (response.status === 201 && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('userEmail', response.data.user.email); // ✅ Store email
        }
        return response;
    },

    // Login
    login: async (credentials) => {
        const payload = {
            email: credentials.email || credentials.username,
            password: credentials.password,
        };

        const response = await api.post('/auth/login/', payload);

        if (response.status === 200 && response.data) {
            if (response.data.access) localStorage.setItem('access_token', response.data.access);
            if (response.data.refresh) localStorage.setItem('refresh_token', response.data.refresh);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userEmail', response.data.user.email); // ✅ Store email
                localStorage.setItem('userName', response.data.user.full_name || 
                    response.data.user.username || 
                    response.data.user.email.split('@')[0]); // ✅ Store name
            }
        }
        return response;
    },

    // Logout
    logout: async () => {
        try {
            await api.post('/auth/logout/');
        } finally {
            localStorage.clear();
        }
    },

    // Get Profile
    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            localStorage.setItem('userEmail', response.data.data.email); // ✅ Store email
        }
        return response.data;
    },

    // Update Profile
    updateProfile: async (profileData) => {
        const response = await api.patch('/auth/profile/', profileData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};