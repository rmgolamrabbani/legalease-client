import React from "react";
import Link from "next/link";
import { Gavel, Shield, Users, Building, Briefcase, Home as HomeIcon } from "lucide-react";

export default function TopExpertsAndCategories() {
  const topExperts = [
    { id: 1, name: "James Anderson", spec: "Corporate Law", hires: "230 hires", rating: "4.9", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" },
    { id: 2, name: "Sarah Mitchell", spec: "Family Law", hires: "180 hires", rating: "4.8", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" },
    { id: 3, name: "David Wilson", spec: "Criminal Law", hires: "160 hires", rating: "4.9", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" }
  ];

  const categories = [
    { name: "Criminal Law", icon: <Gavel size={20} />, count: "140 Lawyers" },
    { name: "Corporate Law", icon: <Building size={20} />, count: "95 Lawyers" },
    { name: "Family Law", icon: <Users size={20} />, count: "110 Lawyers" },
    { name: "Property Law", icon: <HomeIcon size={20} />, count: "85 Lawyers" },
    { name: "Employment Law", icon: <Briefcase size={20} />, count: "60 Lawyers" },
    { name: "Immigration Law", icon: <Shield size={20} />, count: "70 Lawyers" }
  ];

  return (
    <section className="py-16 bg-slate-50/60 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Grid: Top Legal Experts (4 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Legal Experts</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Based on most successful hires</p>
          </div>

          <div className="space-y-3">
            {topExperts.map((expert, idx) => (
              <div key={expert.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-amber-500 w-4">{idx + 1}</span>
                  <img src={expert.img} alt={expert.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{expert.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-400">{expert.spec}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">⭐ {expert.rating}</span>
                  <span className="text-[10px] font-medium text-slate-400">{expert.hires}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/browse?sort=popular" className="block text-center w-full py-3 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition">
            View All Experts
          </Link>
        </div>

        {/* Right Grid: Legal Categories (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Legal Categories</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Find lawyers by your legal needs</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <Link href={`/browse?category=${cat.name}`} key={idx} className="p-4 bg-white border border-slate-100 hover:border-amber-500/40 rounded-xl text-center flex flex-col items-center justify-center gap-3 group transition shadow-sm">
                <div className="p-3 bg-slate-50 text-slate-700 group-hover:bg-amber-500 group-hover:text-slate-950 rounded-xl transition">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition">{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/categories" className="block text-center w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-amber-500 hover:text-slate-950 transition shadow-md shadow-slate-950/10">
            View All Categories
          </Link>
        </div>

      </div>
    </section>
  );
}