import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Star, Video, Sparkles, UserCheck, ChevronRight, Clock, MapPin, Users2, Target } from "lucide-react"
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
            <Target className="w-3.5 h-3.5" /> Accompagnement Pro
          </div>
          <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#1d1d1f]">Mentorat Individuel</h1>
          <p className="text-[#86868b] text-xl max-w-xl leading-relaxed">
            Échangez avec les meilleurs experts du secteur pour accélérer votre progression et valider vos compétences.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white/50 backdrop-blur-xl p-4 rounded-[28px] border border-[#d2d2d7] shadow-sm">
           <div className="flex -space-x-3">
              {mentors.slice(0, 4).map((m, i) => (
                <Avatar key={i} className="w-10 h-10 border-4 border-white shadow-sm ring-1 ring-black/5">
                  <AvatarImage src={m.image || ""} />
                  <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-xs">{m.name?.[0]}</AvatarFallback>
                </Avatar>
              ))}
           </div>
           <div className="border-l border-[#d2d2d7] pl-6">
              <div className="text-[11px] text-[#86868b] uppercase font-bold tracking-wider mb-1">Disponibilité</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[15px] font-bold text-[#1d1d1f]">12 Mentors en ligne</span>
              </div>
           </div>
        </div>
      </div>

      {/* Matching Experience - Apple Card Style */}
      <div className="overflow-hidden rounded-[48px] border border-[#d2d2d7] bg-white shadow-sm transition-all hover:shadow-md">
        <MentorMatching />
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#1d1d1f] flex items-center gap-4">
              Sessions à venir
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f7] text-[13px] font-black text-[#1d1d1f]">{activeSessions.length}</span>
            </h2>
          </div>
          <div className="grid gap-4">
            {activeSessions.map((sess) => {
              const otherUser = sess.mentorId === session.user.id ? sess.mentee : sess.mentor
              return (
                <div key={sess.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[32px] border border-[#d2d2d7] bg-white hover:bg-[#f5f5f7]/50 transition-all group">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-16 h-16 rounded-[24px] shadow-sm border border-[#d2d2d7]/50">
                      <AvatarImage src={otherUser.image || ""} />
                      <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-lg">{otherUser.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-[18px] text-[#1d1d1f] tracking-tight">{otherUser.name}</h4>
                      <div className="flex items-center gap-5 mt-1.5 text-[14px] text-[#86868b] font-medium">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#0066cc]" /> {sess.date ? new Date(sess.date).toLocaleDateString() : "TBD"}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#0066cc]" /> {sess.date ? new Date(sess.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBD"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 flex items-center gap-3">
                    <Button variant="outline" className="h-12 rounded-full border-[#d2d2d7] px-8 text-[14px] font-bold hover:bg-white text-[#1d1d1f]">
                      Message
                    </Button>
                    <Button className="h-12 rounded-full bg-[#1d1d1f] text-white hover:bg-black px-8 text-[14px] font-bold gap-2 shadow-xl shadow-black/10 transition-all active:scale-95">
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
      <div className="space-y-10 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
             <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">Experts recommandés</h2>
             <p className="text-[#86868b] text-[15px]">Profils sélectionnés selon vos objectifs actuels.</p>
          </div>
          <Button variant="ghost" className="text-[#0066cc] hover:bg-[#0066cc]/5 rounded-full font-bold gap-1.5 px-6 h-12">
            Explorer le réseau <ChevronRight className="w-4.5 h-4.5" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="border border-[#d2d2d7] rounded-[40px] overflow-hidden shadow-sm bg-white hover:border-[#1d1d1f] transition-all duration-500 group flex flex-col">
               <CardContent className="p-10 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-8">
                   <Avatar className="w-24 h-24 rounded-[32px] shadow-sm border border-[#d2d2d7]/30 group-hover:scale-105 transition-transform duration-500">
                      <AvatarImage src={mentor.image || ""} />
                      <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-2xl">{mentor.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 bg-[#f5f5f7] px-4 py-2 rounded-full">
                         <Star className="w-4 h-4 fill-[#1d1d1f] text-[#1d1d1f]" />
                         <span className="text-[15px] font-black text-[#1d1d1f]">4.9</span>
                      </div>
                      <span className="text-[11px] text-[#86868b] font-black mt-3 uppercase tracking-widest">124 sessions</span>
                   </div>
                </div>

                <div className="space-y-5 flex-1">
                   <div>
                      <h3 className="text-[22px] font-bold text-[#1d1d1f] tracking-tight">{mentor.name}</h3>
                      <p className="text-[15px] text-[#0066cc] font-bold mt-1 uppercase tracking-tighter">{mentor.specialties?.split(',')[0] || "Senior Engineering Lead"}</p>
                   </div>
                   
                   <p className="text-[16px] text-[#86868b] line-clamp-3 leading-relaxed">
                      {mentor.bio || "Expert passionné par la transmission de savoirs techniques et le développement de carrière dans la tech."}
                   </p>
                   
                   <div className="flex flex-wrap gap-2 pt-2">
                      {mentor.specialties?.split(',').slice(0, 3).map((spec, i) => (
                        <Badge key={i} variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent px-4 py-1.5 rounded-xl text-[12px] font-bold">
                          {spec.trim()}
                        </Badge>
                      )) || (
                        <>
                          <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent px-4 py-1.5 rounded-xl text-[12px] font-bold">Fullstack</Badge>
                          <Badge variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent px-4 py-1.5 rounded-xl text-[12px] font-bold">Architecture</Badge>
                        </>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-[#f5f5f7]">
                   <Button variant="outline" className="h-12 rounded-full font-bold border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all">
                      Profil
                   </Button>
                   <Link href={`/${lang}/dashboard/mentorship/${mentor.id}`}>
                     <Button className="w-full h-12 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold shadow-xl shadow-black/10 transition-all active:scale-95">
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
      <section className="rounded-[48px] p-16 text-white bg-[#1d1d1f] relative overflow-hidden group shadow-2xl">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,204,0.3),transparent_70%)] opacity-50" />
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -ml-40 -mb-40" />
         
         <div className="max-w-2xl relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Kladriva Pro
            </div>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.1]">Accès illimité à l'expertise mondiale.</h2>
            <p className="text-white/60 text-[20px] md:text-[24px] leading-relaxed">
               Passez à la vitesse supérieure. Bénéficiez de sessions hebdomadaires illimitées et d'un coaching carrière personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
              <Button size="lg" className="bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-bold px-12 h-14 rounded-full text-lg shadow-2xl transition-all hover:scale-105 w-full sm:w-auto">
                 Devenir Pro
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-bold px-10 h-14 rounded-full text-lg w-full sm:w-auto gap-2">
                 Voir les avantages <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
         </div>
      </section>
    </div>
  )
}
