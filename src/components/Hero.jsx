
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Scale, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

const sliderImages = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1453722758971-56cca3949f19?auto=format&fit=crop&q=80&w=1200"
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // টেক্সট এনিমেশন কনফিগারেশন
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="relative w-full bg-[#020617] text-white min-h-[750px] flex items-center justify-center overflow-hidden">
      

      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={sliderImages[currentSlide]} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* টেক্সটের রিডিবিলিটি বাড়ানোর জন্য ডার্ক গ্রাডিয়েন্ট ওভারলে */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
      </div>

      {/* Content Layer: টেক্সট ও বাটনগুলো ইমেজের উপরে বসবে (উপরে থাকবে) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-8 max-w-3xl"
          >
            {/* এনিমেটেড মেইন হেডলাইন */}
            <motion.h1 
              variants={textVariants} 
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
            >
              Find & Hire <br />
              <span className="text-amber-500 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                Expert Legal Counsel
              </span>
            </motion.h1>
            
            {/* এনিমেটেড সাবটাইটেল */}
            <motion.p 
              variants={textVariants} 
              className="text-lg sm:text-xl text-slate-300 font-medium max-w-xl leading-relaxed"
            >
              Connect with verified lawyers for your personal or business legal needs. Get top-tier legal presentation and secured workflow seamlessly.
            </motion.p>

           
            <motion.div 
              variants={textVariants} 
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link 
                href="/browse" 
                className="px-10 py-4 bg-amber-500 text-slate-950 text-base font-bold rounded-xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95"
              >
                Browse Lawyers
              </Link>
              <Link 
                href="/auth/signup?role=lawyer" 
                className="px-10 py-4 border border-slate-700 bg-slate-900/40 text-white text-base font-bold rounded-xl hover:bg-slate-800 transition-all backdrop-blur-md active:scale-95"
              >
                Become a Lawyer
              </Link>
            </motion.div>

          
            <motion.div 
              variants={textVariants} 
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80"
            >
              {[
                { icon: Users, label: "Clients", val: "10,000+" },
                { icon: ShieldCheck, label: "Verified", val: "500+" },
                { icon: Scale, label: "Categories", val: "25+" },
                { icon: DollarSign, label: "Volume", val: "$100K+" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-white">{item.val}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="hidden lg:block lg:col-span-4"></div>
        </div>
      </div>

     
      <div className="absolute bottom-8 right-8 flex gap-3 z-30">
        <button 
          onClick={() => setCurrentSlide(prev => (prev === 0 ? sliderImages.length - 1 : prev - 1))}
          className="p-3.5 rounded-full border border-slate-800 bg-slate-950/60 hover:bg-amber-500 hover:text-black transition-all hover:border-amber-500"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => (prev === sliderImages.length - 1 ? 0 : prev + 1))}
          className="p-3.5 rounded-full border border-slate-800 bg-slate-950/60 hover:bg-amber-500 hover:text-black transition-all hover:border-amber-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* স্লাইড ইন্ডিকেটর ডটস */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {sliderImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-amber-500' : 'w-2 bg-slate-600'}`}
          />
        ))}
      </div>
    </section>
  );
}

