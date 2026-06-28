import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Button Skeleton */}
        <div className="h-9 w-32 bg-white border border-slate-200 rounded-xl shadow-sm" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDE: Main Profile & Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Details Card Skeleton */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-950/5 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                {/* Avatar Skeleton */}
                <div className="w-24 h-24 rounded-3xl bg-slate-200 border-4 border-slate-50 shadow-md flex items-center justify-center">
                  <Loader2 className="animate-spin text-amber-500/50" size={24} />
                </div>

                {/* Name & Specialty Skeleton */}
                <div className="space-y-3 flex-1 w-full flex flex-col items-center sm:items-start">
                  <div className="h-7 w-48 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-32 bg-amber-100/60 rounded-md" />
                  <div className="h-5 w-36 bg-slate-100 rounded-full mt-1" />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Bio Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-28 bg-slate-200 rounded-md" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-full bg-slate-100 rounded-md" />
                  <div className="h-3.5 w-5/6 bg-slate-100 rounded-md" />
                  <div className="h-3.5 w-4/6 bg-slate-100 rounded-md" />
                </div>
              </div>
            </div>

            {/* Fixed-Rate Services Skeleton */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-4">
              <div className="h-5 w-52 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-72 bg-slate-100 rounded-md" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded-md" />
                      <div className="h-3 w-full bg-slate-100 rounded-md" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/60">
                      <div className="h-4 w-12 bg-slate-200 rounded-md" />
                      <div className="h-5 w-20 bg-slate-200 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Section Skeleton */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-4">
              <div className="h-5 w-48 bg-slate-200 rounded-md" />
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <div className="h-3 w-full bg-slate-200/60 rounded-md" />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Sidebar Widget Skeleton */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-4 sticky top-6">
              <div className="h-11 w-full bg-slate-200 rounded-xl" />
              <div className="h-11 w-full bg-slate-100 rounded-xl" />
              <div className="space-y-1 pt-2">
                <div className="h-2.5 w-full bg-slate-100 rounded-md" />
                <div className="h-2.5 w-5/6 bg-slate-100 mx-auto rounded-md" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

