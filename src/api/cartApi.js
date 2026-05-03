import api from './axios';

export const cartApi = {
  // GET fetch current cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // POST add item to cart
  addItem: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', {
      product_id: Number(productId),
      quantity: Number(quantity)
    });
    return response.data;
  },

  // PUT update item quantity
  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, {
      quantity: Number(quantity)
    });
    return response.data;
  },

  // DELETE remove specific item
  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // DELETE clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  }
};
