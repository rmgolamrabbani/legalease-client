"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Briefcase, DollarSign, Star } from "lucide-react";

// ডামি লয়ার ডাটাবেজ (টেস্টিং এর জন্য)
const DUMMY_LAWYERS = [
  { id: 1, name: "Adv. Anisur Rahman", specialization: "Criminal Law", rate: 120, rating: 4.9, reviews: 28, isBusy: false, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" },
  { id: 2, name: "Barrister Sarah Karim", specialization: "Corporate Law", rate: 200, rating: 5.0, reviews: 42, isBusy: true, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { id: 3, name: "Adv. Mahbubul Alam", specialization: "Family Law", rate: 90, rating: 4.7, reviews: 19, isBusy: false, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 4, name: "Zayan Al Mansoor", specialization: "Cyber Crime", rate: 150, rating: 4.8, reviews: 31, isBusy: false, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" },
  { id: 5, name: "Adv. Farhana Khan", specialization: "Tax & Revenue", rate: 110, rating: 4.6, reviews: 15, isBusy: true, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { id: 6, name: "Barrister Asif Iqbal", specialization: "Intellectual Property", rate: 180, rating: 4.9, reviews: 24, isBusy: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
];

export default function BrowseLawyers() {
  const router = useRouter();
  
  // স্টেটস
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // ফেইক এপিআই ফেচিং এফেক্ট (Skeleton Loading টেস্ট করার জন্য)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLawyers(DUMMY_LAWYERS);
      setLoading(false);
    }, 1200); // ১.২ সেকেন্ড লোডিং স্টেট দেখাবে
    return () => clearTimeout(timer);
  }, []);

  // ইউনিক স্পেশালাইজেশন লিস্ট বের করা (ফিল্টারের জন্য)
  const specializations = ["All", ...new Set(DUMMY_LAWYERS.map(l => l.specialization))];

  // সার্চ, ফিল্টার এবং সর্টিং লজিক একীভূতকরণ
  const filteredAndSortedLawyers = lawyers
    .filter((lawyer) => {
      const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedSpecialization === "All" || lawyer.specialization === selectedSpecialization;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "rate-low") return a.rate - b.rate;
      if (sortBy === "rate-high") return b.rate - a.rate;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default order
    });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP: Top Header Intro */}
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

          {/* Filters & Sorting Inputs */}
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
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* BOTTOM: LAWYERS GRID DISPLAY */}
        {loading ? (
          /* SKELETON LOADING STATE (Exactly mirrors final responsive layout grid) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                  <div className="w-14 h-5 bg-slate-200 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedLawyers.length === 0 ? (
          /* EMPTY MATCH / ERROR STATE FRIENDLY MESSAGE */
          <div className="text-center py-20 bg-white border border-slate-150 rounded-3xl p-8 max-w-lg mx-auto space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-lg font-bold">!</div>
            <h3 className="text-base font-bold text-slate-800">No Counselors Found</h3>
            <p className="text-xs text-slate-400 font-medium">
              We couldn't find any lawyers matching your current filter criteria. Try updating your keywords or resetting filters.
            </p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedSpecialization("All"); setSortBy("default"); }}
              className="mt-2 text-xs font-extrabold text-amber-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* MAIN GRID: Responsive Grid (2 Mobile, 3 Tablet, 4 Desktop) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                onClick={() => router.push(`/browse/${lawyer.id}`)}
                className="bg-white border border-slate-200/70 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Upper Segment: Image and Availability Badge */}
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <img
                      src={lawyer.avatar}
                      alt={lawyer.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-100 bg-slate-50"
                    />
                    
                    {/* Conditional Booking Badge */}
                    {lawyer.isBusy ? (
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Busy
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Card Details Segment */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {lawyer.name}
                      </h3>
                      <ShieldCheck size={16} className="text-amber-500 shrink-0" />
                    </div>
                    
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <Briefcase size={12} className="text-slate-300" />
                      {lawyer.specialization}
                    </p>
                  </div>
                </div>

                {/* Card Footer Section (Hourly Rates & Ratings Context) */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-slate-800 ml-0.5">{lawyer.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({lawyer.reviews})</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-slate-900 font-black text-sm">${lawyer.rate}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/hr</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}