
// Admin-only modal to create users (Redesigned UI)
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AddUserModal({ open, onClose }) {
  const { createUser } = useApi();
  const { user } = useAuth();

  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const statusRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Mount control */
  useEffect(() => {
    open ? setVisible(true) : visible && closeAnimation();
  }, [open]);

  /* Open animation */
  useEffect(() => {
    if (!visible) return;

    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
  }, [visible]);

  /* Status animation */
  useEffect(() => {
    if (!status || !statusRef.current) return;
    gsap.fromTo(
      statusRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  }, [status]);

  /* Close animation */
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
      setStatus({ ok: true, message: "User created successfully 🎉" });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setStatus({
        ok: false,
        message: err?.response?.data?.message || "Failed to create user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-xl
                   shadow-2xl border border-slate-200 p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Create User
            </h2>
            <p className="text-sm text-slate-500">
              Admin-only access
            </p>
          </div>

          <button
            onClick={handleClose}
            className="h-8 w-8 grid place-items-center rounded-full
                       hover:bg-slate-200 text-slate-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <Input
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="John Doe"
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@example.com"
          />

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-slate-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Status */}
          {status && (
            <div
              ref={statusRef}
              className={`rounded-xl px-4 py-2 text-sm border ${
                status.ok
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r
                         from-blue-600 to-indigo-600 text-white
                         hover:from-blue-700 hover:to-indigo-700
                         disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Input Component */
function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
