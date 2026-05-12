/**
 * Ultrion DMS – Root Application Shell
 * Handles auth state, routing between views, and the main sidebar layout.
 */

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Files,
  Search,
  GitBranch,
  CheckSquare,
  ScrollText,
  Archive,
  Sparkles,
  Settings,
  LogOut,
  Bell,
  Shield,
  ChevronRight,
} from "lucide-react";

import DocumentManagement from "./components/DocumentManagement";
import AIDocumentAssistant from "./components/AIDocumentAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ProcessAutomation from "./components/ProcessAutomation";
import SettingsModule from "./components/SettingsModule";
import UserManagement from "./components/UserManagement";
import LandingPage from "./components/LandingPage";
import Auth, { UserRole } from "./components/Auth";
import SuperAdminApp from "./components/SuperAdminApp";
import { Toaster } from "@/components/ui/sonner";
import api from "./lib/api";
import { toast } from "sonner";

/** Available top-level module routes */
type Module =
  | "dashboard"
  | "documents"
  | "search"
  | "workflows"
  | "approvals"
  | "audit-trail"
  | "retention"
  | "ai-assistant"
  | "settings"
  | "user-management";

type View = "landing" | "login" | "app";

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: string;
  company_name?: string;
  status?: string;
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<UserData | null>(null);
  const [activeModule, setActiveModule] = useState<Module>("dashboard");

  /** Attempt to restore session from stored JWT on mount */
  useEffect(() => {
    const initAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        localStorage.setItem("token", urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser({ ...res.data, id: res.data.id || res.data._id });
          setView("app");
          setActiveModule("dashboard");
        } catch {
          localStorage.removeItem("token");
          setView("login");
        }
      }
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    setView("app");
    setActiveModule("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setView("landing");
    toast.success("Signed out successfully");
  };

  /** Render the active module content */
  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":      return <AnalyticsDashboard user={user as any} />;
      case "documents":      return <DocumentManagement userRole={user?.role} />;
      case "search":         return <DocumentManagement userRole={user?.role} />;
      case "workflows":      return <ProcessAutomation />;
      case "approvals":      return <ProcessAutomation />;
      case "audit-trail":    return <DocumentManagement userRole={user?.role} />;
      case "retention":      return <DocumentManagement userRole={user?.role} />;
      case "ai-assistant":   return <AIDocumentAssistant />;
      case "settings":       return <SettingsModule user={user as any} />;
      case "user-management": return <UserManagement />;
      default:               return null;
    }
  };



  /** Permission guard – viewer/editor can access all DMS modules except user-management */
  const isAllowed = (module: Module): boolean => {
    if (!user) return false;
    if (user.role === "editor" || user.role === "viewer") {
      return module !== "user-management";
    }
    if (user.role === "admin" || user.role === "super_admin") return true;
    return false;
  };

  return (
    <>
      {view === "landing" && (
        <LandingPage onGetStarted={() => setView("login")} onLogin={() => setView("login")} />
      )}
      {view === "login" && (
        <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setView("landing")} />
      )}
      {view === "app" && user?.role === "super_admin" && (
        <SuperAdminApp user={user} onLogout={handleLogout} />
      )}
      {view === "app" && user?.role !== "super_admin" && (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
          {/* ─── Sidebar ─── */}
          <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-[#0f172a] h-screen sticky top-0 z-20">
            <div className="p-5 pb-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">

              {/* Logo */}
              <div className="flex items-center gap-3 mb-8 shrink-0 px-2 pt-1">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-900/40">
                  U
                </div>
                <div>
                  <span className="font-bold text-white tracking-tight block leading-none text-sm">Ultrion DMS</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">
                    AI Document Platform
                  </span>
                </div>
              </div>

              <nav className="space-y-0.5 flex-1">
                <NavSection label="Core">
                  {isAllowed("dashboard") && (
                    <NavItem
                      icon={<LayoutDashboard size={16} />}
                      label="Dashboard"
                      active={activeModule === "dashboard"}
                      onClick={() => setActiveModule("dashboard")}
                    />
                  )}
                  {isAllowed("documents") && (
                    <NavItem
                      icon={<Files size={16} />}
                      label="Documents"
                      active={activeModule === "documents"}
                      onClick={() => setActiveModule("documents")}
                    />
                  )}
                  {isAllowed("search") && (
                    <NavItem
                      icon={<Search size={16} />}
                      label="Search"
                      active={activeModule === "search"}
                      onClick={() => setActiveModule("search")}
                    />
                  )}
                </NavSection>

                <NavSection label="Workflow">
                  {isAllowed("workflows") && (
                    <NavItem
                      icon={<GitBranch size={16} />}
                      label="Workflows"
                      active={activeModule === "workflows"}
                      onClick={() => setActiveModule("workflows")}
                    />
                  )}
                  {isAllowed("approvals") && (
                    <NavItem
                      icon={<CheckSquare size={16} />}
                      label="Approvals"
                      active={activeModule === "approvals"}
                      onClick={() => setActiveModule("approvals")}
                    />
                  )}
                  {isAllowed("audit-trail") && (
                    <NavItem
                      icon={<ScrollText size={16} />}
                      label="Audit Trail"
                      active={activeModule === "audit-trail"}
                      onClick={() => setActiveModule("audit-trail")}
                    />
                  )}
                  {isAllowed("retention") && (
                    <NavItem
                      icon={<Archive size={16} />}
                      label="Retention"
                      active={activeModule === "retention"}
                      onClick={() => setActiveModule("retention")}
                    />
                  )}
                </NavSection>

                <NavSection label="Intelligence">
                  {isAllowed("ai-assistant") && (
                    <NavItem
                      icon={<Sparkles size={16} />}
                      label="AI Assistant"
                      active={activeModule === "ai-assistant"}
                      onClick={() => setActiveModule("ai-assistant")}
                      badge="AI"
                    />
                  )}
                </NavSection>

                <NavSection label="Admin">
                  {isAllowed("user-management") && (
                    <NavItem
                      icon={<Shield size={16} />}
                      label="Access Control"
                      active={activeModule === "user-management"}
                      onClick={() => setActiveModule("user-management")}
                    />
                  )}
                  {isAllowed("settings") && (
                    <NavItem
                      icon={<Settings size={16} />}
                      label="Settings"
                      active={activeModule === "settings"}
                      onClick={() => setActiveModule("settings")}
                    />
                  )}
                </NavSection>
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-3">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate leading-none">{user?.name}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5 font-bold">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 h-9 px-3 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest w-full border border-transparent hover:border-slate-700 group"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <main className="flex-1 flex flex-col min-h-screen relative bg-[#f8fafc]">
            {/* Top Header */}
            <header className="h-14 flex items-center justify-between px-6 sticky top-0 bg-white z-50 border-b border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 capitalize">{activeModule.replace("-", " ")}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all border border-slate-200"
                  title="Notifications"
                >
                  <Bell size={15} />
                </button>

                <div className="h-7 w-px bg-slate-200 mx-1" />

                <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg cursor-pointer group">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-wide">
                      {user?.name}
                    </span>
                    <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-tight mt-0.5">
                      {user?.role}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow group-hover:shadow-indigo-200 transition-shadow">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-50"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </header>

            {/* Page Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-[1600px] mx-auto">
                {renderModule()}
              </div>
            </div>
          </main>
          <Toaster position="top-right" richColors />
        </div>
      )}
    </>
  );
}

/* ─── Sub-components ─────────────────────────────── */

interface NavSectionProps {
  label: string;
  children: React.ReactNode;
}

/** Groups nav items under a labelled section */
function NavSection({ label, children }: NavSectionProps) {
  return (
    <div className="mb-5">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-1.5 ml-3">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
}

/** A single sidebar navigation button */
function NavItem({ icon, label, active = false, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all w-full text-left relative group ${
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      {active && (
        <div className="absolute left-0 w-0.5 h-4 bg-blue-400 rounded-r-full" />
      )}
      <span className={`shrink-0 ${active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[8px] font-black uppercase tracking-widest bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/30">
          {badge}
        </span>
      )}
      {active && <ChevronRight size={12} className="text-slate-500 shrink-0" />}
    </button>
  );
}
