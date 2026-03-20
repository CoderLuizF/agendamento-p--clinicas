import api from './api';

export const appointmentService = {
    async create(appointmentData) {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },

    async getMyAppointments() {
        const response = await api.get('/appointments');
        return response.data;
    },

    async getAllAppointments(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/appointments/all?${params}`);
        return response.data;
    },

    async updateStatus(id, status) {
        const response = await api.put(`/appointments/${id}`, { status });
        return response.data;
    },

    async cancel(id) {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    }
};