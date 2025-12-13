import api from './api';

export const medicalRecordService = {
  getMyRecords: async () => {
    const response = await api.get('/medical-records/my');
    return response.data;
  },

  getRecordById: async (recordId) => {
    const response = await api.get(`/medical-records/${recordId}`);
    return response.data;
  },

  createRecord: async (recordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  updateRecord: async (recordId, recordData) => {
    const response = await api.put(`/medical-records/${recordId}`, recordData);
    return response.data;
  },

  requestAccess: async (patientId) => {
    const response = await api.post('/medical-records/request-access', {
      patient_id: patientId,
    });
    return response.data;
  },

  grantAccess: async (requestId) => {
    const response = await api.post(`/medical-records/grant-access/${requestId}`);
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/medical-records/pending-requests');
    return response.data;
  },
};
