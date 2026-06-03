import { useEffect, useMemo, useState } from 'react';
import { useAnalyticsOverview, useSelectedLinkAnalytics, useUserLinks } from '../hooks/useAnalytics';
import { AnalyticsHeader } from '../components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { AnalyticsSummaryCards } from '../components/analytics/AnalyticsSummaryCards';
import { BreakdownCard } from '../components/analytics/BreakdownCard';
import { TimeSeriesChart } from '../components/analytics/TimeSeriesChart';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { ErrorState } from '../components/dashboard/ErrorState';
import { EmptyState } from '../components/dashboard/EmptyState';

export default function AnalyticsPage() {
  const [selectedLinkId, setSelectedLinkId] = useState('');
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useAnalyticsOverview();
  const { data: links = [], isLoading: linksLoading, error: linksError } = useUserLinks();
  const analytics = useSelectedLinkAnalytics(selectedLinkId);

  useEffect(() => {
    if (!selectedLinkId && links.length > 0) {
      setSelectedLinkId(links[0].id);
    }
  }, [links, selectedLinkId]);

  const selectedLink = useMemo(() => links.find((link) => link.id === selectedLinkId) ?? null, [links, selectedLinkId]);

  const loading = overviewLoading || linksLoading;
  const errorMessage = overviewError?.message || linksError?.message || analytics.error?.message;

  if (loading) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader title="Analytics overview" subtitle="Loading your engagement panels and performance metrics…" />
        <LoadingSkeleton />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader title="Analytics overview" subtitle="We are unable to load analytics for this workspace right now." />
        <ErrorState message={errorMessage} />
      </div>
    );
  }

  if (!links.length) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader title="Analytics overview" subtitle="Create at least one short link to unlock reports, trend charts, and audience breakdowns." />
        <EmptyState title="No links to analyze yet" description="Add your first short link to start viewing analytics insight in this workspace." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        title="Analytics overview"
        subtitle={selectedLink ? `Explore clicks, audience composition, and daily momentum for /${selectedLink.shortCode}.` : 'Select a short link to inspect its performance.'}
      />

      <AnalyticsFilters links={links} selectedLinkId={selectedLinkId} onSelect={setSelectedLinkId} />

      <AnalyticsSummaryCards overview={overview} selectedLinkSummary={analytics.summary} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <TimeSeriesChart data={analytics.timeseries} />
        <BreakdownCard title="Top browsers" subtitle="How visitors reached this link by browser family" items={analytics.browsers} accent="cyan" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownCard title="Device mix" subtitle="Breakdown by mobile, tablet, and desktop traffic" items={analytics.devices} accent="emerald" />
        <BreakdownCard title="Operating systems" subtitle="Traffic segmented by platform" items={analytics.os} accent="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownCard title="Referrers" subtitle="Sources that sent visitors to this short link" items={analytics.referrers} accent="amber" />
        <BreakdownCard title="Countries" subtitle="Geographic distribution of clicks" items={analytics.countries} accent="cyan" />
      </div>
    </div>
  );
}
