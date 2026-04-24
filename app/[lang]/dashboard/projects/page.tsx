import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const projectsFromDb = await prisma.project.findMany({
    include: {
      submissions: {
        where: { userId: userId || '' },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const projects = projectsFromDb.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty as any,
    skills: p.skills.split(','),
    status: p.submissions.length > 0 ? p.submissions[0].status : 'NOT_STARTED',
    submissionId: p.submissions.length > 0 ? p.submissions[0].id : null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Project Workspace</h1>
        <p className="text-slate-400">Apply your skills to real-world scenarios and get verified feedback.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={`${
                  project.difficulty === 'BEGINNER' ? 'border-emerald-500/30 text-emerald-400' :
                  project.difficulty === 'INTERMEDIATE' ? 'border-indigo-500/30 text-indigo-400' :
                  'border-rose-500/30 text-rose-400'
                }`}>
                  {project.difficulty}
                </Badge>
                {project.submissionId && (
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 uppercase text-[10px]">
                    {project.status}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl text-white">{project.title}</CardTitle>
              <CardDescription className="text-slate-400 line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-medium">
                    {skill.trim()}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.submissionId ? (
                  <Link href={`/dashboard/projects/submissions/${project.submissionId}`} className="w-full">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                      View Submission
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/dashboard/projects/${project.id}/submit`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                      Start Project
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
