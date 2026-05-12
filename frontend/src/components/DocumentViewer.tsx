
import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, 
  Download, 
  Search, 
  FileText, 
  Info, 
  History, 
  ChevronRight, 
  Trash2,
  RefreshCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Minimize2,
  Loader2,
  Lock as LockIcon,
  Shield,
  MessageSquare,
  Sparkles,
  Send,
  MoreVertical,
  Paperclip,
  User,
  Bot,
  Hash,
  Clock,
  ExternalLink,
  ChevronDown,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { documentTypes } from "@/lib/mockData";
import api, { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  citations?: string[];
}

interface DocumentViewerProps {
  transaction: any | null;
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  defaultType?: string;
}

export default function DocumentViewer({ transaction: txn, isOpen, onClose, userRole, defaultType }: DocumentViewerProps) {
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localDocs, setLocalDocs] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({ type: 'GENERAL', name: '' });
  const [isUploading, setIsUploading] = useState(false);
  
  // AI Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const fetchDocuments = async () => {
    if (!txn?.id) return;
    setIsLoadingDocs(true);
    try {
      const res = await api.get(`/documents?txn_id=${txn.id}`);
      setLocalDocs(res.data);
      if (res.data.length > 0 && !activeDoc) {
        setActiveDoc(res.data[0]);
      }
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (isOpen && txn) {
      fetchDocuments();
      // Initialize with welcome message if empty
      if (chatMessages.length === 0) {
        setTimeout(() => {
          setChatMessages([{
            id: "welcome",
            role: "ai",
            content: "Hello! I'm your Ultrion AI assistant. I've indexed this document and am ready to help. What would you like to know?",
            timestamp: new Date()
          }]);
        }, 500);
      }
    } else {
      setActiveDoc(null);
      setLocalDocs([]);
    }
  }, [isOpen, txn]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const filteredDocs = useMemo(() => {
    return localDocs.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, localDocs]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', () => setIsResizing(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleResize);
    };
  }, [isResizing]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const BACKEND_URL = API_BASE_URL;
  const resolveDocUrl = (url: string) =>
    url?.startsWith("http") ? url : `${BACKEND_URL}${url}`;

  const handleDownloadActive = () => {
    if (!activeDoc) return;
    toast.success(`Opening ${activeDoc.name}...`);
    window.open(resolveDocUrl(activeDoc.url), '_blank');
  };

  const handleRemoveDoc = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Permanently delete this document from server?")) return;
    
    try {
      await api.delete(`/documents/${docId}`);
      toast.success("Document deleted");
      if (activeDoc?.id === docId) setActiveDoc(null);
      fetchDocuments();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleSendMessage = (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsAiTyping(true);

    // Mock AI Response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "summarize": "Based on the analyzed document, this is a formal agreement between the parties. It outlines the scope of services, delivery milestones, and standard liability clauses. The document is 12 pages long and was signed on Oct 12, 2025.",
        "payment terms": "The payment terms specified in Section 4.2 are Net 30 days upon invoice receipt. Late payments accrue interest at 1.5% per month.",
        "extract key entities": "I've identified the following key entities:\n- **Company A**: The Service Provider\n- **Company B**: The Client\n- **Project Alpha**: The scope of work\n- **Location**: Global delivery centers in Singapore and London.",
        "action items": "The following action items are detected:\n1. Client to provide brand assets by Week 2.\n2. Provider to submit initial prototype by Nov 1.\n3. Both parties to schedule a monthly sync meeting.",
        "who are the parties involved?": "The parties involved are Ultrion Technologies Inc. (as the platform provider) and Global Logistics Corp (as the enterprise client)."
      };

      const lowerContent = content.toLowerCase();
      let aiContent = "I've analyzed that request. Based on the document context, I can confirm that the data matches your query. Is there anything specific you'd like me to highlight?";
      
      if (lowerContent.includes("summarize")) aiContent = responses["summarize"];
      else if (lowerContent.includes("payment")) aiContent = responses["payment terms"];
      else if (lowerContent.includes("entities")) aiContent = responses["extract key entities"];
      else if (lowerContent.includes("action")) aiContent = responses["action items"];
      else if (lowerContent.includes("parties")) aiContent = responses["who are the parties involved?"];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiContent,
        timestamp: new Date(),
        citations: ["Page 2, Para 3", "Annex A"]
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setRightPanelWidth(newWidth);
      }
    }
  };


  const getDocTypeColor = (type: string) => {
    const config = documentTypes.find(t => t.id === type);
    return config?.color || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const suggestedPrompts = [
    "Summarize this document",
    "What are the payment terms?",
    "Extract key entities",
    "What action items exist?",
    "Who are the parties involved?"
  ];

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "p-0 overflow-hidden border-none shadow-2xl bg-white focus:outline-none flex flex-col transition-all duration-300",
        isFullscreen 
          ? "max-w-[100vw] sm:max-w-[100vw] w-[100vw] h-[100vh] rounded-none m-0" 
          : "max-w-[98vw] sm:max-w-[98vw] w-[98vw] h-[95vh] rounded-2xl"
      )}>
        {!txn ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
        {/* Header Bar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Layout size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none">AI Document Workspace</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-blue-600 font-mono tracking-tight uppercase">{txn.txnId}</span>
                  <span className="text-[10px] text-slate-400 font-medium">• {localDocs.length} Documents Indexed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-blue-50 rounded-full px-3 py-1 border border-blue-100">
              <Sparkles size={12} className="text-blue-600 mr-1.5" />
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">AI Intelligence Active</span>
            </div>
            <div className="h-6 w-px bg-slate-100 mx-1" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all h-9 w-9"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT PANEL: Document Preview */}
          <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden h-full">
            {/* Viewer Toolbar */}
            <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 mx-4 mt-3 rounded-xl shadow-sm z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText size={16} className="text-blue-600 shrink-0" />
                <p className="text-[11px] font-bold text-slate-700 truncate max-w-[300px]">
                  {activeDoc?.name || "Select a document"}
                </p>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[10px] font-bold text-slate-600 w-10 text-center">{zoom}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleDownloadActive} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Download">
                  <Download size={16} />
                </button>
                <button onClick={toggleFullscreen} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Fullscreen">
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            {/* Document Frame */}
            <div className="flex-1 p-4 pb-6 overflow-hidden flex flex-col">
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden flex justify-center">
                {activeDoc ? (
                  <iframe
                    key={`${activeDoc.id}-${zoom}`}
                    src={`${resolveDocUrl(activeDoc.url)}#toolbar=0&navpanes=0&zoom=${zoom}`}
                    className="w-full h-full"
                    title="Document Viewer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileText size={32} />
                    </div>
                    <p className="text-sm font-medium">Select a document from the explorer to preview</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* RESIZE HANDLE */}
          <div 
            className="w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize transition-colors z-20"
            onMouseDown={() => setIsResizing(true)}
          />

          {/* RIGHT PANEL: AI Chat & Docs Explorer */}
          <aside 
            className="bg-white border-l border-slate-100 flex flex-col shrink-0 h-full overflow-hidden"
            style={{ width: rightPanelWidth }}
          >
            {/* Tabs Header */}
            <div className="flex border-b border-slate-100 px-4">
              <button className="px-4 py-3 text-xs font-bold text-blue-600 border-b-2 border-blue-600 flex items-center gap-2">
                <MessageSquare size={14} />
                AI Assistant
              </button>
              <button className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">
                <Hash size={14} />
                Document Info
              </button>
            </div>

            {/* Chat Panel Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-white relative">
              
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === "user" ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
                    )}>
                      {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={cn(
                      "max-w-[85%] space-y-2",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user" 
                          ? "bg-slate-100 text-slate-800 rounded-tr-none" 
                          : "bg-blue-50 text-slate-800 border border-blue-100 rounded-tl-none"
                      )}>
                        {msg.content.split('\n').map((line, i) => <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>)}
                      </div>
                      
                      {msg.citations && (
                        <div className="flex flex-wrap gap-2 px-1">
                          {msg.citations.map((cite, i) => (
                            <span key={i} className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <ExternalLink size={8} /> {cite}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[9px] font-medium text-slate-400 uppercase">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isAiTyping && (
                  <div className="flex gap-3 animate-in fade-in duration-300">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
                
                {chatMessages.length === 1 && !isAiTyping && (
                  <div className="pt-4 animate-in slide-in-from-bottom-2 duration-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Suggested Prompts</p>
                    <div className="flex flex-col gap-2">
                      {suggestedPrompts.map((prompt, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-xs font-medium text-slate-600 transition-all flex items-center justify-between group"
                        >
                          {prompt}
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0">
                <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                  <textarea 
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask anything about this document..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-2 px-2 resize-none max-h-32 placeholder:text-slate-400 custom-scrollbar"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isAiTyping}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shrink-0 shadow-lg shadow-blue-200"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
                  AI may provide incorrect info. Verify important details.
                </p>
              </div>
            </div>

            {/* Document Explorer Drawer (Collapsed usually) */}
            <div className="bg-slate-50 border-t border-slate-200 max-h-[30%] flex flex-col overflow-hidden">
               <div className="px-4 py-2 flex items-center justify-between border-b border-slate-200 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Explorer</span>
                  <div className="flex gap-2">
                    <button onClick={fetchDocuments} className="p-1 hover:bg-slate-200 rounded">
                      <RefreshCw size={12} className={cn("text-slate-400", isLoadingDocs && "animate-spin")} />
                    </button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {filteredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => setActiveDoc(doc)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                        activeDoc?.id === doc.id ? "bg-white shadow-sm border border-slate-200" : "hover:bg-slate-100"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0", getDocTypeColor(doc.type))}>
                        <FileText size={12} />
                      </div>
                      <span className="text-[11px] font-medium text-slate-700 truncate flex-1">{doc.name}</span>
                    </div>
                  ))}
               </div>
            </div>
          </aside>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* Upload Metadata Dialog (Unchanged structure, but renamed for generic feel) */}
    <Dialog open={!!uploadingFile} onOpenChange={(open) => !open && setUploadingFile(null)}>
      <DialogContent className="max-w-md p-0 bg-white rounded-2xl shadow-3xl border border-slate-200 top-[50%] translate-y-[-50%] ring-0 focus-visible:ring-0 overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
               <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">Upload Document</h3>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1.5">Asset Classification</p>
            </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Document Name</label>
              <Input 
                value={uploadMetadata.name} 
                onChange={(e) => setUploadMetadata({...uploadMetadata, name: e.target.value})}
                className="h-11 bg-slate-50 border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-blue-50"
              />
            </div>
            {!defaultType && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={uploadMetadata.type}
                  onChange={(e) => setUploadMetadata({...uploadMetadata, type: e.target.value})}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-50 outline-none"
                >
                  {documentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setUploadingFile(null)} className="flex-1 rounded-xl h-11 text-xs font-bold uppercase tracking-widest">Cancel</Button>
            <Button onClick={() => {}} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-widest">Upload</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
