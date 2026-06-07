const getFallbackShortLinkBaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return apiBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
};

export const getShortLinkBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL;
  return (configuredBaseUrl || getFallbackShortLinkBaseUrl()).replace(/\/$/, '');
};

export const buildShortLink = (shortCode) => `${getShortLinkBaseUrl()}/${shortCode}`;
