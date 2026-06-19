"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, User, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // আপনার রিকোয়ারমেন্ট অনুযায়ী ডামি ইউজার স্টেট (রোল চেক করার জন্য)
  // রোলস: "user" | "lawyer" | "admin"
  const user = { name: "Anisur Rahman", role: "lawyer" }; 

  // অ্যাক্টিভ রুট হাইলাইট করার জন্য হেল্পার ফাংশন
  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              LE
            </div>
            <h1 className="font-black text-xl text-slate-900 tracking-tight">
              Legal<span className="text-amber-500">Ease</span>
            </h1>
          </Link>

          {/* Global Search Bar - Responsive Breakpoint Fixed */}
          <div className="hidden lg:flex relative flex-1 max-w-md mx-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search lawyers by specialization or name..."
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                isActive("/") ? "text-amber-500" : "text-slate-600 hover:text-amber-500"
              }`}
            >
              Home
            </Link>

            <Link
              href="/browse"
              className={`text-sm font-semibold transition-colors ${
                isActive("/browse") ? "text-amber-500" : "text-slate-600 hover:text-amber-500"
              }`}
            >
              Browse Lawyers
            </Link>

            <Link
              href="/categories"
              className={`text-sm font-semibold transition-colors ${
                isActive("/categories") ? "text-amber-500" : "text-slate-600 hover:text-amber-500"
              }`}
            >
              Categories
            </Link>

            {/* Role Based Dynamic Dropdown Requirement */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                    pathname.startsWith("/dashboard") ? "text-amber-500" : "text-slate-600 hover:text-amber-500"
                  }`}
                >
                  Dashboard
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-slate-800 capitalize">{user.role}</p>
                    </div>
                    
                    <Link 
                      href={user.role === 'admin' ? '/dashboard/admin/analytics' : user.role === 'lawyer' ? '/dashboard/lawyer/hiring-history' : '/dashboard/user/hiring-history'}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-500 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Workspace Dashboard
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <button 
                      onClick={() => alert('Logged out safely.')}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50/50 transition-colors border-t border-slate-100 mt-1 text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors ${
                isActive("/about") ? "text-amber-500" : "text-slate-600 hover:text-amber-500"
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Right CTA Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold border rounded-xl border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md shadow-slate-950/10"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                {user.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-amber-500 transition-colors"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-5 bg-white space-y-4">
            
            {/* Search (Mobile View) */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search legal counselors..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              {[
                { label: "Home", path: "/" },
                { label: "Browse Lawyers", path: "/browse" },
                { label: "Categories", path: "/categories" },
                { label: "Dashboard Workspace", path: "/dashboard" },
                { label: "About Us", path: "/about" }
              ].map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive(route.path) ? "bg-amber-50 text-amber-600" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </nav>

            {/* Auth Action Area (Mobile) */}
            {!user ? (
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center border border-slate-200 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center bg-amber-500 text-slate-950 font-bold py-3 rounded-xl shadow-md shadow-amber-500/10 hover:bg-amber-600 transition"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-3">
                <span className="text-sm font-medium text-slate-500">Role: <strong className="text-slate-800 capitalize">{user.role}</strong></span>
                <button onClick={() => alert('Logged out')} className="text-sm font-bold text-rose-600">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}