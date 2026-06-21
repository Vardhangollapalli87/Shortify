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
    className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-[#333333] dark:bg-[#262626] dark:text-slate-100 dark:hover:bg-[#333333]"
  >
    <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-slate-900">G</span>
    {label}
  </a>
);
