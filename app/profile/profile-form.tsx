'use client'

import { useState } from 'react'
import { updateUserProfile } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'
// 👇 FIX: Replaced 'BadgeId' with 'IdCard'
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, 
  Camera, Save, Loader2, CheckCircle, ShieldCheck, IdCard 
} from 'lucide-react'

// Define the Interface
interface Profile {
  id: string
  employee_id: string | null
  email: string
  full_name: string | null
  phone: string | null
  address: string | null
  profile_picture_url: string | null
  role: 'employee' | 'admin'
  department: string | null
  position: string | null
  hire_date: Date | null
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    phone: profile.phone || '',
    address: profile.address || '',
    profile_picture_url: profile.profile_picture_url || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    try {
      await updateUserProfile(formData)
      router.refresh()
      setSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- SECTION 1: HEADER & IDENTITY --- */}
      <div className="relative bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        {/* Banner Gradient */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-lg overflow-hidden flex items-center justify-center">
                  {formData.profile_picture_url ? (
                    <img 
                      src={formData.profile_picture_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600 p-1.5 rounded-full text-white border-2 border-white shadow-sm">
                   <Camera className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Role */}
              <div className="mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{profile.full_name || 'Team Member'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide rounded-full border border-indigo-100">
                    {profile.role}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Building className="w-3 h-3" /> {profile.department || 'No Dept'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button (Top Right) */}
            <button
              type="submit"
              disabled={loading}
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

          {/* Success Message Banner */}
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Profile updated successfully!</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                {/* 👇 FIX: Used 'IdCard' component here */}
                <IdCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Employee ID</p>
                <p className="text-sm font-semibold text-slate-900">{profile.employee_id || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="p-2 bg-white rounded-lg text-violet-600 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Position</p>
                <p className="text-sm font-semibold text-slate-900">{profile.position || 'Not Assigned'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Date Hired</p>
                <p className="text-sm font-semibold text-slate-900">
                  {profile.hire_date ? new Date(profile.hire_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: EDITABLE DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Contact Info (Editable) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-indigo-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Personal Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email (Read Only) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Contact admin to change email.</p>
            </div>

            {/* Phone (Editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Photo URL (Editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
              <div className="relative group">
                <Camera className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="url"
                  value={formData.profile_picture_url}
                  onChange={(e) => setFormData({ ...formData, profile_picture_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Address (Full Width) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Residential Address</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  placeholder="123 Main St, City, Country"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Info Card */}
        <div className="space-y-6">
            {/* Mobile Only Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="md:hidden w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-medium transition shadow-lg shadow-indigo-200"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
                
                <h4 className="font-semibold text-lg mb-2 relative z-10">Profile Tips</h4>
                <ul className="space-y-3 text-indigo-200 text-sm relative z-10">
                    <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Keep your phone number updated for emergency alerts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Use a clear, professional photo for your profile picture.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Contact HR directly to update locked fields like Department or Role.</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </form>
  )
}