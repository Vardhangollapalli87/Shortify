import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Finishing sign in...');

  useEffect(() => {
    const finishAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const token = response.data?.data?.accessToken ?? null;

        if (token) {
          localStorage.setItem('shortify_access_token', token);
          navigate('/app', { replace: true });
          return;
        }

        setMessage('Unable to restore your session.');
      } catch {
        setMessage('Your session could not be restored.');
      }
    };

    finishAuth();
  }, [navigate]);

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16 text-slate-100">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">OAuth</p>
        <h1 className="mt-3 text-2xl font-semibold">{message}</h1>
      </div>
    </main>
  );
}
