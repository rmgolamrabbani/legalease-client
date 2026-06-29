"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, CreditCard, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export default function HiringHistoryPage() {
    const { data: session, isPending: sessionPending } = useSession();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payLoading, setPayLoading] = useState(null);

    const currentUserId = session?.user?.id || session?.user?.email;

    // হিস্ট্রি ডেটা লোড করার ফাংশন (যাতে বারবার রিইউজ করা যায়)
    const fetchHistory = useCallback(async () => {
        if (!currentUserId) return;
        try {
            const res = await fetch(`${BACKEND_URL}/user-requests/${currentUserId}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            } else {
                toast.error("হিস্ট্রি ডেটা পাওয়া যায়নি");
            }
        } catch (err) {
            console.error(err);
            toast.error("হিস্ট্রি লোড করতে ব্যর্থ হয়েছে");
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    // ১. প্রথমবার পেজ লোড হলে ডাটা আনা
    useEffect(() => {
        if (currentUserId) {
            fetchHistory();
        }
    }, [currentUserId, fetchHistory]);

    // ২. পেমেন্ট সফল হয়ে ফিরে আসলে ভেরিফাই করা
    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();
                if (data.success) {
                    toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে এবং আপডেট হয়েছে!");
                    
                    // URL থেকে session_id সরিয়ে ক্লিন করা
                    window.history.replaceState(null, "", window.location.pathname);
                    
                    // নতুন ডাটা রিফ্রেশ করা
                    fetchHistory();
                } else {
                    toast.error("পেমেন্ট ভেরিফিকেশন সফল হয়নি");
                }
            } catch (err) {
                console.error("Payment verification error:", err);
            }
        };

        if (sessionId) {
            verifyPayment();
        }
    }, [sessionId, fetchHistory]);

    // ৩. স্ট্রাইপ চেকআউট সেশন তৈরি
    const handleStripePayment = async (item) => {
        try {
            setPayLoading(item._id);
            const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: item._id,
                    lawyerId: item.lawyerId || "lawyer_test",
                    userId: currentUserId,
                    amount: item.amount,
                    serviceTitle: item.serviceTitle || "Legal Consultation",
                    // এখানে আপনার নেক্সট জেএস অ্যাপের সঠিক ইউআরএল দিন
                    successUrl: `${window.location.origin}/dashboard/user/hiring-history?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: window.location.href,
                })
            });
            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Checkout সেশন তৈরি করা যায়নি");
            }
        } catch (err) {
            console.error(err);
            toast.error("পেমেন্ট প্রোসেস ট্রিগার করতে সমস্যা হয়েছে");
        } finally {
            setPayLoading(null);
        }
    };

    if (sessionPending || loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-amber-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-950/5 m-1 sm:m-4">
            <Toaster position="top-right" />
            <div className="mb-6">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Calendar size={20} className="text-amber-500" /> Hiring History
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">আপনার পাঠানো সকল আইনি অ্যাপয়েন্টমেন্ট ও পেমেন্ট স্ট্যাটাস ট্র্যাক করুন।</p>
            </div>

            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-100">
                            <th className="p-4">Lawyer Name</th>
                            <th className="p-4">Service / Specialisation</th>
                            <th className="p-4">Fee</th>
                            <th className="p-4">Hiring Date</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-slate-400 font-bold">
                                    কোনো হিস্ট্রি রেকর্ড পাওয়া যায়নি।
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="p-4 font-bold text-slate-900">{item.lawyerName}</td>
                                    <td className="p-4">{item.serviceTitle}</td>
                                    <td className="p-4 font-bold">${item.amount}</td>
                                    <td className="p-4 text-slate-400">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : 'N/A'}
                                    </td>

                                    {/* পেমেন্ট স্ট্যাটাস */}
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.paymentStatus?.toLowerCase() === "paid"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                            {item.paymentStatus || "Unpaid"}
                                        </span>
                                    </td>

                                    {/* লয়ার একসেপ্টেন্স স্ট্যাটাস */}
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${item.status?.toLowerCase() === "accepted" ? "bg-emerald-50 text-emerald-600" :
                                                item.status?.toLowerCase() === "rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                            {item.status?.toLowerCase() === "pending" && <Clock size={10} />}
                                            {item.status?.toLowerCase() === "accepted" && <CheckCircle size={10} />}
                                            {item.status?.toLowerCase() === "rejected" && <XCircle size={10} />}
                                            {item.status || "Pending"}
                                        </span>
                                    </td>

                                    {/* অ্যাকশন বাটন লজিক */}
                                    <td className="p-4 text-right">
                                        {item.status?.toLowerCase() === "accepted" && item.paymentStatus?.toLowerCase() !== "paid" ? (
                                            <button
                                                disabled={payLoading === item._id}
                                                onClick={() => handleStripePayment(item)}
                                                className="px-3 py-1.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 rounded-xl font-black inline-flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                                            >
                                                <CreditCard size={12} /> {payLoading === item._id ? "Processing..." : "Pay Now"}
                                            </button>
                                        ) : item.paymentStatus?.toLowerCase() === "paid" ? (
                                            <span className="text-emerald-600 text-[11px] font-bold uppercase bg-emerald-50 px-2 py-1 rounded">
                                                Completed
                                            </span>
                                        ) : item.status?.toLowerCase() === "rejected" ? (
                                            <span className="text-rose-600 text-[11px] font-bold uppercase bg-rose-50 px-2 py-1 rounded">
                                                Rejected
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 text-[11px] font-bold uppercase bg-slate-50 px-2 py-1 rounded">
                                                Waiting for Accept
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

