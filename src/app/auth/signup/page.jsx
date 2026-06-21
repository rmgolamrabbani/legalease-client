"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Scale, Mail, Lock, ArrowRight, Eye, EyeOff, Check, X } from "lucide-react";
// আপনার প্রজেক্টের auth-client এর সঠিক পাথ এবং মেথড নিশ্চিত করুন
import { signUp, signIn } from "@/lib/auth-client"; 

export default function SignUp() {
  const router = useRouter();
  
  // ফর্ম স্টেট ম্যানেজমেন্ট
  const [role, setRole] = useState("user"); 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // পাসওয়ার্ড শো/হাইড স্টেট
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(""); // ইউজার টাইপ করা শুরু করলে এরর মেসেজ মুছে যাবে
  };

  // প্রো-লেভেল পাসওয়ার্ড স্ট্রেন্থ চেকার (লাইভ ভ্যালিডেশন)
  const passwordRequirements = useMemo(() => {
    const p = formData.password;
    return [
      { id: "length", label: "Min 8 characters", valid: p.length >= 8 },
      { id: "number", label: "At least one number", valid: /\d/.test(p) },
      { id: "uppercase", label: "One uppercase letter", valid: /[A-Z]/.test(p) },
      { id: "special", label: "One special character", valid: /[^A-Za-z0-9]/.test(p) },
    ];
  }, [formData.password]);

  // সব রিকোয়ারমেন্ট ম্যাচ করেছে কিনা
  const isPasswordValid = passwordRequirements.every(req => req.valid);
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  // ফর্ম সাবমিট হ্যান্ডলার (Email + Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // প্রো-লেভেল সিকিউরিটি চেইন ভ্যালিডেশন
    if (!isPasswordValid) {
      setError("Please fulfill all password strength criteria.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    
    try {
      // BetterAuth এ সাইনআপ রিকোয়েস্ট
      const response = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        role: role, // BetterAuth মেটাডাটা রোল ম্যাপ
      });

      if (response?.error) {
        setError(response.error.message || "Registration failed. Email might already exist.");
      } else {
        // সফল হলে হোম পেজে রিডাইরেক্ট
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth হ্যান্ডলার
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/", // লগইন সফল হলে হোম পেজে যাবে
      });
    } catch (err) {
      setError("Google authentication failed.");
      console.error(err);
      setLoading(false);
    }
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

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* STEP 1: Role Choice (User / Lawyer Segment) */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
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

        {/* Google Login OAuth Flow Integration */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 15.03 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.21 7.42 8.87 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"/>
            <path fill="#FBBC05" d="M5.28 14.42c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.56C.5 9.34 0 11.32 0 13.4s.5 4.06 1.39 5.84l3.89-3.02z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.96 1.09-3.13 0-5.79-2.38-6.74-5.54L1.39 16.8C3.37 20.33 7.35 23 12 23z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or email register</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Interactive Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
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

          {/* Password input with Show/Hide and Strength Checker */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-11 pr-10 py-2.5 border bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                  formData.password && !isPasswordValid ? "border-amber-400" : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* পাসওয়ার্ড রিকোয়ারমেন্টস ইন্ডিকেটর (লাইভ প্যানেল) */}
            {formData.password && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mt-2 grid grid-cols-2 gap-2 transition-all">
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-1.5 text-[10px] font-medium">
                    {req.valid ? (
                      <Check size={12} className="text-emerald-500 stroke-[3]" />
                    ) : (
                      <X size={12} className="text-slate-300 stroke-[3]" />
                    )}
                    <span className={req.valid ? "text-emerald-600" : "text-slate-400"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password input with Show/Hide */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-11 pr-10 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                  formData.confirmPassword && !doPasswordsMatch
                    ? "border-red-300 bg-red-50/30 text-red-900" 
                    : formData.confirmPassword && doPasswordsMatch
                    ? "border-emerald-300 bg-emerald-50/10"
                    : "border-slate-200 bg-slate-50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.confirmPassword && !doPasswordsMatch && (
              <p className="text-[10px] text-red-500 font-semibold mt-0.5 pl-1">Passwords do not match yet</p>
            )}
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