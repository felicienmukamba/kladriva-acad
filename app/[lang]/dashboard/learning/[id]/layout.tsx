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
      <aside className="w-80 border-r flex flex-col h-full bg-slate-50 shrink-0 overflow-hidden">
        <div className="p-6 border-b bg-white">
          <Link 
            href={`/${lang}/dashboard/learning`} 
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h2 className="font-black text-lg leading-tight">{(enrollment as any).course.title}</h2>
          <div className="mt-4">
             <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                <span>Progress</span>
                <span>{(enrollment as any).progress}%</span>
             </div>
             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${(enrollment as any).progress}%` }} />
             </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {(enrollment as any).course.modules.map((module: any, mIdx: number) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                Module {mIdx + 1}: {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons.map((lesson: any, lIdx: number) => (
                  <Link 
                    key={lesson.id} 
                    href={`/${lang}/dashboard/learning/${id}?lesson=${lesson.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                  >
                    <div className="shrink-0">
                       <PlayCircle className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 line-clamp-1">
                      {lesson.title}
                    </span>
                  </Link>
                ))}
                {module.quiz && (
                   <Link 
                    href={`/${lang}/dashboard/learning/${id}?quiz=${module.quiz.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group bg-amber-50/50 border border-amber-100/50"
                  >
                    <div className="shrink-0">
                       <BookOpen className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-sm font-bold text-amber-700">
                      Module Quiz: {module.quiz.title}
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
