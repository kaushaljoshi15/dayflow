'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { getOrCreateProfile, updateProfile, getProfile, getAllProfiles } from '@/lib/queries'

export async function ensureProfile() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    const email = user.emailAddresses[0]?.emailAddress || ''
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || email

    return await getOrCreateProfile(user.id, email, fullName)
  } catch (error) {
    console.error('Error ensuring profile:', error)
    return null
  }
}

export async function getUserProfile() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    return await getProfile(user.id)
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export async function updateUserProfile(data: {
  phone?: string
  address?: string
  profile_picture_url?: string
}) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    const profile = await updateProfile(user.id, data)
    revalidatePath('/profile')
    return profile
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile. Please try again.')
  }
}

export async function getAllUserProfiles() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is admin
  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return await getAllProfiles()
}

