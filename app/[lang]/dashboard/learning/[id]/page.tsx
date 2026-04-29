import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { QuizView } from "@/components/learning/QuizView"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, Award, ChevronLeft, Sparkles, Download } from "lucide-react"
import { completeLesson, submitQuiz } from "@/app/actions/learning"
import { CertificateDownload } from "@/components/certificates/CertificateDownload"
import { CourseForum } from "@/components/learning/CourseForum"
import ReactMarkdown from "react-markdown"

export default async function LearningPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; id: string }>
  searchParams: Promise<{ lesson?: string; quiz?: string }>
}) {
  const { lang, id } = await params
  const { lesson: lessonId, quiz: quizId } = await searchParams
  const session = await auth()

  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id!, courseId: id } },
    include: { user: true, course: true }
  })

  if (!enrollment) redirect(`/${lang}/courses/${id}`)

  // Handle Quiz View
  if (quizId) {
    const quiz = await (prisma as any).quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    })

    if (!quiz) return <div>Quiz not found</div>

    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <QuizView 
          quiz={quiz} 
          onComplete={async (score, passed) => {
            "use server"
            await submitQuiz(enrollment.id, quiz.id, score, passed)
          }}
        />
      </div>
    )
  }

  // Handle Lesson View
  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    })

    if (!lesson) return <div>Lesson not found</div>

    const forum = await prisma.forum.findUnique({
      where: { courseId: id },
      include: {
        threads: {
          include: { author: true, comments: { include: { user: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    })
    const threads = forum?.threads || []

    return (
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-10">
        {/* Lesson Header & Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest w-fit">
                <CheckCircle2 className="w-3 h-3" /> Micro-Learning Module
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{lesson.title}</h1>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-slate-400 mb-2">Progression du Module</div>
              <div className="flex items-center gap-3">
                 <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                 </div>
                 <span className="text-xs font-bold text-white">65%</span>
              </div>
            </div>
          </div>

          {/* Video Player with Glassmorphism */}
          {lesson.videoUrl && (
            <div className="group relative aspect-video bg-slate-900 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl transition-all hover:border-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <iframe 
                src={lesson.videoUrl.replace("watch?v=", "embed/")} 
                className="w-full h-full border-0 relative z-0"
                allowFullScreen
                title={lesson.title}
                suppressHydrationWarning
              />
            </div>
          )}
        </div>

        {/* Lesson Content */}
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <div className="prose prose-invert prose-slate max-w-none 
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg
              prose-strong:text-white prose-code:text-indigo-300 prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-800">
              <ReactMarkdown>
                {lesson.content || "No content available for this lesson yet."}
              </ReactMarkdown>
            </div>

            <div className="pt-10 border-t border-slate-800 flex items-center justify-between">
              <Button variant="ghost" className="text-slate-400 hover:text-white gap-2">
                <ChevronLeft className="w-4 h-4" /> Leçon Précédente
              </Button>
              <form action={async () => {
                "use server"
                await completeLesson(enrollment.id, lesson.id)
              }}>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]">
                  Marquer comme complété
                </Button>
              </form>
            </div>

            <div className="bg-slate-900/50 rounded-[32px] p-8 border border-slate-800">
               <CourseForum courseId={id} threads={threads} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-900/20">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold">Défi de Code</h4>
               </div>
               <p className="text-sm text-indigo-100 mb-6">
                  Prêt à pratiquer ? Ouvrez le sandbox pour tester les concepts vus dans cette vidéo.
               </p>
               <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl h-11">
                  Ouvrir le Sandbox
               </Button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
               <h4 className="font-bold text-white mb-4">Ressources</h4>
               <div className="space-y-3">
                  {["Code Source (GitHub)", "Documentation PDF", "Checklist Architecture"].map(res => (
                    <div key={res} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group">
                       <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{res}</span>
                       <Download className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  ))}
               </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  // Course Completion / Welcome View
  if ((enrollment as any).isCompleted) {
    const certificate = await (prisma as any).certificate.findUnique({
      where: { userId_courseId: { userId: session.user.id!, courseId: id } }
    })

    return (
      <div className="max-w-4xl mx-auto py-24 px-8 text-center space-y-12 h-full flex flex-col justify-center items-center">
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-4">
            <Award className="w-12 h-12 text-[#1d1d1f]" />
          </div>
          <h1 className="text-[48px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">Course Completed</h1>
          <p className="text-[20px] text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            Amazing work! You've successfully finished <strong>{enrollment.course.title}</strong>. 
            Your hard work and dedication have paid off.
          </p>
        </div>

        {certificate && (
          <div className="mt-8">
            <CertificateDownload 
              data={{
                userName: enrollment.user.name || "Student",
                courseName: enrollment.course.title,
                date: certificate.issuedAt,
                certificateCode: certificate.code
              }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-24 px-8 text-center space-y-8 h-full flex flex-col justify-center items-center">
      <div className="w-24 h-24 bg-[#f5f5f7] rounded-full flex items-center justify-center">
        <PlayCircle className="w-12 h-12 text-[#1d1d1f]" />
      </div>
      <div className="space-y-4">
        <h1 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f]">Ready to start?</h1>
        <p className="text-[20px] text-[#86868b] max-w-md mx-auto leading-relaxed">
          Select a lesson from the sidebar to begin.
        </p>
      </div>
    </div>
  )
}
