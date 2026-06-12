import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../lib/axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { restoreSession } = useAuth();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';
  const [status, setStatus] = useState(token ? 'verifying' : 'idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(emailParam);
  const [resendStatus, setResendStatus] = useState('idle');

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    api.post('/auth/verify-email', { token })
      .then(async () => {
        if (!isMounted) return;
        setStatus('success');
        setMessage('Your email is verified. Your Shortify workspace is ready.');
        await restoreSession();
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus('failed');
        setMessage(error.message || 'This verification link is invalid or expired.');
      });

    return () => {
      isMounted = false;
    };
  }, [restoreSession, token]);

  const resendVerification = async (event) => {
    event.preventDefault();
    setResendStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/resend-verification', { email });
      setResendStatus('success');
      setMessage('If verification is required, a new email has been sent.');
    } catch (error) {
      setResendStatus('failed');
      setMessage(error.message || 'Unable to resend verification email.');
    }
  };

  const title = status === 'success'
    ? 'Email verified'
    : status === 'failed'
      ? 'Verification failed'
      : status === 'verifying'
        ? 'Verifying email'
        : 'Verify your email';

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Account security</p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>

        {status === 'verifying' ? (
          <p className="mt-4 text-sm text-slate-300">Checking your verification link...</p>
        ) : null}

        {message ? (
          <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${status === 'success' || resendStatus === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border-rose-400/30 bg-rose-400/10 text-rose-100'}`}>
            {message}
          </p>
        ) : null}

        {status === 'success' ? (
          <Link to="/dashboard" className="mt-6 block rounded-xl bg-cyan-400 px-4 py-3 text-center font-semibold text-slate-950">
            Continue to dashboard
          </Link>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={resendVerification}>
            <p className="text-sm text-slate-300">Enter your account email and we will send a fresh verification link.</p>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button
              type="submit"
              disabled={resendStatus === 'loading'}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendStatus === 'loading' ? 'Sending...' : 'Resend verification email'}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-slate-300">
          Already verified? <Link className="text-cyan-300" to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
