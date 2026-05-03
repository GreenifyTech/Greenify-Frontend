import api from './axios';

export const bouquetApi = {
  createBouquet: async (data) => {
    const response = await api.post('/bouquets', data);
    return response.data;
  },
  getMyBouquets: async () => {
    const response = await api.get('/bouquets/me');
    return response.data;
  },
  deleteBouquet: async (id) => {
    const response = await api.delete(`/bouquets/${id}`);
    return response.data;
  }
};
