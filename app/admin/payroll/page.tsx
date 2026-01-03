import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getAllPayrollRecords } from '@/app/actions/payroll'
import { getUserProfile } from '@/app/actions/profile'

export default async function AdminPayrollPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let profile = null
  let payrollRecords: any[] = []

  try {
    profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      redirect('/')
    }

    payrollRecords = await getAllPayrollRecords()
  } catch (error) {
    console.error('Error loading admin payroll:', error)
    redirect('/')
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payroll Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {payrollRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payroll records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Base Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Allowances</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Deductions</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Net Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                </tr>
              </thead>
              <tbody>
                {payrollRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{record.user_id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">${record.base_salary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600">+${record.allowances.toLocaleString()}</td>
                    <td className="py-3 px-4 text-red-600">-${record.deductions.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold">${record.net_salary.toLocaleString()}</td>
                    <td className="py-3 px-4 capitalize">{record.pay_period || 'Monthly'}</td>
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

