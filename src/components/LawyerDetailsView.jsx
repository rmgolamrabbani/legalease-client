import React, { useState } from "react";
import { CheckCircle, Shield, Landmark, Calendar, MapPin, Globe } from "lucide-react";

export default function LawyerDetailsView({ lawyerId }) {
  const [modalOpen, setModalOpen] = useState(false);

  // ডামি ডেটা অবজেক্ট
  const profile = {
    name: "James Anderson",
    spec: "Corporate Law",
    rate: 80,
    rating: "4.9",
    reviews: "120 reviews",
    cases: "200+ Successful Cases",
    bio: "I am a corporate lawyer with over 10 years of experience providing legal advice to businesses and entrepreneurs. I specialize in business formation, contract drafting, mergers, and compliance.",
    experience: "10+ Years",
    location: "New York, USA",
    languages: "English, Spanish",
    joined: "Jan 15, 2020",
    services: ["Business Formation", "Contract Drafting", "Mergers & Acquisitions", "Legal Consultation"]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Avatar Display */}
        <div className="lg:col-span-4 space-y-4">
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500" alt={profile.name} className="w-full h-full object-cover object-top" />
          </div>
        </div>

        {/* Right Side: Primary Info Metrics */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
              <p className="text-sm font-bold text-amber-500 mt-0.5">{profile.spec}</p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">● Available</span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
            <span>⭐ {profile.rating} ({profile.reviews})</span>
            <span>💼 {profile.cases}</span>
          </div>

          <div className="py-4 border-t border-b border-slate-100 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">${profile.rate}</span>
            <span className="text-xs font-semibold text-slate-400">/ hour consultation fee</span>
          </div>

          <button onClick={() => setModalOpen(true)} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
            Hire Lawyer Now
          </button>

          {/* Quick Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-2"><Shield size={14} className="text-slate-400" /> <strong>Experience:</strong> {profile.experience}</div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> <strong>Location:</strong> {profile.location}</div>
            <div className="flex items-center gap-2"><Globe size={14} className="text-slate-400" /> <strong>Languages:</strong> {profile.languages}</div>
            <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> <strong>Member Since:</strong> {profile.joined}</div>
          </div>
        </div>
      </div>

      {/* Tabs / Professional Context Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 pt-8 border-t border-slate-100">
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">About Me</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{profile.bio}</p>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">Services</h3>
          <div className="space-y-2">
            {profile.services.map((serv, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <CheckCircle size={14} className="text-amber-500 shrink-0" />
                {serv}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hire Booking Confirmation Modal Requirement */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-slate-900">Confirm Hiring Request</h3>
            <p className="text-xs text-slate-500 font-medium">You are sending a preliminary consult deployment request to <strong>{profile.name}</strong>. The lawyer will review your profile credentials.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition">Cancel</button>
              <button onClick={() => { alert('Request transmitted successfully.'); setModalOpen(false); }} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}