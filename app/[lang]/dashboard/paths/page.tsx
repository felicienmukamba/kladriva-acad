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
        <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">{dict.paths.title}</h1>
        <p className="text-[#86868b] text-[17px]">{dict.paths.tagline}</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#f5f5f7] rounded-[24px]">
          <Layers className="w-16 h-16 text-[#d2d2d7] mb-6" />
          <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">No paths enrolled yet</h2>
          <p className="text-[#86868b] mb-8 text-[15px]">Choose a professional path to start your career transformation.</p>
          <Link href={`/${lang}/paths`}>
            <Button size="lg" className="rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium px-8 h-12">Browse Paths</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {enrollments.map((enrollment: any) => (
            <Card key={enrollment.id} className="overflow-hidden border border-[#d2d2d7] shadow-none rounded-[24px]">
              <div className="grid md:grid-cols-4">
                <div className="bg-[#1d1d1f] p-8 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-[20px] font-semibold mb-2">{enrollment.path.title}</h3>
                    <div className="flex items-center gap-2 text-[#a1a1a6] font-medium text-[13px]">
                      <Layers className="w-4 h-4" />
                      {enrollment.path.courses.length} Courses
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-8">
                    <div className="flex justify-between text-[12px] font-medium uppercase tracking-wider text-[#a1a1a6]">
                       <span>Total Progress</span>
                       <span>{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-1 bg-white/20 [&>div]:bg-white" />
                  </div>
                </div>

                <div className="md:col-span-3 p-8 bg-white">
                  <h4 className="text-[12px] font-medium uppercase tracking-wider text-[#86868b] mb-6">Courses in this path</h4>
                  <div className="space-y-4">
                    {enrollment.path.courses.sort((a: any, b: any) => a.order - b.order).map((cp: any) => {
                      const courseEnrollment = cp.course.enrollments[0]
                      const courseProgress = courseEnrollment?.progress || 0
                      const isCourseCompleted = courseEnrollment?.isCompleted || false

                      return (
                        <div key={cp.courseId} className="flex items-center justify-between p-4 rounded-[16px] border border-[#d2d2d7] hover:bg-[#f5f5f7] transition-colors">
                          <div className="flex items-center gap-4">
                            {isCourseCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-[#0066cc]" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-[#d2d2d7]" />
                            )}
                            <div>
                              <p className="font-semibold text-[#1d1d1f] text-[15px]">{cp.course.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={courseProgress} className="h-1 w-24 bg-[#d2d2d7] [&>div]:bg-[#0066cc]" />
                                <span className="text-[11px] font-medium text-[#86868b]">{courseProgress}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <Link href={`/${lang}/dashboard/learning/${cp.courseId}`}>
                            <Button size="sm" variant="ghost" className="text-[#0066cc] hover:bg-transparent hover:text-[#0055b3] font-medium px-0">
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
