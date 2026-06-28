"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Shield, Briefcase, DollarSign, Mail, FileText } from "lucide-react";

export default function DashboardProfile() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  
  const userObj = session?.user;
  const role = userObj?.role || "user";
  const email = userObj?.email;

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    experience: "",
    hourlyRate: "",
    avatarUrl: "",
  });

  const BACKEND_URL = "http://localhost:5000/api";

  useEffect(() => {
    // ১. ইনিশিয়াল স্টেট: লগইন করার সাথে সাথে সেশনের অরিজিনাল ডাটা আগে সেট হবে
    if (userObj) {
      setProfileData({
        name: userObj.name || "Legal User",
        bio: "",
        experience: "",
        hourlyRate: "",
        avatarUrl: userObj.image || userObj.avatarUrl || "",
      });
    }

    // ২. ইউজার যদি 'admin' হয়, তবে ডাটাবেজ থেকে প্রোফাইল ওভাররাইড করবে না
    if (role === "admin") {
      return; 
    }

    // ৩. ডাটাবেজ চেক: শুধুমাত্র লয়ার বা জেনারেল ইউজারদের কাস্টম প্রোফাইল ডাটাবেজ থেকে চেক করবে
    if (email) {
      fetch(`${BACKEND_URL}/profile?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          // যদি ডাটাবেজে আপডেটেড প্রোফাইল পাওয়া যায়
          if (data && !data.message) {
            setProfileData({
              name: data.name || userObj?.name || "Legal User", 
              bio: data.bio || "",
              experience: data.experience || "",
              hourlyRate: data.hourlyRate || "",
              avatarUrl: data.avatarUrl || data.image || data.imgUrl || userObj?.image || "", 
            });
          }
        })
        .catch((err) => console.warn("No custom updates found in DB, using original session data."));
    }
  }, [email, userObj, role]); // এখানে role ডিপেন্ডেন্সি যুক্ত করা হয়েছে যেন কন্ডিশনটি ঠিকঠাক কাজ করে

  // সেশন লোড হওয়ার সময় স্মুথ লোডিং স্টেট
  if (sessionPending) {
    return (
      <div className="max-w-4xl mx-auto w-full p-8 text-center text-sm font-bold text-slate-400 animate-pulse">
        Loading control center...
      </div>
    );
  }

  // ফাইনাল ভ্যালু নির্ধারণ
  const finalName = profileData.name || userObj?.name || "Legal User";
  const finalPhotoSrc = profileData.avatarUrl || userObj?.image || null;
  const avatarLetter = finalName.charAt(0).toUpperCase();

  const getAvatarBgColor = (name) => {
    const colors = [
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-emerald-100 text-emerald-700 border-emerald-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-rose-100 text-rose-700 border-rose-200"
    ];
    const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full px-4 sm:px-0 py-4">
      {/* হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">Account Overview</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Welcome back to your personalized control center.</p>
        </div>
        
        {role === "user" && (
          <button 
            onClick={() => router.push("/dashboard/user/update-profile")}
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md shadow-slate-950/10 active:scale-95 justify-center"
          >
            <Edit2 size={14} /> Update Profile
          </button>
        )}
      </div>

      {/* প্রোফাইল কার্ড */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-950/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-950/10">
        
        {/* ব্যানার */}
        <div className="h-24 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600/20" />

        <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-10">
          
          {/* অ্যাভাটার/ছবি সেকশন */}
          {finalPhotoSrc && finalPhotoSrc.trim() !== "" ? (
            <div className="relative group ring-4 ring-white rounded-2xl shadow-md overflow-hidden bg-white shrink-0 w-24 h-24 sm:w-28 sm:h-28">
              <img 
                src={finalPhotoSrc} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackBox = document.getElementById('avatar-fallback');
                  if (fallbackBox) fallbackBox.style.display = 'flex';
                }}
              />
              <div 
                id="avatar-fallback" 
                className={`hidden absolute inset-0 font-black text-3xl items-center justify-center ${getAvatarBgColor(finalName)}`}
              >
                {avatarLetter}
              </div>
            </div>
          ) : (
            <div className={`w-24 h-24 sm:w-28 sm:h-28 border-4 ring-4 ring-white rounded-2xl flex items-center justify-center font-black text-3xl shrink-0 shadow-md ${getAvatarBgColor(finalName)}`}>
              {avatarLetter}
            </div>
          )}

          {/* ডিটেইলস সেকশন */}
          <div className="flex-1 space-y-4 text-center sm:text-left w-full pt-10 sm:pt-12">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  {finalName}
                </h3>
                <span className="mx-auto sm:mx-0 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-slate-950 text-amber-400 rounded-lg flex items-center gap-1.5 w-fit border border-slate-800 shadow-sm">
                  <Shield size={12} className="text-amber-400" /> {role}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start mt-1.5 font-mono">
                <Mail size={14} className="text-slate-300" /> {email}
              </p>
            </div>

            {/* লয়ার কাস্টম ইনফো */}
            {role === "lawyer" && (
              <div className="space-y-4 pt-2">
                {(profileData.experience || profileData.hourlyRate) && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-black">
                    {profileData.experience && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl shadow-sm">
                        <Briefcase size={14} className="text-slate-400" /> Exp: {profileData.experience}
                      </span>
                    )}
                    {profileData.hourlyRate && (
                      <span className="inline-flex items-center gap-1 px-3.5 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl shadow-sm">
                        <DollarSign size={14} className="text-emerald-500" /> Rate: {profileData.hourlyRate ? `$${profileData.hourlyRate}/hr` : "0"}
                      </span>
                    )}
                  </div>
                )}

                {profileData.bio && (
                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-left shadow-inner">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                      <FileText size={12} /> Professional Bio Statement
                    </h4>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                      {profileData.bio}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}