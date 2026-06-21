// src/app/dashboard/page.jsx
"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { User, Edit2, Shield } from "lucide-react";

export default function DashboardProfile() {
  const { data: session } = useSession();
  const role = session?.user?.role || "user";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Account Overview</h2>
        <p className="text-xs text-slate-400 mt-1">Welcome back to your control center.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm max-w-xl flex items-center gap-6">
        {session?.user?.image ? (
          <img src={session.user.image} alt="" className="w-20 h-20 rounded-2xl object-cover" />
        ) : (
          <div className="w-20 h-20 bg-amber-100 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center font-black text-2xl">
            {session?.user?.name?.charAt(0)}
          </div>
        )}

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">{session?.user?.name}</h3>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-100 rounded text-slate-600 flex items-center gap-1">
              <Shield size={10} /> {role}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500">{session?.user?.email}</p>
          
          <div className="pt-3">
            {/* আপনার রিকোয়ারমেন্ট অনুযায়ী ডাইনামিক রুট লিংক */}
            <Link 
              href={`/dashboard/${role}/update-profile`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition-all shadow-sm"
            >
              <Edit2 size={12} /> Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}