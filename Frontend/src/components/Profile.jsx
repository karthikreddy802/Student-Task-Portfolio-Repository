import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  BookOpen, Award, Shield, 
  Camera, Save, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const role = localStorage.getItem('userRole') || 'Student';
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // In a real app, we'd fetch by current user ID
      // For now, we'll fetch all and filter by username or just get the first one
      const res = await api.get('/profiles/');
      const allProfiles = Array.isArray(res.data) ? res.data : res.data.results || [];
      const myProfile = allProfiles.find(p => p.user.username === username) || allProfiles[0];
      
      // Combine user fields for easier editing
      if (myProfile) {
        myProfile.full_name = `${myProfile.user.first_name || ''} ${myProfile.user.last_name || ''}`.trim() || myProfile.user.username;
        myProfile.email = myProfile.user.email;
      }
      
      setProfile(myProfile);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await toast.promise(
        api.patch(`/profiles/${profile.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        {
          loading: 'Uploading image...',
          success: 'Profile picture updated!',
          error: 'Upload failed'
        }
      );
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const nameParts = (profile.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updateData = {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: profile.email
        },
        id_number: profile.id_number,
        department: profile.department,
        bio: profile.bio
      };
      await api.patch(`/profiles/${profile.id}/`, updateData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <User className="text-indigo-400 w-8 h-8" /> {role} Profile
        </h1>
        <p className="text-slate-400 mt-1">Manage your professional information and account settings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-2xl mx-auto">
                <img 
                  src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-[22px] bg-slate-900 object-cover"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-lg hover:bg-indigo-500 transition-all cursor-pointer">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{username}</h2>
              <p className="text-indigo-400 font-medium text-sm">{role}</p>
            </div>
            <div className="flex justify-center gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {profile?.department || 'Academic'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" /> Account Security
            </h3>
            <button className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-slate-400 text-sm transition-all border border-transparent hover:border-white/5">
              Change Password
            </button>
            <button className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-slate-400 text-sm transition-all border border-transparent hover:border-white/5">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Right: Detailed Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Personal Information</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-indigo-400 hover:text-white transition-all text-sm font-bold"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <input 
                    disabled={!isEditing}
                    type="email" 
                    value={profile?.email || ''}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {role === 'Student' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Student ID</label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                      <input 
                        disabled={!isEditing}
                        type="text" 
                        value={profile?.id_number || ''}
                        onChange={(e) => setProfile({...profile, id_number: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                      <input 
                        disabled={!isEditing}
                        type="text" 
                        value={profile?.department || ''}
                        onChange={(e) => setProfile({...profile, department: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {role === 'Teacher' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Faculty ID</label>
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      value={profile?.id_number || ''}
                      onChange={(e) => setProfile({...profile, id_number: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Subject Area</label>
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      value={profile?.department || ''}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Bio / Introduction</label>
                <textarea 
                  disabled={!isEditing}
                  value={profile?.bio || ''}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white h-32 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {isEditing && (
                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
