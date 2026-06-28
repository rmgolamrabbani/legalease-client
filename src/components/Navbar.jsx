"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, Menu, X, LayoutDashboard, Calendar, User, LogOut } from "lucide-react";
// BetterAuth এর সঠিক ক্লায়েন্ট মেথড অবজেক্ট ইমপোর্ট করা হয়েছে
import { useSession, authClient } from "@/lib/auth-client"; 

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // লগআউট হ্যান্ডলার (BetterAuth এর সঠিক নিয়ম অনুযায়ী ফিক্সড)
  const handleSignOut = async () => {
    try {
      await authClient.signOut(); 
      setDesktopDropdownOpen(false);
      setMobileOpen(false);
      router.push("/auth/login"); // লগআউট হওয়ার পর লগইন পেজে রিডাইরেক্ট
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDesktopDropdownOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white relative">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-50">
            <span className="text-lg font-bold text-amber-600">⚖️</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            LegalEase
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className={`text-[15px] font-bold tracking-wide transition-colors ${
              isActive("/") ? "text-amber-500" : "text-slate-800 hover:text-amber-500"
            }`}
          >
            Home
          </Link>

          <Link
            href="/browse"
            className={`text-[15px] font-bold tracking-wide transition-colors ${
              isActive("/browse") ? "text-amber-500" : "text-slate-800 hover:text-amber-500"
            }`}
          >
            Browse Lawyers
          </Link>

          <Link
            href="/dashboard"
            className={`text-[15px] font-bold tracking-wide transition-colors ${
              isActive("/dashboard") ? "text-amber-500" : "text-slate-800 hover:text-amber-500"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="relative">
            <input
              type="text"
              placeholder="Search lawyers..."
              className="h-10 w-52 rounded-lg border border-gray-200 bg-gray-50 pl-4 pr-10 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* সেশন চেকিং এর মাধ্যমে ডাইনামিক UI কন্ট্রোল */}
          {isPending ? (
            <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
          ) : session?.user ? (
            
            /* লগইন থাকা অবস্থায় ইউজারের প্রোফাইল ড্রপডাউন */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-1.5 pr-3 hover:bg-slate-50 transition-all focus:outline-none"
              >
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name} 
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs uppercase">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                  {session.user.name}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${desktopDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* প্রোফাইল ড্রপডাউন ওপেন মেনু */}
              {desktopDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{session.user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDesktopDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard size={16} className="text-slate-400" />
                    Overview
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left mt-1 border-t border-slate-50 pt-1.5"
                  >
                    <LogOut size={16} className="text-red-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          ) : (
            
            /* লগইন না থাকলে সাধারণ গেস্ট বাটনসমূহ */
            <>
              <Link
                href="/auth/login"
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-gray-50"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-800 hover:bg-slate-50 focus:outline-none lg:hidden z-50"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* FIXED MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full z-50 bg-white px-6 py-6 shadow-xl lg:hidden border-t border-slate-100 animate-in slide-in-from-top duration-200">
          
          {/* ইউজার মোবাইল মোডে লগইন থাকলে তার শর্ট ওয়েলকাম কার্ড */}
          {session?.user && (
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl mb-4">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-9 h-9 rounded-lg" />
              ) : (
                <div className="w-9 h-9 bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm rounded-lg">
                  {session.user.name?.charAt(0)}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-black text-slate-800 leading-none">{session.user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">{session.user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-base font-bold transition-all ${
                isActive("/") ? "bg-amber-50 text-amber-500" : "text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            <Link
              href="/browse"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-base font-bold transition-all ${
                isActive("/browse") ? "bg-amber-50 text-amber-500" : "text-slate-900 hover:bg-slate-50"
              }`}
            >
              Browse Lawyers
            </Link>

            {/* Mobile Dropdown */}
            <div className="w-full">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-bold text-slate-900 hover:bg-slate-50 ${
                  pathname.startsWith("/dashboard") ? "text-amber-500" : ""
                }`}
              >
                <span>Dashboard</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileDropdownOpen && (
                <div className="mt-1 ml-4 pl-2 border-l-2 border-slate-100 flex flex-col gap-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Overview
                  </Link>
                
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search lawyers..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-4 pr-10 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* মোবাইলেও ডাইনামিক বাতন অ্যাকশন */}
            {session?.user ? (
              <button
                onClick={handleSignOut}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-50 text-sm font-bold text-red-600 shadow-sm border border-red-100"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center rounded-lg border border-gray-200 text-sm font-bold text-slate-700 bg-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}