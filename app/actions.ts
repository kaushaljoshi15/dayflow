'use server'
import { createAdminClient } from '@/utils/supabase/admin'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function checkIn() {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const supabase = createAdminClient()

  // 1. Sync User
  const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
  
  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      full_name: `${user.firstName} ${user.lastName}`,
      role: 'employee'
    })
  }

  // 2. Mark Attendance
  await supabase.from('attendance').insert({
    user_id: user.id,
    check_in: new Date().toISOString(),
    status: 'present'
  })
  
  revalidatePath('/')
}

export async function checkOut(attendanceId: number) {
  const supabase = createAdminClient()
  await supabase.from('attendance').update({
    check_out: new Date().toISOString()
  }).eq('id', attendanceId)
  
  revalidatePath('/')
}