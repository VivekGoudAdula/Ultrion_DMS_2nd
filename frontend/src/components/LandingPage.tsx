
import React from "react";
import { 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  Globe,
  Play,
  ArrowUpRight,
  Shield,
  Layers,
  Search,
  MessageSquare,
  Lock,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0f172a] selection:bg-blue-100 selection:text-blue-900">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-[#0f172a] rounded-[6px] flex items-center justify-center shadow-lg shadow-slate-900/10">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-[2px] rotate-45" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase text-[#0f172a]">ULTRION</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#platform">Platform</NavLink>
              <NavLink href="#solutions">Solutions</NavLink>
              <NavLink href="#compliance">Compliance</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onLogin} 
              className="text-[13px] font-bold text-[#0f172a] hover:opacity-70 transition-all px-4"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted} 
              className="bg-[#0f172a] text-white h-[44px] px-7 rounded-full text-[13px] font-bold hover:bg-[#1e293b] transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Request Demo
            </button>
          </div>
        </div>
      </nav>


      <main className="pt-20">
        {/* ─── Hero Section ─── */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 rounded-full border border-blue-100/50 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">
                Empowering Fortune 500 Legal Ops
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-[#0f172a] max-w-5xl mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              Automate your Document <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Intelligence</span> Lifecycle.
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Ultrion DMS combines enterprise-grade storage with proprietary RAG engines to turn millions of static documents into real-time operational intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <button 
                onClick={onGetStarted} 
                className="bg-[#0f172a] text-white h-[60px] px-10 rounded-2xl text-[15px] font-bold hover:bg-[#1e293b] transition-all flex items-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 group"
              >
                Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="bg-white text-[#0f172a] h-[60px] px-10 rounded-2xl text-[15px] font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95"
              >
                <Zap className="w-4 h-4 text-blue-600 fill-blue-600" /> Watch Platform Overview
              </button>
            </div>

            {/* Main Mockup */}
            <div className="mt-20 w-full relative group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 rounded-[3rem] blur-3xl -z-10 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 transition-all"></div>
              <div className="bg-[#f8fafc] border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[16/9] relative flex items-center justify-center">
                 {/* This would be an image/mockup in a real app */}
                 <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"></div>
                 <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]"></div>
                 
                 {/* Play Overlay */}
                 <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-white/20 z-10 transition-transform hover:scale-110 active:scale-90 group/play">
                    <Zap className="w-8 h-8 text-[#0f172a] fill-[#0f172a] transition-colors group-hover/play:text-blue-600" />
                 </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Logo Cloud ─── */}
        <section className="py-12 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center mb-12">
              Institutional scale trusted by industry leaders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-30 grayscale contrast-125">
              <span className="text-xl font-black tracking-tighter">TESLA CORE</span>
              <span className="text-xl font-black tracking-tighter">SPACE X OPS</span>
              <span className="text-xl font-black tracking-tighter">PALANTIR X</span>
              <span className="text-xl font-black tracking-tighter">LINEAR ENT</span>
              <span className="text-xl font-black tracking-tighter">RAMP OPS</span>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
              <FeatureItem 
                icon={<BrainCircuit className="w-6 h-6 text-blue-600" />}
                title="Semantic Intelligence"
                desc="Not just keyword matching. Our AI understands legal terminology, financial context, and complex entities."
              />
              <FeatureItem 
                icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
                title="Operational Compliance"
                desc="Automated retention policies and audit trails that satisfy the most rigorous SEC and GDPR requirements."
              />
              <FeatureItem 
                icon={<Globe className="w-6 h-6 text-blue-600" />}
                title="Infinite Scalability"
                desc="Built on distributed cloud native architecture to handle millions of documents with sub-second latency."
              />
            </div>
          </div>
        </section>

        {/* ─── Performance & Trust Section ─── */}
        <section className="bg-[#0f172a] py-24 lg:py-32 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white translate-y-32"></div>
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white translate-y-64"></div>
             <div className="absolute top-0 left-0 w-[1px] h-full bg-white translate-x-32"></div>
             <div className="absolute top-0 left-0 w-[1px] h-full bg-white translate-x-64"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1fr_420px] gap-20 items-center">
              
              {/* Stats */}
              <div>
                <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-20 max-w-xl">
                  The new standard for Enterprise Document Ops.
                </h2>
                
                <div className="grid grid-cols-2 gap-y-16 gap-x-12">
                   <StatItem value="90%" label="FASTER RETRIEVAL" />
                   <StatItem value="1.2s" label="AVG. SEARCH LATENCY" />
                   <StatItem value="0%" label="COMPLIANCE LEAKS" />
                   <StatItem value="$12M" label="AVG. ANNUAL SAVINGS" />
                </div>
              </div>

              {/* Ready Card */}
              <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] relative">
                <div className="absolute top-8 right-8">
                   <CheckCircle2 className="w-8 h-8 text-blue-500 opacity-20" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  Ready for Global Enterprise
                </h3>

                <div className="space-y-6 mb-10">
                   <CheckListItem text="SOC2 Type II Certified" />
                   <CheckListItem text="Full API Access (Rest/GraphQL)" />
                   <CheckListItem text="Proprietary RAG Privacy Model" />
                   <CheckListItem text="Dedicated Success Engineer" />
                </div>

                <button className="w-full bg-white text-[#0f172a] h-[56px] rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                   Connect with Sales <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0f172a] rounded-[6px] flex items-center justify-center">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-[2px] rotate-45" />
              </div>
              <span className="font-black text-lg tracking-tighter uppercase text-[#0f172a]">ULTRION DMS</span>
            </div>

            <div className="flex items-center gap-10">
               <FooterLink href="#">PRIVACY</FooterLink>
               <FooterLink href="#">SECURITY</FooterLink>
               <FooterLink href="#">SLA</FooterLink>
               <FooterLink href="#">TWITTER</FooterLink>
            </div>

            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              © 2026 Ultrion AI Corporation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-[13px] font-bold text-slate-500 hover:text-[#0f172a] transition-colors"
    >
      {children}
    </a>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-6">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#0f172a]">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="space-y-3">
      <div className="text-5xl lg:text-6xl font-bold text-blue-500 tracking-tight">{value}</div>
      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</div>
    </div>
  );
}

function CheckListItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-5 h-5 rounded-full border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
         <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 group-hover:text-white transition-colors" />
      </div>
      <span className="text-slate-300 font-medium text-sm">{text}</span>
    </div>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} className="text-[11px] font-black text-slate-400 hover:text-[#0f172a] transition-colors uppercase tracking-[0.15em]">
      {children}
    </a>
  );
}
