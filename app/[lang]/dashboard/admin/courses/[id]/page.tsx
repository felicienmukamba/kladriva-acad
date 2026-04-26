import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/permissions"
import { CourseForm } from "@/components/admin/CourseForm"
import { ModuleDialog } from "@/components/admin/ModuleDialog"
import { LessonDialog } from "@/components/admin/LessonDialog"
import { QuizDialog } from "@/components/admin/QuizDialog"
import { ChevronLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteModule, deleteLesson } from "@/app/actions/admin-curriculum"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/dictionary"

export default async function EditCoursePage({ 
  params 
}: { 
  params: Promise<{ lang: string; id: string }> 
}) {
  const { lang, id } = await params
  await isAdmin(lang)
  const dict = await getDictionary(lang as "en" | "fr")

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { 
            orderBy: { order: "asc" },
            include: { resources: true }
          },
          quiz: {
            include: { questions: { include: { options: true } } }
          }
        }
      }
    }
  } as any) as any

  if (!course) return <div>Course not found</div>

  const nextModuleOrder = (course.modules.length > 0) ? Math.max(...course.modules.map((m: any) => m.order)) + 1 : 1

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href={`/${lang}/dashboard/admin/courses`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
        <div className="size-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        {dict.common.back}
      </Link>
      
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{dict.admin.courses.title}</h1>
        <p className="text-muted-foreground text-lg">{dict.admin.courses.tagline}</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-8">
        <TabsList className="bg-muted/50 backdrop-blur-xl p-1 rounded-full h-12 border border-border/50 shadow-sm w-fit">
          <TabsTrigger value="settings" className="rounded-full px-8 font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-apple h-10 transition-all">
            {dict.admin.courses.settings}
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-full px-8 font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-apple h-10 transition-all">
            {dict.admin.courses.curriculum}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <CourseForm course={course} />
        </TabsContent>

        <TabsContent value="content" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex justify-between items-center bg-background/50 backdrop-blur-sm p-4 rounded-[2rem] border border-border/50 sticky top-20 z-20 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-foreground pl-4">Course Structure</h2>
            <ModuleDialog courseId={course.id} nextOrder={nextModuleOrder} />
          </div>
          
          <div className="grid gap-6">
            {course.modules.map((module: any) => {
              const nextLessonOrder = (module.lessons.length > 0) ? Math.max(...module.lessons.map((l: any) => l.order)) + 1 : 1
              return (
                <div key={module.id} className="apple-card bg-card p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center size-8 rounded-xl bg-primary/10 text-primary font-bold text-sm">
                          {module.order}
                        </span>
                        <h3 className="font-bold text-xl tracking-tight text-foreground">{module.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{module.description || "No description provided."}</p>
                    </div>
                    <div className="flex gap-2">
                       <QuizDialog moduleId={module.id} quiz={module.quiz as any} />
                       <ModuleDialog courseId={course.id} module={module} nextOrder={nextModuleOrder} />
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-9 w-9 p-0 rounded-full text-muted-foreground/40 hover:text-destructive transition-colors"
                         onClick={async () => {
                           if(confirm("Delete this module and all its content?")) {
                             await deleteModule(module.id, course.id)
                           }
                         }}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 pl-2">Lessons & Labs</h4>
                     <div className="grid gap-2">
                       {module.lessons.map((lesson: any) => (
                         <div key={lesson.id} className="flex justify-between items-center p-4 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-all group border border-transparent hover:border-border/50">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-muted-foreground/40">{lesson.order}</span>
                              <span className="text-base font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{lesson.title}</span>
                            </div>
                            <div className="flex gap-2">
                               <LessonDialog moduleId={module.id} courseId={course.id} lesson={lesson} nextOrder={nextLessonOrder} />
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-8 w-8 p-0 rounded-full text-muted-foreground/20 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                 onClick={async () => {
                                   if(confirm("Delete this lesson?")) {
                                     await deleteLesson(lesson.id, course.id)
                                   }
                                 }}
                               >
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                            </div>
                         </div>
                       ))}
                       <LessonDialog moduleId={module.id} courseId={course.id} nextOrder={nextLessonOrder} />
                     </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
