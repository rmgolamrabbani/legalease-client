"use client";

import { useState, useEffect } from "react";
import { Trash2, ShieldAlert, Loader2, Ban, CheckCircle2, Users, Scale } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${BACKEND_URL}/admin/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // রোল পরিবর্তন হ্যান্ডলার (টগল লজিক)
  const handleRoleChange = async (id, currentRole) => {
    const normalizedRole = currentRole?.toLowerCase() || "user";
    const nextRoles = { user: "lawyer", lawyer: "admin", admin: "user" };
    const newRole = nextRoles[normalizedRole] || "user";

    if (!confirm(`Change user role to ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/role/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ব্লক এবং আনব্লক হ্যান্ডলার 
  const handleBlockToggle = async (id, isBlockedNow) => {
    const actionText = isBlockedNow ? "Unblock" : "Block";
    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/block/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlockedNow }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !isBlockedNow } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ইউজার ডিলিট হ্যান্ডলার
  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((user) => user._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ডাটাবেজের ইউজার সংখ্যা ক্যালকুলেট করা (রোল ফিল্টারিং ফিক্সড)
  const totalUsersCount = users.filter((u) => (u.role?.toLowerCase() || "user") === "user").length;
  const totalLawyersCount = users.filter((u) => u.role?.toLowerCase() === "lawyer").length;
  const blockedUsersCount = users.filter((u) => u.isBlocked === true).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-xs font-bold text-slate-500">
        <Loader2 className="animate-spin mr-2" size={16} /> Loading Users Platform...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full p-4 sm:p-6 bg-slate-50/50 min-h-screen">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">Manage Users</h2>
        <p className="text-xs text-slate-400 mt-1">Control client, practitioner access roles, permissions, and status.</p>
      </div>

      {/* Database Statistics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-black text-slate-900">{totalUsersCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Lawyers</p>
            <p className="text-xl font-black text-slate-900">{totalLawyersCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Ban size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Blocked Accounts</p>
            <p className="text-xl font-black text-rose-600">{blockedUsersCount}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-950/5 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-amber-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-4">User Details</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {users.map((user) => {
                const userRole = user.role?.toLowerCase() || "user";
                const isBlocked = user.isBlocked || false;

                return (
                  <tr key={user._id} className={`hover:bg-slate-50/50 transition-all ${isBlocked ? 'bg-rose-50/30' : ''}`}>
                    <td className="p-4 flex items-center gap-3">
                      {user.avatarUrl || user.image ? (
                        <img src={user.avatarUrl || user.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold uppercase">
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.name || "Anonymous User"}</span>
                        {isBlocked && <span className="text-[10px] text-rose-500 font-bold">Account Blocked</span>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                        userRole === 'admin' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        userRole === 'lawyer' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {userRole}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Toggle Role Button */}
                        <button 
                          onClick={() => handleRoleChange(user._id, userRole)}
                          className="p-2 text-slate-600 bg-slate-50 hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-all flex items-center gap-1 font-bold text-[11px]"
                          title="Toggle Role"
                        >
                          <ShieldAlert size={14} /> Toggle Role
                        </button>

                        {/* Block / Unblock Button */}
                        <button 
                          onClick={() => handleBlockToggle(user._id, isBlocked)}
                          className={`p-2 font-bold text-[11px] rounded-xl transition-all flex items-center gap-1 ${
                            isBlocked 
                              ? 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white' 
                              : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'
                          }`}
                          title={isBlocked ? "Unblock User" : "Block User"}
                        >
                          {isBlocked ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                          {isBlocked ? "Unblock" : "Block"}
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}