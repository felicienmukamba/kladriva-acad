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
        {projects.map((project) => (
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
                   <div className="flex flex-wrap gap-2">
                      {project.skills.split(",").map((skill) => (
                         <Badge key={skill} variant="outline" className="bg-[#f5f5f7] text-[11px] font-medium uppercase tracking-wider text-[#86868b] border-transparent px-2 py-1 rounded-md">
                            {skill.trim()}
                         </Badge>
                      ))}
                   </div>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${
                            project.difficulty === "BEGINNER" ? "bg-green-500" :
                            project.difficulty === "INTERMEDIATE" ? "bg-yellow-500" : "bg-red-500"
                         }`} />
                         <span className="text-[13px] font-medium text-[#86868b]">{dict.projects.difficulty}: {project.difficulty}</span>
                      </div>
                      <Button variant="ghost" className="h-10 rounded-full text-[#0066cc] font-medium hover:bg-transparent hover:text-[#0055b3] gap-2 px-0">
                         {dict.projects.startLab} <GitBranch className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

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
