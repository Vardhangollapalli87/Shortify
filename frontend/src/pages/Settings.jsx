import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/links/Toast';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Alert, Badge, Skeleton } from '../components/ui/Feedback';
import { Field, Input } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';
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

const providerLabel = (provider) => ({
  credentials: 'Email and password',
  google: 'Google',
  mixed: 'Email and Google'
}[provider] || 'Unknown');

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

const PasswordInput = ({ label, value, onChange, visible, onToggle }) => (
  <Field label={label}>
    <div className="flex rounded-lg border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 outline-none"
      />
      <button type="button" onClick={onToggle} className="px-4 text-xs font-semibold text-cyan-200">
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  </Field>
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
  const initials = activeProfile?.name?.slice(0, 1)?.toUpperCase() || activeProfile?.email?.slice(0, 1)?.toUpperCase() || 'S';

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
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return <Alert tone="error">{error.message || 'Unable to load settings.'}</Alert>;
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Settings" title="Account management" description="Manage identity, security, connected accounts, session details, and account lifecycle." />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader eyebrow="Profile" title="Personal information" description="Keep your workspace identity current." />
          <CardBody>
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="shrink-0">
                <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-xl border border-slate-700 bg-slate-950 text-3xl font-semibold text-cyan-100">
                  {activeProfile?.avatarUrl ? <img src={activeProfile.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Avatar URL today. Upload-ready layout for future storage.</p>
              </div>
              <form className="grid flex-1 gap-4" onSubmit={submitProfile}>
                <Field label="Name">
                  <Input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
                </Field>
                <Field label="Avatar URL">
                  <Input value={profileForm.avatarUrl} onChange={(event) => setProfileForm({ ...profileForm, avatarUrl: event.target.value })} placeholder="https://example.com/avatar.png" />
                </Field>
                <div className="grid gap-3 text-sm text-slate-400 md:grid-cols-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">Email<br /><span className="text-slate-100">{activeProfile?.email}</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">Provider<br /><span className="text-slate-100">{providerLabel(activeProfile?.authProvider)}</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">Verified<br /><span className="text-slate-100">{activeProfile?.isEmailVerified ? 'Yes' : 'No'}</span></div>
                </div>
                <Button type="submit" disabled={profileMutation.isPending} className="w-fit">
                  {profileMutation.isPending ? 'Saving...' : 'Save profile'}
                </Button>
              </form>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Connected" title="Connected accounts" description="Review account providers and sign-in coverage." />
          <CardBody className="grid gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">Google</p>
                  <p className="mt-1 text-sm text-slate-500">OAuth provider status</p>
                </div>
                <Badge tone={activeProfile?.googleId ? 'success' : 'neutral'}>{activeProfile?.googleId ? 'Connected' : 'Not connected'}</Badge>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Sign-in method</p>
              <p className="mt-2 text-lg font-semibold text-white">{providerLabel(activeProfile?.authProvider)}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Joined</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatDate(activeProfile?.createdAt)}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader eyebrow="Security" title="Password" description={passwordEnabled ? 'Change your password and review strength requirements.' : 'This account uses Google-managed authentication.'} />
          <CardBody>
            {passwordEnabled ? (
              <form className="grid gap-4" onSubmit={submitPassword}>
                <PasswordInput label="Current password" value={passwordForm.currentPassword} visible={showPasswords.current} onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} />
                <PasswordInput label="New password" value={passwordForm.newPassword} visible={showPasswords.next} onToggle={() => setShowPasswords({ ...showPasswords, next: !showPasswords.next })} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} />
                <PasswordInput label="Confirm password" value={passwordForm.confirmPassword} visible={showPasswords.confirm} onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} />
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">Password strength</p>
                    <Badge tone={passwordStrength === 'Strong' ? 'success' : passwordStrength === 'Good' ? 'warning' : 'danger'}>{passwordStrength}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {checks.map(([label, isMet]) => (
                      <p key={label} className={isMet ? 'text-emerald-200' : 'text-slate-500'}>{isMet ? '✓' : '✗'} {label}</p>
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={passwordMutation.isPending} className="w-fit">
                  {passwordMutation.isPending ? 'Changing...' : 'Change password'}
                </Button>
              </form>
            ) : (
              <Alert tone="info">Password managed through Google.</Alert>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Session" title="Session information" description="Current account timestamps and sign-in method." />
          <CardBody className="grid gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">Current login method<br /><span className="text-lg font-semibold text-white">{providerLabel(activeProfile?.authProvider)}</span></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">Last login<br /><span className="text-lg font-semibold text-white">{formatDate(activeProfile?.lastLoginAt)}</span></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">Account creation<br /><span className="text-lg font-semibold text-white">{formatDate(activeProfile?.createdAt)}</span></div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="Danger Zone" title="Delete account" description="Permanent account deletion removes account data, owned links, and active sessions." />
        <CardBody>
          <div className="flex flex-col gap-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-white">Permanently delete this account</h3>
              <p className="mt-1 text-sm text-rose-100">This action cannot be undone.</p>
            </div>
            <Button type="button" onClick={() => setIsDeleteOpen(true)} variant="danger">Delete account</Button>
          </div>
        </CardBody>
      </Card>

      {isDeleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/50" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-300">Delete account</p>
            <h2 id="delete-account-title" className="mt-2 text-2xl font-semibold text-white">This action is irreversible</h2>
            <p className="mt-3 text-sm text-slate-400">Type DELETE to confirm account deletion. All owned short links and active sessions will be removed.</p>
            <Input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} className="mt-5" placeholder="DELETE" />
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" onClick={() => {
                setIsDeleteOpen(false);
                setDeleteConfirmation('');
              }} variant="secondary">Cancel</Button>
              <Button type="button" disabled={!confirmationMatches || deleteMutation.isPending} onClick={() => deleteMutation.mutate()} variant="danger">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete account'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}
