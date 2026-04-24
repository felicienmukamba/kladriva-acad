import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, Briefcase, Building2, Wifi, Bookmark } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { JobApplicationModal } from "@/components/JobApplicationModal";
import { redirect } from "next/navigation";

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
};

function MatchScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    : score >= 75 ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
    : "text-slate-400 border-slate-500/30 bg-slate-500/10";

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${color}`}>
      {score}% Match
    </div>
  );
}

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const jobsFromDb = await prisma.job.findMany({
    include: {
      company: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const jobs = jobsFromDb.map((j: any) => ({
    id: j.id,
    title: j.title,
    company: j.company.name || 'Unknown',
    location: j.location || 'Remote',
    remote: j.remote,
    salary: j.salaryRange || 'Competitive',
    type: j.type,
    posted: 'Recently', // Mock data
    matchScore: Math.floor(Math.random() * 30) + 70, // Mock data
    description: j.description,
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Job & Freelance Marketplace</h1>
          <p className="text-slate-400">AI-matched opportunities based on your skills and project portfolio.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
            <Bookmark className="w-4 h-4" /> Saved
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300">My Applications</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 py-12 text-center">
             <p className="text-slate-500">No jobs posted yet. Check back later!</p>
          </Card>
        ) : (
          jobs.map((job: any) => (
            <Card key={job.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <p className="text-sm text-indigo-400 font-medium">{job.company}</p>
                    </div>
                  </div>
                  <MatchScoreBadge score={job.matchScore} />
                </div>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    {job.remote && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Wifi className="w-4 h-4" /> Remote
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {typeLabels[job.type] || job.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    {session.user?.id && (
                      <JobApplicationModal 
                        jobId={job.id} 
                        jobTitle={job.title} 
                        companyName={job.company} 
                        userId={session.user.id} 
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
