'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API থেকে লেটেস্ট বা র্যান্ডম ৬ জন লয়ার ফেচ করার ডামি মেকানিজম
    const mockFeatured = [
      { id: 1, name: "James Anderson", spec: "Corporate Law", rate: 80, rating: "4.9", reviews: 120, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" },
      { id: 2, name: "Sarah Mitchell", spec: "Family Law", rate: 70, rating: "4.8", reviews: 98, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" },
      { id: 3, name: "David Wilson", spec: "Criminal Law", rate: 60, rating: "4.9", reviews: 210, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" },
      { id: 4, name: "Emily Johnson", spec: "Property Law", rate: 65, rating: "4.8", reviews: 150, img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300" },
      { id: 5, name: "Michael Brown", spec: "Immigration Law", rate: 75, rating: "4.9", reviews: 110, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300" },
      { id: 6, name: "Sophia Davis", spec: "Employment Law", rate: 60, rating: "4.7", reviews: 95, img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300" }
    ];
    setLawyers(mockFeatured);
    setLoading(false);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Lawyers</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Meet our handpicked and verified legal experts</p>
          </div>
          <Link href="/browse" className="self-center sm:self-auto px-5 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
            View All
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="w-full h-40 bg-slate-50 rounded-xl overflow-hidden mb-4">
                  <img src={lawyer.img} alt={lawyer.name} className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{lawyer.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{lawyer.spec}</p>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-2">
                  <Star size={12} fill="currentColor" /> {lawyer.rating} <span className="text-slate-400 font-medium">({lawyer.reviews})</span>
                </div>
              </div>
              
              <div className="pt-3 mt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900">${lawyer.rate}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">/hr</span>
                </div>
                <Link href={`/lawyers/${lawyer.id}`} className="bg-slate-950 text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}