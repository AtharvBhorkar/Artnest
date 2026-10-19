import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DEMO_ADMIN = { email: "admin@artnest.com", password: "Admin@123" };

const field =
  "w-full rounded-lg border border-stone-200 bg-[#FBEFE6]/60 px-3 py-2.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-[#A5522F] focus:bg-white focus:ring-2 focus:ring-[#A5522F]/15";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  if (user?.role === "admin") return <Navigate to="/admin" replace />;

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
      setError("Incorrect email or password.");
      return;
    }
    login("admin");
    navigate("/admin");
  };

  return (
    <div className="grid min-h-screen w-full place-items-center bg-[#FDF1E8] p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-[0_2px_24px_rgba(80,40,20,0.06)]"
      >
        <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#A5522F] text-white">
          <ShieldCheck size={20} />
        </span>
        <h1 className="font-serif text-[26px] leading-tight text-stone-900">Admin sign in</h1>
        <p className="mb-5 mt-1 text-[13px] text-stone-500">Authorised staff only.</p>

        <label htmlFor="admin-email" className="mb-1 block text-[12px] font-medium text-stone-700">Email</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="admin email"
          className={`${field} mb-3`}
          required
        />

        <label htmlFor="admin-password" className="mb-1 block text-[12px] font-medium text-stone-700">Password</label>
        <div className="relative mb-3">
          <input
            id="admin-password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Password"
            className={`${field} pr-10`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <p role="alert" className="mb-3 rounded-lg bg-[#F6DFDA] px-3 py-2 text-[13px] text-[#9B3B2E]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#A5522F] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#8f4526]"
        >
          Sign In <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}

