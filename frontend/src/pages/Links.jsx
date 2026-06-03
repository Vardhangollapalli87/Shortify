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

export default function LinksPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [toast, setToast] = useState(null);

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

  const headerLabel = useMemo(() => (links.length === 0 ? 'No links yet' : `${links.length} links managed`), [links.length]);

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
          <button type="button" onClick={() => setIsModalOpen(true)} className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10">Create link</button>
        </div>
        <p className="mt-4 text-sm text-slate-300">{headerLabel}</p>
      </header>

      {links.length > 0 ? (
        <LinkTable
          links={links}
          onEdit={(link) => {
            setActiveLink(link);
            setIsModalOpen(true);
          }}
          onDelete={(link) => {
            setActiveLink(link);
            setIsDeleteOpen(true);
          }}
          onToggle={(link) => toggleMutation.mutate(link.id)}
          onView={(link) => setToast({ message: `Viewing /${link.shortCode} details.`, tone: 'info' })}
        />
      ) : (
        <EmptyState
          title="No links created yet"
          description="Create your first short link to start tracking performance and managing your workspace."
        />
      )}

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
