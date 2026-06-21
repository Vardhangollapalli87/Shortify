import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { restoreSession } = useAuth();
  const [message, setMessage] = useState('Finishing sign in...');

  useEffect(() => {
    const finishAuth = async () => {
      const error = searchParams.get('error');

      if (error) {
        navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
        return;
      }

      try {
        const session = await restoreSession();

        if (session?.accessToken) {
          navigate('/app', { replace: true });
          return;
        }

        setMessage('Unable to restore your session.');
      } catch {
        setMessage('Your session could not be restored.');
      }
    };

    finishAuth();
  }, [navigate, restoreSession, searchParams]);

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16 text-slate-100">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">OAuth</p>
        <h1 className="mt-3 text-2xl font-semibold">{message}</h1>
      </div>
    </main>
  );
}
