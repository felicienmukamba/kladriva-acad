import { useDictionary } from "@/components/DictionaryProvider"
import { BarChart3, Settings, Shield, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminDashboard() {
  const dict = useDictionary()
  
  const stats = [
    { title: dict.dashboard.admin.totalUsers, value: "1,284", icon: Users, color: "text-blue-500" },
    { title: dict.dashboard.admin.monthlyRevenue, value: "$42,500", icon: BarChart3, color: "text-emerald-500" },
    { title: dict.dashboard.admin.activeInstructors, value: "24", icon: Shield, color: "text-orange-500" },
    { title: dict.dashboard.admin.systemHealth, value: "99.9%", icon: Settings, color: "text-emerald-600" },
  ]

  return (
    <div className="flex flex-col gap-10">
      <div className="apple-toolbar">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {dict.dashboard.admin.title}
          </h2>
          <p className="text-muted-foreground">
            {dict.dashboard.admin.tagline}
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

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="apple-card p-6 space-y-4">
          <h3 className="font-bold text-lg">{dict.dashboard.admin.auditLog}</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Settings className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Core API Update {i}</p>
                  <p className="text-xs text-muted-foreground">Automatic deployment completed successfully.</p>
                  <p className="text-[10px] text-muted-foreground/40 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="apple-card p-6 space-y-4">
          <h3 className="font-bold text-lg">{dict.dashboard.admin.growth}</h3>
          <div className="h-[300px] w-full bg-muted/20 rounded-3xl flex items-center justify-center border border-dashed border-border/50">
             <p className="text-sm text-muted-foreground">Growth Metrics Visualization</p>
          </div>
        </div>
      </div>
    </div>
  )
}
