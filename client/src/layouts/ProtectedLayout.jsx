// Layout wrapper for authenticated pages. Renders Navbar, page Outlet, and AddUserModal.
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import AddUserModal from '../components/AddUserModal';

export default function ProtectedLayout() {
  const [openAddUser, setOpenAddUser] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenAddUser={() => setOpenAddUser(true)} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <AddUserModal open={openAddUser} onClose={() => setOpenAddUser(false)} />
    </div>
  );
}
