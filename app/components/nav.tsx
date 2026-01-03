import { getUserProfile } from '@/app/actions/profile'

export async function Nav() {
  try {
    const profile = await getUserProfile()
    const isAdmin = profile?.role === 'admin'

    return (
      <nav className="hidden md:flex gap-4 items-center">
        {isAdmin && (
          <a href="/admin" className="text-gray-600 hover:text-gray-900 font-medium transition px-2 py-1 rounded hover:bg-gray-100">
            Admin
          </a>
        )}
        <a href="/" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Dashboard</a>
        <a href="/profile" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Profile</a>
        <a href="/attendance" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Attendance</a>
        <a href="/leave" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Leave</a>
        <a href="/payroll" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Payroll</a>
      </nav>
    )
  } catch (error) {
    // If database is not configured, show navigation without admin link
    console.error('Error loading nav:', error)
    return (
      <nav className="hidden md:flex gap-4 items-center">
        <a href="/" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Dashboard</a>
        <a href="/profile" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Profile</a>
        <a href="/attendance" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Attendance</a>
        <a href="/leave" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Leave</a>
        <a href="/payroll" className="text-gray-600 hover:text-gray-900 transition px-2 py-1 rounded hover:bg-gray-100">Payroll</a>
      </nav>
    )
  }
}

