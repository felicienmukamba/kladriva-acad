import { IconTrendingDown, IconTrendingUp, IconBook, IconMessageCircle, IconCode, IconTrophy } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useDictionary } from "@/components/DictionaryProvider"

export function SectionCards() {
  const dict = useDictionary()
  const stats = [
    {
      title: dict.dashboard.student.stats.courses.title,
      value: "12",
      trend: "+2",
      trendType: "up",
      icon: IconBook,
      desc: dict.dashboard.student.stats.courses.desc,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: dict.dashboard.student.stats.mentorship.title,
      value: "4",
      trend: "+1",
      trendType: "up",
      icon: IconMessageCircle,
      desc: dict.dashboard.student.stats.mentorship.desc,
      color: "text-rose-600 bg-rose-50"
    },
    {
      title: dict.dashboard.student.stats.projects.title,
      value: "45",
      trend: "+12",
      trendType: "up",
      icon: IconCode,
      desc: dict.dashboard.student.stats.projects.desc,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: dict.dashboard.student.stats.reputation.title,
      value: "2,450",
      trend: "+450",
      trendType: "up",
      icon: IconTrophy,
      desc: dict.dashboard.student.stats.reputation.desc,
      color: "text-amber-600 bg-amber-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="group overflow-hidden border-none shadow-apple hover:shadow-apple-lg transition-all duration-500 rounded-[2rem] apple-card relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
             <stat.icon size={80} className="text-foreground" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
              <Badge variant="outline" className="rounded-full border-slate-100 font-bold text-[10px]">
                {stat.trendType === "up" ? <IconTrendingUp className="size-3 mr-1" /> : <IconTrendingDown className="size-3 mr-1" />}
                {stat.trend}
              </Badge>
            </div>
            <CardDescription className="font-bold text-muted-foreground/70 uppercase tracking-widest text-[10px]">{stat.title}</CardDescription>
            <CardTitle className="text-3xl font-black text-foreground tabular-nums">
              {stat.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="pt-2">
            <p className="text-xs font-medium text-muted-foreground">{stat.desc}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
