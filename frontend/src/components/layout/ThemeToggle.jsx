import { useTheme } from '../../context/ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span aria-hidden="true" className="text-lg leading-none">{isDark ? '\u2600' : '\u263E'}</span>
    </button>
  );
};
