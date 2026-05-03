import api from './axios';

export const profileApi = {
  getMe: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },
  updateMe: async (data) => {
    const response = await api.put('/profile/me', data);
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/profile/me/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
