import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, Lock, ChevronRight, BookOpen, Star } from "lucide-react";
import Link from "next/link";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="relative h-64 rounded-xl overflow-hidden border border-slate-800">
        <img 
          src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'} 
          alt={course.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8">
          <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
          <p className="text-slate-300 max-w-2xl">{course.description}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white">Course Content</h2>
          <div className="space-y-4">
            {course.modules.map((module: any) => (
              <Card key={module.id} className="bg-slate-900 border-slate-800">
                <CardHeader className="py-4 border-b border-slate-800">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-slate-200">
                      Module {module.order}: {module.title}
                    </CardTitle>
                    <span className="text-xs text-slate-500">{module.lessons.length} lessons</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800">
                    {module.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                          <span className="text-sm text-slate-300 group-hover:text-white">
                            {lesson.title}
                          </span>
                        </div>
                        <Link href={`/dashboard/learning/${course.id}/lessons/${lesson.id}`}>
                          <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                            Start
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0% Complete</span>
                  <span>0/{course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} Lessons</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full w-0"></div>
                </div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-6">
                Resume Learning
              </Button>
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Included in this course:</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Comprehensive lessons</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Real-world project</li>
                  <li className="flex items-center gap-2"><Star className="w-4 h-4" /> Certificate of completion</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
