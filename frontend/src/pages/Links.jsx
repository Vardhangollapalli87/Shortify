import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConfirmDeleteModal } from '../components/links/ConfirmDeleteModal';
import { LinkFormModal } from '../components/links/LinkFormModal';
import { LinkTable } from '../components/links/LinkTable';
import { Toast } from '../components/links/Toast';
import { EmptyState } from '../components/dashboard/EmptyState';
import { ErrorState } from '../components/dashboard/ErrorState';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { createLink, deleteLink, getUserLinks, toggleLink, updateLink } from '../services/urls.service';
import { buildShortLink } from '../lib/shortLinks';

export default function LinksPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [detailLink, setDetailLink] = useState(null);
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
        <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Links</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Links management</h1>
          <p className="mt-2 text-slate-300">Loading your short links and workspace details…</p>
        </header>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Links</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Links management</h1>
          <p className="mt-2 text-slate-300">Unable to load your links right now.</p>
        </header>
        <ErrorState message={error.message || 'The links API could not be reached.'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Links</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Links management</h1>
            <p className="mt-2 text-slate-300">Create, update, enable, disable, and delete your short links in one protected workspace.</p>
          </div>
          <button type="button" onClick={() => {
            setActiveLink(null);
            setIsModalOpen(true);
          }} className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10">Create link</button>
        </div>
        <p className="mt-4 text-sm text-slate-300">{headerLabel}</p>
      </header>

      {links.length > 0 ? (
        <section className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/20 md:grid-cols-[1fr_180px_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            placeholder="Search aliases, titles, or destinations"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
            <option value="all">All links</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="protected">Protected</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
            <option value="newest">Newest first</option>
            <option value="clicks">Most clicks</option>
            <option value="alias">Alias A-Z</option>
          </select>
        </section>
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
        />
      )}

      {detailLink ? (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Details</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">/{detailLink.shortCode}</h2>
              <p className="mt-2 break-all text-sm text-slate-300">{buildShortLink(detailLink.shortCode)}</p>
              <p className="mt-3 break-all text-sm text-slate-400">{detailLink.originalUrl}</p>
            </div>
            <button type="button" onClick={() => setDetailLink(null)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100">Close</button>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Clicks<br /><span className="text-xl font-semibold text-white">{detailLink.totalClicks || 0}</span></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Status<br /><span className="text-xl font-semibold text-white">{detailLink.isActive ? 'Active' : 'Inactive'}</span></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Protection<br /><span className="text-xl font-semibold text-white">{detailLink.isPasswordProtected ? 'Password' : 'None'}</span></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Expires<br /><span className="text-xl font-semibold text-white">{detailLink.expiresAt ? 'Scheduled' : 'Never'}</span></div>
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

      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}
