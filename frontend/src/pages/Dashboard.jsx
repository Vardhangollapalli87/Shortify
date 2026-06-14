import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Badge, EmptyState, Skeleton } from '../components/ui/Feedback';
import { PageHeader } from '../components/ui/PageHeader';
import { getOverviewAnalytics, getTopLinksAnalytics } from '../services/analytics.service';

const numberFormat = new Intl.NumberFormat('en');

const KpiCard = ({ label, value, hint, tone = 'info' }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
      </div>
      <Badge tone={tone}>Live</Badge>
    </div>
  </Card>
);

const DashboardLoading = () => (
  <div className="space-y-5">
    <Skeleton className="h-36" />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-36" />)}
    </div>
    <Skeleton className="h-80" />
  </div>
);

export default function Dashboard() {
  const overviewQuery = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getOverviewAnalytics
  });

  const topLinksQuery = useQuery({
    queryKey: ['analytics-top-links'],
    queryFn: getTopLinksAnalytics
  });

  const overview = overviewQuery.data;
  const topLinks = topLinksQuery.data || [];
  const loading = overviewQuery.isLoading || topLinksQuery.isLoading;
  const errorMessage = overviewQuery.error?.message || topLinksQuery.error?.message;
  const maxClicks = Math.max(...topLinks.map((link) => link.totalClicks || 0), 1);
  const topLinkLabel = overview?.topLink?.shortCode ? `/${overview.topLink.shortCode}` : 'No activity';

  if (loading) {
    return <DashboardLoading />;
  }

  if (errorMessage) {
    return (
      <div className="space-y-5">
        <PageHeader eyebrow="Overview" title="Dashboard" description="Workspace health, link velocity, and recent performance." />
        <Card className="p-5">
          <p className="text-sm text-rose-200">{errorMessage}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track link performance, recent activity, and common workflows from one operations view."
        action={<Button as={Link} to="/links" size="lg">Create link</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total links" value={numberFormat.format(overview?.totalLinks ?? 0)} hint="Managed links in this workspace" tone="info" />
        <KpiCard label="Total clicks" value={numberFormat.format(overview?.totalClicks ?? 0)} hint="Recorded redirects across all links" tone="success" />
        <KpiCard label="Unique visitors" value={numberFormat.format(overview?.uniqueVisitors ?? 0)} hint="Distinct visitors identified from clicks" tone="violet" />
        <KpiCard label="Top link" value={topLinkLabel} hint={overview?.topLink?.totalClicks ? `${numberFormat.format(overview.topLink.totalClicks)} clicks` : 'No link activity yet'} tone="warning" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
        <Card>
          <CardHeader eyebrow="Performance" title="Top link velocity" description="A quick read of your highest-performing short links." />
          <CardBody>
            {topLinks.length ? (
              <div className="space-y-4">
                {topLinks.slice(0, 6).map((link) => (
                  <div key={link.id || link.shortCode} className="grid gap-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-white">/{link.shortCode}</span>
                      <span className="text-slate-400">{numberFormat.format(link.totalClicks || 0)} clicks</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full brand-gradient" style={{ width: `${Math.max(((link.totalClicks || 0) / maxClicks) * 100, 4)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No performance data yet" description="Create and share short links to populate this chart." action={<Button as={Link} to="/links">Create first link</Button>} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Actions" title="Quick actions" description="Move through common workflows faster." />
          <CardBody className="grid gap-3">
            <Button as={Link} to="/links" variant="secondary" className="justify-start">Create or manage links</Button>
            <Button as={Link} to="/analytics" variant="secondary" className="justify-start">Review analytics</Button>
            <Button as={Link} to="/settings" variant="secondary" className="justify-start">Account settings</Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="Recent activity" title="Latest high-performing links" description="A compact table for quick review." />
        <CardBody>
          {topLinks.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Short link</th>
                    <th className="py-3 pr-4 font-semibold">Destination</th>
                    <th className="py-3 pr-4 text-right font-semibold">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {topLinks.slice(0, 6).map((link) => (
                    <tr key={link.id || link.shortCode}>
                      <td className="py-4 pr-4 font-medium text-cyan-100">/{link.shortCode}</td>
                      <td className="max-w-[420px] truncate py-4 pr-4 text-slate-400">{link.originalUrl || 'Destination unavailable'}</td>
                      <td className="py-4 pr-4 text-right text-white">{numberFormat.format(link.totalClicks || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No recent link activity" description="Traffic will appear here after visitors start using your short links." />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
