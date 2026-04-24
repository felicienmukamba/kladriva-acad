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

export default async function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/dashboard/mentorship" className="hover:text-white transition-colors">Mentorship</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-200">{mentor.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-slate-900 border-slate-800 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
            <CardContent className="relative pt-0">
              <div className="absolute -top-12 left-6">
                <div className="h-24 w-24 rounded-2xl bg-slate-900 p-1">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                    {mentor.image ? (
                      <img src={mentor.image} alt={mentor.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      mentor.name?.charAt(0)
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{mentor.name}</h1>
                    <p className="text-indigo-400 font-medium mb-4">{mentor.headline}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 (48 reviews)</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> 124 Sessions</span>
                      <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> English, French</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-700 text-slate-300">Message</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Follow</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-t border-slate-800 pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About Me</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {mentor.bio || "No biography provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-slate-800 text-slate-300">
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
          <Card className="bg-slate-900 border-slate-800 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" /> Book a Session
              </CardTitle>
              <CardDescription className="text-slate-400">
                Pick a slot that works for you. All sessions are 60 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-200">Available Slots</h4>
                {mentor.availabilitySlots.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-800 rounded-lg">
                    No upcoming slots available.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {mentor.availabilitySlots.map((slot) => (
                      <form key={slot.id} action={bookSession}>
                        <input type="hidden" name="slotId" value={slot.id} />
                        <input type="hidden" name="mentorId" value={mentor.id} />
                        {session.user?.id && <input type="hidden" name="menteeId" value={session.user.id} />}
                        <Button 
                          type="submit"
                          variant="outline" 
                          className="w-full justify-between border-slate-800 bg-slate-800/50 hover:bg-indigo-600 hover:border-indigo-600 group text-slate-300 hover:text-white transition-all py-6"
                        >
                          <div className="text-left">
                            <div className="text-xs text-slate-500 group-hover:text-indigo-100 uppercase tracking-wider font-bold">
                              {format(slot.startTime, 'EEEE, MMM do')}
                            </div>
                            <div className="font-semibold">
                              {format(slot.startTime, 'p')}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </form>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Session Price</span>
                  <span className="text-white font-bold text-lg">$60.00</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <Shield className="w-4 h-4 text-emerald-500" />
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
