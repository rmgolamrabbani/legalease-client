"use client";

import React, { useState } from "react";
import { Check, X, Clock, User, Calendar, MessageSquare, AlertCircle } from "lucide-react";

const DUMMY_REQUESTS = [
  { id: "HR-9821", clientName: "Tanvir Ahmed", caseType: "Family Dispute", date: "2026-06-25", time: "11:00 AM", status: "pending", notes: "Need legal consultation regarding property division and child custody." },
  { id: "HR-4412", clientName: "Mst. Rokeya Begum", caseType: "Corporate Breach", date: "2026-06-28", time: "03:30 PM", status: "pending", notes: "Breach of contract by a logistics vendor. Contract copy available." },
];

export default function LawyerHiring() {
  const [requests, setRequests] = useState(DUMMY_REQUESTS);

  const handleAction = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    alert(`Request ${id} has been ${newStatus === "accepted" ? "APPROVED" : "REJECTED"} successfully.`);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6 p-6 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-950/5">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Hiring Operations</h2>
        <p className="text-xs text-slate-400 font-medium">Manage, accept, or decline pending case contracts from prospective clients.</p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl space-y-2">
          <AlertCircle size={32} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No Pending Requests</h3>
          <p className="text-xs text-slate-400">You are completely up to date with your legal operations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div key={req.id} className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-md">
                    {req.id}
                  </span>
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">
                    <User size={14} className="text-slate-400" /> {req.clientName}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {req.date}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {req.time}</span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <p className="text-xs font-bold text-slate-700">
                  Case Domain: <span className="text-amber-600">{req.caseType}</span>
                </p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed bg-white border border-slate-100 rounded-xl p-3 flex items-start gap-2">
                  <MessageSquare size={14} className="text-slate-300 mt-0.5 shrink-0" />
                  "{req.notes}"
                </p>
              </div>

              {/* Action Buttons Trigger */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleAction(req.id, "rejected")}
                  className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-xl transition-all flex items-center gap-1"
                >
                  <X size={14} /> Decline Case
                </button>
                <button
                  onClick={() => handleAction(req.id, "accepted")}
                  className="px-4 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                >
                  <Check size={14} /> Accept Contract
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}