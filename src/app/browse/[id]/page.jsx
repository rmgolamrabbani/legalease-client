"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ShieldCheck, ArrowLeft, Calendar, MessageSquare, Sparkles, Clock, DollarSign, UserCheck, X, Briefcase, Mail, Star, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export default function LawyerDetails() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const id = params.id;
    const sessionId = searchParams.get("session_id"); 

    const [practitioner, setPractitioner] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // পেমেন্ট এবং কমেন্টের জন্য স্টেটস
    const [hasPaid, setHasPaid] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [reviews, setReviews] = useState([]);
    const [, setRequestStatus] = useState(null);

    // ডাইনামিক ইউজার আইডি এবং রোল ভেরিয়েবল (সেশন থেকে নেওয়া)
    const currentUserId = session?.user?.id || session?.user?.email;
    const currentUserRole = session?.user?.role; // 'user', 'lawyer' ইত্যাদি হতে পারে

    // ১. প্র্যাকটিশনার প্রোফাইল, সার্ভিস ও রিভিউ ফেচিং
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                // প্র্যাকটিশনার প্রোফাইল ফেচিং
                const profileRes = await fetch(`${BACKEND_URL}/profile/${id}`);
                let profileData = {};
                if (profileRes.ok) {
                    profileData = await profileRes.json();
                } else {
                    const fallbackRes = await fetch(`${BACKEND_URL}/profile`);
                    profileData = await fallbackRes.json();
                }

                setPractitioner({
                    ...profileData,
                    name: profileData.name || "New Lawyer",
                    email: profileData.email || "N/A",
                    category: profileData.category || "General Law",
                    bio: profileData.bio || "Please update your professional bio statement.",
                    experience: profileData.experience || "0 Years",
                    hourlyRate: profileData.hourlyRate || "100",
                    status: profileData.status || "Available",
                    avatarUrl: profileData.avatarUrl || null,
                    createdAt: profileData.createdAt?.$date || profileData.createdAt || new Date().toISOString()
                });

                // সার্ভিস সমূহ ফেচিং
                const servicesRes = await fetch(`${BACKEND_URL}/services?lawyerId=${id}`);
                if (servicesRes.ok) {
                    const servicesData = await servicesRes.json();
                    setServices(servicesData);
                }

                // রিভিউ বা কমেন্ট সমূহ ফেচিং
                const reviewsRes = await fetch(`${BACKEND_URL}/reviews/${id}`);
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData);
                }

                // ডাইনামিক আইডি দিয়ে পেমেন্ট স্ট্যাটাস চেক
                if (currentUserId) {
                    const checkPayRes = await fetch(`${BACKEND_URL}/check-payment-status?userId=${currentUserId}&lawyerId=${id}`);
                    if (checkPayRes.ok) {
                        const checkPayData = await checkPayRes.json();
                        setHasPaid(checkPayData.hasPaid);
                    }
                }

            } catch (error) {
                console.error("Error fetching details:", error);
                toast.error("Failed to load practitioner details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id, currentUserId]);

    // ২. অ্যাপয়েন্টমেন্ট রিকোয়েস্ট স্ট্যাটাস ফেচিং
    useEffect(() => {
        const fetchRequestStatus = async () => {
            if (!currentUserId) return; 
            try {
                const requestRes = await fetch(
                    `${BACKEND_URL}/request-status?userId=${currentUserId}&lawyerId=${id}`
                );

                if (requestRes.ok) {
                    const requestData = await requestRes.json();
                    if (requestData?.status) {
                        setRequestStatus(requestData.status);
                    }
                }
            } catch (error) {
                console.error("Error fetching request status:", error);
            }
        };

        if (id && currentUserId) {
            fetchRequestStatus();
        }
    }, [id, currentUserId]);

    // ৩. Stripe থেকে সফলভাবে ফেরার পর পেমেন্ট ভেরিফাই করার মেকানিজম
    useEffect(() => {
        if (sessionId && id) {
            fetch(`${BACKEND_URL}/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setHasPaid(true);
                        toast.success("Payment successful! Hiring confirmed & feedback unlocked.");
                        router.replace(`/browse/${id}`); 
                    }
                })
                .catch(err => console.error("Payment verification error:", err));
        }
    }, [sessionId, id, router]);

    // Appointment Request পাঠানোর ফাংশন
    const handleSendRequest = async () => {
        if (!currentUserId) {
            toast.error("Please login first to send an appointment request.");
            return;
        }

        setIsModalOpen(false); 

        try {
            toast.loading("Sending request to practitioner...");
            const payload = {
                lawyerId: id,
                lawyerName: practitioner.name,
                userId: currentUserId, 
                userName: session?.user?.name || "Anonymous Client",
                userEmail: session?.user?.email || "client@gmail.com",
                amount: selectedService ? selectedService.cost : practitioner.hourlyRate,
                serviceTitle: selectedService ? selectedService.title : "Standard Consultation Session"
            };

            const res = await fetch(`${BACKEND_URL}/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            toast.dismiss();
            if (res.ok) {
                toast.success("Hiring request sent successfully! Check status in your dashboard.");
            } else {
                toast.error(data.error || "Failed to send request.");
            }
        } catch (err) {
            toast.dismiss();
            console.error(err);
            toast.error("Something went wrong!");
        }
    };

    // কমেন্ট ও রিভিউ সাবমিট করার ফাংশন
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        if (!currentUserId) return;

        // চেক করা হচ্ছে ইউজারের রোল এবং সে পেমেন্ট করেছে কিনা
        if (currentUserRole !== "user") {
            toast.error("Only registered clients/users can submit reviews.");
            return;
        }

        if (!hasPaid) {
            toast.error("You need to hire and complete payment first to leave a review.");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lawyerId: id,
                    lawyerName: practitioner.name, 
                    userId: currentUserId, 
                    userName: session?.user?.name || "Current Client",
                    comment,
                    rating
                })
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setComment("");
                toast.success("Thank you for your valuable feedback!");
            } else {
                toast.error("Could not post review. Verification required.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error connecting to server.");
        }
    };

    // কাস্টম প্রিমিয়াম স্কেলিটন লোডার
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 py-10 animate-pulse">
                <div className="max-w-5xl mx-auto px-4 space-y-6">
                    <div className="h-9 w-32 bg-slate-200 rounded-xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl p-8 space-y-6 shadow-sm border border-slate-100">
                                <div className="flex flex-col sm:flex-row items-center gap-5">
                                    <div className="w-24 h-24 bg-slate-200 rounded-3xl" />
                                    <div className="space-y-3 flex-1 text-center sm:text-left">
                                        <div className="h-6 w-48 bg-slate-200 rounded mx-auto sm:mx-0" />
                                        <div className="h-4 w-32 bg-slate-200 rounded mx-auto sm:mx-0" />
                                        <div className="h-6 w-36 bg-slate-200 rounded-full mx-auto sm:mx-0" />
                                    </div>
                                </div>
                                <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                            </div>
                            <div className="bg-white rounded-3xl p-6 h-40 shadow-sm border border-slate-100" />
                        </div>
                        <div className="bg-white rounded-3xl p-6 h-64 shadow-sm border border-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (!practitioner) {
        return (
            <div className="text-center py-20 bg-slate-50 min-h-screen flex flex-col items-center justify-center">
                <p className="text-slate-500 font-bold">Practitioner not found!</p>
                <button onClick={() => router.back()} className="mt-4 text-amber-500 font-bold flex items-center gap-1">
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-10">
            <Toaster position="top-right" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={14} /> Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT SIDE: Main Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-950/5 space-y-6 relative overflow-hidden">
                            
                            {/* Dynamic Availability Badge */}
                            <div className="absolute top-6 right-6">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                                    practitioner.status?.toLowerCase() === 'available' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${practitioner.status?.toLowerCase() === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    {practitioner.status}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                                <div className="relative">
                                    {practitioner.avatarUrl ? (
                                        <img
                                            src={practitioner.avatarUrl}
                                            alt={practitioner.name}
                                            className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-50 shadow-md"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-3xl bg-amber-100 text-amber-700 border-4 border-slate-50 shadow-md flex items-center justify-center font-black text-3xl uppercase">
                                            {practitioner.name ? practitioner.name.charAt(0) : "L"}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-xl border-2 border-white">
                                        <ShieldCheck size={16} className="fill-current" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 flex-1 pr-0 sm:pr-24">
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{practitioner.name}</h1>
                                    <p className="text-sm text-amber-600 font-bold tracking-wide uppercase">
                                        {practitioner.category} Lawyer
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-slate-500 text-xs font-medium">
                                        <span className="flex items-center gap-1">
                                            <Mail size={14} className="text-slate-400" /> {practitioner.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Specs Row: Hourly Rate, Experience & Date Joined */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl hidden sm:block">
                                        <DollarSign size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hourly Rate</p>
                                        <p className="text-xs sm:text-sm font-black text-slate-800">${practitioner.hourlyRate}/hr</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl hidden sm:block">
                                        <Briefcase size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                                        <p className="text-xs sm:text-sm font-black text-slate-800">{practitioner.experience}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-900/5 text-slate-600 rounded-xl hidden sm:block">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Joined Platform</p>
                                        <p className="text-xs sm:text-sm font-black text-slate-800">
                                            {new Date(practitioner.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Professional Bio</h3>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed bg-amber-50/20 p-4 rounded-2xl border border-dashed border-amber-500/10">
                                    "{practitioner.bio}"
                                </p>
                            </div>
                        </div>

                        {/* Fixed-Rate Premium Services Section */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-4">
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                                <Sparkles size={18} className="text-amber-500" /> Fixed-Rate Premium Packages
                            </h3>
                            {services.length === 0 ? (
                                <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl border border-dashed">No dynamic packages uploaded by this advocate yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    {services.map((service) => (
                                        <div
                                            key={service._id}
                                            onClick={() => setSelectedService(service)}
                                            className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                                                selectedService?._id === service._id
                                                    ? "border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/10"
                                                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-slate-800">{service.title}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">{service.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100/60">
                                                <span className="text-xs font-black text-slate-900">${service.cost} USD</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${selectedService?._id === service._id ? "bg-amber-500 text-slate-950" : "bg-slate-200 text-slate-600"}`}>
                                                    {selectedService?._id === service._id ? "Selected" : "Select"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 🌟 Evaluation & Feedback Section (Role based and Payment Conditioned) */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-4">
                            <h3 className="text-base font-black text-slate-900">Practitioner Evaluation & Feedback</h3>

                            {currentUserRole === "user" && hasPaid ? (
                                <form onSubmit={handleCommentSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                    <p className="text-xs font-bold text-slate-700">Write an authentic review on your experience:</p>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Provide constructive feedback regarding the legal services..."
                                        className="w-full p-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                        rows={3}
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={`cursor-pointer ${star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                        <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500 hover:text-slate-950 transition-all">
                                            Submit Feedback <Send size={12} />
                                        </button>
                                    </div>
                                </form>
                            ) : currentUserRole !== "user" && currentUserId ? (
                                <div className="p-4 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium rounded-2xl">
                                    ℹ️ Review submissions are exclusive to registered Clients ("user" role).
                                </div>
                            ) : (
                                <div className="p-4 bg-amber-50/40 border border-amber-500/10 text-amber-800 text-xs font-medium rounded-2xl">
                                    🔒 Reviews are restricted. You can leave a rating and comment after hiring this advocate and completing the payment process.
                                </div>
                            )}

                            {/* Reviews Display List */}
                            <div className="space-y-3 pt-2">
                                {reviews.length === 0 ? (
                                    <p className="text-xs text-slate-400">No client feedback published yet.</p>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev._id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-slate-800">{rev.userName}</span>
                                                <div className="flex items-center text-amber-500 gap-0.5">
                                                    <Star size={12} className="fill-current" />
                                                    <span className="text-[11px] font-bold text-slate-700">{rev.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{rev.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDE: Dynamic Sidebar Actions Widget */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-950/5 space-y-5 sticky top-6">
                            
                            {selectedService ? (
                                <div className="bg-amber-50/30 border border-amber-500/20 rounded-2xl p-3 space-y-1">
                                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">Selected Package</span>
                                    <p className="text-xs font-bold text-slate-800 truncate">{selectedService.title}</p>
                                    <p className="text-xs font-black text-slate-900">${selectedService.cost} USD Fixed</p>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Base Rate</span>
                                    <p className="text-xs font-bold text-slate-800">Dynamic Consultation</p>
                                    <p className="text-xs font-black text-slate-900">${practitioner.hourlyRate} USD / Hour</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        if (!currentUserId) {
                                            toast.error("Please login first to send an appointment request.");
                                            return;
                                        }
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full py-3 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md"
                                >
                                    <Calendar size={14} /> Hire & Request Consultation
                                </button>

                                <button
                                    onClick={() => toast.loading("Opening consultation secure channel...")}
                                    className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                                >
                                    <MessageSquare size={14} /> Contact Counsel
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CONFIRMATION POPUP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                                <UserCheck size={18} className="text-amber-500" /> Confirm Engagement
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-1.5 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="space-y-3 text-sm text-slate-600">
                            <p>You are hiring <strong className="text-slate-900">{practitioner.name}</strong> ({practitioner.category} specialist).</p>
                            
                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-xs font-medium text-slate-400">Rate Scope:</span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {selectedService ? selectedService.title : "Hourly Retainer"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-medium text-slate-400">Amount:</span>
                                    <span className="text-xs font-black text-slate-900">
                                        ${selectedService ? selectedService.cost : practitioner.hourlyRate} USD
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendRequest}
                                className="flex-1 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all shadow-sm"
                            >
                                Confirm & Hire
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}