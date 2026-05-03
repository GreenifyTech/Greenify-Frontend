import api from './axios';

export const productApi = {
  getAllProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  getLiveViewers: async (id) => {
    const response = await api.get(`/products/${id}/live-viewers`);
    return response.data;
  }
};
