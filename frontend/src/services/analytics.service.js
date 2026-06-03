import api from '../lib/axios';

export const getOverviewAnalytics = async () => {
  const response = await api.get('/analytics/overview');
  return response.data?.data ?? null;
};

export const getTopLinksAnalytics = async () => {
  const response = await api.get('/analytics/top-links');
  return response.data?.data ?? [];
};

export const getUrlSummaryAnalytics = async (urlId) => {
  const response = await api.get(`/analytics/urls/${urlId}/summary`);
  return response.data?.data ?? null;
};

export const getUrlTimeseriesAnalytics = async (urlId, params = {}) => {
  const response = await api.get(`/analytics/urls/${urlId}/timeseries`, { params });
  return response.data?.data?.data ?? [];
};

export const getUrlBreakdownAnalytics = async (urlId, key) => {
  const response = await api.get(`/analytics/urls/${urlId}/${key}`);
  return response.data?.data ?? [];
};
