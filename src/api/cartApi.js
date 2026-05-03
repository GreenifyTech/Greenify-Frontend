import api from './axios';

export const cartApi = {
 // GET /api/cart/ — fetch current cart
 getCart: async () => {
 const response = await api.get('/cart/');
 return response.data;
 },

 // POST /api/cart/add — add item to cart (NOT POST /cart/)
 addItem: async (productId, quantity = 1) => {
 const response = await api.post('/cart/add', {
 product_id: Number(productId),
 quantity: Number(quantity)
 });
 return response.data;
 },

 // PUT /api/cart/{item_id} — update item quantity
 updateItem: async (itemId, quantity) => {
 const response = await api.put(`/cart/${itemId}`, {
 quantity: Number(quantity)
 });
 return response.data;
 },

 // DELETE /api/cart/{item_id} — remove specific item
 removeItem: async (itemId) => {
 const response = await api.delete(`/cart/${itemId}`);
 return response.data;
 },

 // DELETE /api/cart/ — clear entire cart
 clearCart: async () => {
 const response = await api.delete('/cart/');
 return response.data;
 }
};
