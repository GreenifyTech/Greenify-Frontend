import api from './axios';

export const orderApi = {
 placeOrder: async (orderData) => {
 const response = await api.post('/orders/', orderData);
 return response.data;
 },
 getMyOrders: async (params) => {
 const response = await api.get('/orders/me/', { params });
 return response.data;
 },
 getOrder: async (orderId) => {
 const response = await api.get(`/orders/${orderId}/`);
 return response.data;
 },
 uploadPaymentProof: async (orderId, file) => {
 const formData = new FormData();
 formData.append('file', file);
 const response = await api.post(`/orders/${orderId}/upload-proof/`, formData, {
 headers: {
 'Content-Type': 'multipart/form-data',
 },
 });
 return response.data;
 }
};
