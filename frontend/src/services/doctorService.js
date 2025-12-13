import api from './api';

export const doctorService = {
  searchDoctors: async (params = {}) => {
    const response = await api.get('/doctors/search', { params });
    return response.data;
  },

  getDoctorById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  getDoctorAvailability: async (doctorId, date) => {
    const response = await api.get(`/doctors/${doctorId}/availability`, {
      params: { date },
    });
    return response.data;
  },

  getSpecializations: async () => {
    const response = await api.get('/doctors/specializations');
    return response.data;
  },
};
