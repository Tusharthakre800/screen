// Layout wrapper for authenticated pages. Renders Navbar, page Outlet, and AddUserModal.
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import AddUserModal from '../components/AddUserModal';
import { syncTime } from '../utils/time';

export default function ProtectedLayout() {
  const [openAddUser, setOpenAddUser] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    syncTime(baseUrl);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar onOpenAddUser={() => setOpenAddUser(true)} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <AddUserModal open={openAddUser} onClose={() => setOpenAddUser(false)} />
    </div>
  );
}
