import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getAllAttendanceRecords } from '@/app/actions/attendance'
import { getUserProfile } from '@/app/actions/profile'

export default async function AdminAttendancePage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let profile = null
  let attendance: any[] = []

  try {
    profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      redirect('/')
    }

    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

    attendance = await getAllAttendanceRecords(firstDay, lastDay)
  } catch (error) {
    console.error('Error loading admin attendance:', error)
    redirect('/')
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Attendance Records</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Check In</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Check Out</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No attendance records found for this month
                  </td>
                </tr>
              ) : (
                attendance.map((record) => {
                  const checkIn = record.check_in ? new Date(record.check_in) : null
                  const checkOut = record.check_out ? new Date(record.check_out) : null
                  const hours = checkIn && checkOut 
                    ? ((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(1)
                    : '-'

                  return (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{record.user_id.substring(0, 8)}...</td>
                      <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {checkIn ? checkIn.toLocaleTimeString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {checkOut ? checkOut.toLocaleTimeString() : '-'}
                      </td>
                      <td className="py-3 px-4">{hours} {hours !== '-' && 'hrs'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

