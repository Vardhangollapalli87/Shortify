import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthShell, PasswordStrength } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Feedback';
import { Field } from '../components/ui/Form';
import api from '../lib/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('success');
      setMessage('Your password has been reset. You can sign in with your new password.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to reset password.');
    }
  };

  return (
    <AuthShell eyebrow="Password recovery" title="Create a new password" description="Choose a strong password to secure your Shortify account.">
      <form className="space-y-4" onSubmit={onSubmit}>
        {!token ? <Alert tone="error">This reset link is missing a token. Request a new password reset email.</Alert> : null}
        <Field label="New password">
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 outline-none"
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-4 text-xs font-semibold text-cyan-200">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        {password ? <PasswordStrength password={password} /> : null}
        {message ? <Alert tone={status === 'success' ? 'success' : 'error'}>{message}</Alert> : null}
        <Button type="submit" className="w-full" disabled={!token || status === 'loading'}>
          {status === 'loading' ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-slate-400"><Link className="text-cyan-300 hover:text-cyan-100" to="/login">Back to sign in</Link></p>
    </AuthShell>
  );
}
