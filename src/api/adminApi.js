import api from './axios';

export const adminApi = {
 // Dashboard Stats — GET /api/admin/stats/
 getStats: async () => {
 const response = await api.get('/admin/stats/');
 return response.data;
 },

 // Analytics Summary — GET /api/analytics/summary/?days=0
 getAnalyticsSummary: async (days = 0) => {
 const response = await api.get('/analytics/summary', { params: { days } });
 return response.data;
 },

 // Products
 createProduct: async (data) => {
 const response = await api.post('/products', data);
 return response.data;
 },
 updateProduct: async (id, data) => {
 const response = await api.put(`/products/${id}`, data);
 return response.data;
 },
 deleteProduct: async (id) => {
 const response = await api.delete(`/products/${id}`);
 return response.data;
 },

 // Orders — GET /api/admin/orders
 getOrders: async (params) => {
 const response = await api.get('/admin/orders', { params });
 return response.data;
 },
 updateOrderStatus: async (orderId, status) => {
 const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
 return response.data;
 },
 approvePayment: async (orderId) => {
 const response = await api.patch(`/admin/orders/${orderId}/approve-payment`);
 return response.data;
 },

 // Users — GET /api/admin/users
 getUsers: async () => {
 const response = await api.get('/admin/users');
 return response.data;
 },
 toggleUserActive: async (userId) => {
 const response = await api.put(`/admin/users/${userId}/toggle-active`);
 return response.data;
 },
 updateUserRole: async (userId, role) => {
 const response = await api.patch(`/users/${userId}/role`, { role });
 return response.data;
 }
};
