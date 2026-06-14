import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Feedback';
import { Field, Input } from '../components/ui/Form';
import api from '../lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage('If an account exists for this email, a reset link has been sent.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to send reset email.');
    }
  };

  return (
    <AuthShell eyebrow="Password recovery" title="Reset your password" description="Send a secure reset link to your account email.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Email">
          <Input type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        {message ? <Alert tone={status === 'success' ? 'success' : 'error'}>{message}</Alert> : null}
        <Button type="submit" className="w-full" disabled={status === 'loading'}>{status === 'loading' ? 'Sending...' : 'Send reset link'}</Button>
      </form>
      <p className="mt-5 text-sm text-slate-400"><Link className="text-cyan-300 hover:text-cyan-100" to="/login">Back to sign in</Link></p>
    </AuthShell>
  );
}
