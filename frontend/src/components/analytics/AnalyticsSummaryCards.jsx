import { Card } from '../ui/Card';

const MetricCard = ({ label, value, hint }) => (
  <Card className="p-5">
    <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
  </Card>
);

export const AnalyticsSummaryCards = ({ overview, selectedLinkSummary }) => {
  const totalClicks = selectedLinkSummary?.totalClicks ?? overview?.totalClicks ?? 0;
  const uniqueVisitors = selectedLinkSummary?.uniqueVisitors ?? overview?.uniqueVisitors ?? 0;
  const lastActivity = selectedLinkSummary?.lastClickedAt
    ? new Date(selectedLinkSummary.lastClickedAt).toLocaleDateString()
    : 'No activity yet';

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total clicks" value={totalClicks} hint="Recorded click events for the selected short link" />
      <MetricCard label="Unique visitors" value={uniqueVisitors} hint="Distinct visitor fingerprints seen in analytics" />
      <MetricCard label="Workspace links" value={overview?.totalLinks ?? 0} hint="All short links available in your account" />
      <MetricCard label="Last activity" value={lastActivity} hint="Most recent click captured for this link" />
    </section>
  );
};
