import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { QuizView } from "@/components/learning/QuizView"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, Award } from "lucide-react"
import { completeLesson, submitQuiz } from "@/app/actions/learning"
import { CertificateDownload } from "@/components/certificates/CertificateDownload"

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

    return (
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
             <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> Video Lesson</span>
             <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Part of Module</span>
          </div>
        </div>

        {lesson.videoUrl && (
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
            <iframe 
              src={lesson.videoUrl.replace("watch?v=", "embed/")} 
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed">
            {lesson.content || "No content available for this lesson yet."}
          </p>
        </div>

        <div className="pt-10 border-t flex justify-end">
          <form action={async () => {
            "use server"
            await completeLesson(enrollment.id, lesson.id)
          }}>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 h-14 rounded-2xl shadow-xl shadow-emerald-600/20 gap-2">
              <CheckCircle2 className="w-5 h-5" /> Mark as Completed
            </Button>
          </form>
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
      <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-12 h-full flex flex-col justify-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-black tracking-tight">Course Completed!</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Amazing work! You've successfully finished <strong>{enrollment.course.title}</strong>. 
            Your hard work and dedication have paid off.
          </p>
        </div>

        {certificate && (
          <CertificateDownload 
            data={{
              userName: enrollment.user.name || "Student",
              courseName: enrollment.course.title,
              date: certificate.issuedAt,
              certificateCode: certificate.code
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-8 h-full flex flex-col justify-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <PlayCircle className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl font-black">Ready to start?</h1>
      <p className="text-xl text-slate-500 max-w-md mx-auto">
        Select a lesson from the sidebar to begin your transformation journey.
      </p>
    </div>
  )
}
