
/**
 * Auth – Login page for Ultrion DMS.
 * Split-panel design: brand panel (left) + login form (right).
 */

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  BrainCircuit,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Layout,
  Cpu
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { API_BASE_URL } from "@/lib/api";

export type UserRole = "super_admin" | "editor" | "viewer" | "admin" | "operations" | "finance";

interface AuthProps {
  onAuthSuccess: (user: {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    company_id?: string;
    status?: string;
  }) => void;
  onBack: () => void;
}

export default function Auth({ onAuthSuccess, onBack }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  /** Submit login credentials to the backend */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        onAuthSuccess(data.user);
      } else {
        const errData = await res.json();
        setError(errData.detail || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#0f172a]">

      {/* ── Left: Brand Panel ── */}
      <div className="hidden lg:flex flex-col w-[40%] bg-[#0f172a] text-white p-16 justify-between sticky top-0 h-screen overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="space-y-12 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onBack}>
            <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
               <div className="w-4 h-4 border-2 border-[#0f172a] rounded-[2px] rotate-45" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase text-white">ULTRION</span>
          </div>

          {/* Headline */}
          <div className="space-y-6 pt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-100/60">
                Institutional Document Ops
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-white">
              The intelligence layer for <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Legal & Finance.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
              Proprietary RAG engines designed to process millions of documents with sub-second latency.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-8 pt-8">
            <FeatureBullet
              icon={<BrainCircuit size={20} className="text-blue-400" />}
              title="Semantic Reasoning"
              desc="Understand complex legal entities and financial context."
            />
            <FeatureBullet
              icon={<ShieldAlert size={20} className="text-blue-400" />}
              title="Audit Proofing"
              desc="SOC2 and GDPR compliance built into every interaction."
            />
            <FeatureBullet
              icon={<Cpu size={20} className="text-blue-400" />}
              title="Edge Architecture"
              desc="Unmatched speed for global enterprise scalability."
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8 mt-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Verified</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">v2.5.0-ENT</span>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-10">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div className="w-9 h-9 bg-[#0f172a] rounded-[8px] flex items-center justify-center">
               <div className="w-4 h-4 border-2 border-white rounded-[2px] rotate-45" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase text-[#0f172a]">ULTRION</span>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign In</h2>
            <p className="text-slate-500 font-medium text-sm">
              Enter your credentials to access the Ultrion workspace
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/5">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Work Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-blue-600 hover:opacity-70 transition-all uppercase tracking-widest"
                  >
                    Reset
                  </button>
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1 pt-1">
                <Checkbox id="remember" className="w-5 h-5 rounded-md border-slate-200 data-[state=checked]:bg-blue-600" />
                <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  id="auth-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-50 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" size={20} />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2026 Ultrion AI Corporation. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature Bullet ─── */
function FeatureBullet({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-bold text-white text-base leading-tight">{title}</p>
        <p className="text-slate-500 text-sm mt-1 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
