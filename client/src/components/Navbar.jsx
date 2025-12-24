// Top navigation bar with responsive links and actions. Opens AddUserModal via onOpenAddUser.
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ onOpenAddUser }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
    ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <span className="text-lg font-semibold text-slate-800">
            Digital Signage Admin
          </span>

          {/* Desktop Menu */}
          <div className="nav-desktop items-center gap-2">
            <NavLink to="/upload" className={linkClass}>Upload</NavLink>
            <NavLink to="/library" className={linkClass}>Library</NavLink>
            <NavLink to="/playlist" className={linkClass}>Playlist</NavLink>
            <NavLink to="/status" className={linkClass}>Player Status</NavLink>
          </div>

          {/* Desktop Right Actions */}
          <div className="nav-desktop items-center gap-3">
            {isAdmin && (
              <button
                onClick={onOpenAddUser}
                className="px-3 py-2 text-sm rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Add User
              </button>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-700 truncate max-w-[180px]">
                {user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-900"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="nav-mobile p-2 rounded hover:bg-slate-100" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="nav-mobile border-t bg-white px-4 py-3 space-y-2">
          <NavLink to="/upload" onClick={() => setOpen(false)} className={linkClass}>Upload</NavLink>
          <NavLink to="/library" onClick={() => setOpen(false)} className={linkClass}>Library</NavLink>
          <NavLink to="/playlist" onClick={() => setOpen(false)} className={linkClass}>Playlist</NavLink>
          <NavLink to="/status" onClick={() => setOpen(false)} className={linkClass}>Player Status</NavLink>

          {isAdmin && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenAddUser();
              }}
              className="w-full rounded-md text-sm font-medium transition text-left px-2 py-4  hover:bg-slate-100"
            >
              Add User
            </button>
          )}

          <div className=" pt-3 border-t border-slate-200 flex items-center justify-between">
  {/* User info */}
  <div className="flex items-center gap-2 min-w-0">
    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
      {user?.email?.[0]?.toUpperCase()}
    </div>
    <span className="text-sm text-slate-700 truncate max-w-[160px]">
      {user?.email}
    </span>
  </div>

  {/* Logout */}
  <button
    onClick={logout}
    className="px-4 py-1.5 rounded-xl text-sm font-medium
              text-sm font-medium bg-red-600 text-white
               hover:bg-red-100 transition"
  >
    Logout
  </button>
</div>

        </div>
      )}
    </nav>
  );
}
