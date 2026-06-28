"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function UpdateUserProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role || "user";
  const email = session?.user?.email;

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatarUrl: "",
    phone: "",
    address: ""
  });

  const BACKEND_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (email && role === "user") {
      fetch(`${BACKEND_URL}/dashboard-profile?email=${email}&role=${role}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setFormData({
              name: data.name || session?.user?.name || "",
              avatarUrl: data.avatarUrl || session?.user?.image || "",
              phone: data.phone || "",
              address: data.address || ""
            });
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [email, role, session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, ...formData }),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        router.push("/dashboard"); // সফল হলে মূল ড্যাশবোর্ডে ফেরত যাবে
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 w-full">
      {/* ব্যাক বাটন ও হেডার */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.push("/dashboard")}
          className="p-2 bg-white border rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900">Update Profile</h2>
          <p className="text-xs text-slate-400">Manage your Full Name and Profile Picture</p>
        </div>
      </div>

      {/* প্রোফাইল আপডেট ফর্ম */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-950/5">
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium" 
              required 
            />
          </div>
          
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Profile Image URL</label>
            <input 
              type="url" 
              name="avatarUrl" 
              value={formData.avatarUrl} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium" 
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium" 
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Address / Location</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium" 
            />
          </div>

          {/* সাবমিট বাটন */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-6">
            <button 
              type="button" 
              onClick={() => router.push("/dashboard")} 
              className="px-4 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center gap-1.5 min-w-[120px] justify-center"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}