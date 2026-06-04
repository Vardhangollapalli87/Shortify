import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { ErrorState } from '../components/dashboard/ErrorState';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { StatCard } from '../components/dashboard/StatCard';
import { TopLinksTable } from '../components/dashboard/TopLinksTable';
import { getOverviewAnalytics, getTopLinksAnalytics } from '../services/analytics.service';

export default function Dashboard() {
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError
  } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getOverviewAnalytics
  });

  const {
    data: topLinks = [],
    isLoading: topLinksLoading,
    error: topLinksError
  } = useQuery({
    queryKey: ['analytics-top-links'],
    queryFn: getTopLinksAnalytics
  });

  const loading = overviewLoading || topLinksLoading;
  const errorMessage = overviewError?.message || topLinksError?.message;

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <ErrorState message={errorMessage} />
      </div>
    );
  }

  const topLinkLabel = overview?.topLink?.shortCode
    ? `/${overview.topLink.shortCode} • ${overview.topLink.totalClicks} clicks`
    : 'No link activity yet';

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Links"
          value={overview?.totalLinks ?? 0}
          hint="Managed links in this workspace"
          accent="cyan"
        />
        <StatCard
          label="Total Clicks"
          value={overview?.totalClicks ?? 0}
          hint="Recorded redirects across all links"
          accent="emerald"
        />
        <StatCard
          label="Unique Visitors"
          value={overview?.uniqueVisitors ?? 0}
          hint="Distinct visitors identified from click data"
          accent="violet"
        />
        <StatCard
          label="Top Performing Link"
          value={topLinkLabel}
          hint="Highest traffic link by clicks"
          accent="amber"
        />
      </section>

      {topLinks.length > 0 ? (
        <TopLinksTable links={topLinks} />
      ) : (
        <EmptyState
          title="No top links available yet"
          description="Create short links and start collecting clicks to populate this dashboard table."
        />
      )}
    </div>
  );
}
