"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { StudentDashboard } from "@/components/dashboard/StudentDashboard"
import { MentorDashboard } from "@/components/dashboard/MentorDashboard"
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    )
  }

  const role = session?.user?.role || "STUDENT"

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {role === "ADMIN" || role === "INSTRUCTOR" ? (
        <AdminDashboard />
      ) : role === "MENTOR" ? (
        <MentorDashboard />
      ) : role === "COMPANY" ? (
        <CompanyDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  )
}
