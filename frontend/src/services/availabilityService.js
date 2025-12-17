import api from './api';

export const availabilityService = {
  getMyAvailability: async () => {
    const response = await api.get('/availability/my');
    return response.data;
  },

  getDoctorAvailability: async (doctorId) => {
    const response = await api.get(`/availability/doctor/${doctorId}`);
    return response.data;
  },

  addAvailability: async (availabilityData) => {
    const response = await api.post('/availability', availabilityData);
    return response.data;
  },

  updateAvailability: async (availabilityId, availabilityData) => {
    const response = await api.put(`/availability/${availabilityId}`, availabilityData);
    return response.data;
  },

  deleteAvailability: async (availabilityId) => {
    const response = await api.delete(`/availability/${availabilityId}`);
    return response.data;
  },
};
