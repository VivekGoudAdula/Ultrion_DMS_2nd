
import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  Copy, 
  ExternalLink, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Clock,
  Check,
  Search,
  BrainCircuit,
  MessageSquareText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  relatedDoc?: {
    name: string;
    type: string;
    ref: string;
  };
}

const SUGGESTIONS = [
  "Summarize my recent uploads",
  "Find payment terms in contracts",
  "Are there any expiring documents?",
  "Extract action items from last meeting"
];

const MOCK_RESPONSES: Record<string, { content: string; doc?: Message["relatedDoc"] }> = {
  "summarize my recent uploads": {
    content: "I've analyzed your 5 most recent documents. They primarily consist of Service Agreements and Invoices. Key themes include **quarterly renewals**, **payment scheduling**, and **liability clauses**.",
    doc: { name: "Quarterly Review.pdf", type: "Summary", ref: "REPORT-001" }
  },
  "find payment terms in contracts": {
    content: "Across the indexed Service Agreements, I found that most contracts specify **Net 30** payment terms. However, the agreement with 'Tech Partners Inc.' (DOC-992) specifies **Net 15**.",
    doc: { name: "Tech Partners Agreement.pdf", type: "Contract", ref: "DOC-992" }
  },
  "are there any expiring documents?": {
    content: "Yes, I've identified **two documents** expiring within the next 30 days:\n1. Office Lease Agreement (Exp: Nov 15)\n2. Professional Liability Insurance (Exp: Dec 1)",
    doc: { name: "Compliance Dashboard", type: "Alert", ref: "ALT-2024" }
  },
  "extract action items from last meeting": {
    content: "From the meeting minutes dated Oct 10, I've extracted these action items:\n- **Alex** to finalize the Q4 budget.\n- **Sarah** to review the legal amendments.\n- **Dev Team** to deploy the security patch.",
    doc: { name: "Meeting Minutes Oct 10.pdf", type: "Note", ref: "NOTE-882" }
  },
  "default": {
    content: "I've processed your request. Based on the indexed repository, I recommend searching for specific keywords or document types like 'Invoices' or 'Contracts' for better results.",
  }
};

export default function AIDocumentAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Ultrion AI Assistant. I can help you search, summarize, and analyze documents across your entire workspace. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
      const response = MOCK_RESPONSES[query] || MOCK_RESPONSES["default"];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedDoc: response.doc
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const clearChat = () => {
    if (confirm("Clear conversation history?")) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Conversation cleared. How else can I assist your document research?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <div className="px-8 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Ultrion AI Assistant</h1>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Enterprise v2.5</Badge>
            </div>
            <p className="text-slate-500 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Large Language Model connected to your secure workspace
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="text-slate-500 hover:text-red-600 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Session
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-white">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === "assistant" ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm",
                    msg.role === "assistant" ? "bg-blue-600 text-white" : "bg-slate-100 border border-slate-200 text-slate-700"
                  )}>
                    {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed border transition-all",
                      msg.role === "assistant" 
                        ? "bg-blue-50/50 border-blue-100 text-slate-800" 
                        : "bg-slate-900 border-slate-800 text-white"
                    )}>
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-current">$1</strong>') }} />
                      
                      {msg.role === "assistant" && (
                        <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                            <Clock size={10} />
                            {msg.timestamp}
                          </span>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-slate-400 hover:text-blue-600 rounded-lg"
                              onClick={() => copyToClipboard(msg.content)}
                            >
                              <Copy size={14} />
                            </Button>
                            {msg.relatedDoc && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-slate-400 hover:text-blue-600 rounded-lg"
                                title="View source"
                              >
                                <ExternalLink size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.relatedDoc && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Source Context</p>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{msg.relatedDoc.name}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 mr-auto"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-white mt-1 shadow-sm">
                  <Bot size={18} />
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 pt-2 bg-white border-t border-slate-100 shrink-0">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative flex items-center bg-white border border-slate-300 rounded-2xl p-1.5 shadow-sm focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <div className="pl-3 pr-2 text-slate-400">
                  <MessageSquareText size={20} />
                </div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask about contract details, financial summaries, or action items..."
                  className="border-none focus-visible:ring-0 text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 h-11 w-full"
                />
                <Button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white shrink-0 ml-1 shadow-lg shadow-blue-200"
                  size="icon"
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-black">
                Ultrion Neural Engine • Trusted Enterprise Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="hidden xl:flex w-80 border-l border-slate-200 bg-slate-50 flex-col p-6 space-y-6">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            Workspace Intelligence
          </h2>
          
          <div className="space-y-4">
             <ContextCard 
              label="Recently Analyzed" 
              title="Global Service Agreement" 
              metadata={[
                { label: "Status", value: "Verified" },
                { label: "AI Confidence", value: "98.5%" }
              ]} 
             />
             <ContextCard 
              label="Compliance Alert" 
              title="Liability Insurance" 
              metadata={[
                { label: "Expires", value: "In 12 days" },
                { label: "Action", value: "Review Renewal" }
              ]} 
              urgent
             />
          </div>

          <Separator className="bg-slate-200" />

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Common Inquiries</h3>
            <div className="space-y-3">
              {[
                "Extract all payment terms", 
                "Summarize Q4 liabilities", 
                "Identify missing signatures"
              ].map(q => (
                <div key={q} className="text-xs font-bold text-slate-600 hover:text-blue-600 cursor-pointer flex items-center gap-2 group transition-all">
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextCard({ label, title, metadata, urgent }: { label: string, title: string, metadata: { label: string, value: string }[], urgent?: boolean }) {
  return (
    <div className={cn(
      "p-4 bg-white rounded-2xl border transition-all shadow-sm group",
      urgent ? "border-red-100 hover:border-red-400" : "border-slate-200 hover:border-blue-400"
    )}>
      <div className="flex items-center justify-between mb-3">
        <Badge className={cn(
          "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border-none",
          urgent ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        )}>{label}</Badge>
      </div>
      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</p>
      <div className="space-y-2 pt-3 mt-3 border-t border-slate-50">
        {metadata.map((m, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
            <span className={cn("text-[10px] font-bold", urgent && m.label === "Expires" ? "text-red-600" : "text-slate-700")}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
