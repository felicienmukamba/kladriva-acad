import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Globe, Trophy, Code2, CheckCircle2, AlertCircle, Clock, ChevronRight } from "lucide-react"
import { IconBrandGithub } from "@tabler/icons-react"
import { getDictionary } from "@/lib/dictionary"
import { SubmitProjectForm } from "@/components/projects/SubmitProjectForm"
import { PeerReviewForm } from "@/components/projects/PeerReviewForm"
import { cn } from "@/lib/utils"

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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Trophy className="w-3 h-3" /> Application Réelle
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Projets & Certification</h1>
          <p className="text-slate-400 text-lg">Validez vos acquis par la pratique et obtenez votre certification.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 rounded-2xl bg-slate-900 border-slate-800 text-white font-bold gap-2 hover:bg-slate-800">
            <Trophy className="w-5 h-5 text-yellow-500" /> {dict.projects.leaderboard}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => {
          const submission = userSubmissions.find(s => s.projectId === project.id)
          const isBossFinal = idx === projects.length - 1;
          
          return (
            <Card key={project.id} className={cn(
              "border rounded-[32px] shadow-2xl flex flex-col transition-all duration-300 hover:-translate-y-1",
              isBossFinal 
                ? "bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-500/50 shadow-indigo-500/10" 
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            )}>
              <CardContent className="p-8 flex-1 flex flex-col">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner",
                    isBossFinal ? "bg-white/10 text-white" : "bg-slate-800 text-indigo-400"
                  )}>
                    {isBossFinal ? <Trophy className="w-7 h-7" /> : <Code2 className="w-7 h-7" />}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {isBossFinal && <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Boss Final</span>}
                    <h3 className="text-[22px] font-bold text-white tracking-tight">{project.title}</h3>
                    <p className="text-[15px] text-slate-400 line-clamp-3 leading-relaxed flex-1">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                              project.difficulty === "BEGINNER" ? "bg-emerald-500" :
                              project.difficulty === "INTERMEDIATE" ? "bg-amber-500" : "bg-rose-500"
                          }`} />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{project.difficulty}</span>
                        </div>
                    </div>

                    {!submission ? (
                      <SubmitProjectForm projectId={project.id} />
                    ) : (
                      <div className={cn(
                        "p-5 rounded-2xl flex items-start gap-4 border",
                        submission.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        submission.status === 'REJECTED' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                      )}>
                        {submission.status === 'APPROVED' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> :
                         submission.status === 'REJECTED' ? <AlertCircle className="w-6 h-6 shrink-0" /> :
                         <Clock className="w-6 h-6 shrink-0" />}
                        <div>
                           <p className="text-[11px] font-bold uppercase tracking-widest mb-1">{submission.status}</p>
                           {submission.score !== null && <p className="text-lg font-bold">Score: {submission.score}%</p>}
                           <a href={submission.repoUrl!} target="_blank" rel="noreferrer" className="text-xs font-medium underline-offset-4 hover:underline mt-2 flex items-center gap-1">
                              Review Code <ChevronRight className="w-3 h-3" />
                           </a>
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
