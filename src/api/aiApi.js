import api from './axios';

export const aiApi = {
 diagnose: async (symptoms) => {
 const response = await api.post('/ai/diagnose', { symptoms });
 return response.data;
 }
};
