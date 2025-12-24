// Animated login page using GSAP; posts credentials and stores JWT via AuthContext.
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const btnWrapRef = useRef(null);

  /* ---------------- GSAP PAGE ENTRY ---------------- */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 }
    )
      .fromTo(
        cardRef.current,
        { opacity: 0, y: 32, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        "-=0.25"
      )
      .from(
        ".login-field",
        { opacity: 0, y: 14, stagger: 0.12, duration: 0.45 },
        "-=0.3"
      );
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.token);

      // success micro animation
      gsap.to(cardRef.current, {
        scale: 0.98,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
      });

      setTimeout(() => navigate("/"), 250);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex items-center justify-center px-4
                bg-[#F8FAFC]
"
    >
      <div className="w-full max-w-md">
        <div
          ref={cardRef}
          className="bg-white/90 backdrop-blur-xl border border-white/40
                     rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-800">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Sign in to Digital Signage Admin Panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div className="login-field">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-16
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-field text-sm rounded-lg px-3 py-2
                              bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Submit Button (FIXED ANIMATION) */}
            <div ref={btnWrapRef} className="login-field">
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => {
                  if (!loading)
                    gsap.to(btnWrapRef.current, {
                      scale: 1.03,
                      duration: 0.2,
                      ease: "power2.out",
                    });
                }}
                onMouseLeave={() => {
                  if (!loading)
                    gsap.to(btnWrapRef.current, {
                      scale: 1,
                      duration: 0.2,
                      ease: "power2.out",
                    });
                }}
                className={`w-full h-[46px] flex items-center justify-center gap-2
                  rounded-xl font-medium text-white transition-colors
                  ${
                    loading
                      ? "bg-blue-500 opacity-70 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading && (
                  <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                )}
                <span>{loading ? "Signing in…" : "Sign In"}</span>
              </button>
            </div>

            <p className="text-xs text-center text-slate-500">
              Session expires automatically after 15 minutes
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-white/80 text-sm">
          Use your <span className="font-semibold">admin credentials</span> to continue
        </p>
      </div>
    </div>
  );
}
