import { isAdmin } from "@/lib/permissions"
import { CourseForm } from "@/components/admin/CourseForm"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function NewCoursePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <Link href={`/${lang}/dashboard/admin/courses`} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Courses
      </Link>
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Create course</h1>
          <p className="text-sm text-slate-600">Fill in the details to publish a new program.</p>
        </div>
      </div>
      <div className="apple-surface bg-white p-6 sm:p-8">
        <CourseForm />
      </div>
    </div>
  )
}
