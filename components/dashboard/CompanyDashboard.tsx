import { useDictionary } from "@/components/DictionaryProvider"
import { Briefcase, FileText, UserPlus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CompanyDashboard({ data }: { data?: any }) {
  const dict = useDictionary()
  
  const stats = [
    { title: dict.dashboard.company.activeJobs, value: "4", icon: Briefcase, color: "text-indigo-500" },
    { title: dict.dashboard.company.totalApplications, value: "48", icon: FileText, color: "text-blue-500" },
    { title: dict.dashboard.company.newCandidates, value: "12", icon: UserPlus, color: "text-emerald-500" },
    { title: dict.dashboard.company.hiringVelocity, value: "+15%", icon: TrendingUp, color: "text-rose-500" },
  ]

  return (
    <div className="flex flex-col gap-10">
      <div className="apple-toolbar">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {dict.dashboard.company.title}
          </h2>
          <p className="text-muted-foreground">
            {dict.dashboard.company.tagline}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="apple-card border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 apple-card p-6 space-y-6">
          <h3 className="font-bold text-lg">{dict.dashboard.company.activePostings}</h3>
          <div className="divide-y divide-border/50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-base">Senior Full Stack Engineer {i}</p>
                  <p className="text-xs text-muted-foreground">Remote • Full-time • 12 applications</p>
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="apple-card p-6 space-y-6">
          <h3 className="font-bold text-lg">{dict.dashboard.company.candidatePipeline}</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Candidate {i}</p>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-primary" style={{ width: `${Math.random() * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
