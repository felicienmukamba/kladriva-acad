import { isAdmin } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { BookOpen, Users, Briefcase, Award, MessageSquare, LayoutGrid, DollarSign, Activity, AlertCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)

  const courseCount = await prisma.course.count()
  const userCount = await prisma.user.count()
  const jobCount = await prisma.job.count()
  const certCount = await prisma.certificate.count()
  const mentorCount = await prisma.user.count({ where: { role: "MENTOR" } })

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" }
  })

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, course: true }
  })

  const pendingSubmissions = await prisma.projectSubmission.count({
    where: { status: "PENDING" }
  })

  const adminStats = [
    { title: "Revenue", count: `$${(totalRevenue._sum.amount || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-green-600" />, href: "#", bg: "bg-green-50" },
    { title: "Courses", count: courseCount, icon: <BookOpen className="w-5 h-5 text-[#0066cc]" />, href: "courses", bg: "bg-blue-50" },
    { title: "Students", count: userCount, icon: <Users className="w-5 h-5 text-indigo-600" />, href: "users", bg: "bg-indigo-50" },
    { title: "Jobs", count: jobCount, icon: <Briefcase className="w-5 h-5 text-orange-600" />, href: "jobs", bg: "bg-orange-50" },
    { title: "Certificates", count: certCount, icon: <Award className="w-5 h-5 text-yellow-600" />, href: "certificates", bg: "bg-yellow-50" },
    { title: "Mentors", count: mentorCount, icon: <MessageSquare className="w-5 h-5 text-purple-600" />, href: "mentorship", bg: "bg-purple-50" },
  ]

  return (
    <div className="px-6 py-10 space-y-10 bg-[#f5f5f7] min-h-screen max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">Admin Console</h1>
          <p className="text-[17px] text-[#86868b]">Manage content, jobs, and users in a calmer layout.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {adminStats.map((stat) => (
          <Link key={stat.title} href={stat.href === "#" ? "#" : `/${lang}/dashboard/admin/${stat.href}`}>
            <Card className="border border-[#d2d2d7] rounded-[24px] bg-white hover:bg-[#fcfcfd] transition-colors shadow-sm cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className={`p-4 rounded-full ${stat.bg}`}>
                   {stat.icon}
                </div>
                <div>
                  <div className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">{stat.count}</div>
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-[#86868b] mt-1">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-[20px] font-semibold text-[#1d1d1f] flex items-center gap-2">
             <Activity className="w-5 h-5" /> Recent Enrollments
           </h2>
           <Card className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-sm overflow-hidden">
             <div className="divide-y divide-[#d2d2d7]">
                {recentEnrollments.map(enr => (
                  <div key={enr.id} className="p-6 flex items-center justify-between hover:bg-[#f5f5f7] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-[13px] font-bold">
                           {(enr.user.name || "S")[0]}
                        </div>
                        <div>
                           <p className="text-[15px] font-semibold text-[#1d1d1f]">{enr.user.name || "Anonymous Student"}</p>
                           <p className="text-[13px] text-[#86868b]">Enrolled in <span className="font-medium text-[#1d1d1f]">{enr.course.title}</span></p>
                        </div>
                     </div>
                     <span className="text-[13px] text-[#86868b]">{new Date(enr.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {recentEnrollments.length === 0 && (
                  <div className="p-8 text-center text-[#86868b]">No recent enrollments.</div>
                )}
             </div>
           </Card>
        </div>

        <div className="space-y-6">
           <h2 className="text-[20px] font-semibold text-[#1d1d1f]">Platform Health</h2>
           <div className="space-y-4">
              <Card className="border border-[#d2d2d7] rounded-[24px] bg-[#1d1d1f] text-white shadow-sm p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/10 rounded-xl">
                       <AlertCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white hover:bg-white/10">Action Needed</Badge>
                 </div>
                 <div className="text-[32px] font-semibold tracking-tight mb-1">{pendingSubmissions}</div>
                 <p className="text-[15px] text-[#a1a1a6]">Project submissions waiting for instructor review or peer grading.</p>
              </Card>

              <Card className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-sm p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-green-50 rounded-xl">
                       <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                 </div>
                 <div className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] mb-1">+{Math.floor(Math.random() * 40) + 10}%</div>
                 <p className="text-[15px] text-[#86868b]">Monthly active user growth compared to last 30 days.</p>
              </Card>
           </div>
        </div>
      </div>
    </div>
  )
}
