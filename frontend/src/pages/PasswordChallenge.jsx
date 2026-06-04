import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { buildShortLink } from '../lib/shortLinks';

export default function PasswordChallenge() {
  const { shortCode } = useParams();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');

  const errorMessage = useMemo(() => {
    if (searchParams.get('error') === 'invalid_password') {
      return 'That password did not unlock the link. Try again.';
    }

    return '';
  }, [searchParams]);

  const onSubmit = (event) => {
    event.preventDefault();

    if (!password.trim()) {
      return;
    }

    const redirectUrl = new URL(buildShortLink(shortCode));
    redirectUrl.searchParams.set('password', password);
    window.location.assign(redirectUrl.toString());
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-16 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Protected link</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Enter the password</h1>
        <p className="mt-2 text-sm text-slate-300">/{shortCode} is protected. Enter the password to continue to the destination.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Password</span>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Link password"
              required
            />
          </label>
          {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Continue</button>
        </form>

        <Link to="/" className="mt-5 block text-center text-sm text-cyan-300">Back to Shortify</Link>
      </section>
    </main>
  );
}
