import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Video, Star, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import Link from "next/link";

export default async function MentorshipPage() {
  const mentorsFromDb = await prisma.user.findMany({
    where: { role: 'MENTOR' },
  });

  const mentors = mentorsFromDb.map(m => ({
    id: m.id,
    name: m.name || 'Anonymous',
    title: m.headline || 'Industry Expert',
    expertise: m.bio?.split(',').map(s => s.trim()) || [], // Simplified for now
    rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1), // Mock rating
    sessions: Math.floor(Math.random() * 200), // Mock data
    price: `$${Math.floor(Math.random() * 50) + 50}/hr`, // Mock data
    availability: "Next slot: Tomorrow",
    avatar: m.image || '',
  }));

  const session = await auth();
  const userId = session?.user?.id;

  const upcomingSessions = userId ? await prisma.mentorshipSession.findMany({
    where: { 
      menteeId: userId,
      status: "SCHEDULED",
      date: { gte: new Date() }
    },
    include: {
      mentor: true,
    },
    orderBy: { date: 'asc' },
  }) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mentorship</h1>
        <p className="text-slate-400">Get personalized guidance from industry experts who have been where you want to go.</p>
      </div>

      {upcomingSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Upcoming Sessions</h2>
          <div className="grid gap-4">
            {upcomingSessions.map((s) => (
              <Card key={s.id} className="bg-slate-900 border-slate-800 border-l-4 border-l-indigo-500">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold overflow-hidden">
                      {s.mentor.image ? <img src={s.mentor.image} className="w-full h-full object-cover" /> : s.mentor.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{s.mentor.name}</p>
                      <p className="text-sm text-slate-400">{format(s.date, 'EEEE, MMM do @ p')}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
                    <Video className="w-4 h-4" /> Join Call
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Find a Mentor</h2>
          <Button variant="outline" className="border-slate-700 text-slate-300">View All</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="bg-slate-900 border-slate-800 flex flex-col">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold mb-3 overflow-hidden">
                  {mentor.avatar ? (
                    <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                  ) : (
                    mentor.name.charAt(0)
                  )}
                </div>
                <CardTitle className="text-lg text-white">{mentor.name}</CardTitle>
                <CardDescription className="text-slate-400 text-xs">{mentor.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" /> {mentor.rating}
                    </span>
                    <span className="text-slate-400">{mentor.sessions} sessions</span>
                    <span className="text-emerald-400 font-semibold">{mentor.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" /> {mentor.availability}
                  </div>
                  <Link href={`/dashboard/mentorship/${mentor.id}`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2 mt-2">
                      <MessageSquare className="w-4 h-4" /> Book Session
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
