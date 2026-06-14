import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell, PasswordStrength } from '../components/auth/AuthShell';
import { GoogleOAuthButton } from '../components/auth/GoogleOAuthButton';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Feedback';
import { Field, Input } from '../components/ui/Form';
import { useAuth } from '../context/AuthProvider';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await register(form);
      navigate(`/verify-email?email=${encodeURIComponent(result?.data?.user?.email || form.email)}`);
    } catch (err) {
      setError(err.message || 'Unable to create an account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="Create account" title="Start your Shortify workspace" description="Create secure links, manage QR assets, and measure every redirect.">
      <GoogleOAuthButton label="Sign up with Google" />
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
        <span className="h-px flex-1 bg-slate-800" />
        Email
        <span className="h-px flex-1 bg-slate-800" />
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Name">
          <Input type="text" placeholder="Vardhan" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="you@company.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </Field>
        <Field label="Password">
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
            <input className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 outline-none" type={showPassword ? 'text' : 'password'} placeholder="Create password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-xs font-semibold text-cyan-200">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        {form.password ? <PasswordStrength password={form.password} /> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create account'}</Button>
      </form>
      <p className="mt-5 text-sm text-slate-400">Already have an account? <Link className="text-cyan-300 hover:text-cyan-100" to="/login">Sign in</Link></p>
    </AuthShell>
  );
}
