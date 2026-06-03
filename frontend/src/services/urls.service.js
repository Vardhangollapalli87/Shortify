import api from '../lib/axios';

export const getUserLinks = async () => {
  const response = await api.get('/urls');
  return response.data?.data ?? [];
};

export const getLinkById = async (urlId) => {
  const response = await api.get(`/urls/${urlId}`);
  return response.data?.data ?? null;
};

export const createLink = async (payload) => {
  const response = await api.post('/urls', payload);
  return response.data?.data ?? null;
};

export const updateLink = async ({ urlId, payload }) => {
  const response = await api.patch(`/urls/${urlId}`, payload);
  return response.data?.data ?? null;
};

export const deleteLink = async (urlId) => {
  const response = await api.delete(`/urls/${urlId}`);
  return response.data?.data ?? null;
};

export const toggleLink = async (urlId) => {
  const response = await api.patch(`/urls/${urlId}/toggle`);
  return response.data?.data ?? null;
};

export const updateLinkPassword = async ({ urlId, password }) => {
  const response = await api.patch(`/urls/${urlId}/password`, { password });
  return response.data?.data ?? null;
};

export const updateLinkExpiration = async ({ urlId, expiresAt }) => {
  const response = await api.patch(`/urls/${urlId}/expiration`, { expiresAt });
  return response.data?.data ?? null;
};
