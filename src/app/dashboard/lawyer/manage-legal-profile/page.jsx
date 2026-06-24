"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus, Trash2, DollarSign, Sparkles, Loader2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function ManageProfile() {
  // প্রোফাইল ডাটা স্টেট
  const [profile, setProfile] = useState({
    bio: "",
    experience: "",
    hourlyRate: "",
    avatarUrl: "",
  });

  // সার্ভিসের স্টেট
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: "", cost: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ব্যাকএন্ড URL (আপনার পোর্ট অনুযায়ী পরিবর্তন করতে পারেন)
  const BACKEND_URL = "http://localhost:5000/api";

  // ডেটাবেজ থেকে ডেটা লোড করার ফাংশন
  const loadData = async () => {
    try {
      setLoading(true);
      // প্রোফাইল ডাটা ফেচ
      const profileRes = await fetch(`${BACKEND_URL}/profile`);
      const profileData = await profileRes.json();
      setProfile(profileData);

      // সার্ভিস ডাটা ফেচ
      const servicesRes = await fetch(`${BACKEND_URL}/services`);
      const servicesData = await servicesRes.json();
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data from database.");
    } finally {
      setLoading(false);
    }
  };

  // কম্পোনেন্ট মাউন্ট হলে ডাটা লোড হবে
  useEffect(() => {
    loadData();
  }, []);

  // imgBB Image Upload Integration Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setProfile((prev) => ({ ...prev, avatarUrl: result.data.url }));
        toast.success("Image uploaded to imgBB successfully!");
      } else {
        toast.error("Image upload failed. Check API key.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Network error during image upload.");
    } finally {
      setUploading(false);
    }
  };

  // Profile Save/Update Handler
  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        loadData(); // রিলোড বা রি-ফেচ করার জন্য 
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // CRUD: Add New Service Action
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.title || !newService.cost) return;

    try {
      const response = await fetch(`${BACKEND_URL}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newService.title,
          cost: parseFloat(newService.cost)
        }),
      });

      if (response.ok) {
        toast.success("New service deployed!");
        setNewService({ title: "", cost: "" });
        loadData(); // নতুন সার্ভিসসহ লিস্ট আপডেট করার জন্য রি-ফেচ
      } else {
        toast.error("Failed to add service.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server.");
    }
  };

  // CRUD: Delete Service Action
  const handleDeleteService = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Service removed successfully.");
        loadData(); // লিস্ট থেকে বাদ দিয়ে ডাটা রিলোড করার জন্য
      } else {
        toast.error("Failed to delete service.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting service.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1 sm:p-4">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* COLUMN 1 & 2: Profile Update */}
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Manage Practitioner Profile</h2>
          <p className="text-xs text-slate-400 font-medium">Update your bio parameters, expertise benchmarks, and premium avatar.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative group">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150"}
              alt="Lawyer Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
            />
            {uploading && (
              <div className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center text-white">
                <Loader2 size={18} className="animate-spin" />
              </div>
            )}
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all">
              <Upload size={13} /> Change Avatar via imgBB
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <p className="text-[10px] text-slate-400 font-medium block">Supports JPG, PNG formats up to 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Total Legal Experience</label>
            <input
              type="text"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Base Hourly Rate ($)</label>
            <input
              type="number"
              value={profile.hourlyRate}
              onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Professional Bio Statement</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveProfile}
          className="px-5 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md shadow-slate-950/10"
        >
          Save Profile Changes
        </button>
      </div>

      {/* COLUMN 3: Services (CRUD) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1">
              <Sparkles size={16} className="text-amber-500" /> Custom Services CRUD
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Add, review, or clean up fixed-rate specific service items.</p>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {services.map((service) => (
              <div key={service._id} className="flex justify-between items-center p-3 border border-slate-100 bg-slate-50/50 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">{service.title}</p>
                  <p className="text-[10px] text-slate-400 font-black flex items-center gap-0.5"><DollarSign size={10} />{service.cost} Fixed</p>
                </div>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleAddService} className="pt-4 border-t border-slate-100 space-y-3">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Service title e.g. NDA Drafting"
              required
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="number"
                placeholder="Fixed Cost Amount"
                required
                value={newService.cost}
                onChange={(e) => setNewService({ ...newService, cost: e.target.value })}
                className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500"
              />
              <DollarSign size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus size={14} /> Deploy New Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

