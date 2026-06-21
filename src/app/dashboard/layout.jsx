// src/app/dashboard/layout.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { 
  User, History, MessageSquare, Briefcase, 
  Settings, Users, CreditCard, BarChart3, LogOut 
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (isPending) {
    return <div className="h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const role = session.user.role || "user";

  // রোল অনুযায়ী সাইডবার লিংক ডিফাইন করা
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
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 fixed h-full z-30">
        <div>
          <div className="mb-8 px-2">
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
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs uppercase">
              {session.user.name?.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold truncate">{session.user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 pl-64">
        <main className="p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}