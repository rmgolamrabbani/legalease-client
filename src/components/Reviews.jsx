"use client";

import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";

export default function ReviewSlider() {
  // Safe mounting flag to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Corporate Client",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      message: "Absolute lifesaver! The corporate attorney I matched with resolved our contract dispute within 48 hours. Completely stress-free process."
    },
    {
      id: 2,
      name: "David Miller",
      role: "Small Business Owner",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      message: "Transparent hourly pricing helped me manage my budget perfectly. Highly recommend this marketplace for securing top-tier talent."
    },
    {
      id: 3,
      name: "Elena Rostova",
      role: "Family Law Client",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      message: "The escrow payment method made me feel safe. The consultant didn't get paid until my documentation was officially completed."
    },
    {
      id: 4,
      name: "Marcus Vance",
      role: "Real Estate Investor",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      rating: 4,
      message: "Excellent UI. I filtered advocates by experience and field, found an expert property attorney, and booked a slot instantly."
    },
    {
      id: 5,
      name: "Amina Al-Mansoor",
      role: "Startup Founder",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      message: "Unbelievable convenience! Verified profiles meant I could trust the advice entirely. Intellectual property law made simple."
    },
    {
      id: 6,
      name: "Robert Chen",
      role: "Civil Litigation",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      message: "Customer service guided me on selecting the category. The advocate fought passionately for my insurance settlement claim."
    },
    {
      id: 7,
      name: "Jessica Taylor",
      role: "Employment Dispute",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      message: "Fast matching and reliable support. My lawyer explained everything cleanly without confusing jargon. Five stars all day!"
    },
    {
      id: 8,
      name: "Liam O'Connor",
      role: "Tax Consultation",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
      rating: 4,
      message: "Super smooth. Avoided hefty offline firm retainers and talked to a seasoned tax specialist immediately via the secure channel."
    }
  ];

  const duplicatedReviews = [...reviews, ...reviews];

  if (!mounted) return null;

  return (
    <section className="bg-[#0a1128] text-white py-20 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10 text-center space-y-3">
        <span className="text-xs font-black text-amber-500 tracking-widest uppercase border border-amber-500/20 bg-amber-500/10 px-3 py-1 rounded-full">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          What Our Clients Say <span className="text-amber-500">About Us</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-medium">
          Real reviews from real people who discovered seamless, premium legal solutions through our platform.
        </p>
      </div>

      <div className="relative flex w-full overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
        
        {/* We use an arbitrary custom animation style safely injected through regular React tags */}
        <div className="flex gap-6 py-4 animate-marquee-loop whitespace-nowrap min-w-full">
          {duplicatedReviews.map((review, idx) => (
            <div
              key={idx}
              className="inline-block w-[350px] shrink-0 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 relative whitespace-normal group hover:border-amber-500/30 transition-all duration-300 hover:[animation-play-state:paused]"
            >
              <Quote size={40} className="text-slate-800/40 absolute top-4 right-4 pointer-events-none" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                ))}
                {review.rating < 5 && <Star size={14} className="text-slate-700" />}
              </div>

              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6 italic">
                "{review.message}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800 group-hover:ring-amber-500/40 transition-colors"
                />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{review.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Injecting standard keyframes via safe style tag blocks */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeLoop {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          animation: marqueeLoop 35s linear infinite;
        }
        .animate-marquee-loop:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}