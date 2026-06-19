import React from "react";
import { Users, Scale, CreditCard, DollarSign } from "lucide-react";

export default function AdminAnalytics() {
  const stats = [
    { label: "Total Users", count: "1,250", icon: <Users size={18} />, bg: "bg-blue-500/10 text-blue-600" },
    { label: "Total Lawyers", count: "320", icon: <Scale size={18} />, bg: "bg-amber-500/10 text-amber-500" },
    { label: "Total Hires", count: "2,340", icon: <CreditCard size={18} />, bg: "bg-emerald-500/10 text-emerald-600" },
    { label: "Total Revenue", count: "$145,000", icon: <DollarSign size={18} />, bg: "bg-rose-500/10 text-rose-600" }
  ];

  const transactions = [
    { id: "TXN102", name: "John Smith", date: "May 22, 2026", amount: "$800", status: "Paid" },
    { id: "TXN103", name: "Michael Brown", date: "May 21, 2026", amount: "$650", status: "Paid" },
    { id: "TXN104", name: "Emily Davis", date: "May 21, 2026", amount: "$600", status: "Paid" }
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-slate-50 min-h-screen">
      
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.count}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout Split Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Placeholder for Analytic Graph Charts Required by Guideline (8 columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Revenue Analytics Overview</h4>
            <p className="text-[11px] text-slate-400 font-medium">Monthly performance indicator matrix</p>
          </div>
          {/* Chart placeholder layout structure */}
          <div className="h-44 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-xs text-slate-400 font-medium">[ Interactive Chart Data Deployment ]</span>
          </div>
        </div>

        {/* Recent Transactions List Ledger (5 columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Recent Transactions</h4>
            <p className="text-[11px] text-slate-400 font-medium">Global payment tracking updates</p>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((txn, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{txn.name}</h5>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">{txn.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">{txn.amount}</span>
                  <span className="inline-block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-0.5">{txn.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}