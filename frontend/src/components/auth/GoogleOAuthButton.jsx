const getGoogleOAuthUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    return '#';
  }

  return `${apiBaseUrl.replace(/\/$/, '')}/auth/google`;
};

export const GoogleOAuthButton = ({ label = 'Continue with Google' }) => (
  <a
    href={getGoogleOAuthUrl()}
    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-100"
  >
    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-slate-900">G</span>
    {label}
  </a>
);
