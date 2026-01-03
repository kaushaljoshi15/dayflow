import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getAllLeaveRequestsList } from '@/app/actions/leave'
import { getUserProfile } from '@/app/actions/profile'
import { LeaveApprovalActions } from './leave-approval'

export default async function AdminLeavePage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let profile = null
  let leaveRequests: any[] = []

  try {
    profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      redirect('/')
    }

    leaveRequests = await getAllLeaveRequestsList()
  } catch (error) {
    console.error('Error loading admin leave page:', error)
    redirect('/')
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leave Request Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {leaveRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No leave requests</p>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <div key={leave.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-800 capitalize text-lg">
                        {leave.leave_type} Leave
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      <strong>Employee ID:</strong> {leave.user_id}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Dates:</strong> {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                    {leave.remarks && (
                      <p className="text-gray-600 mb-1">
                        <strong>Remarks:</strong> {leave.remarks}
                      </p>
                    )}
                    {leave.admin_comment && (
                      <div className="mt-2 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          <strong>Admin Comment:</strong> {leave.admin_comment}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Applied on {new Date(leave.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {leave.status === 'pending' && (
                    <LeaveApprovalActions requestId={leave.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

