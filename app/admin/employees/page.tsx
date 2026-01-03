import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getAllUserProfiles } from '@/app/actions/profile'
import { getUserProfile } from '@/app/actions/profile'

export default async function AdminEmployeesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let profile = null
  let employees: any[] = []

  try {
    profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      redirect('/')
    }

    employees = await getAllUserProfiles()
  } catch (error) {
    console.error('Error loading admin employees:', error)
    redirect('/')
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No employees found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{emp.employee_id || emp.id.substring(0, 8)}</td>
                    <td className="py-3 px-4 font-medium">{emp.full_name || 'N/A'}</td>
                    <td className="py-3 px-4">{emp.email}</td>
                    <td className="py-3 px-4">{emp.department || '-'}</td>
                    <td className="py-3 px-4">{emp.position || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        emp.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

