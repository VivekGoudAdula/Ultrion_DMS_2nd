
import React, { useState, useMemo, useEffect } from "react";
import { documentTypes } from "@/lib/mockData";
import { FilterBar } from "./shared/FilterBar";
import { DocumentTable } from "./shared/DocumentTable";
import DocumentViewer from "./DocumentViewer";
import { toast } from "sonner";
import { Loader2, Layout, FileStack, ShieldCheck } from "lucide-react";
import { fetchPOs, fetchWB, fetchGRN, fetchInvoices } from "../services/erpApi";

export default function DocumentManagement({ userRole }: { userRole?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllTransactions = async () => {
    setIsLoading(true);
    try {
      const [pos, wbs, grns, invoices] = await Promise.all([
        fetchPOs(),
        fetchWB(),
        fetchGRN(),
        fetchInvoices(),
      ]);

      const txnMap = new Map<string, any>();

      const upsert = (items: any[]) => {
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
              rawDate: t.date,
              documents: t.documents ? [...t.documents] : [],
            });
          } else {
            const existing = txnMap.get(key);
            if (t.po_number && existing.poNumber === "-") existing.poNumber = t.po_number;
            if (t.wb_number && existing.wbNumber === "-") existing.wbNumber = t.wb_number;
            if (t.grn_number && existing.grnNumber === "-") existing.grnNumber = t.grn_number;
            if (t.invoice_number && existing.invoiceNumber === "-") existing.invoiceNumber = t.invoice_number;
            
            const existingUrls = new Set(existing.documents.map((d: any) => d.url));
            (t.documents || []).forEach((doc: any) => {
              if (!existingUrls.has(doc.url)) {
                existing.documents.push(doc);
                existingUrls.add(doc.url);
              }
            });
          }
        });
      };

      upsert(pos);
      upsert(wbs);
      upsert(grns);
      upsert(invoices);

      setTransactions(Array.from(txnMap.values()));
    } catch (error) {
      toast.error("Failed to fetch consolidated document records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch =
          (txn.txnId && txn.txnId.toLowerCase().includes(query)) ||
          (txn.poNumber && txn.poNumber.toLowerCase().includes(query)) ||
          (txn.wbNumber && txn.wbNumber.toLowerCase().includes(query)) ||
          (txn.grnNumber && txn.grnNumber.toLowerCase().includes(query)) ||
          (txn.invoiceNumber && txn.invoiceNumber.toLowerCase().includes(query)) ||
          txn.documents.some((doc: any) => doc.name?.toLowerCase().includes(query));
      }

      const matchesType =
        selectedType === "all" ||
        txn.documents.some((d: any) => d.type === selectedType);

      let matchesDate = true;
      if (txn.rawDate) {
        const docDate = new Date(txn.rawDate).setHours(0, 0, 0, 0);
        if (startDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          if (docDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate).setHours(0, 0, 0, 0);
          if (docDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchQuery, selectedType, startDate, endDate]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 flex items-center justify-center bg-blue-50 rounded border border-blue-100">
               <FileStack className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Unified Repository</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Documents</h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Access and manage all enterprise transactions and their associated digital artifacts in one secure workspace.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">{i}</div>)}
           </div>
           <div className="pr-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Access Control</p>
              <p className="text-xs font-bold text-green-600 mt-1">Verified Node</p>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="enterprise-card border-slate-200 shadow-sm bg-white p-5">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          resetFilters={resetFilters}
          documentTypes={documentTypes}
          placeholder="Search by transaction ID, reference, or content..."
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing with Secure Ledger...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                  {filteredTransactions.length} Indexed Transactions
                </span>
              </div>
              {(selectedType !== "all" || startDate || endDate || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest px-3 py-2 bg-blue-50 rounded-xl border border-blue-100"
                >
                  Clear Results
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button className="enterprise-button-secondary px-6 h-10 text-[10px]">
                Export Repository
              </button>
              <button className="enterprise-button-primary px-6 h-10 text-[10px]">
                Upload Batch
              </button>
            </div>
          </div>

          <div className="enterprise-card p-0 overflow-hidden border border-slate-200 shadow-xl bg-white">
            <DocumentTable
              transactions={filteredTransactions}
              onView={setSelectedTransaction}
              onSuccess={fetchAllTransactions}
            />
          </div>
        </>
      )}

      {/* Document Workspace Overlay */}
      <DocumentViewer
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        userRole={userRole}
      />
    </div>
  );
}
