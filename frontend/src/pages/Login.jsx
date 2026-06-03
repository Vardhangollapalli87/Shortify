import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Sign in</p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-slate-300">Foundation-only auth placeholder for the dashboard shell.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Continue</button>
        </form>
        <p className="mt-4 text-sm text-slate-300">Need an account? <Link className="text-cyan-300" to="/register">Create one</Link></p>
      </div>
    </main>
  );
}
