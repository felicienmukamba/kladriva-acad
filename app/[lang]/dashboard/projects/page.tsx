import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Globe, Trophy, Code2, CheckCircle2, AlertCircle, Clock, ChevronRight, Sparkles, Activity, Users } from "lucide-react"
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
  const projects = await prisma.project.findMany({
     orderBy: { id: "asc" }
  })

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
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" /> Validation Technique
          </div>
          <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">
            Projets & Certification
          </h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Mettez en pratique vos connaissances et construisez un portfolio qui impressionnera les recruteurs.
          </p>
        </div>
        
        <Button variant="outline" className="h-12 rounded-full border-[#d2d2d7] bg-white text-[#1d1d1f] font-bold px-6 shadow-sm gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" /> {dict.projects.leaderboard}
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => {
          const submission = userSubmissions.find(s => s.projectId === project.id)
          const isBossFinal = idx === projects.length - 1;
          
          return (
            <Card key={project.id} className={cn(
              "border-[#d2d2d7] rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 bg-white",
              isBossFinal && "border-[#1d1d1f]/20 bg-[#fbfbfd]"
            )}>
              <CardContent className="p-10 flex flex-col h-full min-h-[460px]">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border",
                      isBossFinal ? "bg-[#1d1d1f] text-white border-[#1d1d1f]" : "bg-[#f5f5f7] text-[#1d1d1f] border-[#d2d2d7]"
                    )}>
                      {isBossFinal ? <Trophy className="w-7 h-7" /> : <Code2 className="w-7 h-7" />}
                    </div>
                    {isBossFinal && (
                      <Badge className="bg-[#1d1d1f] text-white font-black text-[9px] px-3 py-1 uppercase tracking-widest border-none">Boss Final</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <h3 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight leading-tight">{project.title}</h3>
                    <p className="text-[16px] text-[#86868b] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-[#f5f5f7]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                              project.difficulty === "BEGINNER" ? "bg-emerald-500" :
                              project.difficulty === "INTERMEDIATE" ? "bg-amber-500" : "bg-rose-500"
                          }`} />
                          <span className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">{project.difficulty}</span>
                        </div>
                    </div>

                    {!submission ? (
                      <SubmitProjectForm projectId={project.id} />
                    ) : (
                      <div className={cn(
                        "p-6 rounded-[28px] flex items-start gap-4 border transition-all",
                        submission.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        submission.status === 'REJECTED' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                        'bg-[#f5f5f7] border-[#d2d2d7] text-[#1d1d1f]'
                      )}>
                        {submission.status === 'APPROVED' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> :
                         submission.status === 'REJECTED' ? <AlertCircle className="w-6 h-6 shrink-0" /> :
                         <Clock className="w-6 h-6 shrink-0" />}
                        <div className="min-w-0">
                           <p className="text-[11px] font-black uppercase tracking-widest mb-1">{submission.status}</p>
                           {submission.score !== null && <p className="text-xl font-bold">Score: {submission.score}%</p>}
                           <a href={submission.repoUrl!} target="_blank" rel="noreferrer" className="text-[13px] font-bold underline underline-offset-4 mt-2 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                              Revoir mon code <ChevronRight className="w-3.5 h-3.5" />
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

      {/* Peer Review Section */}
      {submissionsToReview.length > 0 && (
        <section className="pt-16 border-t border-[#d2d2d7] space-y-10">
          <div className="space-y-4 pl-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" /> Peer Review
            </div>
            <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">File d'attente des revues</h2>
            <p className="text-[#86868b] text-[17px] max-w-2xl leading-relaxed">
              Corrigez les projets de vos pairs pour valider vos propres modules et renforcer vos compétences de revue de code.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {submissionsToReview.map(sub => (
               <Card key={sub.id} className="border border-[#d2d2d7] rounded-[40px] shadow-sm bg-white overflow-hidden">
                 <CardContent className="p-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] border border-[#d2d2d7] flex items-center justify-center font-bold text-[15px] shadow-sm">
                          {(sub.user.name || "Student").charAt(0)}
                       </div>
                       <div>
                         <h3 className="text-[18px] font-bold text-[#1d1d1f] tracking-tight">{sub.project.title}</h3>
                         <p className="text-[14px] text-[#86868b]">soumis par <span className="font-bold text-[#1d1d1f]">{sub.user.name || "Apprenant"}</span></p>
                       </div>
                    </div>
                    
                    <div className="flex gap-4 mb-10">
                       <a href={sub.repoUrl!} target="_blank" rel="noreferrer" className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#f5f5f7] rounded-full text-[14px] font-bold text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors border border-[#d2d2d7]/50">
                          <IconBrandGithub className="w-4.5 h-4.5" /> Voir le code
                       </a>
                       {sub.liveUrl && (
                         <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#f5f5f7] rounded-full text-[14px] font-bold text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors border border-[#d2d2d7]/50">
                            <Globe className="w-4.5 h-4.5" /> Démo Live
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

      {/* Capstone Promo Section */}
      <section className="rounded-[48px] p-16 text-white bg-[#1d1d1f] relative overflow-hidden text-center group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,204,0.3),transparent_70%)] opacity-50" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
         
         <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center mx-auto mb-10 shadow-2xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
               <Activity className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.1]">{dict.projects.capstone.title}</h2>
            <p className="text-white/60 text-[20px] md:text-[24px] leading-relaxed max-w-2xl mx-auto">
               {dict.projects.capstone.tagline}
            </p>
            <div className="pt-6">
              <Button size="lg" className="bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-bold px-12 h-14 rounded-full text-lg shadow-2xl transition-all hover:scale-105">
                 {dict.projects.capstone.apply}
              </Button>
            </div>
         </div>
      </section>
    </div>
  )
}
