import api from '../lib/axios';

export const getCurrentUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data?.data?.user ?? null;
};

export const updateCurrentUserProfile = async (payload) => {
  const response = await api.patch('/users/me', payload);
  return response.data?.data?.user ?? null;
};

export const changeCurrentUserPassword = async (payload) => {
  const response = await api.patch('/users/change-password', payload);
  return response.data?.data?.user ?? null;
};

export const deleteCurrentUserAccount = async () => {
  const response = await api.delete('/users/me');
  return response.data?.data ?? null;
};
