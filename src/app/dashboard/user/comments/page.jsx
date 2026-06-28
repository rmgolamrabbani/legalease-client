"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; // 💡 আপনার প্রজেক্টের সেশন হুক (প্রয়োজন অনুযায়ী পাথ চেঞ্জ করতে পারেন)
import { MessageSquare, Edit2, Trash2, Star, X, Loader2, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = "http://localhost:5000/api";

export default function CommentManagementPage() {
    const { data: session, status } = useSession(); // 💡 লগইন সেশন ডেটা নেওয়া হলো
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [editingReview, setEditingReview] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);

    // 💡 ডাইনামিক ইউজার আইডি (সেশন থেকে আইডি অথবা ইমেইল)
    const currentUserId = session?.user?.id || session?.user?.email;

    useEffect(() => {
        const fetchReviews = async () => {
            // যদি সেশন লোড হওয়া শেষ না হয়, তাহলে অপেক্ষা করবে
            if (status === "loading") return;
            
            // সেশন না থাকলে বা ইউজার লগইন না থাকলে ফেচ করার প্রয়োজন নেই
            if (!currentUserId) {
                setLoading(false);
                return;
            }

            try {
                // হায়ার হিস্ট্রির মতো ডাইনামিক currentUserId দিয়ে ডেটা লোড
                const res = await fetch(`${BACKEND_URL}/user-reviews/${currentUserId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                } else {
                    toast.error("সার্ভার থেকে ডেটা পাওয়া যায়নি");
                }
            } catch (err) {
                console.error(err);
                toast.error("রিভিউ লোড করতে সমস্যা হয়েছে");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [currentUserId, status]); // 💡 ইউজার পরিবর্তন হলে বা সেশন স্ট্যাটাস আপডেট হলে পুনরায় রান হবে

    const handleDelete = async (id) => {
        if (!confirm("আপনি কি নিশ্চিতভাবে এই মন্তব্যটি ডিলিট করতে চান?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/reviews/${id}`, { method: "DELETE" });
            if (res.ok) { 
                setReviews(reviews.filter(r => r._id !== id));
                toast.success("মন্তব্যটি সফলভাবে ডিলিট করা হয়েছে");
            } else {
                toast.error("ডিলিট করা যায়নি");
            }
        } catch (err) {
            console.error(err);
            toast.error("ডিলিট করা যায়নি");
        }
    };

    const handleOpenEdit = (review) => {
        setEditingReview(review);
        setEditComment(review.comment);
        setEditRating(review.rating);
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/reviews/${editingReview._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: editComment, rating: editRating })
            });

            if (res.ok) {
                setReviews(reviews.map(r => r._id === editingReview._id ? { ...r, comment: editComment, rating: editRating } : r));
                toast.success("মন্তব্য আপডেট করা হয়েছে");
                setEditingReview(null);
            } else {
                toast.error("আপডেট করা সম্ভব হয়নি");
            }
        } catch (err) {
            console.error(err);
            toast.error("আপডেট করা সম্ভব হয়নি");
        }
    };

    // লোডিং স্টেট হ্যান্ডলার
    if (loading || status === "loading") {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
        );
    }

    // 💡 ইউজার লগইন না থাকলে এই ভিউটি দেখতে পাবেন
    if (!currentUserId) {
        return (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-950/5 max-w-md mx-auto my-10 space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                    <Lock size={20} />
                </div>
                <h2 className="text-base font-black text-slate-900">Access Denied</h2>
                <p className="text-xs text-slate-400 font-medium">আপনার করা মন্তব্য ও রেটিং ম্যানেজ করতে অনুগ্রহ করে প্রথমে সিস্টেমে লগইন করুন।</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-950/5 relative">
            <Toaster position="top-right" />
            <div className="mb-6">
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <MessageSquare size={20} className="text-amber-500"/> Comment Management
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">লইয়ার প্রোফাইলে আপনার দেওয়া সকল মন্তব্য ও রেটিং এখানে পরিবর্তন করতে পারবেন।</p>
            </div>

            {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl text-center">আপনি এখনো কোনো লয়ার প্রোফাইলে মন্তব্য করেননি।</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                        <div key={rev._id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col justify-between gap-3 hover:border-slate-200 transition-all">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    {/* যাকে কমেন্ট করা হয়েছে (Lawyer Name) */}
                                    <h3 className="text-xs font-black text-slate-900">To: {rev.lawyerName || "Verified Lawyer"}</h3>
                                    <div className="flex items-center text-amber-500 gap-0.5">
                                        <Star size={12} className="fill-current" />
                                        <span className="text-[11px] font-bold text-slate-700">{rev.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 font-medium bg-white p-3 border border-slate-100 rounded-xl leading-relaxed">"{rev.comment}"</p>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100/60 pt-2">
                                <button onClick={() => handleOpenEdit(rev)} className="inline-flex items-center gap-1 px-2.5 py-1.5 hover:bg-amber-50 text-slate-700 hover:text-amber-600 rounded-lg text-[11px] font-bold transition-all"><Edit2 size={12}/> Edit</button>
                                <button onClick={() => handleDelete(rev._id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-[11px] font-bold transition-all"><Trash2 size={12}/> Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h2 className="text-sm font-black text-slate-900">Edit Comment</h2>
                            <button onClick={() => setEditingReview(null)} className="p-1 text-slate-400 hover:text-slate-900 rounded-lg"><X size={16}/></button>
                        </div>

                        <form onSubmit={handleUpdateReview} className="space-y-3">
                            <textarea 
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full text-xs font-medium p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                rows={4}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} size={16} className={`cursor-pointer ${s <= editRating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`} onClick={() => setEditRating(s)} />
                                    ))}
                                </div>
                                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs rounded-xl transition-all">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}