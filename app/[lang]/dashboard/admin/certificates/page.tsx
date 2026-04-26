import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Award, Search, MoreVertical, ShieldCheck, Trash2, ExternalLink } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"
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

export default async function AdminCertificatesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const certificates = await (prisma as any).certificate.findMany({
    include: {
      user: true,
      course: true
    },
    orderBy: { issuedAt: "desc" }
  })

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Certificate Registry</h1>
          <p className="text-sm text-slate-600">Monitor and verify all professional credentials issued by the academy.</p>
        </div>
      </div>

      <div className="apple-surface overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500 py-6 pl-8">Certificate ID</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Recipient</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Course</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Issued Date</TableHead>
              <TableHead className="text-right pr-8 font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((cert: any) => (
              <TableRow key={cert.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-6 pl-8 font-mono text-[10px] font-bold text-slate-400">
                  {cert.code}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{cert.user.name}</span>
                    <span className="text-xs text-slate-500">{cert.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-none">
                      {cert.course.title}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-sm text-slate-600">{new Date(cert.issuedAt).toLocaleDateString()}</span>
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
                        <ExternalLink className="w-4 h-4 text-slate-400" /> View Certificate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                        <Trash2 className="w-4 h-4" /> Revoke Credential
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
