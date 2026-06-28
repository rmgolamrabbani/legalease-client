"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Loader2, Check, X, User, Mail } from "lucide-react";
import { useSession } from "@/lib/auth-client"; 
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = "http://localhost:5000/api";

export default function LawyerRequestsPage() {
    const { data: session, isPending: sessionPending } = useSession(); 
    const [lawyerId, setLawyerId] = useState(null); 
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const getCleanId = (idObj) => {
        if (!idObj) return "";
        return typeof idObj === "object" ? idObj.$oid || idObj.toString() : idObj;
    };

    // ১. লগইন করা লয়ারের ইমেইল দিয়ে আসল লয়ার আইডি খুঁজে বের করা
    useEffect(() => {
        if (session?.user?.email) {
            
            fetch(`${BACKEND_URL}/dashboard-profile?email=${session.user.email}`)
                .then((res) => res.json())
                .then((data) => {
                   
                    const profileData = Array.isArray(data) ? data[0] : data;
                    
                    
                    const targetDoc = profileData?.data || profileData;

                    const extractedId = getCleanId(targetDoc?._id);
                    
                    if (extractedId) {
                        setLawyerId(extractedId);
                    } else {
                        console.error("Profile payload received:", data); 
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching lawyer ID:", err);
                    toast.error("প্রোফাইল লোড করতে ব্যর্থ হয়েছে");
                    setLoading(false);
                });
        } else if (!sessionPending && !session) {
            setLoading(false); 
        }
    }, [session, sessionPending]);

    // ২. লয়ার আইডি পাওয়ার পর স্পেসিফিক রিকোয়েস্টগুলো ফেচ করা
    useEffect(() => {
        const fetchLawyerRequests = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BACKEND_URL}/lawyer-requests/${lawyerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setRequests(data); 
                } else {
                    toast.error("রিকোয়েস্ট ডেটা পাওয়া যায়নি");
                }
            } catch (err) {
                console.error(err);
                toast.error("রিকোয়েস্ট লিস্ট লোড করতে ব্যর্থ হয়েছে");
            } finally {
                setLoading(false);
            }
        };

        if (lawyerId) {
            fetchLawyerRequests();
        }
    }, [lawyerId]);

    // ৩. রিকোয়েস্ট Accept অথবা Reject করার হ্যান্ডলার
    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            setActionLoading(requestId);

            const res = await fetch(`${BACKEND_URL}/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                toast.success(`রিকোয়েস্ট সফলভাবে ${newStatus === 'Accepted' ? 'অ্যাকসেপ্ট' : 'রিজেক্ট'} করা হয়েছে!`);

               
                setRequests((prevRequests) =>
                    prevRequests.map((req) => {
                        const currentReqId = getCleanId(req._id);
                        return currentReqId === requestId ? { ...req, status: newStatus } : req;
                    })
                );
            } else {
                toast.error("স্ট্যাটাস আপডেট করা যায়নি");
            }
        } catch (err) {
            console.error(err);
            toast.error("সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে");
        } finally {
            setActionLoading(null);
        }
    };

    if (sessionPending || loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-center py-20 text-slate-500 font-bold">
                অনুগ্ৰহ করে লয়ার অ্যাকাউন্ট দিয়ে লগইন করুন।
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-950/5 m-1 sm:m-4">
            <Toaster position="top-right" />

            <div className="mb-6">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Calendar size={20} className="text-amber-500" /> Client Hiring Requests
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    আপনার প্রোফাইলে কোন কোন ইউজার রিকোয়েস্ট পাঠিয়েছে তাদের বিস্তারিত তালিকা নিচে দেওয়া হলো।
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-100">
                            <th className="p-4">User (Client) Details</th>
                            <th className="p-4">Requested Service</th>
                            <th className="p-4">Offered Fee</th>
                            <th className="p-4">Payment Status</th>
                            <th className="p-4">Request Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-slate-400 font-bold">
                                    এখনো কোনো ক্লায়েন্ট আপনার কাছে রিকোয়েস্ট পাঠাননি।
                                </td>
                            </tr>
                        ) : (
                            requests.map((item) => {
                                const currentRequestId = getCleanId(item._id);
                                return (
                                    <tr key={currentRequestId} className="hover:bg-slate-50/50 transition-all">
                                        
                                        {/* ক্লায়েন্ট ডিটেইলস */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-slate-900 flex items-center gap-1">
                                                    <User size={12} className="text-slate-400" /> {item.userName || "Anonymous User"}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                                                    <Mail size={10} className="text-slate-300" /> {item.userEmail}
                                                </div>
                                                <div className="text-[9px] text-slate-400 tracking-wider font-mono">ID: {item.userId}</div>
                                            </div>
                                        </td>

                                        {/* সার্ভিসের নাম */}
                                        <td className="p-4 font-semibold text-slate-600">
                                            {item.serviceTitle}
                                        </td>

                                        {/* অফার করা অ্যামাউন্ট */}
                                        <td className="p-4 font-bold text-slate-900">
                                            ${item.amount || "0.00"}
                                        </td>

                                        {/* পেমেন্ট স্ট্যাটাস */}
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                item.paymentStatus?.toLowerCase() === "paid" 
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                                {item.paymentStatus || "Unpaid"}
                                            </span>
                                        </td>

                                        {/* রিকোয়েস্টের তারিখ */}
                                        <td className="p-4 text-slate-400">
                                            {item.createdAt?.$date 
                                                ? new Date(item.createdAt.$date).toLocaleDateString("en-GB") 
                                                : item.createdAt 
                                                ? new Date(item.createdAt).toLocaleDateString("en-GB") 
                                                : "N/A"
                                            }
                                        </td>

                                        {/* স্ট্যাটাস ব্যাজ */}
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                                                item.status?.toLowerCase() === "accepted" ? "bg-emerald-50 text-emerald-600" :
                                                item.status?.toLowerCase() === "rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                                {item.status?.toLowerCase() === "pending" && <Clock size={10} />}
                                                {item.status?.toLowerCase() === "accepted" && <CheckCircle size={10} />}
                                                {item.status?.toLowerCase() === "rejected" && <XCircle size={10} />}
                                                {item.status || "Pending"}
                                            </span>
                                        </td>

                                        {/* অ্যাকশন বাটন */}
                                        <td className="p-4 text-center">
                                            {item.status?.toLowerCase() === "pending" || !item.status ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        disabled={actionLoading === currentRequestId}
                                                        onClick={() => handleStatusUpdate(currentRequestId, "Accepted")}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 rounded-xl font-bold transition-all shadow-sm"
                                                    >
                                                        {actionLoading === currentRequestId ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Accept
                                                    </button>
                                                    <button
                                                        disabled={actionLoading === currentRequestId}
                                                        onClick={() => handleStatusUpdate(currentRequestId, "Rejected")}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 rounded-xl font-bold transition-all shadow-sm"
                                                    >
                                                        {actionLoading === currentRequestId ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md">
                                                    Decision Taken
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}