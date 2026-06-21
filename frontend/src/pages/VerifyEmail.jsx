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
    <main className="grid min-h-screen place-items-center bg-white px-6 py-16 text-slate-950 dark:bg-[#171717] dark:text-slate-100">
      <div className="app-panel w-full max-w-md rounded-lg border p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Account security</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{title}</h1>

        {status === 'verifying' ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Checking your verification link...</p>
        ) : null}

        {message ? (
          <p className={`mt-4 rounded-lg border px-4 py-3 text-sm ${status === 'success' || resendStatus === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'}`}>
            {message}
          </p>
        ) : null}

        {status === 'success' ? (
          <Link to="/dashboard" className="mt-6 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700">
            Continue to dashboard
          </Link>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={resendVerification}>
            <p className="text-sm text-slate-600 dark:text-slate-300">Enter your account email and we will send a fresh verification link.</p>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 dark:border-[#333333] dark:bg-[#212121] dark:text-slate-100"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button
              type="submit"
              disabled={resendStatus === 'loading'}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendStatus === 'loading' ? 'Sending...' : 'Resend verification email'}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already verified? <Link className="text-blue-600 dark:text-blue-400" to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
