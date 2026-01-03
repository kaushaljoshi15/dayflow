// File: app/page.tsx
import { auth } from '@clerk/nextjs/server'
import { SignInButton } from '@clerk/nextjs'
// ✅ Correct import path (now that you renamed the file to actions.ts)
import { checkIn, checkOut } from '@/app/actions' 

type AttendanceRecord = {
  id: number
  check_in: string
  check_out: string | null
}

export default async function Home() {
  const { userId } = await auth() // ✅ Added 'await' which is required in newer Clerk versions

  // --- STATE 1: NOT LOGGED IN ---
  if (!userId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">Dayflow HRMS</h1>
        <p className="text-lg text-gray-600 mb-8">Please sign in to mark your attendance.</p>
        <SignInButton mode="modal">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
            Sign In with Clerk
          </button>
        </SignInButton>
      </main>
    )
  }

  // --- STATE 2: LOGGED IN (DASHBOARD) ---
  // Database removed - using placeholder data
  // When database is re-implemented, replace null with actual query result
  const todayRecord = null as AttendanceRecord | null

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Today's Overview</h2>
          <p className="text-gray-500">{new Date().toDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Mark Attendance</h3>
            
            {(() => {
              if (!todayRecord || !todayRecord.check_in) {
                return (
                  <form action={checkIn}>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition shadow-md text-lg">
                      Clock In ⏱️
                    </button>
                  </form>
                )
              }
              
              const record = todayRecord
              if (record.check_out) {
                return (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-800 font-bold text-xl">✅ Shift Completed</p>
                    <p className="text-green-600 text-sm mt-1">
                      Clocked out at {new Date(record.check_out).toLocaleTimeString()}
                    </p>
                  </div>
                )
              }
              
              return (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                     <p className="text-blue-800 font-medium">
                       Clocked In at {new Date(record.check_in).toLocaleTimeString()}
                     </p>
                  </div>
                  {/* Using bind to pass the ID to the server action */}
                  <form action={checkOut.bind(null, record.id)}>
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition shadow-md">
                      Clock Out 🛑
                    </button>
                  </form>
                </div>
              )
            })()}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Leave Balance</h3>
            <div className="text-4xl font-bold text-gray-900 mb-1">12</div>
            <p className="text-gray-500 text-sm">Days Available</p>
            <button className="mt-6 text-blue-600 font-medium hover:underline text-sm">
              Apply for Leave &rarr;
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}