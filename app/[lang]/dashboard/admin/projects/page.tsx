import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Search, Filter, MoreVertical, Edit, Trash2, Plus, Code2, GraduationCap, CheckCircle2 } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function AdminProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { id: "desc" }
  })

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" /> Certification & Validation
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Gestion des Projets</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Configurez les défis techniques que les étudiants doivent relever pour valider leurs compétences.
          </p>
        </div>
        
        <Link href={`/${lang}/dashboard/admin/projects/new`}>
          <Button className="h-14 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-8 gap-3 shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">
            <Plus className="w-5 h-5" /> Nouveau Projet
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Projets actifs", value: projects.length, icon: Code2, color: "text-[#1d1d1f]" },
           { label: "Soumissions", value: projects.reduce((acc, p) => acc + p._count.submissions, 0), icon: GraduationCap, color: "text-[#0066cc]" },
           { label: "Taux de réussite", value: "78%", icon: CheckCircle2, color: "text-emerald-600" },
           { label: "Délai moyen", value: "4j", icon: Trophy, color: "text-orange-500" }
         ].map((stat, i) => (
           <div key={i} className="bg-white/50 backdrop-blur-xl border border-[#d2d2d7] rounded-[28px] p-8 shadow-sm">
              <p className="text-[#86868b] text-[13px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className={`text-4xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</p>
                <div className="p-3 bg-[#f5f5f7] rounded-2xl text-[#1d1d1f]">
                   <stat.icon className="w-5 h-5" />
                </div>
              </div>
           </div>
         ))}
      </div>

      {/* Projects Table - Apple Style */}
      <div className="bg-white border border-[#d2d2d7] rounded-[40px] overflow-hidden shadow-sm relative">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="hover:bg-transparent border-b-[#d2d2d7]">
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b] py-8 pl-10">Détails du Projet</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Difficulté</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Soumissions</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Status</TableHead>
              <TableHead className="text-right pr-10 font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="group hover:bg-[#f5f5f7]/30 transition-all border-b-[#d2d2d7]">
                <TableCell className="py-8 pl-10">
                  <div className="min-w-0">
                    <p className="font-bold text-[#1d1d1f] text-[17px] truncate tracking-tight">{project.title}</p>
                    <p className="text-[14px] text-[#86868b] truncate mt-1">{project.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider border-none ${
                    project.difficulty === 'BEGINNER' ? 'bg-emerald-100 text-emerald-700' :
                    project.difficulty === 'INTERMEDIATE' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {project.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{project._count.submissions}</span>
                    <span className="text-[11px] font-black text-[#86868b] uppercase tracking-tighter">rendus</span>
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className="rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider bg-[#f5f5f7] text-[#1d1d1f] border-none">
                      Actif
                   </Badge>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-[#f5f5f7] h-10 w-10">
                        <MoreVertical className="w-5 h-5 text-[#86868b]" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-56 rounded-[24px] p-2 shadow-2xl border-[#d2d2d7] bg-white/80 backdrop-blur-xl">
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
                          <Edit className="w-4.5 h-4.5 text-[#86868b]" /> Modifier le projet
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
                          <Trophy className="w-4.5 h-4.5 text-yellow-500" /> Gérer le barème
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                          <Trash2 className="w-4.5 h-4.5" /> Supprimer le projet
                        </div>
                      } />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
