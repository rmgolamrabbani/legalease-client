"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
// আপনার প্রজেক্টের auth-client এর সঠিক পাথ এবং মেথড নিশ্চিত করুন
import { signIn } from "@/lib/auth-client"; 

export default function Login() {
  const router = useRouter();
  
  // স্টেট ম্যানেজমেন্ট
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(""); // ইউজার টাইপ করা শুরু করলে এরর মুছে যাবে
  };

  // ফর্ম সাবমিট হ্যান্ডলার (Email + Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // BetterAuth/NextAuth-এর মাধ্যমে ক্রেডেনশিয়াল ভ্যালিডেশন
      const response = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (response?.error) {
        setError(response.error.message || "Invalid email or password.");
        setLoading(false);
      } else {
        /**
         * রিকোয়ারমেন্ট অনুযায়ী রোল-বেসড রিডাইরেকশন:
         * BetterAuth সফলভাবে লগইন করালে সেশন থেকে রোল চেক করা যায়।
         * এখানে ডেমো হিসেবে response.data.user.role চেক করা হচ্ছে।
         */
        const userRole = response?.data?.user?.role || "user";

        if (userRole === "lawyer" || userRole === "admin") {
          router.push("/dashboard"); // লয়ার বা এডমিন হলে ড্যাশবোর্ডে রিডাইরেক্ট
        } else {
          router.push("/"); // রেগুলার ক্লায়েন্ট বা ইউজার হলে হোমপেজে রিডাইরেক্ট
        }
      }
    } catch (err) {
      setError("Something went wrong. Please check your network.");
      console.error(err);
      setLoading(false);
    }
  };

  // Google OAuth লগইন হ্যান্ডলার
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/", // গুগল লগইন শেষে রিডাইরেক্ট ইউআরএল
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-medium">
            Sign in to your LegalEase operational account
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {/* Google SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 15.03 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.21 7.42 8.87 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"/>
            <path fill="#FBBC05" d="M5.28 14.42c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.56C.5 9.34 0 11.32 0 13.4s.5 4.06 1.39 5.84l3.89-3.02z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.96 1.09-3.13 0-5.79-2.38-6.74-5.54L1.39 16.8C3.37 20.33 7.35 23 12 23z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or credentials login</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-500 block">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-amber-600 font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {/* পাসওয়ার্ড হাইড/শো বাটন */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              className="accent-amber-500 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-[11px] text-slate-400 font-medium select-none cursor-pointer">
              Keep me logged in for 7 days
            </label>
          </div>

          {/* Submit Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In to Account
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>

        {/* SignUp Redirect Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            New to LegalEase?{" "}
            <Link href="/auth/signup" className="text-amber-600 font-black hover:underline">
              Create an Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
