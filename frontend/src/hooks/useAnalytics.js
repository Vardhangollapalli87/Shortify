import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getOverviewAnalytics, getTopLinksAnalytics, getUrlBreakdownAnalytics, getUrlSummaryAnalytics, getUrlTimeseriesAnalytics } from '../services/analytics.service';
import { getUserLinks } from '../services/urls.service';

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getOverviewAnalytics
  });

export const useAnalyticsTopLinks = () =>
  useQuery({
    queryKey: ['analytics-top-links'],
    queryFn: getTopLinksAnalytics
  });

export const useUserLinks = () =>
  useQuery({
    queryKey: ['user-links'],
    queryFn: getUserLinks
  });

export const useSelectedLinkAnalytics = (urlId) => {
  const breakdowns = useQueries({
    queries: [
      {
        queryKey: ['analytics-url-summary', urlId],
        queryFn: () => getUrlSummaryAnalytics(urlId),
        enabled: Boolean(urlId)
      },
      {
        queryKey: ['analytics-url-timeseries', urlId],
        queryFn: () => getUrlTimeseriesAnalytics(urlId),
        enabled: Boolean(urlId)
      },
      {
        queryKey: ['analytics-url-browsers', urlId],
        queryFn: () => getUrlBreakdownAnalytics(urlId, 'browsers'),
        enabled: Boolean(urlId)
      },
      {
        queryKey: ['analytics-url-devices', urlId],
        queryFn: () => getUrlBreakdownAnalytics(urlId, 'devices'),
        enabled: Boolean(urlId)
      },
      {
        queryKey: ['analytics-url-os', urlId],
        queryFn: () => getUrlBreakdownAnalytics(urlId, 'os'),
        enabled: Boolean(urlId)
      },
      {
        queryKey: ['analytics-url-referrers', urlId],
        queryFn: () => getUrlBreakdownAnalytics(urlId, 'referrers'),
        enabled: Boolean(urlId)
      },
      {
        queryKey: ['analytics-url-countries', urlId],
        queryFn: () => getUrlBreakdownAnalytics(urlId, 'countries'),
        enabled: Boolean(urlId)
      }
    ]
  });

  return useMemo(() => {
    const [summaryResult, timeseriesResult, browsersResult, devicesResult, osResult, referrersResult, countriesResult] = breakdowns;

    return {
      summary: summaryResult.data ?? null,
      timeseries: timeseriesResult.data ?? [],
      browsers: browsersResult.data ?? [],
      devices: devicesResult.data ?? [],
      os: osResult.data ?? [],
      referrers: referrersResult.data ?? [],
      countries: countriesResult.data ?? [],
      isLoading: breakdowns.some((item) => item.isLoading),
      error: breakdowns.find((item) => item.error)?.error ?? null
    };
  }, [breakdowns]);
};
