import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Star, Video, Sparkles, UserCheck, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MentorMatching } from "@/components/mentorship/MentorMatching"

export default async function MentorshipDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    take: 6
  })

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
            <UserCheck className="w-3 h-3" /> Accompagnement Pro
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Mentorat Dynamique</h1>
          <p className="text-slate-400 text-lg">Propulsez votre carrière avec l'aide d'experts du secteur.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-2xl border border-slate-800">
           <div className="flex -space-x-3 pl-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?u=mentor${i}`} alt="Mentor" className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
           <div className="pr-4 border-l border-slate-800 pl-4">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Disponibilité</div>
              <div className="text-sm font-bold text-emerald-400">12 Mentors en ligne</div>
           </div>
        </div>
      </div>

      {/* New Matching Section */}
      <MentorMatching />

      <div className="space-y-8 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Tous les Mentors Experts</h2>
          <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 gap-2">Voir tout <ChevronRight className="w-4 h-4" /></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="border border-slate-800 rounded-[32px] shadow-2xl bg-slate-900/50 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
               <CardContent className="p-8">
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                   <Avatar className="w-24 h-24">
                      <AvatarImage src={mentor.image || ""} />
                      <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-semibold text-2xl">{mentor.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="text-[20px] font-semibold text-[#1d1d1f]">{mentor.name}</h3>
                      <p className="text-[15px] text-[#86868b]">{mentor.bio?.substring(0, 50) || "Senior Expert"}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                         <Star className="w-4 h-4 fill-[#1d1d1f] text-[#1d1d1f]" />
                         <span className="text-[14px] font-semibold text-[#1d1d1f]">4.9</span>
                         <span className="text-[14px] text-[#86868b]">(48 reviews)</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <p className="text-[15px] text-[#1d1d1f] line-clamp-3 leading-relaxed text-center">
                      {mentor.bio || "Helping students navigate the complex world of software engineering and design systems."}
                   </p>
                   <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] font-medium border-transparent">React</Badge>
                      <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] font-medium border-transparent">System Design</Badge>
                      <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] font-medium border-transparent">UI/UX</Badge>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#d2d2d7]">
                   <Button variant="outline" className="h-10 rounded-full font-medium border-[#d2d2d7] text-[#1d1d1f] bg-white hover:bg-[#f5f5f7]">
                      Message
                   </Button>
                   <Link href={`/${lang}/dashboard/mentorship/${mentor.id}`}>
                     <Button className="w-full h-10 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-medium">
                        Book Session
                     </Button>
                   </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="rounded-[24px] p-12 text-white bg-[#1d1d1f]">
         <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-[32px] font-semibold tracking-tight">Unlimited 1-on-1 access</h2>
            <p className="text-[#a1a1a6] text-[17px] leading-relaxed">
               Upgrade to Kladriva Pro to unlock unlimited weekly mentorship sessions and direct project reviews from our staff engineers.
            </p>
            <Button size="lg" className="bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium px-8 h-12 rounded-full">
               Upgrade to Pro
            </Button>
         </div>
      </section>
    </div>
  )
}
