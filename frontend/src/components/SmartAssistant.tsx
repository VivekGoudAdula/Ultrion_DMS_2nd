
import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Zap, 
  Trash2, 
  ChevronRight,
  Clock,
  Check,
  Mic,
  History,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Activity,
  Package,
  FileCheck,
  CreditCard,
  PlusCircle,
  ShoppingCart,
  Scale,
  ClipboardCheck,
  ReceiptText,
  ShieldAlert,
  Cpu,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Globe,
  MessageSquareText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type AgentType = "Procurement" | "Logistics" | "Validation" | "Finance" | "Compliance" | "Orchestrator";

interface Agent {
  id: AgentType;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const AGENTS: Agent[] = [
  { id: "Procurement", name: "Contracts Agent", icon: <FileText size={16} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100", description: "Contract Lifecycle & Clauses" },
  { id: "Logistics", name: "Logistics Agent", icon: <Globe size={16} />, color: "text-orange-600 bg-orange-50 border-orange-100", description: "Supply Chain Artifacts" },
  { id: "Validation", name: "Integrity Agent", icon: <FileCheck size={16} />, color: "text-blue-600 bg-blue-50 border-blue-100", description: "Document Verification" },
  { id: "Finance", name: "Finance Agent", icon: <ReceiptText size={16} />, color: "text-purple-600 bg-purple-50 border-purple-100", description: "Billing & Revenue Intelligence" },
  { id: "Compliance", name: "Compliance Agent", icon: <ShieldCheck size={16} />, color: "text-red-600 bg-red-50 border-red-100", description: "Governance & Data Privacy" },
];

interface ActionResponse {
  type: "list" | "status-card" | "success" | "info" | "alert" | "data-card";
  title?: string;
  items?: { label: string; value: string; status?: "completed" | "pending" | "issue" }[];
  data?: any;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  agentId?: AgentType;
  content: string;
  timestamp: string;
  actionResponse?: ActionResponse;
}

const COMMAND_SUGGESTIONS = [
  "Review legal clauses",
  "Track shipment docs",
  "Validate invoice accuracy",
  "Check compliance status",
  "Summarize last contract"
];

const MOCK_ACTIONS: Record<string, { agent: AgentType; response: Message["actionResponse"]; content: string }> = {
  "review legal clauses": {
    agent: "Procurement",
    content: "I've analyzed the liability clauses in the master service agreement. Three potential risks detected.",
    response: {
      type: "status-card",
      title: "Contract Risk Analysis",
      data: {
        id: "MSA-2026-01",
        status: "Warning",
        steps: [
          { name: "Parsing", status: "completed" },
          { name: "Risk Review", status: "completed" },
          { name: "Legal Approval", status: "pending" }
        ]
      }
    }
  },
  "track shipment docs": {
    agent: "Logistics",
    content: "Retrieved the artifact chain for Global Shipment #882. All documentation is in place.",
    response: {
      type: "data-card",
      title: "Shipment Bundle #882",
      items: [
        { label: "Bill of Lading", value: "Verified" },
        { label: "Origin Cert", value: "Available", status: "completed" },
        { label: "Customs Clearance", value: "In Transit", status: "pending" }
      ]
    }
  },
  "validate invoice accuracy": {
    agent: "Finance",
    content: "The cross-check between Invoice #INV-442 and the corresponding PO shows a 100% match.",
    response: {
      type: "success",
      title: "Finance Verification",
      data: {
        message: "Invoice amounts and line items perfectly align with Procurement records.",
        id: "INV-442-MATCH"
      }
    }
  },
  "check compliance status": {
    agent: "Compliance",
    content: "The current data retention status for the Finance department is fully compliant with SOC2.",
    response: {
      type: "list",
      title: "Governance Audit",
      items: [
        { label: "GDPR Compliance", value: "Pass", status: "completed" },
        { label: "Data Retention", value: "Active", status: "completed" },
        { label: "Audit Trail", value: "Verified", status: "completed" }
      ]
    }
  },
  "summarize last contract": {
    agent: "Procurement",
    content: "The last contract (Vendor: TechCorp) is a 2-year subscription for cloud services with a total value of $240k.",
    response: {
      type: "info",
      title: "Contract Summary",
      data: {
        message: "Key terms: $10k/mo, Net 30, Auto-renewal unless cancelled 90 days prior.",
        id: "TECHCORP-SUB"
      }
    }
  }
};

export default function SmartAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      agentId: "Orchestrator",
      content: "Ultrion Multi-Agent Mesh online. I can route your requests to specialized agents for Contracts, Logistics, Validation, Finance, or Compliance. How can I assist your operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | "Auto">("Auto");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const query = text.toLowerCase().trim();
      let routedAgent: AgentType = "Orchestrator";
      let action = null;
      let responseContent = "I'm orchestrating your request across the intelligence mesh.";

      // Routing logic
      if (query.includes("contract") || query.includes("legal")) routedAgent = "Procurement";
      else if (query.includes("shipment") || query.includes("logistics")) routedAgent = "Logistics";
      else if (query.includes("validate") || query.includes("integrity")) routedAgent = "Validation";
      else if (query.includes("finance") || query.includes("invoice")) routedAgent = "Finance";
      else if (query.includes("compliance") || query.includes("governance")) routedAgent = "Compliance";

      for (const key in MOCK_ACTIONS) {
        if (query.includes(key)) {
          const mock = MOCK_ACTIONS[key];
          routedAgent = mock.agent;
          action = mock.response;
          responseContent = mock.content;
          break;
        }
      }

      if (!action && routedAgent === "Orchestrator") {
        responseContent = "I've processed your query but couldn't route it to a specific intelligence node. Please try one of the suggested operations.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        agentId: routedAgent,
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionResponse: action || undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentInfo = (id?: AgentType) => {
    if (id === "Orchestrator") return { name: "Orchestrator", icon: <Cpu size={18} />, color: "text-slate-900 bg-slate-100 border-slate-200" };
    const agent = AGENTS.find(a => a.id === id);
    return agent || AGENTS[0];
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-100";
      case "pending": return "text-blue-600 bg-blue-50 border-blue-100";
      case "issue": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <div className="px-8 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 rounded-xl bg-[#0f172a] flex items-center justify-center shadow-lg shadow-slate-900/10">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Intelligence Mesh</h1>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">v5.0-AUTO</Badge>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Neural Router Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routing Mode:</span>
            <Select value={selectedAgent} onValueChange={(v: any) => setSelectedAgent(v)}>
              <SelectTrigger className="h-6 border-none bg-transparent shadow-none focus:ring-0 text-xs font-bold text-slate-900 p-0 w-32 uppercase tracking-tight">
                <SelectValue placeholder="Auto Orchestrate" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl">
                <SelectItem value="Auto" className="font-bold text-xs">Auto Orchestrate</SelectItem>
                {AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id} className="font-bold text-xs">{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="h-8 bg-slate-200" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMessages([messages[0]])} 
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs h-10 px-3"
          >
            <Trash2 size={16} className="mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const agent = msg.role === "assistant" ? getAgentInfo(msg.agentId) : null;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                    msg.role === "assistant" ? "bg-white border border-slate-200 text-slate-700" : "bg-[#0f172a] text-white"
                  )}>
                    {msg.role === "assistant" ? agent?.icon : <User size={18} />}
                  </div>
                  
                  <div className="space-y-2 min-w-[240px]">
                    {msg.role === "assistant" && (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                        {agent?.name}
                      </p>
                    )}
                    
                    <div className={cn(
                      "p-5 rounded-2xl text-sm font-medium leading-relaxed border shadow-xl shadow-slate-900/5",
                      msg.role === "assistant" 
                        ? "bg-white border-slate-200 text-slate-800 rounded-tl-none" 
                        : "bg-[#0f172a] border-[#0f172a] text-white rounded-tr-none"
                    )}>
                      <p>{msg.content}</p>
                      
                      {msg.actionResponse && (
                        <div className="mt-6 space-y-4">
                          {msg.actionResponse.type === "list" && (
                            <div className="space-y-2 pt-4 border-t border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{msg.actionResponse.title}</p>
                              {msg.actionResponse.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                  <span className="font-bold text-xs text-slate-700">{item.label}</span>
                                  <Badge className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border shadow-none", getStatusColor(item.status))}>
                                    {item.value}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}

                          {msg.actionResponse.type === "data-card" && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{msg.actionResponse.title}</p>
                              <div className="grid grid-cols-2 gap-3">
                                {msg.actionResponse.items?.map((item, i) => (
                                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.label}</p>
                                    <p className={cn("text-xs font-bold mt-1.5", item.status === "pending" ? "text-blue-600" : "text-slate-900")}>{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {msg.actionResponse.type === "status-card" && (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{msg.actionResponse.data.id}</span>
                                <Badge variant="outline" className="text-[9px] font-black uppercase border-blue-200 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                                  {msg.actionResponse.data.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                {msg.actionResponse.data.steps.map((step: any, i: number) => (
                                  <React.Fragment key={i}>
                                    <div className="flex flex-col items-center gap-2 flex-1">
                                      <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all",
                                        step.status === "completed" ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-300"
                                      )}>
                                        {step.status === "completed" ? <Check size={16} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                                      </div>
                                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{step.name}</span>
                                    </div>
                                    {i < msg.actionResponse.data.steps.length - 1 && (
                                      <div className="h-0.5 bg-slate-200 flex-1 mb-6 rounded-full" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {(msg.actionResponse.type === "success" || msg.actionResponse.type === "info" || msg.actionResponse.type === "alert") && (
                            <div className={cn(
                              "border rounded-2xl p-5 flex items-start gap-4 transition-all",
                              msg.actionResponse.type === "success" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
                            )}>
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg shadow-black/5",
                                msg.actionResponse.type === "success" ? "bg-emerald-600" : "bg-blue-600"
                              )}>
                                {msg.actionResponse.type === "success" ? <CheckCircle2 size={20} /> : <Info size={20} />}
                              </div>
                              <div>
                                <p className={cn("text-xs font-black uppercase tracking-[0.1em]", msg.actionResponse.type === "success" ? "text-emerald-800" : "text-blue-800")}>{msg.actionResponse.title}</p>
                                <p className="text-xs font-bold text-slate-600 mt-2 leading-relaxed">{msg.actionResponse.data.message}</p>
                                <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-white/50 rounded-lg border border-black/5">
                                   <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">ID: {msg.actionResponse.data.id}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between opacity-30">
                        <span className="text-[9px] font-black uppercase tracking-widest">{msg.timestamp}</span>
                        {msg.role === "user" && <Check size={12} />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mr-auto"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-slate-700">
                <Cpu size={18} className="animate-spin duration-[3000ms]" />
              </div>
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 pt-0 shrink-0 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {COMMAND_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl shadow-slate-900/5 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all h-[64px]">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-xl w-12 h-12 ml-1">
                  <Mic size={20} />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Task the intelligence orchestrator..."
                  className="border-none focus-visible:ring-0 text-sm font-bold bg-transparent text-slate-900 placeholder:text-slate-400 px-4 h-full outline-none"
                />
                <Button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl w-12 h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white mr-1 transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
            <div className="flex justify-center gap-10 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
              <div className="flex items-center gap-2"><Activity size={12} className="text-blue-600" /> Intelligence Mesh Active</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-blue-600" /> Decentralized Nodes Synced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
