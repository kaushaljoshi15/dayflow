import pool, { isDatabaseAvailable } from './db'

export interface Profile {
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
  created_at: Date
  updated_at: Date
}

export interface Attendance {
  id: number
  user_id: string
  date: string
  check_in: string | null
  check_out: string | null
  status: 'present' | 'absent' | 'half-day' | 'leave'
  notes: string | null
  created_at: Date
}

export interface LeaveRequest {
  id: number
  user_id: string
  leave_type: 'paid' | 'sick' | 'unpaid'
  start_date: string
  end_date: string
  remarks: string | null
  status: 'pending' | 'approved' | 'rejected'
  approved_by: string | null
  admin_comment: string | null
  created_at: Date
  updated_at: Date
}

export interface Payroll {
  id: number
  user_id: string
  base_salary: number
  allowances: number
  deductions: number
  net_salary: number
  pay_period: string | null
  effective_from: string
  effective_to: string | null
  created_at: Date
  updated_at: Date
}

// --- PROFILE FUNCTIONS ---

export async function getOrCreateProfile(userId: string, email: string, fullName: string): Promise<Profile | null> {
  if (!isDatabaseAvailable() || !pool) {
    console.warn('⚠️ Database not available, skipping profile creation.')
    return null
  }

  try {
    // 1. Try to find the user
    const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [userId])
    
    if (result.rows.length > 0) {
      return result.rows[0]
    }
    
    // 2. If not found, create new user
    console.log(`👤 Creating new profile for ${email}...`)
    const insertResult = await pool.query(
      `INSERT INTO profiles (id, email, full_name, role)
       VALUES ($1, $2, $3, 'employee')
       RETURNING *`,
      [userId, email, fullName]
    )
    
    return insertResult.rows[0]

  } catch (error: any) {
    // 👇 FIX: Log the RAW error so you can see the real message in the console
    console.error('❌ Database Error in getOrCreateProfile:', error)
    return null
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isDatabaseAvailable() || !pool) return null

  try {
    const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [userId])
    return result.rows[0] || null
  } catch (error: any) {
    console.error('❌ Error fetching profile:', error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  if (!isDatabaseAvailable() || !pool) {
    throw new Error('Database not available')
  }

  const allowedFields = ['phone', 'address', 'profile_picture_url', 'department', 'position']
  const fields = Object.keys(updates).filter(key => allowedFields.includes(key))
  
  if (fields.length === 0) {
    throw new Error('No valid fields to update')
  }
  
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
  const values = [userId, ...fields.map(field => updates[field as keyof Profile])]
  
  try {
    const result = await pool.query(
      `UPDATE profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error updating profile:', error)
    throw error
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (!isDatabaseAvailable() || !pool) return []
  try {
    const result = await pool.query('SELECT * FROM profiles ORDER BY full_name')
    return result.rows
  } catch (error) {
    console.error('❌ Error getting all profiles:', error)
    return []
  }
}

// --- ATTENDANCE FUNCTIONS ---

export async function getTodayAttendance(userId: string): Promise<Attendance | null> {
  if (!isDatabaseAvailable() || !pool) return null
  try {
    const today = new Date().toISOString().split('T')[0]
    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND date = $2',
      [userId, today]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('❌ Error getting today attendance:', error)
    return null
  }
}

export async function checkIn(userId: string): Promise<Attendance> {
  if (!isDatabaseAvailable() || !pool) throw new Error('Database not available')
  try {
    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()
    
    const result = await pool.query(
      `INSERT INTO attendance (user_id, date, check_in, status)
       VALUES ($1, $2, $3, 'present')
       ON CONFLICT (user_id, date) 
       DO UPDATE SET check_in = $3, status = 'present'
       RETURNING *`,
      [userId, today, now]
    )
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error checking in:', error)
    throw error
  }
}

export async function checkOut(attendanceId: number): Promise<Attendance> {
  if (!isDatabaseAvailable() || !pool) throw new Error('Database not available')
  try {
    const now = new Date().toISOString()
    const result = await pool.query(
      'UPDATE attendance SET check_out = $1 WHERE id = $2 RETURNING *',
      [now, attendanceId]
    )
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error checking out:', error)
    throw error
  }
}

export async function getAttendanceByDateRange(userId: string, startDate: string, endDate: string): Promise<Attendance[]> {
  if (!isDatabaseAvailable() || !pool) return []
  try {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC',
      [userId, startDate, endDate]
    )
    return result.rows
  } catch (error) {
    console.error('❌ Error getting attendance range:', error)
    return []
  }
}

export async function getAllAttendance(startDate?: string, endDate?: string): Promise<Attendance[]> {
  if (!isDatabaseAvailable() || !pool) return []
  try {
    if (startDate && endDate) {
      const result = await pool.query(
        'SELECT * FROM attendance WHERE date BETWEEN $1 AND $2 ORDER BY date DESC, user_id',
        [startDate, endDate]
      )
      return result.rows
    }
    const result = await pool.query('SELECT * FROM attendance ORDER BY date DESC, user_id')
    return result.rows
  } catch (error) {
    console.error('❌ Error getting all attendance:', error)
    return []
  }
}

// --- LEAVE REQUEST FUNCTIONS ---

export async function createLeaveRequest(
  userId: string,
  leaveType: 'paid' | 'sick' | 'unpaid',
  startDate: string,
  endDate: string,
  remarks: string | null
): Promise<LeaveRequest> {
  if (!isDatabaseAvailable() || !pool) throw new Error('Database not available')
  try {
    const result = await pool.query(
      `INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, remarks)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, leaveType, startDate, endDate, remarks]
    )
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error creating leave request:', error)
    throw error
  }
}

