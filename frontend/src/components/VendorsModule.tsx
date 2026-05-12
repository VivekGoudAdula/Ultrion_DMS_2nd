
import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  User,
  Eye,
  Edit2,
  UserX,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Globe,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status: "active" | "inactive";
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: "V-9901",
    name: "Global Logistics Corp",
    contactPerson: "Sarah Jenkins",
    email: "s.jenkins@globallogistics.com",
    phone: "+1 (555) 0123-4567",
    address: "Delaware, USA",
    rating: 4.9,
    status: "active",
  },
  {
    id: "V-9902",
    name: "Tech Infrastructure Ltd",
    contactPerson: "Michael Chen",
    email: "m.chen@techinfra.io",
    phone: "+44 20 7946 0123",
    address: "London, UK",
    rating: 4.7,
    status: "active",
  },
  {
    id: "V-9903",
    name: "Enterprise Services Inc",
    contactPerson: "David Miller",
    email: "d.miller@entservices.com",
    phone: "+61 2 9876 5432",
    address: "Sydney, Australia",
    rating: 4.4,
    status: "inactive",
  },
];

export default function VendorsModule() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVendor, setNewVendor] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const vendor: Vendor = {
      id: "V-" + Math.floor(1000 + Math.random() * 9000),
      ...newVendor,
      rating: 0,
      status: "active",
    };

    setVendors([vendor, ...vendors]);
    setIsAddModalOpen(false);
    setNewVendor({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });
    toast.success("New vendor registered successfully");
  };

  const toggleStatus = (id: string) => {
    setVendors(vendors.map(v => 
      v.id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v
    ));
    toast.info("Vendor operational status updated");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            size={12} 
            className={cn(star <= Math.round(rating) ? "fill-blue-600 text-blue-600" : "text-slate-200", "transition-colors")} 
          />
        ))}
        <span className="ml-2 text-xs font-black text-slate-900 tracking-tighter">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Institutional Ecosystem</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Vendor Intelligence</h1>
          <p className="text-slate-500 font-medium max-w-xl text-sm">Orchestrate supplier relationships, compliance scoring, and institutional data flows.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-14 px-10 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95"
        >
          <Plus size={20} className="stroke-[3px]" />
          <span>Register Vendor</span>
        </button>
      </div>

      {/* Filters & Metrics Strip */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          </div>
          <Input 
            placeholder="Search ecosystem by entity, ID or contact..." 
            className="w-full h-14 pl-14 pr-6 bg-white border-slate-200 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-8 px-8 py-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Entities</span>
            <span className="text-xl font-black text-slate-900">{vendors.filter(v => v.status === "active").length}</span>
          </div>
          <Separator orientation="vertical" className="h-8 bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance Rate</span>
            <span className="text-xl font-black text-blue-600">98.2%</span>
          </div>
        </div>
      </div>

      {/* Vendors Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal Entity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authorized Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Communication</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trust Score</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredVendors.map((vendor) => (
                  <motion.tr 
                    key={vendor.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                           <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight text-base leading-tight">{vendor.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                           <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{vendor.contactPerson}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                          <Mail size={14} className="text-slate-300" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400">
                          <Phone size={14} className="text-slate-300" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {renderStars(vendor.rating)}
                    </td>
                    <td className="px-8 py-6">
                      <Badge 
                        className={cn(
                          "rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border shadow-none",
                          vendor.status === "active" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        )}
                      >
                        {vendor.status === "active" ? (
                          <CheckCircle2 size={10} className="mr-2" />
                        ) : (
                          <AlertCircle size={10} className="mr-2" />
                        )}
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all">
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStatus(vendor.id)}
                          className={cn(
                            "h-10 w-10 rounded-xl bg-white border border-slate-200 transition-all",
                            vendor.status === "active" 
                              ? "text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-600" 
                              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600"
                          )}
                        >
                          <UserX size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
            <div className="py-32 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 text-slate-200 border border-slate-100">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-lg font-bold text-slate-900">Entity not found</h3>
                 <p className="text-sm text-slate-400 font-medium">Verify the vendor ID or legal entity name.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl shadow-slate-900/40">
          <div className="bg-[#0f172a] p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black tracking-tight text-white uppercase">Register Supplier</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium mt-2">
                    Onboard a new institutional partner to the Ultrion DMS ecosystem.
                  </DialogDescription>
                </DialogHeader>
             </div>
          </div>
          
          <div className="p-10 space-y-8 bg-white">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Entity Name</Label>
                <div className="relative group">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                   <Input 
                    id="name" 
                    placeholder="e.g. Global Logistics Corp" 
                    className="h-14 pl-12 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Authorized Representative</Label>
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                   <Input 
                    id="contact" 
                    placeholder="e.g. Sarah Jenkins" 
                    className="h-14 pl-12 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={newVendor.contactPerson}
                    onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="s.jenkins@globallogistics.com" 
                    className="h-14 px-6 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 0123-4567" 
                    className="h-14 px-6 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operational Headquarters</Label>
                <div className="relative group">
                   <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                   <Input 
                    id="address" 
                    placeholder="e.g. Delaware, USA" 
                    className="h-14 pl-12 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="flex-1 h-14 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handleAddVendor} 
                className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
              >
                Register Entity
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
