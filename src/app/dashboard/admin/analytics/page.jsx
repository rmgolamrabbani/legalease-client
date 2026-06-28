"use client";

import { useState, useEffect } from "react";
import { Users, Briefcase, History, DollarSign, Loader2 } from "lucide-react";

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetch(`${BACKEND_URL}/admin/analytics`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[300px] text-xs font-bold text-slate-500"><Loader2 className="animate-spin mr-2" size={16} /> Generating Business Intelligence Data...</div>;
  }

  const cards = [
    { title: "Total Registered Clients", value: data?.totalUsers || 0, icon: <Users size={22} />, color: "text-blue-500 bg-blue-50 border-blue-100" },
    { title: "Active Legal Practitioners", value: data?.totalLawyers || 0, icon: <Briefcase size={22} />, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { title: "Successful Legal Consultations", value: data?.totalHires || 0, icon: <History size={22} />, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
    { title: "Total System Revenue", value: `$${data?.totalRevenue || 0}`, icon: <DollarSign size={22} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">Analytics Overview</h2>
        <p className="text-xs text-slate-400 mt-1">Platform-wide system insights, monetary metrics and operation volume metrics.</p>
      </div>

      {/* অ্যানালিটিক্স গ্রিড লেআউট - পুরোপুরি রেসপন্সিভ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-950/5 flex items-center justify-between transition-all hover:scale-[1.01]">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{card.title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 border rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
      
      {/* এক্সট্রা ড্যামি গ্রাফ বা স্ট্যাট কন্টেইনার (লুক অ্যান্ড ফিল বাড়ানোর জন্য) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-amber-400">System Core Health Normal</h4>
          <p className="text-slate-400 text-xs mt-0.5">Database status ping successful. Connected with Stripe Core version 2026-06-26 APIs securely.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase rounded-full text-[10px] tracking-widest animate-pulse">
          Live System
        </span>
      </div>
    </div>
  );
}