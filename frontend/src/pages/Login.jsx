import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleOAuthButton } from '../components/auth/GoogleOAuthButton';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Feedback';
import { Field, Input } from '../components/ui/Form';
import { useAuth } from '../context/AuthProvider';

const oauthErrorMessages = {
  google_oauth_denied: 'Google sign in was cancelled.',
  invalid_oauth_state: 'Google sign in could not be verified. Please try again.',
  google_oauth_failed: 'Google sign in failed. Please try again.'
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(oauthErrorMessages[searchParams.get('error')] || '');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="Sign in" title="Welcome back" description="Access your links, QR codes, analytics, and account workspace.">
      <GoogleOAuthButton label="Sign in with Google" />
      <div className="my-5 flex items-center gap-3 text-xs uppercase text-slate-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        Email
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Email">
          <Input type="email" placeholder="you@company.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </Field>
        <Field label="Password">
          <div className="flex rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-950">
            <input className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-950 outline-none dark:text-slate-100" type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-xs font-semibold text-blue-600 dark:text-blue-400" aria-label={`${showPassword ? 'Hide' : 'Show'} password`}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Continue'}</Button>
      </form>
      <div className="mt-5 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400" to="/forgot-password">Forgot password?</Link>
        <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400" to="/register">Create account</Link>
      </div>
    </AuthShell>
  );
}
