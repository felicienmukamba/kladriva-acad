import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, Filter, MoreVertical, Shield, UserX, Mail } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function AdminUsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
  })

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{dict.admin.users.title}</h1>
          <p className="text-sm text-slate-600">{dict.admin.users.tagline}</p>
        </div>
        <Button className="h-11 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-medium gap-2">
          <UserPlus className="w-4 h-4" /> {dict.admin.users.invite}
        </Button>
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
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500 py-6 pl-8">{dict.admin.users.table.user}</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">{dict.admin.users.table.role}</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">{dict.admin.users.table.reputation}</TableHead>
              <TableHead className="font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">{dict.admin.users.table.status}</TableHead>
              <TableHead className="text-right pr-8 font-semibold uppercase tracking-[0.18em] text-[11px] text-slate-500">{dict.admin.users.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="font-bold text-xs bg-primary/5 text-primary">{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{user.name || "Anonymous User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase border-none ${
                    user.role === "ADMIN" ? "bg-amber-100 text-amber-700" :
                    user.role === "MENTOR" ? "bg-indigo-100 text-indigo-700" :
                    user.role === "COMPANY" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {dict.admin.users.table.roles[user.role.toLowerCase() as keyof typeof dict.admin.users.table.roles] || user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{user.reputation}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pts</span>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-xs font-bold text-slate-500">{dict.admin.users.table.statuses.active}</span>
                   </div>
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
                        <Mail className="w-4 h-4 text-slate-400" /> Message User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer">
                        <Shield className="w-4 h-4 text-slate-400" /> Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl gap-3 font-medium p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                        <UserX className="w-4 h-4" /> Suspend Account
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
