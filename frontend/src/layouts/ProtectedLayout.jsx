import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav, Sidebar } from '../components/layout/Sidebar';

export const ProtectedLayout = () => (
  <div className="premium-shell min-h-screen text-slate-100">
    <div className="mx-auto flex min-h-screen max-w-[1800px]">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </section>
        <MobileNav />
      </main>
    </div>
  </div>
);
