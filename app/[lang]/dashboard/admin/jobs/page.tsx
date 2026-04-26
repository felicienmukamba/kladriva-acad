import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Search, Filter, MoreVertical, ExternalLink, Archive, CheckCircle } from "lucide-react"
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

export default async function AdminJobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const jobs = await prisma.job.findMany({
    include: {
      company: true,
      _count: {
        select: { applications: true }
      }
    }
  })

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{dict.admin.jobs.title}</h1>
          <p className="text-sm text-slate-600">{dict.admin.jobs.tagline}</p>
        </div>
        <Link href={`/${lang}/dashboard/admin/jobs/new`}>
          <Button className="h-11 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-medium gap-2">
            <Briefcase className="w-4 h-4" /> {dict.admin.jobs.addJob}
          </Button>
        </Link>
      </div>

      <div className="apple-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-11 h-11 rounded-full border-slate-200 bg-white" placeholder={dict.admin.users.search} />
        </div>
        <Button variant="outline" className="h-11 rounded-full gap-2 border-slate-200 bg-white hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <div className="apple-surface overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500 py-6 pl-8">Opportunity</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Company</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Applications</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Salary</TableHead>
              <TableHead className="text-right pr-8 font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-6 pl-8">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <Badge variant="outline" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-tighter px-1.5 py-0">
                          {job.type.replace("_", " ")}
                       </Badge>
                       <span className="text-xs text-slate-400">{job.location || "Remote"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400">
                       {job.company.name?.[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{job.company.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{job._count.applications}</span>
                    <span className="text-xs text-slate-400">Candidates</span>
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-sm font-medium text-slate-600">{job.salaryRange || "Competitive"}</span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-slate-100">
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer">
                        <CheckCircle className="w-4 h-4 text-slate-400" /> Mark as Filled
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer">
                        <ExternalLink className="w-4 h-4 text-slate-400" /> View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer text-slate-600">
                        <Archive className="w-4 h-4" /> Archive Listing
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
  )
}
