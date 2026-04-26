import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Globe, Trophy, Code2 } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"

export default async function ProjectsDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const dict = await getDictionary(lang as "en" | "fr")
  const projects = await prisma.project.findMany()

  return (
    <div className="space-y-10">
      <div className="apple-toolbar">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{dict.projects.title}</h1>
          <p className="text-sm text-slate-600">{dict.projects.tagline}</p>
        </div>
        <Button variant="outline" className="h-11 rounded-full bg-white border-slate-200 font-medium gap-2">
          <Trophy className="w-4 h-4" /> {dict.projects.leaderboard}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="apple-surface overflow-hidden border-black/6 hover:shadow-apple-lg transition-all group rounded-[2rem] flex flex-col bg-white">
             <CardContent className="p-8 flex-1 flex flex-col">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   <Code2 className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-1">
                   {project.description}
                </p>

                <div className="space-y-6 pt-6 border-t border-slate-200/70">
                   <div className="flex flex-wrap gap-2">
                      {project.skills.split(",").map((skill) => (
                         <Badge key={skill} variant="outline" className="bg-white text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-0.5 border-slate-200">
                            {skill.trim()}
                         </Badge>
                      ))}
                   </div>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${
                            project.difficulty === "BEGINNER" ? "bg-emerald-500" :
                            project.difficulty === "INTERMEDIATE" ? "bg-amber-500" : "bg-rose-500"
                         }`} />
                         <span className="text-xs font-bold text-slate-500">{dict.projects.difficulty}: {project.difficulty}</span>
                      </div>
                      <Button variant="ghost" className="h-10 rounded-full text-slate-700 font-medium hover:bg-slate-50 gap-2">
                         {dict.projects.startLab} <GitBranch className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <section className="rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.92),rgba(15,23,42,1)_55%,rgba(37,99,235,0.94)_130%)]">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Globe className="w-64 h-64" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] mb-4">{dict.projects.capstone.title}</h2>
            <p className="text-white/72 text-lg mb-8 leading-relaxed">
               {dict.projects.capstone.tagline}
            </p>
            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-semibold px-10 h-12 rounded-full shadow-xl">
               {dict.projects.capstone.apply}
            </Button>
         </div>
      </section>
    </div>
  )
}
