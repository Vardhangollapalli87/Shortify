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
    <main className="grid min-h-screen place-items-center bg-white px-6 py-16 text-slate-950 dark:bg-[#171717] dark:text-slate-100">
      <section className="app-panel w-full max-w-md rounded-lg border p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Protected link</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Enter password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">/{shortCode} requires a password before redirecting.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>Password</span>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 dark:border-[#333333] dark:bg-[#212121] dark:text-slate-100"
              placeholder="Link password"
              required
            />
          </label>
          {errorMessage ? <p className="text-sm text-red-600 dark:text-red-300">{errorMessage}</p> : null}
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Continue</button>
        </form>

        <Link to="/" className="mt-5 block text-center text-sm text-blue-600 dark:text-blue-400">Back to Shortify</Link>
      </section>
    </main>
  );
}
