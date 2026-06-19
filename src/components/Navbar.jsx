"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, Menu, X, LayoutDashboard, Calendar, User } from "lucide-react";


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
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
    // এখানে relative ক্লাসটি যোগ করা হয়েছে যাতে মোবাইল মেনু হেডারের নিচ থেকে শুরু হয়
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white relative">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
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
            href="/lawyers"
            className={`text-[15px] font-bold tracking-wide transition-colors ${
              isActive("/lawyers") ? "text-amber-500" : "text-slate-800 hover:text-amber-500"
            }`}
          >
            Browse Lawyers
          </Link>

          {/* Desktop Dashboard Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
              className={`flex items-center gap-1 text-[15px] font-bold tracking-wide transition-colors ${
                desktopDropdownOpen || pathname.startsWith("/dashboard") ? "text-amber-500" : "text-slate-800 hover:text-amber-500"
              }`}
            >
              Dashboard
              <ChevronDown size={15} className={`transition-transform duration-200 ${desktopDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {desktopDropdownOpen && (
              <div className="absolute left-0 mt-3 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl z-50">
                <Link
                  href="/dashboard"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard size={16} className="text-slate-400" />
                  Overview
                </Link>

                <Link
                  href="/dashboard/bookings"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Calendar size={16} className="text-slate-400" />
                  Bookings
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User size={16} className="text-slate-400" />
                  Profile
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="relative">
            <input
              type="text"
              placeholder="Search lawyers..."
              className="h-10 w-60 rounded-lg border border-gray-200 bg-gray-50 pl-4 pr-10 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <Link
            href="/login"
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-gray-50"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600"
          >
            Get Started
          </Link>
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
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-3 text-base font-bold transition-all ${
                isActive("/") ? "bg-amber-50 text-amber-500" : "text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            <Link
              href="/lawyers"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-3 text-base font-bold transition-all ${
                isActive("/lawyers") ? "bg-amber-50 text-amber-500" : "text-slate-900 hover:bg-slate-50"
              }`}
            >
              Browse Lawyers
            </Link>

            {/* Mobile Dropdown */}
            <div className="w-full">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-bold text-slate-900 hover:bg-slate-50 ${
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
                  <Link
                    href="/dashboard/bookings"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Bookings
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Profile
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search lawyers..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-4 pr-10 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center justify-center rounded-lg border border-gray-200 text-sm font-bold text-slate-700 bg-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}