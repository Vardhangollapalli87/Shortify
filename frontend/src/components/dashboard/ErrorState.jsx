export const ErrorState = ({ message }) => (
  <section className="rounded-lg border border-red-200 bg-red-50 p-8 text-red-800 shadow-sm dark:border-red-900 dark:bg-red-950 dark:text-red-200">
    <p className="text-sm uppercase text-red-700 dark:text-red-300">Analytics unavailable</p>
    <h2 className="mt-3 text-2xl font-semibold text-white">Unable to load dashboard stats</h2>
    <p className="mt-2">{message}</p>
  </section>
);
