"use client";



import { useSession } from "@/lib/auth-client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Loader2, ArrowLeft } from "lucide-react";



export default function UpdateUserProfile() {

  const { data: session } = useSession();

  const router = useRouter();

  const role = session?.user?.role || "user";

  const email = session?.user?.email;



  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({

    name: "",

    avatarUrl: "",

    phone: "",

    address: ""

  });

 

  const BACKEND_URL = "http://localhost:5000/api";



  useEffect(() => {

    if (email && role === "user") {

      fetch(`${BACKEND_URL}/dashboard-profile?email=${email}&role=${role}`)

        .then((res) => res.json())

        .then((data) => {

          if (data) {

            setFormData({

              name: data.name || session?.user?.name || "",

              avatarUrl: data.avatarUrl || session?.user?.image || "",

              phone: data.phone || "",

              address: data.address || ""

            });

          }

        })

        .catch((err) => console.error("Error fetching profile:", err));

    }

  }, [email, role, session]);



  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });

  };



  const handleUpdate = async (e) => {

    e.preventDefault();

    setIsSaving(true);

    try {

      const response = await fetch(`${BACKEND_URL}/dashboard-profile`, {

        method: "PUT",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email, role, ...formData }),

      });

      if (response.ok) {

        alert("Profile updated successfully!");

        router.push("/dashboard");

      } else {

        alert("Failed to update profile.");

      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong!");

    } finally {

      setIsSaving(false);

    }

  };



  return (

    <div className="max-w-2xl mx-auto space-y-6 w-full">

      {/* ব্যাক বাটন ও হেডার */}

      <div className="flex items-center gap-3">

        <button

          onClick={() => router.push("/dashboard")}

          className="p-2 bg-white border rounded-xl hover:bg-slate-100 text-slate-600 transition-all"

        >

          <ArrowLeft size={16} />

        </button>

        <div>

          <h2 className="text-xl font-black text-slate-900">Update Profile</h2>

          <p className="text-xs text-slate-400">Manage your Full Name and Profile Picture</p>

        </div>

      </div>



      {/* প্রোফাইল আপডেট ফর্ম */}

    

    </div>

  );

} 

