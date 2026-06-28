"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession } from "@/lib/auth-client"; 

export default function ManageProfile() {

  const { data: session, isPending: sessionLoading } = useSession();
  const userEmail = session?.user?.email;
  
  // Profile States
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [category, setCategory] = useState('General Practice');
  const [status, setStatus] = useState('Available');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Services CRUD States
  const [services, setServices] = useState([]);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceCost, setServiceCost] = useState('');

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_ACTUAL_IMGBB_API_KEY";

  // টোস্ট মেসেজ হেল্পার (English)
  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  // ১. সেশন থেকে ইমেইল পাওয়ার পর প্রোফাইল ও সার্ভিস ডাটা লোড করা
  useEffect(() => {
    if (userEmail) {
      // প্রোফাইল ডাটা আনা
      axios.get(`http://localhost:5000/api/profile?email=${userEmail}`)
        .then(res => {
          if (res.data) {
            setName(res.data.name || '');
            setBio(res.data.bio || '');
            setExperience(res.data.experience || '');
            setHourlyRate(res.data.hourlyRate || '');
            setCategory(res.data.category || 'General Practice');
            setStatus(res.data.status || 'Available');
            setAvatarUrl(res.data.avatarUrl || '');
          }
        })
        .catch(err => {
          console.error(err);
          showToast('error', 'Failed to load profile data');
        });

      // সার্ভিস লিস্ট আনা
      fetchServices(userEmail);
    }
  }, [userEmail]);

  // সার্ভিস লিস্ট রিফ্রেশ করার ফাংশন
  const fetchServices = (email) => {
    axios.get(`http://localhost:5000/api/services?email=${email}`)
      .then(res => setServices(res.data || []))
      .catch(err => console.error(err));
  };

  // ২. ইমেজ আপলোড (ImgBB)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      if (response.data?.data?.url) {
        setAvatarUrl(response.data.data.url);
        showToast('success', 'Image uploaded successfully');
      } else {
        showToast('error', 'Image upload failed');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  // ৩. লয়ার প্রোফাইল সেভ করা (ডায়নামিক ইমেইল)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      showToast('error', 'User session not found. Please log in again.');
      return;
    }

    const profileData = {
      email: userEmail, // BetterAuth সেশন থেকে রিয়েলটাইম ডায়নামিক ইমেইল যাচ্ছে
      name, bio, experience, hourlyRate, category, status, avatarUrl
    };

    try {
      const res = await axios.put('http://localhost:5000/api/profile', profileData);
      if (res.data.success) {
        showToast('success', 'Profile updated successfully');
      } else {
        showToast('error', 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Server error during profile update');
    }
  };

  // ৪. নতুন সার্ভিস যুক্ত করা
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceTitle || !serviceCost) {
      showToast('warning', 'Please fill in all service fields');
      return;
    }

    try {
      const newService = {
        title: serviceTitle,
        cost: serviceCost,
        lawyerEmail: userEmail
      };

      const res = await axios.post('http://localhost:5000/api/services', newService);
      if (res.data.insertedId) {
        showToast('success', 'New service deployed successfully');
        setServiceTitle('');
        setServiceCost('');
        fetchServices(userEmail);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to add service');
    }
  };

  // ৫. সার্ভিস ডিলিট করা
  const handleDeleteService = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/services/${id}`);
      if (res.data.deletedCount > 0) {
        showToast('success', 'Service deleted successfully');
        fetchServices(userEmail);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to delete service');
    }
  };

  // সেশন লোড হওয়ার সময় লোডিং স্টেট দেখানো
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Form: Profile Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Professional Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category / Specialization</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
              <option value="Family">Family Law</option>
              <option value="Criminal">Criminal Law</option>
              <option value="Corporate">Corporate Law</option>
              <option value="General Practice">General Practice</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience</label>
              <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. 5 Years" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. 50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded h-24" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" onChange={handleImageUpload} className="w-full p-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {uploadingImage && <p className="text-blue-500 text-xs mt-1">Uploading image...</p>}
            {avatarUrl && <img src={avatarUrl} alt="Avatar" className="w-16 h-16 object-cover rounded-full mt-2 border" />}
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Right Section: Custom Services CRUD */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Deploy New Custom Service</h2>
          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Title</label>
              <input type="text" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} placeholder="e.g. Document Review" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fixed Cost ($)</label>
              <input type="number" value={serviceCost} onChange={(e) => setServiceCost(e.target.value)} placeholder="e.g. 100" className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition">
              Deploy New Service
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Your Active Services</h3>
          {services.length === 0 ? (
            <p className="text-gray-500 text-sm">No services added yet.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {services.map(service => (
                <li key={service._id} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
                  <div>
                    <p className="font-medium text-gray-800">{service.title}</p>
                    <p className="text-sm text-green-600 font-bold">${service.cost}</p>
                  </div>
                  <button onClick={() => handleDeleteService(service._id)} className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-1 px-2 rounded transition">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

