import { useDictionary } from "@/components/DictionaryProvider"
import { Users, Calendar, MessageSquare, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MentorDashboard() {
  const dict = useDictionary()
  
  const stats = [
    { title: dict.dashboard.mentor.activeMentees, value: "12", icon: Users, color: "text-blue-500" },
    { title: dict.dashboard.mentor.scheduledSessions, value: "5", icon: Calendar, color: "text-emerald-500" },
    { title: dict.dashboard.mentor.unreadMessages, value: "8", icon: MessageSquare, color: "text-orange-500" },
    { title: dict.dashboard.mentor.avgRating, value: "4.9", icon: Star, color: "text-yellow-500" },
  ]

  return (
    <div className="flex flex-col gap-10">
      <div className="apple-toolbar">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {dict.dashboard.mentor.title}
          </h2>
          <p className="text-muted-foreground">
            {dict.dashboard.mentor.tagline}
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
          <h3 className="font-bold text-lg">{dict.dashboard.mentor.upcomingSessions}</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/10" />
                  <div>
                    <p className="font-semibold text-sm">Mentee Name {i}</p>
                    <p className="text-xs text-muted-foreground">Today at 2:00 PM</p>
                  </div>
                </div>
                <div className="size-8 rounded-full bg-background border border-border/50 flex items-center justify-center">
                   <Calendar className="size-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="apple-card p-6 space-y-4">
          <h3 className="font-bold text-lg">{dict.dashboard.mentor.recentFeedback}</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="size-3 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-sm italic">"Great session! Really helped me understand React patterns."</p>
                <p className="text-xs text-muted-foreground">- Student A</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
