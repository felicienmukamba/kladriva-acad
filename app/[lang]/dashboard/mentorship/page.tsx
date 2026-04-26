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
      <div className="space-y-2">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">Mentorship</h1>
        <p className="text-[#86868b] text-[17px]">Connect with experts to accelerate your career.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="border border-[#d2d2d7] rounded-[24px] shadow-none bg-white">
             <CardContent className="p-8">
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                   <Avatar className="w-24 h-24">
                      <AvatarImage src={mentor.image || ""} />
                      <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-semibold text-2xl">{mentor.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="text-[20px] font-semibold text-[#1d1d1f]">{mentor.name}</h3>
                      <p className="text-[15px] text-[#86868b]">{mentor.headline || "Senior Expert"}</p>
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
                   <Button className="h-10 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-medium">
                      Book Session
                   </Button>
                </div>
             </CardContent>
          </Card>
        ))}
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
