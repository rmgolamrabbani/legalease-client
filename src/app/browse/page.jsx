"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ShieldCheck, ArrowRight, DollarSign, Briefcase, Eye } from "lucide-react";

export default function BrowseLawyers() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // ব্যাকেন্ড এপিআই থেকে সরাসরি লয়ার প্রোফাইল ডেটা ফেচ করা হচ্ছে
    fetch("http://localhost:5000/api/lawyers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLawyers(data);
        } else {
          setLawyers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lawyer profiles:", err);
        setLoading(false);
      });
  }, []);

  // ডাটাবেজের category ফরম্যাট অনুযায়ী ড্রপডাউন লিস্ট
  const categories = ["All", "Criminal", "Family", "Corporate", "Cyber Crime", "General Practice"];

  // সার্চ এবং ক্যাটাগরি অনুযায়ী ফিল্টারিং (নিরাপদ লজিক)
  const getFilteredPractitioners = () => {
    if (!lawyers || lawyers.length === 0) return [];
    
    return lawyers.filter((lawyer) => {
      const name = lawyer && lawyer.name ? lawyer.name.toLowerCase() : "";
      const category = lawyer && lawyer.category ? lawyer.category : "General Practice";

      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesFilter = selectedCategory === "All" || 
        category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  };

  const displayedPractitioners = getFilteredPractitioners();

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP: Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Verified Legal Practitioners
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Find and connect with top-rated certified advocates across various specializations.
          </p>
        </div>

        {/* MIDDLE CONTROL BAR */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by practitioner name..."
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          <div className="w-full md:w-auto flex flex-wrap sm:flex-nowrap gap-3 items-center justify-end">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto">
              <SlidersHorizontal size={16} className="text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-4 uppercase"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* BOTTOM: GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : displayedPractitioners.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-150 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
            <h3 className="text-base font-bold text-slate-800">No Practitioners Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedPractitioners.map((practitioner, index) => {
              const targetId = practitioner._id?.$oid || practitioner._id || index;
              
              return (
                <div 
                  key={targetId}
                  className="w-full bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Status Badge (Top Right Corner) */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                      practitioner.status === "Available" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {practitioner.status || "Unavailable"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Image, Name, Category */}
                    <div className="flex items-start gap-4 pt-2">
                      <div className="relative flex-shrink-0">
                        {practitioner.avatarUrl ? (
                          <img
                            src={practitioner.avatarUrl}
                            alt={practitioner.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 border-2 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center font-black text-xl uppercase">
                            {practitioner.name ? practitioner.name.charAt(0) : "L"}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-lg border-2 border-white">
                          <ShieldCheck size={12} className="fill-current" />
                        </div>
                      </div>
                      
                      <div className="space-y-1 pr-14">
                        <h3 className="text-base font-black text-slate-900 tracking-tight line-clamp-1">
                          {practitioner.name || "New Lawyer"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold tracking-wide uppercase">
                          <Briefcase size={12} />
                          <span>{practitioner.category || "General Practice"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Experience & Hourly Rate Display */}
                    <div className="bg-slate-50/80 rounded-2xl p-3 flex items-center justify-between border border-slate-100 mt-2">
                      <div className="text-center flex-1 border-r border-slate-200/60">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience</p>
                        <p className="text-xs font-black text-slate-700">{practitioner.experience || "0 Years"}</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hourly Rate</p>
                        <p className="text-xs font-black text-slate-900 flex items-center justify-center text-amber-600">
                          <DollarSign size={12} className="-mr-0.5" />
                          {practitioner.hourlyRate || "0"}/hr
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button 
                      onClick={() => router.push(`/browse/${targetId}`)}
                      className="w-full py-3 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-slate-950/10 group-hover:shadow-amber-500/10"
                    >
                      <Eye size={14} />
                      View Details
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}