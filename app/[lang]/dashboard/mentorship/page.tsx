import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Star, Video, Sparkles, UserCheck, ChevronRight, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { MentorMatching } from "@/components/mentorship/MentorMatching"

export default async function MentorshipDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/auth/signin`)

  // Fetch all mentors
  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    take: 6
  })

  // Fetch active sessions for the current user
  const activeSessions = await prisma.mentorshipSession.findMany({
    where: {
      OR: [
        { menteeId: session.user.id },
        { mentorId: session.user.id }
      ],
      status: "SCHEDULED"
    },
    include: {
      mentor: true,
      mentee: true
    },
    orderBy: { date: "asc" }
  })

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 text-[#0066cc] text-[11px] font-bold uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5" /> Accompagnement Pro
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">Mentorat Individuel</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Échangez avec les meilleurs experts du secteur pour accélérer votre progression et valider vos compétences.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white/50 backdrop-blur-xl p-4 rounded-[28px] border border-[#d2d2d7] shadow-sm">
           <div className="flex -space-x-3">
              {mentors.slice(0, 4).map((m, i) => (
                <Avatar key={i} className="w-10 h-10 border-2 border-white ring-2 ring-transparent">
                  <AvatarImage src={m.image || ""} />
                  <AvatarFallback>{m.name?.[0]}</AvatarFallback>
                </Avatar>
              ))}
           </div>
           <div className="border-l border-[#d2d2d7] pl-6">
              <div className="text-[11px] text-[#86868b] uppercase font-bold tracking-wider mb-1">Disponibilité</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[15px] font-semibold text-[#1d1d1f]">12 Mentors en ligne</span>
              </div>
           </div>
        </div>
      </div>

      {/* Matching Experience - Apple Card Style */}
      <div className="overflow-hidden rounded-[36px] border border-[#d2d2d7] bg-white shadow-sm transition-all hover:shadow-md">
        <MentorMatching />
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#1d1d1f] flex items-center gap-3">
            Mes Sessions à venir
            <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] font-bold">{activeSessions.length}</Badge>
          </h2>
          <div className="grid gap-4">
            {activeSessions.map((sess) => {
              const otherUser = sess.mentorId === session.user.id ? sess.mentee : sess.mentor
              return (
                <div key={sess.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[24px] border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7] transition-colors group">
                  <div className="flex items-center gap-5">
                    <Avatar className="w-14 h-14 rounded-2xl">
                      <AvatarImage src={otherUser.image || ""} />
                      <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-[17px] text-[#1d1d1f]">{otherUser.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-[13px] text-[#86868b]">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {sess.date ? new Date(sess.date).toLocaleDateString() : "TBD"}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {sess.date ? new Date(sess.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBD"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-full border-[#d2d2d7] px-6 text-[14px] font-medium hover:bg-white">
                      Message
                    </Button>
                    <Button className="h-10 rounded-full bg-[#1d1d1f] text-white hover:bg-black px-6 text-[14px] font-medium gap-2">
                      Rejoindre la visio <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mentors Catalog */}
      <div className="space-y-8 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1d1d1f]">Experts recommandés</h2>
          <Button variant="ghost" className="text-[#0066cc] hover:bg-[#0066cc]/5 rounded-full font-semibold gap-1.5 px-5">
            Explorer tout le réseau <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="border border-[#d2d2d7] rounded-[32px] overflow-hidden shadow-none bg-white hover:border-[#1d1d1f] transition-all duration-500 group flex flex-col">
               <CardContent className="p-8 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-6">
                   <Avatar className="w-20 h-20 rounded-[22px] shadow-sm">
                      <AvatarImage src={mentor.image || ""} />
                      <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-xl">{mentor.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 bg-[#f5f5f7] px-3 py-1.5 rounded-full">
                         <Star className="w-3.5 h-3.5 fill-[#1d1d1f] text-[#1d1d1f]" />
                         <span className="text-[13px] font-bold text-[#1d1d1f]">4.9</span>
                      </div>
                      <span className="text-[11px] text-[#86868b] font-medium mt-2 uppercase tracking-wider">124 sessions</span>
                   </div>
                </div>

                <div className="space-y-4 flex-1">
                   <div>
                      <h3 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{mentor.name}</h3>
                      <p className="text-[14px] text-[#0066cc] font-semibold mt-0.5">{mentor.specialties?.split(',')[0] || "Senior Engineering Lead"}</p>
                   </div>
                   
                   <p className="text-[15px] text-[#86868b] line-clamp-3 leading-relaxed">
                      {mentor.bio || "Expert passionné par la transmission de savoirs techniques et le développement de carrière dans la tech."}
                   </p>
                   
                   <div className="flex flex-wrap gap-2 pt-2">
                      {mentor.specialties?.split(',').slice(0, 3).map((spec, i) => (
                        <Badge key={i} variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent px-3 py-1 rounded-lg text-[12px] font-medium">
                          {spec.trim()}
                        </Badge>
                      )) || (
                        <>
                          <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent px-3 py-1 rounded-lg text-[12px] font-medium">Fullstack</Badge>
                          <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent px-3 py-1 rounded-lg text-[12px] font-medium">Architecture</Badge>
                        </>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-[#d2d2d7]">
                   <Button variant="outline" className="h-11 rounded-full font-semibold border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all">
                      Profil
                   </Button>
                   <Link href={`/${lang}/dashboard/mentorship/${mentor.id}`}>
                     <Button className="w-full h-11 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-semibold shadow-lg shadow-black/5 transition-all">
                        Réserver
                     </Button>
                   </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pro Membership Banner */}
      <section className="rounded-[40px] p-12 md:p-16 text-white bg-[radial-gradient(circle_at_top_right,rgba(46,101,255,0.9),rgba(15,23,42,1)_70%)] shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_40%)]" />
         <div className="absolute right-0 top-0 w-1/3 h-full bg-indigo-500/10 blur-[100px] -translate-y-1/2" />
         
         <div className="max-w-2xl relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Kladriva Pro
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">Accès illimité à l'expertise mondiale.</h2>
            <p className="text-white/70 text-xl leading-relaxed">
               Passez à la vitesse supérieure. Bénéficiez de sessions hebdomadaires illimitées, de revues de code prioritaires et d'un coaching carrière personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="bg-white text-[#1d1d1f] hover:bg-slate-100 font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-black/20 w-full sm:w-auto">
                 Devenir Pro
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-semibold px-10 h-14 rounded-full text-lg w-full sm:w-auto">
                 Voir les avantages
              </Button>
            </div>
         </div>
      </section>
    </div>
  )
}