export async function getLeaveRequests(userId: string): Promise<LeaveRequest[]> {
  if (!isDatabaseAvailable() || !pool) return []
  try {
    const result = await pool.query(
      'SELECT * FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error('❌ Error getting leave requests:', error)
    return []
  }
}

export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  if (!isDatabaseAvailable() || !pool) return []
  try {
    const result = await pool.query(
      'SELECT * FROM leave_requests ORDER BY created_at DESC'
    )
    return result.rows
  } catch (error) {
    console.error('❌ Error getting all leave requests:', error)
    return []
  }
}

export async function updateLeaveRequestStatus(
  requestId: number,
  status: 'approved' | 'rejected',
  approvedBy: string,
  adminComment: string | null
): Promise<LeaveRequest> {
  if (!isDatabaseAvailable() || !pool) throw new Error('Database not available')
  try {
    const result = await pool.query(
      `UPDATE leave_requests 
       SET status = $1, approved_by = $2, admin_comment = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [status, approvedBy, adminComment, requestId]
    )
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error updating leave request:', error)
    throw error
  }
}

// --- PAYROLL FUNCTIONS ---

export async function getPayroll(userId: string): Promise<Payroll | null> {
  if (!isDatabaseAvailable() || !pool) return null
  try {
    const result = await pool.query(
      `SELECT * FROM payroll 
       WHERE user_id = $1 
       AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
       ORDER BY effective_from DESC
       LIMIT 1`,
      [userId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('❌ Error getting payroll:', error)
    return null
  }
}

export async function getAllPayroll(): Promise<Payroll[]> {
  if (!isDatabaseAvailable() || !pool) return []
  try {
    const result = await pool.query(
      `SELECT * FROM payroll 
       WHERE (effective_to IS NULL OR effective_to >= CURRENT_DATE)
       ORDER BY user_id, effective_from DESC`
    )
    return result.rows
  } catch (error) {
    console.error('❌ Error getting all payroll:', error)
    return []
  }
}

export async function createOrUpdatePayroll(
  userId: string,
  baseSalary: number,
  allowances: number,
  deductions: number,
  payPeriod: string | null,
  effectiveFrom: string
): Promise<Payroll> {
  if (!isDatabaseAvailable() || !pool) throw new Error('Database not available')
  
  const netSalary = baseSalary + allowances - deductions
  
  try {
    // End previous payroll record
    await pool.query(
      'UPDATE payroll SET effective_to = $1 WHERE user_id = $2 AND effective_to IS NULL',
      [effectiveFrom, userId]
    )
    
    // Create new payroll record
    const result = await pool.query(
      `INSERT INTO payroll (user_id, base_salary, allowances, deductions, net_salary, pay_period, effective_from)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, baseSalary, allowances, deductions, netSalary, payPeriod, effectiveFrom]
    )
    
    return result.rows[0]
  } catch (error) {
    console.error('❌ Error updating payroll:', error)
    throw error
  }
}