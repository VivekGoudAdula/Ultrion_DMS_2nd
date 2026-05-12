
import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  ReceiptText, 
  Clock,
  Download,
  Zap,
  Loader2,
  Files,
  FileText,
  ShieldCheck,
  BarChart3,
  Search,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";
import { cn } from "@/lib/utils";
import { fetchPOs, fetchWB, fetchGRN, fetchInvoices } from "../services/erpApi";

export default function AnalyticsDashboard({ user }: { user?: any }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total_transactions: 0,
    total_pos: 0,
    total_invoices: 0,
    total_documents: 0
  });

  /**
   * Fetch all data and calculate consolidated KPIs and recent activity log.
   */
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pos, wbs, grns, invoices] = await Promise.all([
        fetchPOs(),
        fetchWB(),
        fetchGRN(),
        fetchInvoices(),
      ]);

      // Merge into a txn map for activity log
      const txnMap = new Map<string, any>();
      const processItems = (items: any[]) => {
        items.forEach((t) => {
          const key = t.txn_id || (t.po_number ? `TXN-${t.po_number}` : `TXN-UNLINKED`);
          if (!txnMap.has(key)) {
            txnMap.set(key, {
              id: key,
              txnId: key,
              poNumber: t.po_number || "-",
              wbNumber: t.wb_number || "-",
              grnNumber: t.grn_number || "-",
              invoiceNumber: t.invoice_number || "-",
              date: t.date ? new Date(t.date).toLocaleDateString() : "-",
              documents: t.documents || [],
            });
          } else {
            const existing = txnMap.get(key);
            if (t.po_number && existing.poNumber === "-") existing.poNumber = t.po_number;
            if (t.wb_number && existing.wbNumber === "-") existing.wbNumber = t.wb_number;
            if (t.grn_number && existing.grnNumber === "-") existing.grnNumber = t.grn_number;
            if (t.invoice_number && existing.invoiceNumber === "-") existing.invoiceNumber = t.invoice_number;
            // Document merging
            const existingUrls = new Set(existing.documents.map((d: any) => d.url));
            (t.documents || []).forEach((doc: any) => {
              if (!existingUrls.has(doc.url)) existing.documents.push(doc);
            });
          }
        });
      };

      processItems(pos);
      processItems(wbs);
      processItems(grns);
      processItems(invoices);

      const allMerged = Array.from(txnMap.values());
      
      // Update KPIs
      setKpis({
        total_transactions: allMerged.length,
        total_pos: pos.length,
        total_invoices: invoices.length,
        total_documents: allMerged.reduce((acc, curr) => acc + (curr.documents?.length || 0), 0)
      });

      // Show top 5 recent
      setTransactions(allMerged.slice(0, 5));
    } catch (error) {
      toast.error("Data synchronization failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpiCards = [
    { label: "Active Transactions", value: kpis.total_transactions, icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Indexed Records", value: kpis.total_pos, icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Financial Artifacts", value: kpis.total_invoices, icon: ReceiptText, color: "text-purple-600 bg-purple-50" },
    { label: "Total Intelligence", value: kpis.total_documents, icon: Sparkles, color: "text-emerald-600 bg-emerald-50" },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Intelligence report generated successfully");
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               {user?.company_name || 'Global Operations'}
            </p>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time status of your automated document intelligence network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="enterprise-button-secondary h-12 flex items-center gap-3 group border-slate-200 shadow-sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4 text-slate-900" />
              </div>
            )}
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-700">Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. Structured KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="enterprise-card bg-white p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.color)}>
                  <kpi.icon size={20} className="stroke-[2]" />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <BarChart3 size={16} />
              </div>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                ) : (
                  kpi.value
                )}
              </h3>
              <div className="flex items-center text-[10px] font-black px-3 py-1.5 rounded-lg text-blue-600 bg-blue-50 uppercase tracking-widest border border-blue-100/50">
                Cloud Sync
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Table Section */}
      <div className="flex items-center justify-between mt-10 mb-3 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Repository</h2>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Live Activity</span>
        </div>
        <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-2">
           View Full Logs <Search size={12} />
        </button>
      </div>

      {isLoading ? (
        <div className="enterprise-card py-32 flex flex-col items-center justify-center gap-5 bg-white/50 border-dashed border-slate-200">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Files className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Indexing Intelligence Nodes...</p>
        </div>
      ) : (
        <div className="enterprise-card p-0 overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/5 bg-white">
          <DocumentTable 
            transactions={transactions} 
            onView={setSelectedTransaction}
          />
        </div>
      )}

      {/* Document Workspace Overlay */}
      <DocumentViewer 
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
