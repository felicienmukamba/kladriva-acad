import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LearningDashboard() {
  const coursesFromDb = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  // Map DB data to match the UI structure (adding some mock progress for now)
  const courses = coursesFromDb.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    progress: Math.floor(Math.random() * 100), // Mock progress until Enrollment is implemented
    modulesCount: course.modules.length,
    lessonsCount: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
    status: "IN_PROGRESS", // Mock status
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Learning Hub</h1>
          <p className="text-slate-400">Pick up where you left off or start a new skill.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Browse Catalog</Button>
      </div>

      <div className="grid gap-6">
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-lg border border-slate-800">
            <p className="text-slate-400">No courses available yet.</p>
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-slate-800 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-700">
                  <BookOpen className="w-16 h-16 text-indigo-400/50" />
                </div>
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-white">{course.title}</CardTitle>
                      {course.progress === 100 && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Completed</Badge>
                      )}
                    </div>
                    <CardDescription className="text-slate-400 mb-6">
                      {course.description}
                    </CardDescription>
                  </div>

                  <div className="space-y-4">
                    {course.progress < 100 && (
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{course.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.modulesCount} Modules</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.lessonsCount} Lessons</span>
                      </div>
                      
                      <Link href={`/dashboard/learning/${course.id}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                          <PlayCircle className="w-4 h-4" /> {course.progress === 0 ? 'Start' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
