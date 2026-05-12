
import React, { useState, useRef } from "react";
import { 
  FileUp, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Loader2, 
  History,
  Info,
  Edit3,
  Check,
  X,
  Zap,
  Clock,
  UserCheck,
  Workflow,
  Sparkles,
  Layout,
  BrainCircuit,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type WorkflowStep = "upload" | "extracting" | "review" | "finalized";

interface ExtractedData {
  entityName: string;
  category: string;
  reference: string;
  valuation: string;
  compliance: string;
  terms: string;
}

export default function ProcessAutomation() {
  const [step, setStep] = useState<WorkflowStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  const [formData, setFormData] = useState<ExtractedData>({
    entityName: "",
    category: "",
    reference: "",
    valuation: "",
    compliance: "",
    terms: ""
  });
  const [status, setStatus] = useState<"none" | "approved" | "rejected">("none");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast.success("Document uploaded to intelligence buffer");
    }
  };

  const startExtraction = () => {
    setStep("extracting");
    setTimeout(() => {
      setFormData({
        entityName: "Global Solutions Inc.",
        category: "Enterprise SaaS Subscription",
        reference: "CTX-99281-B",
        valuation: "$24,250.00",
        compliance: "SOC2 Compliant",
        terms: "Net 30 Days"
      });
      setStep("review");
      toast.info("AI extraction complete. Validation required.");
    }, 2500);
  };

  const handleApprove = () => {
    setStatus("approved");
    setStep("finalized");
    toast.success("Transaction verified and committed to ledger");
  };

  const handleReject = () => {
    setStatus("rejected");
    setStep("finalized");
    toast.error("Document flagged for manual correction");
  };

  const resetWorkflow = () => {
    setStep("upload");
    setFile(null);
    setStatus("none");
    setFormData({
      entityName: "",
      category: "",
      reference: "",
      valuation: "",
      compliance: "",
      terms: ""
    });
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               Intelligent Pipeline
            </p>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workflow Automation</h1>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Extract, validate, and process enterprise documents using proprietary RAG engines with high-fidelity accuracy.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <Switch id="auto-submit" checked={isAutoSubmit} onCheckedChange={setIsAutoSubmit} className="data-[state=checked]:bg-blue-600" />
            <Label htmlFor="auto-submit" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer">Auto-Approve</Label>
          </div>
        </div>
      </div>

      {/* Workflow Progress Steps */}
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-inner">
        <div className="flex justify-between items-center max-w-4xl mx-auto relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 rounded-full"></div>
          {[
            { id: "upload", label: "Ingestion", icon: FileUp },
            { id: "extracting", label: "Extraction", icon: Cpu },
            { id: "review", label: "Validation", icon: UserCheck },
            { id: "finalized", label: "Execution", icon: Database }
          ].map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = 
              (step === "extracting" && i < 1) || 
              (step === "review" && i < 2) || 
              (step === "finalized" && i < 4);
            
            return (
              <div key={s.id} className="relative flex flex-col items-center gap-4 bg-transparent px-2 z-10">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-[#0f172a] text-white shadow-xl shadow-slate-900/20 scale-110" : 
                  isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : 
                  "bg-white border border-slate-200 text-slate-400"
                )}>
                  <s.icon size={20} />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.15em] bg-transparent",
                  isActive ? "text-[#0f172a]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                )}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/5 text-center">
              <div className="space-y-2 mb-10">
                <h2 className="text-2xl font-bold text-slate-900">Document Ingestion</h2>
                <p className="text-sm text-slate-500 font-medium">Upload any legal, financial, or operational artifact for AI analysis.</p>
              </div>

              <div className="relative group mb-10">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={handleFileUpload}
                />
                <div className={cn(
                  "border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center gap-6 transition-all duration-300",
                  file ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/30"
                )}>
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center transition-all",
                    file ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "bg-white text-slate-300 shadow-sm border border-slate-100"
                  )}>
                    {file ? <CheckCircle2 size={36} /> : <FileUp size={36} />}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      {file ? file.name : "Drag & drop or Click to browse"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium uppercase tracking-widest">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF, DOCX, Images (Max 25MB)"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                className="w-full h-14 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                disabled={!file}
                onClick={startExtraction}
              >
                <Zap size={20} className="fill-white" />
                Trigger Pipeline
              </button>
            </div>
          </motion.div>
        )}

        {step === "extracting" && (
          <motion.div 
            key="extracting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-8"
          >
            <div className="relative">
               <div className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <BrainCircuit size={32} />
               </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Neural Extraction Active</h3>
              <p className="text-sm text-slate-500 font-medium">Resolving entities and mapping document logic to schema...</p>
            </div>
          </motion.div>
        )}

        {(step === "review" || step === "finalized") && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-[1fr_440px] gap-8 mt-8"
          >
            {/* Left: Intelligence Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/5 h-[760px] flex flex-col overflow-hidden">
              <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-blue-600 shadow-sm">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Artifact Preview</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{file?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Scan Complete</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-10 bg-slate-100/30">
                <div className="bg-white shadow-2xl border border-slate-100 rounded-2xl w-full min-h-[900px] p-12 space-y-10 relative">
                   {/* Generic Document Mockup */}
                   <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="w-32 h-8 bg-slate-900 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="w-56 h-3 bg-slate-100 rounded-full"></div>
                        <div className="w-40 h-3 bg-slate-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="w-24 h-4 bg-slate-200 rounded-lg ml-auto"></div>
                      <div className="w-32 h-3 bg-slate-100 rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 w-full my-10"></div>
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-3">
                       <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                       <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
                    </div>
                    <div className="space-y-3">
                       <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                       <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-10">
                     <div className="w-40 h-3 bg-slate-200 rounded-full"></div>
                     <div className="space-y-3">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-full h-3 bg-slate-50 rounded-full"></div>)}
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Validation Panel */}
            <div className="space-y-8 flex flex-col h-full">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden flex flex-col">
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Extraction Validation</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Verify neural mappings</p>
                  </div>
                  <Badge className="bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest py-1.5 px-3">
                    <Sparkles size={10} className="fill-white" /> AI Confidence: 99%
                  </Badge>
                </div>
                <div className="p-8 space-y-6 flex-1">
                  <div className="grid grid-cols-1 gap-6">
                    <ValidatedField label="Entity Identity" value={formData.entityName} onChange={(v) => setFormData({...formData, entityName: v})} disabled={step === "finalized"} />
                    <ValidatedField label="Document Category" value={formData.category} onChange={(v) => setFormData({...formData, category: v})} disabled={step === "finalized"} />
                    <ValidatedField label="Unique Reference" value={formData.reference} onChange={(v) => setFormData({...formData, reference: v})} disabled={step === "finalized"} />
                    <div className="grid grid-cols-2 gap-4">
                       <ValidatedField label="Valuation" value={formData.valuation} onChange={(v) => setFormData({...formData, valuation: v})} disabled={step === "finalized"} />
                       <ValidatedField label="Compliance" value={formData.compliance} onChange={(v) => setFormData({...formData, compliance: v})} disabled={step === "finalized"} />
                    </div>
                    <ValidatedField label="Contractual Terms" value={formData.terms} onChange={(v) => setFormData({...formData, terms: v})} disabled={step === "finalized"} />
                  </div>

                  {step === "review" && (
                    <div className="mt-8 flex gap-4">
                      <button 
                        onClick={handleApprove}
                        className="flex-1 h-12 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button 
                        onClick={handleReject}
                        className="flex-1 h-12 bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <X size={18} /> Flag Issue
                      </button>
                    </div>
                  )}

                  {step === "finalized" && (
                    <div className={cn(
                      "mt-8 p-5 rounded-2xl border-2 animate-in zoom-in-95 duration-300",
                      status === "approved" ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-red-50 border-red-100 text-red-900"
                    )}>
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                          status === "approved" ? "bg-emerald-600 text-white shadow-emerald-500/20" : "bg-red-600 text-white shadow-red-500/20"
                        )}>
                          {status === "approved" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold tracking-tight">
                            {status === "approved" ? "Transaction Committed" : "Pipeline Halted"}
                          </h4>
                          <p className="text-xs mt-1.5 opacity-80 leading-relaxed font-medium">
                            {status === "approved" 
                              ? "The intelligence artifact was verified and the transaction was recorded in the secure ledger." 
                              : "This extraction was manually flagged for corrective intelligence training."}
                          </p>
                          <button 
                            onClick={resetWorkflow}
                            className="mt-4 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1.5"
                          >
                            New Extraction <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Log Panel */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/5 p-8 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <History size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Chain</h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                </div>
                <div className="space-y-6">
                  <AuditStep 
                    title="Document Ingested" 
                    time="10:42:01 AM" 
                    desc="Artifact captured via Secure API Buffer" 
                    icon={<FileUp size={12} />} 
                  />
                  <AuditStep 
                    title="Intelligence Match" 
                    time="10:42:04 AM" 
                    desc="High-fidelity schema mapping (Confidence 0.99)" 
                    icon={<BrainCircuit size={12} />} 
                    active
                  />
                  {status !== "none" && (
                    <AuditStep 
                      title={status === "approved" ? "Finalized" : "Flagged"} 
                      time="10:42:15 AM" 
                      desc={`Human-in-the-loop ${status} decision recorded`} 
                      icon={status === "approved" ? <Check size={12} /> : <X size={12} />} 
                      status={status}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ─── */

function ValidatedField({ label, value, onChange, disabled }: { label: string, value: string, onChange: (v: string) => void, disabled?: boolean }) {
  return (
    <div className="space-y-1.5 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-blue-600 transition-colors">{label}</Label>
      <div className="relative">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none pr-10"
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
           <CheckCircle2 size={16} className="text-emerald-500 opacity-60" />
        </div>
      </div>
    </div>
  );
}

function AuditStep({ title, time, desc, icon, active, status }: { title: string, time: string, desc: string, icon: React.ReactNode, active?: boolean, status?: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5",
        status === "approved" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
        status === "rejected" ? "bg-red-50 border-red-100 text-red-600" :
        active ? "bg-blue-50 border-blue-100 text-blue-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-300"
      )}>
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-900 tracking-tight">{title}</p>
          <span className="text-[9px] font-black text-slate-300 uppercase">{time}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
