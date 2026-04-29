import * as React from "react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { StudentDashboard } from "@/components/dashboard/StudentDashboard"
import { MentorDashboard } from "@/components/dashboard/MentorDashboard"
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`)
  }

  const role = session.user.role || "STUDENT"
  const userId = session.user.id!

  // Fetch role-specific data
  let dashboardData: any = {}

  if (role === "STUDENT") {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: "desc" }
    })
    const certificates = await prisma.certificate.count({ where: { userId } })
    const projects = await prisma.projectSubmission.count({ where: { userId } })
    
    dashboardData = { enrollments, certificates, projects }
  } else if (role === "MENTOR") {
    const sessions = await prisma.mentorshipSession.findMany({
      where: { mentorId: userId },
      include: { mentee: true },
      orderBy: { date: "asc" }
    })
    const uniqueMentees = await prisma.mentorshipSession.groupBy({
      by: ['menteeId'],
      where: { mentorId: userId }
    })
    dashboardData = { 
      sessions, 
      menteesCount: uniqueMentees.length,
      rating: 4.9 // Mock for now until we have reviews in DB
    }
  } else if (role === "ADMIN" || role === "INSTRUCTOR") {
    const stats = {
      users: await prisma.user.count(),
      courses: await prisma.course.count(),
      enrollments: await prisma.enrollment.count(),
      revenue: await prisma.payment.aggregate({ _sum: { amount: true } })
    }
    dashboardData = { stats }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {role === "ADMIN" || role === "INSTRUCTOR" ? (
        <AdminDashboard data={dashboardData} />
      ) : role === "MENTOR" ? (
        <MentorDashboard data={dashboardData} />
      ) : role === "COMPANY" ? (
        <CompanyDashboard data={dashboardData} />
      ) : (
        <StudentDashboard data={dashboardData} />
      )}
    </div>
  )
}
