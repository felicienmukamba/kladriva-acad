import { isAdmin } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Briefcase, Award, MessageSquare, LayoutGrid } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)

  const adminStats = [
    { title: "Courses", count: "12", icon: <BookOpen />, href: "courses", color: "bg-blue-500" },
    { title: "Students", count: "1,240", icon: <Users />, href: "users", color: "bg-emerald-500" },
    { title: "Jobs", count: "45", icon: <Briefcase />, href: "jobs", color: "bg-amber-500" },
    { title: "Certificates", count: "890", icon: <Award />, href: "certificates", color: "bg-indigo-500" },
    { title: "Mentorship", count: "24", icon: <MessageSquare />, href: "mentorship", color: "bg-rose-500" },
    { title: "Dashboard", count: "Manage", icon: <LayoutGrid />, href: "/", color: "bg-slate-500" },
  ]

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Admin Console</h1>
          <p className="text-sm text-slate-600">Manage content, jobs, and users in a calmer layout.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminStats.map((stat) => (
          <Link key={stat.title} href={`/${lang}/dashboard/admin/${stat.href}`}>
            <Card className="apple-surface group cursor-pointer overflow-hidden border-black/6 bg-white hover:shadow-apple-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-2xl text-white ${stat.color} group-hover:scale-110 transition-transform`}>
                   {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{stat.count}</div>
                <p className="text-xs text-slate-600 mt-1">Open section</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
