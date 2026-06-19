import React from 'react';
import Link from 'next/link'; // যদি Next.js ব্যবহার করেন (নরমাল React হলে 'react-router-dom' থেকে Link নিন)
import { Users, ShieldCheck, Scale, DollarSign } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#0a1128] text-white min-h-[680px] flex items-center overflow-hidden">
      
      {/* Background Statue Blend Layer - Image on the Right */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="relative w-full lg:w-[55%] h-full">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200" 
            alt="Lady Justice Graphic Background"
            className="w-full h-full object-cover object-center opacity-25 lg:opacity-40 mix-blend-luminosity select-none pointer-events-none"
          />
          {/* Smooth radial blending to avoid sharp edges */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-[#0a1128]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Content Area */}
          <div className="lg:col-span-7 space-y-6 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white">
              Find & Hire <br />
              <span className="text-amber-500">Expert Legal Counsel</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 font-medium max-w-lg leading-relaxed">
              Connect with verified lawyers for your personal or business legal needs. Get top-tier presentation seamlessly.
            </p>

            {/* Action Buttons Group matching the reference photo */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href="/browse" 
                className="px-8 py-3.5 bg-amber-500 text-slate-950 text-sm font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                Browse Lawyers
              </Link>
              <Link 
                href="/register?role=lawyer" 
                className="px-8 py-3.5 border border-slate-700 bg-slate-900/50 text-white text-sm font-bold rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all backdrop-blur-sm active:scale-[0.98]"
              >
                Become a Lawyer
              </Link>
            </div>

            {/* Bottom Counter/Trust Metrics Section exactly from image layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 mt-8 border-t border-slate-800/80">
              
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white tracking-tight">10,000+</h4>
                  <p className="text-xs text-slate-400 font-medium">Clients</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white tracking-tight">500+</h4>
                  <p className="text-xs text-slate-400 font-medium">Verified Lawyers</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <Scale size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white tracking-tight">25+</h4>
                  <p className="text-xs text-slate-400 font-medium">Legal Categories</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white tracking-tight">$100K+</h4>
                  <p className="text-xs text-slate-400 font-medium">Transactions</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column Layout Balance Space */}
          <div className="hidden lg:block lg:col-span-5"></div>

        </div>
      </div>
    </section>
  );
}