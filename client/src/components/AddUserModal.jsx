// Admin-only modal to create users. Uses GSAP for enter/exit animations on open/close.
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AddUserModal({ open, onClose }) {
  const { createUser } = useApi();
  const { user } = useAuth();

  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  const [visible, setVisible] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Mount / Unmount control ---
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else if (visible) {
      closeAnimation();
    }
  }, [open]);

  // --- Open animation ---
  useEffect(() => {
    if (!visible) return;

    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 }
    );

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
    );
  }, [visible]);

  // --- Close animation ---
  const closeAnimation = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.25,
      ease: "power3.in",
    });

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => setVisible(false),
    });
  };

  const handleClose = () => {
    closeAnimation();
    setTimeout(onClose, 250);
  };

  if (!visible || user?.role !== "admin") return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await createUser(name, email, password);
      setStatus({ ok: true, message: "User created successfully" });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setStatus({
        ok: false,
        message:
          err?.response?.data?.message || "Failed to create user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Add New User
            </h2>
            <p className="text-sm text-slate-500">
              Create a new admin or operator account
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {status && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                status.ok
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
