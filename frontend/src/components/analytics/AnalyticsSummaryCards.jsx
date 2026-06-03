import { StatCard } from '../dashboard/StatCard';

export const AnalyticsSummaryCards = ({ overview, selectedLinkSummary }) => {
  const totalClicks = selectedLinkSummary?.totalClicks ?? overview?.totalClicks ?? 0;
  const uniqueVisitors = selectedLinkSummary?.uniqueVisitors ?? overview?.uniqueVisitors ?? 0;
  const lastActivity = selectedLinkSummary?.lastClickedAt
    ? new Date(selectedLinkSummary.lastClickedAt).toLocaleDateString()
    : 'No activity yet';

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total clicks" value={totalClicks} hint="Recorded click events for the selected short link" accent="cyan" />
      <StatCard label="Unique visitors" value={uniqueVisitors} hint="Distinct visitor fingerprints seen in analytics" accent="emerald" />
      <StatCard label="Workspace links" value={overview?.totalLinks ?? 0} hint="All short links available in your account" accent="violet" />
      <StatCard label="Last activity" value={lastActivity} hint="Most recent click captured for this link" accent="amber" />
    </section>
  );
};
