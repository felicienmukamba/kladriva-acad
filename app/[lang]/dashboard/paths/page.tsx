import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Layers, ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"

export default async function EnrolledPathsPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params
  const session = await auth()
  
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const dict = await getDictionary(lang as "en" | "fr")

  const enrollments = await prisma.pathEnrollment.findMany({
    where: { userId: session.user.id! },
    include: {
      path: {
        include: {
          courses: {
            include: {
              course: {
                include: {
                  enrollments: {
                    where: { userId: session.user.id! }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  return (
    <div className="flex flex-col gap-10 py-10 px-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{dict.paths.title}</h1>
        <p className="text-slate-500 text-lg">{dict.paths.tagline}</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Layers className="w-16 h-16 text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No paths enrolled yet</h2>
          <p className="text-slate-500 mb-8">Choose a professional path to start your career transformation.</p>
          <Link href={`/${lang}/paths`}>
            <Button size="lg" className="rounded-xl font-bold">Browse Paths</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {enrollments.map((enrollment: any) => (
            <Card key={enrollment.id} className="overflow-hidden border-slate-200 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-4">
                <div className="bg-slate-900 p-8 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{enrollment.path.title}</h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Layers className="w-4 h-4" />
                      {enrollment.path.courses.length} Courses
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-8">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                       <span>Total Progress</span>
                       <span>{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2 bg-white/10" />
                  </div>
                </div>

                <div className="md:col-span-3 p-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Courses in this path</h4>
                  <div className="space-y-4">
                    {enrollment.path.courses.sort((a: any, b: any) => a.order - b.order).map((cp: any) => {
                      const courseEnrollment = cp.course.enrollments[0]
                      const courseProgress = courseEnrollment?.progress || 0
                      const isCourseCompleted = courseEnrollment?.isCompleted || false

                      return (
                        <div key={cp.courseId} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            {isCourseCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-slate-300" />
                            )}
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{cp.course.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={courseProgress} className="h-1 w-24 bg-slate-100" />
                                <span className="text-[10px] font-bold text-slate-400">{courseProgress}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <Link href={`/${lang}/dashboard/learning/${cp.courseId}`}>
                            <Button size="sm" variant="ghost" className="text-primary font-bold">
                              {isCourseCompleted ? "Review" : courseProgress > 0 ? "Continue" : "Start"}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
