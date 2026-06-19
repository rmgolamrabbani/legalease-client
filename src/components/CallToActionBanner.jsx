import React from "react";
import Link from "next/link";

export default function CallToActionBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full bg-[#0a1128] rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-950/10">
          
          {/* Graphic Overlay Line Effect */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Need Legal Help?</h2>
            <p className="text-sm text-slate-400 max-w-md font-medium">
              Find the right lawyer for your case today. Get an assessment from elite practitioners.
            </p>
          </div>

          <Link href="/browse" className="relative z-10 shrink-0 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20">
            Browse Lawyers Now
          </Link>
        </div>
      </div>
    </section>
  );
}