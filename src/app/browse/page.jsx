"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Clock, DollarSign, ArrowRight, Loader2 } from "lucide-react";

export default function BrowseLawyers() {
  const router = useRouter();
  
  // স্টেটস
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // ব্যাকএন্ড থেকে প্রোফাইল ডেটা লোড করা
  useEffect(() => {
    fetch("http://localhost:5000/api/profile")
      .then((res) => res.json())
      .then((data) => {
        // ডেটাবেজে নাম বা টাইটেল না থাকলে ডেমো ডেটা ফলব্যাক হিসেবে সেট করা হয়েছে সৌন্দর্যের জন্য
        const structuredData = {
          ...data,
          name: data.name || "Adv. Raisul Islam",
          title: data.title || "Senior Advocate, Supreme Court",
          specialization: data.specialization || "Corporate Law" // ফিল্টারিং ইন্টিগ্রেশনের জন্য
        };
        setProfile(structuredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  // ফিল্টার ড্রপডাউনের জন্য স্পেশালাইজেশন লিস্ট
  const specializations = ["All", "Corporate Law", "Criminal Law", "Family Law", "Cyber Crime"];

  // সার্চ এবং ফিল্টার লজিক প্রসেসিং
  const getFilteredPractitioners = () => {
    if (!profile) return [];
    
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          profile.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedSpecialization === "All" || profile.specialization === selectedSpecialization;

    return matchesSearch && matchesFilter ? [profile] : [];
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
            Find and connect with top-rated certified advocates across various specializations. Direct hiring requires authentication.
          </p>
        </div>

        {/* MIDDLE CONTROL BAR: Search, Filter and Sort controls */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Realtime Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by practitioner name or keyword..."
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="w-full md:w-auto flex flex-wrap sm:flex-nowrap gap-3 items-center justify-end">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto">
              <SlidersHorizontal size={16} className="text-slate-500" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-4"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto">
              <ArrowUpDown size={16} className="text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-4"
              >
                <option value="default">Sort: Recommended</option>
                <option value="rate-low">Price: Low to High</option>
                <option value="rate-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOTTOM: DYNAMIC CARD DISPLAY */}
        {loading ? (
          /* SKELETON LOADING STATE */
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
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : displayedPractitioners.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-white border border-slate-150 rounded-3xl p-8 max-w-lg mx-auto space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-lg font-bold">!</div>
            <h3 className="text-base font-bold text-slate-800">No Practitioners Found</h3>
            <p className="text-xs text-slate-400 font-medium">
              We couldn't find any practitioners matching your current search or filter criteria.
            </p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedSpecialization("All"); setSortBy("default"); }}
              className="mt-2 text-xs font-extrabold text-amber-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* MAIN GRID: আপনার দেওয়া প্রিমিয়াম কার্ডটি এখানে ম্যাপ হচ্ছে */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedPractitioners.map((practitioner, index) => (
              <div 
                key={practitioner._id || index}
                className="w-full bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 group"
              >
                {/* টপ সেকশন: ইমেজ এবং নাম/টাইটেল */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={practitioner.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"}
                        alt={practitioner.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-lg border-2 border-white">
                        <ShieldCheck size={12} className="fill-current" />
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                        {practitioner.name}
                      </h3>
                      <p className="text-xs text-amber-600 font-bold tracking-wide uppercase">
                        {practitioner.title}
                      </p>
                    </div>
                  </div>

                  {/* ইনফো ব্যাজ (Experience & Hourly Rate) */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Clock size={14} className="text-slate-400" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block leading-none">EXPERIENCE</span>
                        <span className="text-xs font-black text-slate-800">{practitioner.experience || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 px-2 py-1 border-l border-slate-200">
                      <DollarSign size={14} className="text-slate-400" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block leading-none">HOURLY RATE</span>
                        <span className="text-xs font-black text-slate-800">${practitioner.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* বায়ো সেকশন */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">About Practitioner</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                      {practitioner.bio}
                    </p>
                  </div>
                </div>

                {/* অ্যাকশন বাটন সেকশন */}
                <div className="pt-5 mt-5 border-t border-slate-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Initiating hire request for ${practitioner.name}`);
                    }}
                    className="w-full py-3 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-slate-950/10 group-hover:shadow-amber-500/10"
                  >
                    Hire Now 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}