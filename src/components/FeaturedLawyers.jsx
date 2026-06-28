"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, DollarSign, Briefcase, Eye } from "lucide-react";

export default function FeaturedLawyers() {
  const router = useRouter();
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ডাটাবেজের 'profile' কালেকশন থেকে সব লয়ারদের প্রোফাইল ডেটা আনা
    fetch("http://localhost:5000/api/lawyers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // প্রোফাইল কালেকশন ফিল্টার করে শুধুমাত্র টপ ৩টি প্রোফাইল নেওয়া হলো
          const lawyerProfiles = data.filter(p => p.hourlyRate || p.category);
          setFeaturedLawyers(lawyerProfiles.slice(0, 3)); // প্রথম ৩টি কার্ড দেখানোর জন্য slice করা হলো
        } else {
          setFeaturedLawyers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured lawyers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black text-amber-600 tracking-widest uppercase">
              Top Practitioners
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Meet Our Featured Lawyers
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-xl">
              Connect with globally recognized, highly trusted legal experts chosen specifically for your premium assistance.
            </p>
          </div>
          
          {/* Browse All Button */}
          <button 
            onClick={() => router.push('/browse')}
            className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors group self-start sm:self-end"
          >
            See All Lawyers 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse shadow-md">
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
        ) : featuredLawyers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl p-8 max-w-lg mx-auto border border-dashed border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">No Featured Practitioners At The Moment</h3>
          </div>
        ) : (
          /* Cards Grid (Max 3 Items Displayed) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLawyers.map((practitioner, index) => {
              const targetId = practitioner._id?.$oid || practitioner._id || index;
              
              return (
                <div 
                  key={targetId}
                  className="w-full bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-2xl hover:shadow-slate-950/10 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Status Badge */}
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
                    {/* Avatar, Name & Category */}
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

                    {/* Meta Info (Experience & Hourly Rate) */}
                    <div className="bg-slate-50/80 rounded-2xl p-3 flex items-center justify-between border border-slate-100 mt-2">
                      <div className="text-center flex-1 border-r border-slate-200/60">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience</p>
                        <p className="text-xs font-black text-slate-700">{practitioner.experience || "0 Years"}</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hourly Rate</p>
                        <p className="text-xs font-black text-amber-600 flex items-center justify-center">
                          <DollarSign size={12} className="-mr-0.5" />
                          {practitioner.hourlyRate || "0"}/hr
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
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
    </section>
  );
}