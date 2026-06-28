"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Clock, Scale, ThumbsUp, Users } from "lucide-react";

export default function WhyChooseUs() {
  // Feature data list in English
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Verified Profiles",
      description: "Every lawyer's bar council credentials and documents are thoroughly scrutinized and verified by our compliance team."
    },
    {
      icon: Award,
      title: "Top-Tier Legal Experts",
      description: "Gain direct access to highly rated and experienced advocates specializing across multiple legal domains."
    },
    {
      icon: Clock,
      title: "Instant Case Matching",
      description: "Find the right attorney based on your specific legal requirements and schedule consultations instantly."
    },
    {
      icon: Scale,
      title: "Transparent Pricing",
      description: "No hidden costs. Review explicit hourly rates and fixed consultation fees upfront right on the attorney's profile."
    },
    {
      icon: ThumbsUp,
      title: "Secure Payment Escrow",
      description: "Your financial transactions remain strictly protected in our secure escrow system until the legal service is delivered."
    },
    {
      icon: Users,
      title: "Dedicated Client Support",
      description: "Our customer success team is available 24/7 to assist you with onboarding, booking, or platform navigation issues."
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="bg-[#0a1128] text-white py-20 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black text-amber-500 tracking-widest uppercase border border-amber-500/20 bg-amber-500/10 px-3 py-1 rounded-full"
          >
            Our Core Values
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
          >
            Why Choose Our <span className="text-amber-500">Legal Services?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed"
          >
            Securing dependable, highly qualified legal advice has never been simpler, safer, or more accessible. Here is why thousands trust us.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6, borderColor: "rgba(245, 158, 11, 0.3)" }}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 backdrop-blur-sm shadow-xl shadow-slate-950/20 group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/10 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300 mb-5">
                <feature.icon size={24} />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-amber-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}