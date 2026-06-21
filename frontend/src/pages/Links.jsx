import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConfirmDeleteModal } from '../components/links/ConfirmDeleteModal';
import { LinkFormModal } from '../components/links/LinkFormModal';
import { LinkTable } from '../components/links/LinkTable';
import { Toast } from '../components/links/Toast';
import { ErrorState } from '../components/dashboard/ErrorState';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { EmptyState } from '../components/ui/Feedback';
import { Input, Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';
import { createLink, deleteLink, getUserLinks, toggleLink, updateLink } from '../services/urls.service';
import { buildShortLink } from '../lib/shortLinks';
import { QRCodeModal } from '../components/qr/QRCodeModal';

export default function LinksPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [detailLink, setDetailLink] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: links = [], isLoading, error } = useQuery({
    queryKey: ['user-links'],
    queryFn: getUserLinks
  });

  const createMutation = useMutation({
    mutationFn: createLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-links'] });
      setToast({ message: 'Short link created successfully.', tone: 'success' });
      setIsModalOpen(false);
      setTimeout(() => setToast(null), 2200);
    },
    onError: (mutationError) => {
      setToast({ message: mutationError.message || 'Unable to create short link.', tone: 'error' });
      setTimeout(() => setToast(null), 2600);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-links'] });
      setToast({ message: 'Short link updated successfully.', tone: 'success' });
      setIsModalOpen(false);
      setActiveLink(null);
      setTimeout(() => setToast(null), 2200);
    },
    onError: (mutationError) => {
      setToast({ message: mutationError.message || 'Unable to update short link.', tone: 'error' });
      setTimeout(() => setToast(null), 2600);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-links'] });
      setToast({ message: 'Short link deleted successfully.', tone: 'success' });
      setIsDeleteOpen(false);
      setActiveLink(null);
      setTimeout(() => setToast(null), 2200);
    },
    onError: (mutationError) => {
      setToast({ message: mutationError.message || 'Unable to delete short link.', tone: 'error' });
      setTimeout(() => setToast(null), 2600);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: toggleLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-links'] });
      setToast({ message: 'Link status updated.', tone: 'success' });
      setTimeout(() => setToast(null), 2200);
    },
    onError: (mutationError) => {
      setToast({ message: mutationError.message || 'Unable to update link status.', tone: 'error' });
      setTimeout(() => setToast(null), 2600);
    }
  });

  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return links
      .filter((link) => {
        const matchesSearch = !query
          || link.shortCode.toLowerCase().includes(query)
          || link.originalUrl.toLowerCase().includes(query)
          || (link.title || '').toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all'
          || (statusFilter === 'active' && link.isActive)
          || (statusFilter === 'inactive' && !link.isActive)
          || (statusFilter === 'protected' && link.isPasswordProtected);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'clicks') return (b.totalClicks || 0) - (a.totalClicks || 0);
        if (sortBy === 'alias') return a.shortCode.localeCompare(b.shortCode);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [links, search, sortBy, statusFilter]);

  const headerLabel = useMemo(() => {
    if (links.length === 0) return 'No links yet';
    if (filteredLinks.length !== links.length) return `${filteredLinks.length} of ${links.length} links shown`;
    return `${links.length} links managed`;
  }, [filteredLinks.length, links.length]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Links" title="Links management" description="Loading your short links and workspace details." />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Links" title="Links management" description="Unable to load your links right now." />
        <ErrorState message={error.message || 'The links API could not be reached.'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Links"
        title="Links management"
        description="Create, update, protect, enable, disable, and delete short links in one operational workspace."
        meta={headerLabel}
        action={(
          <Button type="button" size="lg" onClick={() => {
            setActiveLink(null);
            setIsModalOpen(true);
          }}
          >
            Create link
          </Button>
        )}
      />

      {links.length > 0 ? (
        <Card>
          <CardBody className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search aliases, titles, or destinations"
              aria-label="Search links"
            />
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter links by status">
              <option value="all">All links</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="protected">Protected</option>
            </Select>
            <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort links">
              <option value="newest">Newest first</option>
              <option value="clicks">Most clicks</option>
              <option value="alias">Alias A-Z</option>
            </Select>
          </CardBody>
        </Card>
      ) : null}

      {filteredLinks.length > 0 ? (
        <LinkTable
          links={filteredLinks}
          onEdit={(link) => {
            setActiveLink(link);
            setIsModalOpen(true);
          }}
          onDelete={(link) => {
            setActiveLink(link);
            setIsDeleteOpen(true);
          }}
          onToggle={(link) => toggleMutation.mutate(link.id)}
          onView={(link) => setDetailLink(link)}
          onQr={(link) => setQrLink(link)}
          onCopy={() => {
            setToast({ message: 'Short link copied.', tone: 'success' });
            setTimeout(() => setToast(null), 1800);
          }}
          onCopyError={() => {
            setToast({ message: 'Unable to copy. Select and copy the link manually.', tone: 'error' });
            setTimeout(() => setToast(null), 2600);
          }}
        />
      ) : (
        <EmptyState
          title={links.length > 0 ? 'No links match your filters' : 'No links created yet'}
          description={links.length > 0 ? 'Adjust your search or filters to find another short link.' : 'Create your first short link to start tracking performance and managing your workspace.'}
          action={links.length > 0 ? null : <Button type="button" onClick={() => { setActiveLink(null); setIsModalOpen(true); }}>Create first link</Button>}
        />
      )}

      {detailLink ? (
        <section className="app-panel rounded-lg border p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Link details</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">/{detailLink.shortCode}</h2>
              <p className="mt-2 break-all text-sm text-slate-300">{buildShortLink(detailLink.shortCode)}</p>
              <p className="mt-3 break-all text-sm text-slate-400">{detailLink.originalUrl}</p>
            </div>
            <Button type="button" onClick={() => setDetailLink(null)} variant="secondary">Close</Button>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
            {[["Clicks", detailLink.totalClicks || 0], ["Status", detailLink.isActive ? 'Active' : 'Inactive'], ["Protection", detailLink.isPasswordProtected ? 'Password' : 'None'], ["Expires", detailLink.expiresAt ? 'Scheduled' : 'Never']].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">{label}<br /><span className="mt-1 block text-lg font-semibold text-slate-950 dark:text-white">{value}</span></div>)}
          </div>
        </section>
      ) : null}

      <LinkFormModal
        isOpen={isModalOpen}
        mode={activeLink ? 'edit' : 'create'}
        link={activeLink}
        onClose={() => {
          setIsModalOpen(false);
          setActiveLink(null);
        }}
        onSubmit={(payload) => {
          if (activeLink) {
            updateMutation.mutate({ urlId: activeLink.id, payload });
            return;
          }

          createMutation.mutate(payload);
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        link={activeLink}
        onClose={() => {
          setIsDeleteOpen(false);
          setActiveLink(null);
        }}
        onConfirm={() => deleteMutation.mutate(activeLink.id)}
      />

      <QRCodeModal
        isOpen={Boolean(qrLink)}
        link={qrLink}
        onClose={() => setQrLink(null)}
        onCopy={() => {
          setToast({ message: 'Short link copied.', tone: 'success' });
          setTimeout(() => setToast(null), 1800);
        }}
        onCopyError={() => {
          setToast({ message: 'Unable to copy. Select and copy the link manually.', tone: 'error' });
          setTimeout(() => setToast(null), 2600);
        }}
      />

      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}
