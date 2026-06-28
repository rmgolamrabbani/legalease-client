"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Scale, ArrowLeft, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-950/5 relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-slate-900/5 rounded-full blur-2xl" />

        {/* Brand Icon or Illustration */}
        <div className="mx-auto h-24 w-24 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm relative z-10">
          <Scale size={44} className="stroke-[1.5]" />
          <div className="absolute -top-1 -right-1 bg-slate-900 text-white rounded-full p-1 border-2 border-white">
            <HelpCircle size={14} />
          </div>
        </div>

        {/* Error Messaging */}
        <div className="space-y-3 relative z-10">
          <span className="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Counsel Not Found
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            The practitioner profile or legal resource you are looking for doesn't exist or has been relocated.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Interactive Actions Layout */}
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={() => router.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          
          <button
            onClick={() => router.push("/browse")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md shadow-slate-950/10"
          >
            <Home size={14} /> Browse Lawyers
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-400 font-medium">
          If you believe this is a technical error, please contact our platform support.
        </p>
      </div>
    </div>
  );
}

