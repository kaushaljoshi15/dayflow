import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserPayroll } from '@/app/actions/payroll'

export default async function PayrollPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let payroll = null
  try {
    payroll = await getUserPayroll()
  } catch (error) {
    console.error('Error loading payroll:', error)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payroll Information</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {!payroll ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payroll information available</p>
            <p className="text-gray-400 text-sm mt-2">Please contact HR for salary details</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Base Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${payroll.base_salary.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Allowances</p>
                <p className="text-2xl font-bold text-green-700">
                  +${payroll.allowances.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Deductions</p>
                <p className="text-2xl font-bold text-red-700">
                  -${payroll.deductions.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                <p className="text-2xl font-bold text-purple-700">
                  ${payroll.net_salary.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Pay Period</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {payroll.pay_period || 'Monthly'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Effective From</p>
                  <p className="font-medium text-gray-900">
                    {new Date(payroll.effective_from).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

