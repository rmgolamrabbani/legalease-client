"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { 
  User, History, MessageSquare, Briefcase, 
  Settings, Users, CreditCard, BarChart3, Menu, X 
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isPending) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-medium">Loading dashboard...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const role = session.user.role || "user";

  const sidebarLinks = {
    user: [
      { name: "Profile Overview", href: "/dashboard", icon: <User size={18} /> },
      { name: "Hiring History", href: "/dashboard/user/hiring-history", icon: <History size={18} /> },
      { name: "My Comments", href: "/dashboard/user/comments", icon: <MessageSquare size={18} /> },
    ],
    lawyer: [
      { name: "Profile Overview", href: "/dashboard", icon: <User size={18} /> },
      { name: "Hiring Requests", href: "/dashboard/lawyer/hiring-history", icon: <Briefcase size={18} /> },
      { name: "Manage Services", href: "/dashboard/lawyer/manage-legal-profile", icon: <Settings size={18} /> },
    ],
    admin: [
      { name: "Profile Overview", href: "/dashboard", icon: <User size={18} /> },
      { name: "Manage Users", href: "/dashboard/admin/manage-users", icon: <Users size={18} /> },
      { name: "All Transactions", href: "/dashboard/admin/all-transactions", icon: <CreditCard size={18} /> },
      { name: "Analytics", href: "/dashboard/admin/analytics", icon: <BarChart3 size={18} /> },
    ],
  };

  const currentLinks = sidebarLinks[role] || sidebarLinks["user"];

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      {/* MOBILE TOP BAR (শুধুমাত্র মোবাইল ও ট্যাবলেটের জন্য) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 shadow-md">
        <h1 className="text-lg font-black text-amber-500 tracking-wide">LegalEase</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white transition-all focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR (Desktop-এ সবসময় দৃশ্যমান, Mobile/Tablet-এ টগল হবে) */}
      <aside className={`
        w-64 bg-slate-900 text-white flex flex-col justify-between p-4 fixed h-full z-30 transition-transform duration-300 ease-in-out
        lg:translate-x-0 top-0 bottom-0 left-0
        ${isMobileMenuOpen ? "translate-x-0 pt-20 lg:pt-4" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          {/* Brand Logo - ডেস্কটপে দেখাবে */}
          <div className="hidden lg:block mb-8 px-2">
            <h1 className="text-xl font-black text-amber-500 tracking-wide">LegalEase</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Portal: {role}</p>
          </div>
          
          <nav className="space-y-1">
            {currentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)} // মোবাইল মেনু আইটেমে ক্লিক করলে সাইডবার বন্ধ হবে
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive 
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at Bottom */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {session.user.name?.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold truncate">{session.user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE MENU (মোবাইলে ব্যাকগ্রাউন্ড ব্লার করার জন্য) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA (মোবাইলের জন্য টপ প্যাডিং এবং ডেস্কটপের জন্য লেফট প্যাডিং অ্যাডজাস্টেড) */}
      <div className="flex-1 pl-0 lg:pl-64 pt-16 lg:pt-0 w-full overflow-x-hidden">
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}