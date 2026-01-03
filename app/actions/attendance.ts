'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import {
  checkIn as dbCheckIn,
  checkOut as dbCheckOut,
  getTodayAttendance,
  getAttendanceByDateRange,
  getAllAttendance,
  getProfile
} from '@/lib/queries'

export async function checkIn() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    // Ensure profile exists
    const profile = await getProfile(user.id)
    if (!profile) {
      throw new Error('Profile not found. Please contact admin.')
    }

    await dbCheckIn(user.id)
    revalidatePath('/')
    revalidatePath('/attendance')
  } catch (error: any) {
    console.error('Error checking in:', error)
    throw new Error(error?.message || 'Failed to check in. Please try again.')
  }
}

export async function checkOut(attendanceId: number) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    await dbCheckOut(attendanceId)
    revalidatePath('/')
    revalidatePath('/attendance')
  } catch (error: any) {
    console.error('Error checking out:', error)
    throw new Error(error?.message || 'Failed to check out. Please try again.')
  }
}

export async function getTodayAttendanceRecord() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  return await getTodayAttendance(user.id)
}

export async function getUserAttendance(startDate: string, endDate: string) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  return await getAttendanceByDateRange(user.id, startDate, endDate)
}

export async function getAllAttendanceRecords(startDate?: string, endDate?: string) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return await getAllAttendance(startDate, endDate)
}

