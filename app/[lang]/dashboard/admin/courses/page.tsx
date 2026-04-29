import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, GraduationCap, BookOpen, Clock, TrendingUp } from "lucide-react"
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
import { IconBook } from "@tabler/icons-react"
import Link from "next/link"

export default async function AdminCoursesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { enrollments: true, modules: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0)
  const publishedCount = courses.filter(c => c.published).length

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f]/5 border border-[#1d1d1f]/10 text-[#1d1d1f] text-[11px] font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" /> Gestion Académique
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Catalogue de Formations</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Concevez, éditez et publiez des parcours d'apprentissage de haute qualité pour vos étudiants.
          </p>
        </div>
        
        <Link href={`/${lang}/dashboard/admin/courses/new`}>
          <Button className="h-14 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-8 gap-3 shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">
            <Plus className="w-5 h-5" /> Créer un nouveau cours
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Cours Totaux", value: courses.length, icon: BookOpen, color: "text-[#1d1d1f]" },
           { label: "Étudiants Inscrits", value: totalStudents, icon: GraduationCap, color: "text-[#0066cc]" },
           { label: "Cours Publiés", value: publishedCount, icon: TrendingUp, color: "text-emerald-600" },
           { label: "Mise à jour (24h)", value: "3", icon: Clock, color: "text-orange-500" }
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

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/50 backdrop-blur-xl p-4 rounded-[32px] border border-[#d2d2d7] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#86868b]" />
          <Input className="pl-14 h-14 rounded-[24px] border-transparent bg-transparent focus-visible:ring-0 text-[17px] placeholder:text-[#86868b]" placeholder="Rechercher un cours, une catégorie..." />
        </div>
        <div className="flex items-center gap-3 pr-2">
          <Button variant="ghost" className="h-12 rounded-full gap-2 text-[#1d1d1f] font-bold px-6 hover:bg-[#f5f5f7]">
            <Filter className="w-4 h-4" /> Filtres avancés
          </Button>
        </div>
      </div>

      {/* Courses Table - Apple Style */}
      <div className="bg-white border border-[#d2d2d7] rounded-[40px] overflow-hidden shadow-sm relative">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="hover:bg-transparent border-b-[#d2d2d7]">
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b] py-8 pl-10">Détails du Cours</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Statut</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Contenu</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Étudiants</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Dernière MAJ</TableHead>
              <TableHead className="text-right pr-10 font-bold uppercase tracking-widest text-[11px] text-[#86868b]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="group hover:bg-[#f5f5f7]/30 transition-all border-b-[#d2d2d7]">
                <TableCell className="py-8 pl-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[22px] bg-[#f5f5f7] overflow-hidden shrink-0 shadow-sm border border-[#d2d2d7] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      {course.imageUrl ? (
                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <IconBook className="w-8 h-8 text-[#86868b]" />
                      )}
                    </div>
                    <div className="min-w-0 max-w-[300px]">
                      <p className="font-bold text-[#1d1d1f] text-[17px] truncate tracking-tight">{course.title}</p>
                      <p className="text-[14px] text-[#86868b] truncate">{course.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider border-none ${
                    course.published ? "bg-emerald-100 text-emerald-700" : "bg-[#f5f5f7] text-[#86868b]"
                  }`}>
                    {course.published ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{course._count.modules}</span>
                    <span className="text-[11px] font-black text-[#86868b] uppercase tracking-tighter">Modules</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-[#1d1d1f]">{course._count.enrollments}</span>
                    <span className="text-[11px] font-black text-[#86868b] uppercase tracking-tighter">Inscrits</span>
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-[14px] font-semibold text-[#1d1d1f]">
                      {new Date(course.updatedAt).toLocaleDateString()}
                   </span>
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
                        <Link href={`/${lang}/courses/${course.id}`} className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
                          <Eye className="w-4.5 h-4.5 text-[#86868b]" /> Voir la page publique
                        </Link>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
                          <Edit className="w-4.5 h-4.5 text-[#86868b]" /> Modifier le cours
                        </div>
                      } />
                      <DropdownMenuItem render={
                        <div className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                          <Trash2 className="w-4.5 h-4.5" /> Supprimer le cours
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
