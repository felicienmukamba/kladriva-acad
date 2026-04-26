import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CheckCircle2, PlayCircle, Lock, BookOpen } from "lucide-react"

export default async function CourseLearningLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string; id: string }>
}) {
  const { lang, id } = await params
  const session = await auth()

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`)
  }

  const enrollment = await (prisma as any).enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id!,
        courseId: id,
      },
    },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: { orderBy: { order: "asc" } },
              quiz: true
            },
          },
        },
      },
    },
  })

  if (!enrollment) {
    redirect(`/${lang}/courses/${id}`)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Navigation */}
      <aside className="w-[320px] border-r border-[#d2d2d7] flex flex-col h-full bg-[#f5f5f7] shrink-0 overflow-hidden">
        <div className="p-6 border-b border-[#d2d2d7] bg-[#f5f5f7]">
          <Link 
            href={`/${lang}/dashboard/learning`} 
            className="flex items-center gap-2 text-[13px] font-medium text-[#0066cc] hover:underline mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h2 className="font-semibold text-[20px] text-[#1d1d1f] leading-tight line-clamp-2">{(enrollment as any).course.title}</h2>
          <div className="mt-6">
             <div className="flex justify-between text-[11px] font-semibold text-[#86868b] mb-2 uppercase tracking-wider">
                <span>Progress</span>
                <span>{(enrollment as any).progress}%</span>
             </div>
             <div className="w-full bg-[#d2d2d7] h-[4px] rounded-full overflow-hidden">
                <div className="bg-[#1d1d1f] h-full transition-all duration-500" style={{ width: `${(enrollment as any).progress}%` }} />
             </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
          {(enrollment as any).course.modules.map((module: any, mIdx: number) => (
            <div key={module.id} className="space-y-3">
              <h3 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider px-3">
                Module {mIdx + 1}: {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons.map((lesson: any) => (
                  <Link 
                    key={lesson.id} 
                    href={`/${lang}/dashboard/learning/${id}?lesson=${lesson.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8e8ed] transition-colors group"
                  >
                    <div className="shrink-0">
                       <PlayCircle className="w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f]" />
                    </div>
                    <span className="text-[14px] font-medium text-[#1d1d1f] line-clamp-1">
                      {lesson.title}
                    </span>
                  </Link>
                ))}
                {module.quiz && (
                   <Link 
                    href={`/${lang}/dashboard/learning/${id}?quiz=${module.quiz.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8e8ed] transition-colors group mt-2"
                  >
                    <div className="shrink-0">
                       <BookOpen className="w-4 h-4 text-[#0066cc]" />
                    </div>
                    <span className="text-[14px] font-medium text-[#0066cc]">
                      Quiz: {module.quiz.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white no-scrollbar">
        {children}
      </main>
    </div>
  )
}
