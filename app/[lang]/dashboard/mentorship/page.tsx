import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Star, Video } from "lucide-react"

export default async function MentorshipDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    take: 6
  })

  return (
    <div className="space-y-10">
      <div className="apple-toolbar">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Mentorship</h1>
          <p className="text-sm text-slate-600">Connect with experts to accelerate your career.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="apple-surface bg-white overflow-hidden border-black/6 hover:shadow-apple-lg transition-all group rounded-3xl">
             <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-8">
                   <Avatar className="w-20 h-20 border-2 border-primary/10">
                      <AvatarImage src={mentor.image || ""} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold text-xl">{mentor.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">{mentor.name}</h3>
                      <p className="text-sm text-slate-600 font-medium">{mentor.headline || "Senior Expert"}</p>
                      <div className="flex items-center gap-1 mt-2">
                         <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                         <span className="text-sm font-semibold text-slate-950">4.9</span>
                         <span className="text-xs text-slate-500">(48 reviews)</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {mentor.bio || "Helping students navigate the complex world of software engineering and design systems."}
                   </p>
                   <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-medium">React</Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-medium">System Design</Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-medium">UI/UX</Badge>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                   <Button variant="outline" className="h-11 rounded-full font-medium gap-2 border-slate-200 bg-white hover:bg-slate-50">
                      <MessageCircle className="w-4 h-4" /> Message
                   </Button>
                   <Button className="h-11 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-medium gap-2 shadow-lg shadow-slate-950/10">
                      <Calendar className="w-4 h-4" /> Book Session
                   </Button>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <section className="rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.92),rgba(15,23,42,1)_55%,rgba(37,99,235,0.94)_130%)]">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Video className="w-64 h-64" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] mb-4">Unlimited 1-on-1 access</h2>
            <p className="text-white/72 text-lg mb-8 leading-relaxed">
               Upgrade to Kladriva Pro to unlock unlimited weekly mentorship sessions and direct project reviews from our staff engineers.
            </p>
            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-semibold px-10 h-12 rounded-full">
               Upgrade to Pro
            </Button>
         </div>
      </section>
    </div>
  )
}
