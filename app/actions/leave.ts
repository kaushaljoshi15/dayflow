'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import {
  createLeaveRequest as dbCreateLeaveRequest,
  getLeaveRequests as dbGetLeaveRequests,
  getAllLeaveRequests as dbGetAllLeaveRequests,
  updateLeaveRequestStatus as dbUpdateLeaveRequestStatus,
  getProfile
} from '@/lib/queries'

export async function createLeaveRequest(data: {
  leave_type: 'paid' | 'sick' | 'unpaid'
  start_date: string
  end_date: string
  remarks?: string | null
}) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    const leaveRequest = await dbCreateLeaveRequest(
      user.id,
      data.leave_type,
      data.start_date,
      data.end_date,
      data.remarks || null
    )

    revalidatePath('/leave')
    return leaveRequest
  } catch (error) {
    console.error('Error creating leave request:', error)
    throw new Error('Failed to create leave request. Please try again.')
  }
}

export async function getUserLeaveRequests() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  return await dbGetLeaveRequests(user.id)
}

export async function getAllLeaveRequestsList() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return await dbGetAllLeaveRequests()
}

export async function approveLeaveRequest(requestId: number, adminComment?: string) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const leaveRequest = await dbUpdateLeaveRequestStatus(requestId, 'approved', user.id, adminComment || null)
  revalidatePath('/leave')
  revalidatePath('/admin/leave')
  return leaveRequest
}

export async function rejectLeaveRequest(requestId: number, adminComment?: string) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const leaveRequest = await dbUpdateLeaveRequestStatus(requestId, 'rejected', user.id, adminComment || null)
  revalidatePath('/leave')
  revalidatePath('/admin/leave')
  return leaveRequest
}

