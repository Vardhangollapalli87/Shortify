import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

export const ProtectedLayout = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <section className="flex-1 p-6">
          <Outlet />
        </section>
      </main>
    </div>
  </div>
);
