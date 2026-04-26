import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, User, MoreVertical, CheckCircle, XCircle } from "lucide-react"
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

export default async function AdminMentorshipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const sessions = await prisma.mentorshipSession.findMany({
    include: {
      mentor: true,
      mentee: true
    },
    orderBy: { date: "desc" }
  })

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Mentorship Sessions</h1>
          <p className="text-sm text-slate-600">Track and manage professional guidance interactions.</p>
        </div>
      </div>

      <div className="apple-surface overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500 py-6 pl-8">Date</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Mentor</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Mentee</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Status</TableHead>
              <TableHead className="text-right pr-8 font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {session.date ? new Date(session.date).toLocaleDateString() : 'TBD'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{session.mentor.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{session.mentee.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase border-none ${
                    session.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                    session.status === "CANCELLED" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {session.status}
                  </Badge>
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
                        <CheckCircle className="w-4 h-4 text-slate-400" /> Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer text-rose-600">
                        <XCircle className="w-4 h-4" /> Cancel Session
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
