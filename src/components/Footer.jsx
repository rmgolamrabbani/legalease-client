"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black">
                LE
              </div>

              <span className="text-xl font-black text-slate-900">
                Legal<span className="text-amber-500">Ease</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              LegalEase connects clients with verified lawyers and legal
              professionals worldwide through a secure and transparent platform.
            </p>

            <p className="text-sm text-slate-400 mt-4">
              © {new Date().getFullYear()} LegalEase. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-amber-500 transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-amber-500 transition">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:text-amber-500 transition">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-amber-500 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Clients */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4">
              For Clients
            </h3>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/browse" className="hover:text-amber-500 transition">
                  Browse Lawyers
                </Link>
              </li>

              <li>
                <Link href="/how-it-works" className="hover:text-amber-500 transition">
                  How It Works
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="hover:text-amber-500 transition">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/faq" className="hover:text-amber-500 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Lawyers */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4">
              For Lawyers
            </h3>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="/register?role=lawyer"
                  className="hover:text-amber-500 transition"
                >
                  Become a Lawyer
                </Link>
              </li>

              <li>
                <Link
                  href="/lawyer-guide"
                  className="hover:text-amber-500 transition"
                >
                  Lawyer Guide
                </Link>
              </li>

              <li>
                <Link
                  href="/support"
                  className="hover:text-amber-500 transition"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4">
              Newsletter
            </h3>

            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <button
                className="absolute right-1 top-1 bg-slate-900 text-white p-2.5 rounded-lg hover:bg-amber-500 hover:text-black transition"
              >
                <Send size={16} />
              </button>
            </div>

            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Follow Us
            </h4>

            <div className="flex items-center gap-3">

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-amber-500 hover:text-white transition"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-amber-500 hover:text-white transition"
              >
                <FaTwitter size={14} />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-amber-500 hover:text-white transition"
              >
                <FaLinkedinIn size={14} />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-amber-500 hover:text-white transition"
              >
                <FaInstagram size={14} />
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Trusted legal marketplace for clients and lawyers.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-amber-500">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-amber-500">
              Terms
            </Link>

            <Link href="/cookies" className="hover:text-amber-500">
              Cookies
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}