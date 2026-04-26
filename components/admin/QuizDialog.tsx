"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { addQuestion, getOrCreateQuiz } from "@/app/actions/admin-curriculum"

interface QuizDialogProps {
  moduleId?: string
  lessonId?: string
  quiz?: {
    id: string
    title: string
    questions: any[]
  }
}

export function QuizDialog({ moduleId, lessonId, quiz: initialQuiz }: QuizDialogProps) {
  const params = useParams()
  const courseId = params.id as string
  
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState<any>(initialQuiz)
  
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "MULTIPLE_CHOICE",
    points: 1,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  })

  async function onOpen() {
    if (activeQuiz) return
    setLoading(true)
    try {
      const q = await getOrCreateQuiz(moduleId || lessonId!, moduleId ? 'module' : 'lesson', courseId)
      setActiveQuiz(q)
    } catch (err) {
      toast.error("Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }

  async function onAddQuestion() {
    if (!newQuestion.text) return toast.error("Question text is required")
    if (newQuestion.options.filter(o => o.text).length < 2) return toast.error("At least 2 options are required")
    if (newQuestion.options.every(o => !o.isCorrect)) return toast.error("Please mark one option as correct")
    
    setLoading(true)
    try {
      const validOptions = newQuestion.options.filter(o => o.text !== "")
      await addQuestion(activeQuiz.id, courseId, {
        ...newQuestion,
        options: validOptions
      })
      
      toast.success("Question added")
      setNewQuestion({
        text: "",
        type: "MULTIPLE_CHOICE",
        points: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]
      })
      
      // Reload quiz data
      const q = await getOrCreateQuiz(moduleId || lessonId!, moduleId ? 'module' : 'lesson', courseId)
      setActiveQuiz(q)
    } catch (error) {
      toast.error("Failed to add question")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(v) onOpen(); }}>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="h-9 rounded-full font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50">
          <HelpCircle className="w-4 h-4 mr-2" /> Questions
        </Button>
      } />
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight">Curriculum Assessment</DialogTitle>
          <DialogDescription>
            Configure questions and challenges for this {moduleId ? "module" : "lesson"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8">
          {loading && !activeQuiz ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Craft New Question</h3>
                <div className="space-y-4 p-6 rounded-3xl bg-muted/30 border border-border/50">
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Inquiry Text</Label>
                    <Input 
                      value={newQuestion.text} 
                      onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                      placeholder="e.g. Which hook is used for side effects in React?"
                      className="rounded-xl border-border/50 h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Potential Answers</Label>
                    <div className="grid gap-2">
                      {newQuestion.options.map((option, idx) => (
                        <div key={idx} className="flex gap-3 items-center group">
                          <div className="relative flex-1">
                             <Input 
                                value={option.text} 
                                onChange={e => {
                                  const newOptions = [...newQuestion.options]
                                  newOptions[idx].text = e.target.value
                                  setNewQuestion({...newQuestion, options: newOptions})
                                }}
                                placeholder={`Option ${idx + 1}`} 
                                className={`rounded-xl border-border/50 h-11 pl-4 ${option.isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : ""}`}
                              />
                              {option.isCorrect && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 size-2 rounded-full bg-emerald-500" />
                              )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newOptions = newQuestion.options.map((o, i) => ({...o, isCorrect: i === idx}))
                              setNewQuestion({...newQuestion, options: newOptions})
                            }}
                            className={`size-11 rounded-xl flex items-center justify-center transition-all border ${
                              option.isCorrect 
                                ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" 
                                : "bg-background border-border/50 text-muted-foreground hover:border-emerald-500/50"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={onAddQuestion} disabled={loading} className="w-full apple-button h-12 shadow-md">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Integrate Question
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Active Database ({activeQuiz?.questions?.length || 0})</h3>
                <div className="grid gap-3">
                  {activeQuiz?.questions?.map((q: any) => (
                    <div key={q.id} className="p-5 rounded-3xl border border-border/50 bg-card hover:bg-muted/10 transition-all flex justify-between items-center group shadow-sm">
                      <div className="space-y-1">
                        <p className="font-bold text-foreground/90">{q.text}</p>
                        <div className="flex gap-2">
                           {q.options.map((o: any) => (
                             <span key={o.id} className={`text-[10px] px-2 py-0.5 rounded-full border ${o.isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-muted/50 border-border/50 text-muted-foreground/60"}`}>
                                {o.text}
                             </span>
                           ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground/40 hover:text-destructive h-10 w-10 p-0 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {(!activeQuiz?.questions || activeQuiz.questions.length === 0) && (
                    <div className="text-center py-10 text-muted-foreground/40 italic text-sm">
                       No questions engineered yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
