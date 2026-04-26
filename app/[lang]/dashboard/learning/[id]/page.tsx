import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { QuizView } from "@/components/learning/QuizView"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, Award } from "lucide-react"
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
      <div className="max-w-4xl mx-auto py-16 px-8 space-y-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[13px] text-[#86868b] font-medium uppercase tracking-wider">
             <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> Video Lesson</span>
             <span className="w-1 h-1 bg-[#d2d2d7] rounded-full"></span>
             <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Part of Module</span>
          </div>
          <h1 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] leading-tight">{lesson.title}</h1>
        </div>

        {lesson.videoUrl && (
          <div className="aspect-video bg-black rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative">
            <iframe 
              src={lesson.videoUrl.replace("watch?v=", "embed/")} 
              className="w-full h-full border-0"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-p:text-[#1d1d1f] prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#1d1d1f] prose-a:text-[#0066cc] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1d1d1f] prose-ul:text-[#1d1d1f] prose-li:marker:text-[#86868b]">
          <ReactMarkdown>
            {lesson.content || "No content available for this lesson yet."}
          </ReactMarkdown>
        </div>

        <div className="pt-12 border-t border-[#d2d2d7] flex justify-end">
          <form action={async () => {
            "use server"
            await completeLesson(enrollment.id, lesson.id)
          }}>
            <Button size="lg" className="bg-[#0066cc] hover:bg-[#0055b3] text-white font-medium px-8 h-12 rounded-full transition-all active:scale-[0.98]">
              Mark as Completed
            </Button>
          </form>
        </div>

        <CourseForum courseId={id} threads={threads} />
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
