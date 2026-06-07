import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/links/Toast';
import { useAuth } from '../context/AuthProvider';
import { changeCurrentUserPassword, deleteCurrentUserAccount, getCurrentUserProfile, updateCurrentUserProfile } from '../services/users.service';

const formatDate = (value) => {
  if (!value) return 'Not available';

  return new Date(value).toLocaleString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const providerLabel = (provider) => {
  const labels = {
    credentials: 'Email and password',
    google: 'Google',
    mixed: 'Email and Google'
  };

  return labels[provider] || 'Unknown';
};

const passwordChecks = (password) => [
  ['At least 8 characters', password.length >= 8],
  ['Uppercase letter', /[A-Z]/.test(password)],
  ['Lowercase letter', /[a-z]/.test(password)],
  ['Number', /\d/.test(password)],
  ['Special character', /[^A-Za-z0-9]/.test(password)]
];

const strengthLabel = (checks) => {
  const passed = checks.filter(([, isMet]) => isMet).length;

  if (passed <= 2) return 'Weak';
  if (passed <= 4) return 'Good';
  return 'Strong';
};

const canUsePassword = (authProvider) => authProvider === 'credentials' || authProvider === 'mixed';

const SettingsSection = ({ eyebrow, title, children }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
    <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', avatarUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['settings-profile'],
    queryFn: getCurrentUserProfile
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
  }, [profile]);

  const activeProfile = profile || authUser;
  const checks = useMemo(() => passwordChecks(passwordForm.newPassword), [passwordForm.newPassword]);
  const passwordStrength = strengthLabel(checks);
  const passwordEnabled = canUsePassword(activeProfile?.authProvider);
  const confirmationMatches = deleteConfirmation === 'DELETE';

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2400);
  };

  const profileMutation = useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['settings-profile'] });
      showToast('Profile updated.');
    },
    onError: (mutationError) => showToast(mutationError.message || 'Unable to update profile.', 'error')
  });

  const passwordMutation = useMutation({
    mutationFn: changeCurrentUserPassword,
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed. Sign in again on other devices.');
    },
    onError: (mutationError) => showToast(mutationError.message || 'Unable to change password.', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCurrentUserAccount,
    onSuccess: async () => {
      await logout();
      navigate('/', { replace: true });
    },
    onError: (mutationError) => showToast(mutationError.message || 'Unable to delete account.', 'error')
  });

  const submitProfile = (event) => {
    event.preventDefault();

    if (profileForm.name.trim().length < 2) {
      showToast('Name must be at least 2 characters.', 'error');
      return;
    }

    if (profileForm.avatarUrl && !/^https?:\/\/.+/i.test(profileForm.avatarUrl)) {
      showToast('Avatar URL must start with http:// or https://.', 'error');
      return;
    }

    profileMutation.mutate({
      name: profileForm.name,
      avatarUrl: profileForm.avatarUrl
    });
  };

  const submitPassword = (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword) {
      showToast('Current password is required.', 'error');
      return;
    }

    if (checks.some(([, isMet]) => !isMet)) {
      showToast('New password does not meet all requirements.', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Password confirmation must match.', 'error');
      return;
    }

    passwordMutation.mutate(passwordForm);
  };

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-200">Loading account settings...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">{error.message || 'Unable to load settings.'}</div>;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Settings</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Account management</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Manage your profile, sign-in method, session details, and account lifecycle.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SettingsSection eyebrow="Profile" title="Personal information">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-3xl font-semibold text-cyan-100">
              {activeProfile?.avatarUrl ? <img src={activeProfile.avatarUrl} alt="" className="h-full w-full object-cover" /> : activeProfile?.name?.slice(0, 1)}
            </div>
            <form className="grid flex-1 gap-4" onSubmit={submitProfile}>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Name</span>
                <input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Avatar URL</span>
                <input value={profileForm.avatarUrl} onChange={(event) => setProfileForm({ ...profileForm, avatarUrl: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" placeholder="https://example.com/avatar.png" />
              </label>
              <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <div>Email<br /><span className="text-slate-100">{activeProfile?.email}</span></div>
                <div>Auth provider<br /><span className="text-slate-100">{providerLabel(activeProfile?.authProvider)}</span></div>
                <div>Joined<br /><span className="text-slate-100">{formatDate(activeProfile?.createdAt)}</span></div>
              </div>
              <button type="submit" disabled={profileMutation.isPending} className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
                {profileMutation.isPending ? 'Saving...' : 'Save profile'}
              </button>
            </form>
          </div>
        </SettingsSection>

        <SettingsSection eyebrow="Connected" title="Connected account">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              Google status<br />
              <span className="text-lg font-semibold text-white">{activeProfile?.googleId ? 'Connected' : 'Not connected'}</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              Sign-in method<br />
              <span className="text-lg font-semibold text-white">{providerLabel(activeProfile?.authProvider)}</span>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SettingsSection eyebrow="Security" title="Password">
          {passwordEnabled ? (
            <form className="grid gap-4" onSubmit={submitPassword}>
              {[
                ['currentPassword', 'Current password', 'current'],
                ['newPassword', 'New password', 'next'],
                ['confirmPassword', 'Confirm password', 'confirm']
              ].map(([field, label, key]) => (
                <label key={field} className="space-y-2 text-sm text-slate-200">
                  <span>{label}</span>
                  <div className="flex rounded-xl border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
                    <input
                      type={showPasswords[key] ? 'text' : 'password'}
                      value={passwordForm[field]}
                      onChange={(event) => setPasswordForm({ ...passwordForm, [field]: event.target.value })}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-100 outline-none"
                    />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })} className="px-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      {showPasswords[key] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>
              ))}

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Password strength</p>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">{passwordStrength}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  {checks.map(([label, isMet]) => (
                    <p key={label} className={isMet ? 'text-emerald-200' : 'text-slate-400'}>{isMet ? '✓' : '✗'} {label}</p>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={passwordMutation.isPending} className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
                {passwordMutation.isPending ? 'Changing...' : 'Change password'}
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-300">Password managed through Google</div>
          )}
        </SettingsSection>

        <SettingsSection eyebrow="Session" title="Session information">
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Current login method<br /><span className="text-lg font-semibold text-white">{providerLabel(activeProfile?.authProvider)}</span></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Last login<br /><span className="text-lg font-semibold text-white">{formatDate(activeProfile?.lastLoginAt)}</span></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">Account creation<br /><span className="text-lg font-semibold text-white">{formatDate(activeProfile?.createdAt)}</span></div>
          </div>
        </SettingsSection>
      </div>

      <SettingsSection eyebrow="Danger Zone" title="Delete account">
        <div className="flex flex-col gap-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-white">Permanently delete this account</h3>
            <p className="mt-1 text-sm text-rose-100">This removes your account, owned links, and active sessions. This action cannot be undone.</p>
          </div>
          <button type="button" onClick={() => setIsDeleteOpen(true)} className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white">Delete account</button>
        </div>
      </SettingsSection>

      {isDeleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/40">
            <p className="text-xs uppercase tracking-[0.35em] text-rose-300">Delete account</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">This action is irreversible</h2>
            <p className="mt-3 text-sm text-slate-300">Type DELETE to confirm account deletion. All owned short links and active sessions will be removed.</p>
            <input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-rose-400" placeholder="DELETE" />
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => {
                setIsDeleteOpen(false);
                setDeleteConfirmation('');
              }} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100">Cancel</button>
              <button type="button" disabled={!confirmationMatches || deleteMutation.isPending} onClick={() => deleteMutation.mutate()} className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}
