"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Award, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface QuizProps {
  quiz: {
    id: string
    title: string
    description?: string | null
    passingScore: number
    questions: {
      id: string
      text: string
      type: string
      options: {
        id: string
        text: string
        isCorrect: boolean
      }[]
    }[]
  }
  onComplete: (score: number, passed: boolean) => void
}

export function QuizView({ quiz, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  const calculateResults = () => {
    let score = 0
    quiz.questions.forEach((q) => {
      const selectedOptionId = answers[q.id]
      const correctOption = q.options.find((o) => o.isCorrect)
      if (selectedOptionId === correctOption?.id) {
        score += 1
      }
    })
    
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const passed = percentage >= quiz.passingScore
    
    setShowResults(true)
    onComplete(percentage, passed)
  }

  if (showResults) {
    const score = Object.entries(answers).reduce((acc, [qId, optId]) => {
      const question = quiz.questions.find(q => q.id === qId)
      const option = question?.options.find(o => o.id === optId)
      return acc + (option?.isCorrect ? 1 : 0)
    }, 0)
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const passed = percentage >= quiz.passingScore

    return (
      <Card className="max-w-2xl mx-auto border-none shadow-xl">
        <CardHeader className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {passed ? <Award className="w-10 h-10 text-emerald-600" /> : <XCircle className="w-10 h-10 text-red-600" />}
          </div>
          <CardTitle className="text-3xl font-bold">
            {passed ? "Congratulations!" : "Keep Practicing"}
          </CardTitle>
          <CardDescription className="text-lg">
            You scored {percentage}% in {quiz.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 rounded-[24px] bg-[#f5f5f7] space-y-4">
             <div className="flex justify-between items-center text-[15px]">
                <span className="font-medium text-[#86868b]">Passing Score:</span>
                <span className="font-semibold text-[#1d1d1f]">{quiz.passingScore}%</span>
             </div>
             <div className="flex justify-between items-center text-[15px]">
                <span className="font-medium text-[#86868b]">Your Score:</span>
                <span className={`font-bold ${passed ? 'text-emerald-600' : 'text-red-500'}`}>{percentage}%</span>
             </div>
             <div className="w-full bg-[#e8e8ed] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} 
                  style={{ width: `${percentage}%` }}
                />
             </div>
          </div>

          {!passed && (
            <div className="p-8 mt-6 rounded-[24px] bg-[#1d1d1f] text-white">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#0066cc]" />
                <span className="font-semibold text-[17px]">Antigravity Analysis</span>
              </div>
              <p className="text-[#a1a1a6] text-[15px] leading-relaxed">
                I noticed some friction in your understanding of the core concepts. To ensure a weightless learning experience, I strongly recommend reviewing the previous lessons to strengthen your foundation before retrying. Real progress takes time.
              </p>
            </div>
          )}
          
          <div className="space-y-4 pt-6">
             <h4 className="font-semibold text-[17px] text-[#1d1d1f]">Review Answers</h4>
             {quiz.questions.map((q, i) => {
               const selectedOptId = answers[q.id]
               const correctOpt = q.options.find(o => o.isCorrect)
               const isCorrect = selectedOptId === correctOpt?.id
               
               return (
                 <div key={q.id} className={`p-6 rounded-[24px] border ${isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
                    <p className="text-[15px] font-medium mb-4 text-[#1d1d1f]">{i + 1}. {q.text}</p>
                    <div className="space-y-3">
                       <div className="flex items-center gap-2 text-[13px]">
                          {isCorrect ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct:</span>
                          ) : (
                            <span className="text-red-500 font-semibold flex items-center gap-1"><XCircle className="w-4 h-4" /> Incorrect:</span>
                          )}
                          <span className="text-[#86868b]">{q.options.find(o => o.id === selectedOptId)?.text || "No answer"}</span>
                       </div>
                       {!isCorrect && (
                         <div className="flex items-center gap-2 text-[13px]">
                            <span className="text-emerald-600 font-semibold">Correct Answer:</span>
                            <span className="text-[#1d1d1f] font-medium">{correctOpt?.text}</span>
                         </div>
                       )}
                    </div>
                 </div>
               )
             })}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full h-12 text-lg font-bold" onClick={() => window.location.reload()}>
            {passed ? "Continue to Next Lesson" : "Retry Quiz"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-xl overflow-hidden">
      <div className="h-1.5 w-full bg-slate-100">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>
      <CardHeader className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Badge variant="outline" className="px-3 py-1 text-slate-500 font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Badge>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passing: {quiz.passingScore}%</span>
        </div>
        <CardTitle className="text-2xl font-bold leading-snug">
          {currentQuestion.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <RadioGroup value={answers[currentQuestion.id]} onValueChange={handleAnswerChange} className="space-y-3">
          {currentQuestion.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
              <Label
                htmlFor={option.id}
                className="flex flex-1 items-center justify-between rounded-xl border-2 border-slate-100 p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all font-medium"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="p-8 flex justify-between border-t bg-slate-50/50">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="font-bold gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        {isLastQuestion ? (
          <Button 
            onClick={calculateResults} 
            disabled={!answers[currentQuestion.id]}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8 shadow-lg shadow-emerald-600/20"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            disabled={!answers[currentQuestion.id]}
            className="font-bold gap-2 px-8"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
