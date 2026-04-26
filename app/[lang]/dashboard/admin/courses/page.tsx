import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
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
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f5f5f7] min-h-screen px-4 py-8 lg:px-6 lg:py-10">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Courses</h1>
          <p className="text-sm text-slate-600 mt-1">Create, edit, and publish your curriculum.</p>
        </div>
        <Link href={`/${lang}/dashboard/admin/courses/new`}>
          <Button className="h-11 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800 font-medium gap-2">
            <Plus className="w-4 h-4" /> Create course
          </Button>
        </Link>
      </div>

      <div className="apple-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-11 h-11 rounded-full border-slate-200 bg-white transition-all" 
            placeholder="Search courses..." 
          />
        </div>
        <Button variant="outline" className="h-11 rounded-full gap-2 border-slate-200 bg-white hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <div className="apple-surface overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500 py-5 pl-8">Course</TableHead>
                <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Status</TableHead>
                <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Curriculum</TableHead>
                <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Students</TableHead>
                <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Updated</TableHead>
                <TableHead className="text-right pr-8 font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="group hover:bg-muted/20 transition-colors border-b border-border/50 last:border-0">
                  <TableCell className="py-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden shrink-0 shadow-sm border border-border/50">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <IconBook className="w-6 h-6 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate text-base">{course.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{course.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.published ? "default" : "outline"} className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      course.published ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
                    }`}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground">{course._count.modules}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Modules</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground">{course._count.enrollments}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Students</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600 font-medium">
                      {new Date(course.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-background hover:shadow-sm h-10 w-10">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-border/50 backdrop-blur-xl bg-background/90">
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-medium p-3 cursor-pointer"
                          render={<Link href={`/${lang}/courses/${course.id}`} />}
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" /> View Public Page
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-medium p-3 cursor-pointer"
                          render={<Link href={`/${lang}/dashboard/admin/courses/${course.id}`} />}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" /> Edit Curriculum
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="w-4 h-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
