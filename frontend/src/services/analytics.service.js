import api from '../lib/axios';

export const getOverviewAnalytics = async () => {
  const response = await api.get('/analytics/overview');
  return response.data?.data ?? null;
};

export const getTopLinksAnalytics = async () => {
  const response = await api.get('/analytics/top-links');
  return response.data?.data ?? [];
};
