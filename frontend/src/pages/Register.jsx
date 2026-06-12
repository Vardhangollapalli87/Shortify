import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthButton } from '../components/auth/GoogleOAuthButton';
import { useAuth } from '../context/AuthProvider';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const result = await register(form);
      navigate(`/verify-email?email=${encodeURIComponent(result?.data?.user?.email || form.email)}`);
    } catch (err) {
      setError(err.message || 'Unable to create an account.');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-slate-300">Create a workspace for your short links and analytics.</p>
        <div className="mt-6">
          <GoogleOAuthButton label="Sign up with Google" />
        </div>
        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
          <span className="h-px flex-1 bg-slate-800" />
          Email
          <span className="h-px flex-1 bg-slate-800" />
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Create account</button>
        </form>
        <p className="mt-4 text-sm text-slate-300">Already have an account? <Link className="text-cyan-300" to="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
