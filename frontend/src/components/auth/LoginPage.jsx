import { useMemo, useState } from "react";

const DEFAULT_ADMIN = {
  name: "AI-ARX Administrator",
  email: "admin@aiarx.com",
  password: "admin123",
  role: "System Administrator",
};

function readUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem("aiarx_users") || "[]");
    if (!Array.isArray(saved)) return [DEFAULT_ADMIN];
    const hasAdmin = saved.some(
      (user) => user.email?.toLowerCase() === DEFAULT_ADMIN.email
    );
    return hasAdmin ? saved : [DEFAULT_ADMIN, ...saved];
  } catch {
    return [DEFAULT_ADMIN];
  }
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "Welcome Back" : "Create Account"),
    [mode]
  );

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const users = readUsers();

      if (users.some((user) => user.email?.toLowerCase() === cleanEmail)) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password,
        role: "AR Workspace User",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "aiarx_users",
        JSON.stringify([...users, newUser])
      );

      setSuccess("Account created successfully. You can now sign in.");
      setName("");
      setEmail(cleanEmail);
      setPassword("");
      setConfirmPassword("");
      setMode("login");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      const users = readUsers();
      const foundUser = users.find(
        (user) =>
          user.email?.toLowerCase() === cleanEmail &&
          user.password === password
      );

      if (!foundUser) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      const user = {
        id: foundUser.id || "admin",
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || "AR Workspace User",
        loginTime: new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem("aiarx_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("aiarx_user");
      }

      sessionStorage.setItem("aiarx_session", JSON.stringify(user));
      onLogin?.(user);
      setLoading(false);
    }, 500);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.10),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.10),transparent_30%)]" />
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",backgroundSize:"48px 48px"}} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-3xl text-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.10)]">◇</div>
          <h1 className="mt-5 text-xl font-semibold tracking-[0.25em]">AI-ARX</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">Vision Workspace</p>
        </div>

        <div className="rounded-3xl border border-cyan-400/10 bg-slate-950/90 p-7 shadow-[0_0_80px_rgba(34,211,238,0.05)] backdrop-blur-xl">
          <div className="mb-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400">SECURE ACCESS</div>
            <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mode === "login" ? "Sign in to access the AI-powered AR dashboard." : "Register a new user for the AI-ARX workspace."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-900/50 p-1">
            <button type="button" onClick={() => switchMode("login")} className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${mode === "login" ? "bg-cyan-400/10 text-cyan-300" : "text-slate-500"}`}>Login</button>
            <button type="button" onClick={() => switchMode("register")} className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${mode === "register" ? "bg-cyan-400/10 text-cyan-300" : "text-slate-500"}`}>New User</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm outline-none focus:border-cyan-400/50" />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm outline-none focus:border-cyan-400/50" />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 pr-20 text-sm outline-none focus:border-cyan-400/50" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase text-slate-500 hover:text-cyan-300">{showPassword ? "Hide" : "Show"}</button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-slate-500">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm outline-none focus:border-cyan-400/50" />
              </div>
            )}

            {mode === "login" && (
              <label className="flex cursor-pointer items-center gap-3 text-xs text-slate-500">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 accent-cyan-400" />
                Remember this device
              </label>
            )}

            {error && <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">{error}</div>}
            {success && <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-300">{success}</div>}

            <button type="submit" disabled={loading} className="w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 transition hover:bg-cyan-400/15 disabled:opacity-50">
              {loading ? "AUTHENTICATING..." : mode === "login" ? "LOGIN" : "REGISTER USER"}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600">Demo Administrator</div>
              <div className="mt-2 text-xs text-slate-500">Email: <span className="text-slate-300">admin@aiarx.com</span></div>
              <div className="mt-1 text-xs text-slate-500">Password: <span className="text-slate-300">admin123</span></div>
            </div>
          )}
        </div>

        <div className="mt-5 text-center text-[9px] uppercase tracking-[0.2em] text-slate-700">AI Vision • Gesture Control • Spatial Interaction</div>
      </div>
    </main>
  );
}
