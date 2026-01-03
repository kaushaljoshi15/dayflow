import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateProfile, getTodayAttendance, getLeaveRequests } from '@/lib/queries'
import Link from 'next/link'
import { Calendar, Clock, DollarSign, User, Briefcase, PlayCircle, StopCircle, Bell } from 'lucide-react'
import { checkIn, checkOut } from '@/app/actions/attendance'

export default async function Home() {
  const user = await currentUser()

  // 1. Auth Check
  if (!user) {
    return redirect('/sign-in')
  }

  // 2. Database Sync
  const profile = await getOrCreateProfile(
    user.id, 
    user.emailAddresses[0].emailAddress, 
    `${user.firstName} ${user.lastName}`
  )

  if (!profile) {
    return <div className="p-8 text-red-500 bg-red-50 m-8 rounded-xl border border-red-200">Database Connection Error. Please verify .env settings.</div>
  }

  // 3. Admin Redirect
  if (profile.role === 'admin') {
    redirect('/admin')
  }

  // 4. Load Data
  const todayRecord = await getTodayAttendance(user.id)
  const leaveRequests = await getLeaveRequests(user.id)
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length

  // Helper for greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-950">
            {greeting}, {profile.full_name} 👋
          </h1>
          <p className="text-indigo-500/80 mt-1 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-sm shadow-indigo-100/50">
           <div className={`w-2 h-2 rounded-full ${todayRecord?.check_in && !todayRecord?.check_out ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-200'}`}></div>
           <span className="text-sm font-medium text-indigo-600">
             {todayRecord?.check_in && !todayRecord?.check_out ? 'Currently Active' : 'Offline'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Actions & Attendance */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard 
              href="/profile" 
              icon={<User className="w-6 h-6 text-indigo-600" />} 
              title="Profile" 
              subtitle="Personal Info"
              color="indigo"
            />
            <DashboardCard 
              href="/attendance" 
              icon={<Calendar className="w-6 h-6 text-violet-600" />} 
              title="Attendance" 
              subtitle="View History"
              color="violet"
            />
            <DashboardCard 
              href="/leave" 
              icon={<Briefcase className="w-6 h-6 text-pink-600" />} 
              title="Leaves" 
              subtitle="Apply Time Off"
              notification={pendingLeaves}
              color="pink"
            />
            <DashboardCard 
              href="/payroll" 
              icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
              title="Payroll" 
              subtitle="Salary Slips"
              color="emerald"
            />
          </div>

          {/* Time Tracker */}
          <div className="bg-white rounded-2xl p-8 border border-indigo-100 shadow-xl shadow-indigo-100/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-100/50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-indigo-950 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Time Tracker
              </h2>

              {!todayRecord || !todayRecord.check_in ? (
                <form action={checkIn} className="w-full flex justify-center">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-4 px-12 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-3 w-full md:w-auto justify-center">
                    <PlayCircle className="w-6 h-6" /> Clock In for the Day
                  </button>
                </form>
              ) : todayRecord.check_out ? (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-900">Shift Completed</h3>
                  <div className="flex justify-center gap-6 mt-2 text-sm text-emerald-700">
                    <span>In: {new Date(todayRecord.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>•</span>
                    <span>Out: {new Date(todayRecord.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-1">Current Session</p>
                      <p className="text-3xl font-bold text-indigo-950">
                        {new Date(todayRecord.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        <span className="text-lg text-indigo-300 font-normal ml-2">Start Time</span>
                      </p>
                    </div>
                    <form action={checkOut.bind(null, todayRecord.id)}>
                      <button className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2">
                        <StopCircle className="w-5 h-5" />
                        End Shift
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar / Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/20 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-indigo-950 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" /> Recent Updates
              </h2>
              <Link href="/leave" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-6">
              {leaveRequests.length > 0 ? (
                leaveRequests.slice(0, 3).map((leave) => (
                  <div key={leave.id} className="relative pl-6 border-l-2 border-indigo-50 last:border-0 pb-2">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ring-1 ${
                      leave.status === 'approved' ? 'bg-emerald-500 ring-emerald-100' :
                      leave.status === 'rejected' ? 'bg-red-500 ring-red-100' :
                      'bg-amber-400 ring-amber-100'
                    }`}></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-indigo-900 capitalize">{leave.leave_type} Request</p>
                        <p className="text-xs text-indigo-400 mt-1">
                          {new Date(leave.start_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </p>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        leave.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        leave.status === 'rejected' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
                    <Briefcase className="w-5 h-5 text-indigo-300" />
                  </div>
                  <p className="text-indigo-400 text-sm">No recent activity.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <h4 className="font-semibold text-sm mb-1">Did you know?</h4>
              <p className="text-indigo-100 text-xs leading-relaxed">
                You can download your payslips directly from the Payroll section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ href, icon, title, subtitle, notification, color }: any) {
  const colorMap: any = {
    indigo: "group-hover:border-indigo-300 group-hover:shadow-indigo-100",
    violet: "group-hover:border-violet-300 group-hover:shadow-violet-100",
    pink: "group-hover:border-pink-300 group-hover:shadow-pink-100",
    emerald: "group-hover:border-emerald-300 group-hover:shadow-emerald-100",
  }

  return (
    <Link 
      href={href} 
      className={`bg-white p-5 rounded-2xl border border-indigo-50 shadow-sm shadow-indigo-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative ${colorMap[color]}`}
    >
      {notification > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm z-10 animate-bounce">
          {notification}
        </span>
      )}
      <div className="mb-4 bg-indigo-50/50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-indigo-950 mb-0.5">{title}</h3>
      <p className="text-xs text-indigo-400 font-medium">{subtitle}</p>
    </Link>
  )
}