import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Globe, Trophy, Code2, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { IconBrandGithub } from "@tabler/icons-react"
import { getDictionary } from "@/lib/dictionary"
import { SubmitProjectForm } from "@/components/projects/SubmitProjectForm"
import { PeerReviewForm } from "@/components/projects/PeerReviewForm"

export default async function ProjectsDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const dict = await getDictionary(lang as "en" | "fr")
  const projects = await prisma.project.findMany()

  const userSubmissions = await prisma.projectSubmission.findMany({
    where: { userId: session.user.id! }
  })

  const submissionsToReview = await prisma.projectSubmission.findMany({
    where: { 
      status: "PENDING", 
      userId: { not: session.user.id! },
      reviews: { none: { reviewerId: session.user.id! } }
    },
    include: { project: true, user: true }
  })

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">{dict.projects.title}</h1>
          <p className="text-[17px] text-[#86868b]">{dict.projects.tagline}</p>
        </div>
        <Button variant="outline" className="h-10 rounded-full bg-white border-[#d2d2d7] text-[#1d1d1f] font-medium gap-2 hover:bg-[#f5f5f7]">
          <Trophy className="w-4 h-4" /> {dict.projects.leaderboard}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
          const submission = userSubmissions.find(s => s.projectId === project.id)
          
          return (
            <Card key={project.id} className="border border-[#d2d2d7] rounded-[24px] shadow-none flex flex-col bg-white">
              <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center text-[#1d1d1f] mb-6">
                    <Code2 className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">{project.title}</h3>
                  <p className="text-[15px] text-[#86868b] line-clamp-3 leading-relaxed mb-6 flex-1">
                    {project.description}
                  </p>

                  <div className="space-y-6 pt-6 border-t border-[#d2d2d7]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                              project.difficulty === "BEGINNER" ? "bg-green-500" :
                              project.difficulty === "INTERMEDIATE" ? "bg-yellow-500" : "bg-red-500"
                          }`} />
                          <span className="text-[13px] font-medium text-[#86868b]">{dict.projects.difficulty}: {project.difficulty}</span>
                        </div>
                    </div>

                    {!submission ? (
                      <SubmitProjectForm projectId={project.id} />
                    ) : (
                      <div className={`p-4 rounded-xl flex items-start gap-3 ${
                        submission.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800' :
                        submission.status === 'REJECTED' ? 'bg-red-50 text-red-800' :
                        'bg-blue-50 text-blue-800'
                      }`}>
                        {submission.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> :
                         submission.status === 'REJECTED' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> :
                         <Clock className="w-5 h-5 shrink-0 mt-0.5" />}
                        <div>
                           <p className="text-[13px] font-bold uppercase tracking-wider mb-1">{submission.status}</p>
                           {submission.grade !== null && <p className="text-[15px] font-medium">Grade: {submission.grade}%</p>}
                           <a href={submission.repoUrl!} target="_blank" rel="noreferrer" className="text-[13px] underline mt-2 block">View Submission</a>
                        </div>
                      </div>
                    )}
                  </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {submissionsToReview.length > 0 && (
        <section className="pt-8 border-t border-[#d2d2d7]">
          <div className="mb-8 space-y-2">
            <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f]">Peer Review Queue</h2>
            <p className="text-[15px] text-[#86868b]">Review your peers' projects to validate your own module completion.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {submissionsToReview.map(sub => (
               <Card key={sub.id} className="border border-[#d2d2d7] rounded-[24px] shadow-none bg-white">
                 <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-semibold text-[13px]">
                          {(sub.user.name || "Student").charAt(0)}
                       </div>
                       <div>
                         <h3 className="text-[15px] font-semibold text-[#1d1d1f]">{sub.project.title}</h3>
                         <p className="text-[13px] text-[#86868b]">by {sub.user.name || "Anonymous"}</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-4 mb-6">
                       <a href={sub.repoUrl!} target="_blank" rel="noreferrer" className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#f5f5f7] rounded-lg text-[13px] font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors">
                          <IconBrandGithub className="w-4 h-4" /> View Code
                       </a>
                       {sub.liveUrl && (
                         <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#f5f5f7] rounded-lg text-[13px] font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors">
                            <Globe className="w-4 h-4" /> Live Demo
                         </a>
                       )}
                    </div>

                    <PeerReviewForm submissionId={sub.id} />
                 </CardContent>
               </Card>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[24px] p-12 text-white bg-[#1d1d1f]">
         <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-[32px] font-semibold tracking-tight">{dict.projects.capstone.title}</h2>
            <p className="text-[#a1a1a6] text-[17px] leading-relaxed">
               {dict.projects.capstone.tagline}
            </p>
            <Button size="lg" className="bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium px-8 h-12 rounded-full">
               {dict.projects.capstone.apply}
            </Button>
         </div>
      </section>
    </div>
  )
}
