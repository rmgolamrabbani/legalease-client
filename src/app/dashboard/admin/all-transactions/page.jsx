"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";

export default function AllTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetch(`${BACKEND_URL}/admin/all-orders`)
      .then((res) => {
        // যদি রেসপন্স ওকে (200) না হয় বা রাউট না থাকে তবে এরর থ্রো করবে
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // নিশ্চিত হয়ে নেওয়া যে ডেটাটি একটি অ্যারে
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false); // এরর খেলেও লোডিং ফলস করে দেওয়া যাতে পেজ আটকে না থাকে
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-xs font-bold text-slate-500">
        <Loader2 className="animate-spin mr-2" size={16} /> Resolving Financial Records...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">All Transactions</h2>
        <p className="text-xs text-slate-400 mt-1">Real-time financial transactions processed via Stripe secure gateway.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-950/5 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-amber-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-4">Transaction / Session ID</th>
                <th className="p-4">User Identity</th>
                <th className="p-4">Service Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-4 font-mono font-bold text-slate-900 max-w-[180px] truncate" title={order.sessionId}>
                    {order.sessionId || "N/A"}
                  </td>
                  <td className="p-4 text-slate-500">{order.userId}</td>
                  <td className="p-4 font-bold text-slate-800">{order.serviceTitle}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg font-bold">
                      ${order.amount} USD
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-slate-400 font-bold">No successful payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}