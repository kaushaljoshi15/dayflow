import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/app/actions/profile'
import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let profile = null
  try {
    profile = await getUserProfile()
  } catch (error) {
    console.error('Error loading profile:', error)
  }

  // Error State
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-500">We couldn't retrieve your employee data.</p>
          <p className="text-sm text-gray-400 mt-4">Please contact your HR administrator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2">
        <Link href="/" className="p-2 hover:bg-white rounded-full transition text-indigo-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-indigo-950">My Profile</h1>
      </div>
      
      {/* Main Form Component */}
      <ProfileForm profile={profile} />
    </div>
  )
}