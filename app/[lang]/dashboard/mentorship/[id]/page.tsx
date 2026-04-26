import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Globe, Shield, MessageSquare, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { bookSession } from "@/app/actions/mentorship";

export default async function MentorProfilePage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const session = await auth();
  
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const mentor = await prisma.user.findUnique({
    where: { id },
    include: {
      availabilitySlots: {
        where: { 
          isBooked: false,
          startTime: { gte: new Date() }
        },
        orderBy: { startTime: 'asc' },
        take: 12
      }
    }
  });

  if (!mentor || mentor.role !== 'MENTOR') {
    notFound();
  }

  const expertise = mentor.bio?.split(',').map(s => s.trim()) || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2 text-[13px] text-[#86868b] font-medium uppercase tracking-wider mb-8">
        <Link href="/dashboard/mentorship" className="hover:text-[#1d1d1f] transition-colors">Mentorship</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1d1d1f]">{mentor.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border-[#d2d2d7] rounded-[24px] shadow-none overflow-hidden">
            <div className="h-32 bg-[#f5f5f7] border-b border-[#d2d2d7]" />
            <CardContent className="relative pt-0">
              <div className="absolute -top-12 left-8">
                <div className="h-24 w-24 rounded-[18px] bg-white p-1 border border-[#d2d2d7]">
                  <div className="h-full w-full rounded-[14px] bg-[#e8e8ed] flex items-center justify-center text-[#1d1d1f] text-3xl font-semibold overflow-hidden">
                    {mentor.image ? (
                      <img src={mentor.image} alt={mentor.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      mentor.name?.charAt(0)
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-2">{mentor.name}</h1>
                    <p className="text-[#86868b] text-[17px] font-medium mb-6">{mentor.headline}</p>
                    <div className="flex flex-wrap gap-6 text-[13px] font-medium text-[#86868b] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#1d1d1f] fill-[#1d1d1f]" /> 4.9 (48 reviews)</span>
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-[#1d1d1f]" /> 124 Sessions</span>
                      <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#1d1d1f]" /> English, French</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-[#d2d2d7] text-[#1d1d1f] font-medium rounded-full h-10 px-6 hover:bg-[#f5f5f7]">Message</Button>
                    <Button className="bg-[#1d1d1f] hover:bg-black text-white font-medium rounded-full h-10 px-6">Follow</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-8 border-t border-[#d2d2d7] pt-8">
                <div>
                  <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-4">About Me</h3>
                  <p className="text-[#86868b] text-[15px] leading-relaxed">
                    {mentor.bio || "No biography provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-[#f5f5f7] text-[#1d1d1f] border-transparent font-medium px-4 py-1.5 rounded-full">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Booking */}
        <div className="space-y-6">
          <Card className="bg-[#f5f5f7] border-[#d2d2d7] rounded-[24px] shadow-none sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#1d1d1f] flex items-center gap-2 text-[20px] font-semibold tracking-tight">
                <CalendarIcon className="w-5 h-5 text-[#1d1d1f]" /> Book a Session
              </CardTitle>
              <CardDescription className="text-[#86868b] text-[15px]">
                Pick a slot that works for you. All sessions are 60 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Available Slots</h4>
                {mentor.availabilitySlots.length === 0 ? (
                  <p className="text-[15px] text-[#86868b] py-6 text-center bg-white border border-[#d2d2d7] rounded-[16px]">
                    No upcoming slots available.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {mentor.availabilitySlots.map((slot) => (
                      <Link key={slot.id} href={`/${lang}/checkout?slotId=${slot.id}&mentorId=${mentor.id}`}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between border-[#d2d2d7] bg-white hover:border-[#1d1d1f] hover:bg-white group text-[#1d1d1f] transition-all py-8 rounded-[16px]"
                        >
                          <div className="text-left">
                            <div className="text-[11px] text-[#86868b] group-hover:text-[#1d1d1f] uppercase tracking-wider font-semibold mb-1 transition-colors">
                              {format(slot.startTime, 'EEEE, MMM do')}
                            </div>
                            <div className="font-semibold text-[15px]">
                              {format(slot.startTime, 'p')}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#1d1d1f]" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#d2d2d7] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#86868b] text-[15px]">Session Price</span>
                  <span className="text-[#1d1d1f] font-semibold text-[20px]">$60.00</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#1d1d1f] font-medium bg-white p-4 rounded-[16px] border border-[#d2d2d7]">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Secure payment via Kladriva Escrow.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
