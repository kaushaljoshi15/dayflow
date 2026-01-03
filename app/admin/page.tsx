import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserProfile } from '@/app/actions/profile'
import { getAllLeaveRequestsList } from '@/app/actions/leave'

export default async function AdminDashboard() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let profile = null
  let leaveRequests: any[] = []
  let pendingLeaves = 0

  try {
    profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      redirect('/')
    }

    leaveRequests = await getAllLeaveRequestsList()
    pendingLeaves = leaveRequests.filter((l: any) => l.status === 'pending').length
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    redirect('/')
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/employees" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
          <div className="text-blue-600 text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-800 mb-1">Employees</h3>
          <p className="text-sm text-gray-500">Manage Employees</p>
        </Link>

        <Link href="/admin/attendance" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
          <div className="text-green-600 text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-800 mb-1">Attendance</h3>
          <p className="text-sm text-gray-500">View All Records</p>
        </Link>

        <Link href="/admin/leave" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer relative">
          {pendingLeaves > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {pendingLeaves}
            </span>
          )}
          <div className="text-purple-600 text-3xl mb-3">🏖️</div>
          <h3 className="font-semibold text-gray-800 mb-1">Leave Requests</h3>
          <p className="text-sm text-gray-500">Approve/Reject</p>
        </Link>

        <Link href="/admin/payroll" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
          <div className="text-yellow-600 text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-800 mb-1">Payroll</h3>
          <p className="text-sm text-gray-500">Manage Salaries</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending Leave Requests</p>
            <p className="text-2xl font-bold text-blue-600">{pendingLeaves}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

