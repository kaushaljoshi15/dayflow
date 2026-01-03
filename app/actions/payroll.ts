'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import {
  getPayroll as dbGetPayroll,
  getAllPayroll as dbGetAllPayroll,
  createOrUpdatePayroll as dbCreateOrUpdatePayroll,
  getProfile
} from '@/lib/queries'

export async function getUserPayroll() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  return await dbGetPayroll(user.id)
}

export async function getAllPayrollRecords() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return await dbGetAllPayroll()
}

export async function createOrUpdatePayrollRecord(data: {
  user_id: string
  base_salary: number
  allowances: number
  deductions: number
  pay_period?: string | null
  effective_from: string
}) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const profile = await getProfile(user.id)
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  const payroll = await dbCreateOrUpdatePayroll(
    data.user_id,
    data.base_salary,
    data.allowances,
    data.deductions,
    data.pay_period || null,
    data.effective_from
  )

  revalidatePath('/admin/payroll')
  return payroll
}

