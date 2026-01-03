import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserLeaveRequests } from '@/app/actions/leave'
import { LeaveRequestForm } from './leave-form'

export default async function LeavePage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let leaveRequests: any[] = []
  try {
    leaveRequests = await getUserLeaveRequests()
  } catch (error) {
    console.error('Error loading leave requests:', error)
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leave Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Apply for Leave</h2>
            <LeaveRequestForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Leave Requests</h2>
            
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No leave requests yet</p>
            ) : (
              <div className="space-y-4">
                {leaveRequests.map((leave) => (
                  <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize">{leave.leave_type} Leave</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                        </p>
                        {leave.remarks && (
                          <p className="text-sm text-gray-500 mt-1">{leave.remarks}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    {leave.admin_comment && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Admin Comment:</strong> {leave.admin_comment}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Applied on {new Date(leave.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

