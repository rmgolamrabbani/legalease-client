"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Scale, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function SignUp() {
  // ফর্ম স্টেট ম্যানেজমেন্ট
  const [role, setRole] = useState("user"); // ডিফল্ট রোল: "user" অথবা "lawyer"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    
    // ডামি এপিআই রিকোয়েস্ট পেলোড সাবমিশন স্ট্রাকচার
    setTimeout(() => {
      console.log("Submitting Registration Data:", { role, ...formData });
      alert(`Registration successful as a ${role.toUpperCase()}!`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-950/5 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl items-center justify-center font-black mb-2">
            LE
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400 font-medium">
            Join LegalEase to access premium absolute legal operations
          </p>
        </div>

        {/* Interactive Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* STEP 1: Role Choice (User / Lawyer Segment) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Select Your Profile Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Regular Client Role Card */}
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`p-4 border rounded-xl text-left flex flex-col justify-between h-28 transition-all ${
                  role === "user"
                    ? "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-lg inline-block ${role === "user" ? "bg-amber-500 text-slate-950" : "bg-slate-50 text-slate-500"}`}>
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">General Client</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">I want to hire legal counsel</p>
                </div>
              </button>

              {/* Certified Lawyer Role Card */}
              <button
                type="button"
                onClick={() => setRole("lawyer")}
                className={`p-4 border rounded-xl text-left flex flex-col justify-between h-28 transition-all ${
                  role === "lawyer"
                    ? "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-lg inline-block ${role === "lawyer" ? "bg-amber-500 text-slate-950" : "bg-slate-50 text-slate-500"}`}>
                  <Scale size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Legal Practitioner</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">I am a certified advocate</p>
                </div>
              </button>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* STEP 2: Main Credential Inputs */}
          <div className="space-y-4">
            
            {/* Full Name input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Anisur Rahman"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@domain.com"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Legal Document Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              name="agreeTerms"
              id="agreeTerms"
              required
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="mt-0.5 accent-amber-500 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-[11px] text-slate-400 font-medium select-none cursor-pointer">
              I agree to the LegalEase <Link href="/terms" className="text-amber-600 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-amber-600 font-bold hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          {/* Dynamic Submit Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Register as {role === "lawyer" ? "Lawyer" : "Client"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>

        {/* Existing User Redirect Link Context */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            Already have an operational account?{" "}
            <Link href="/login" className="text-amber-600 font-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}