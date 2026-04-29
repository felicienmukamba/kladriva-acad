"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { enrollInCourse } from "@/app/actions/courses"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Zap, ArrowRight, CheckCircle2 } from "lucide-react"

export function EnrollButton({ 
  userId, 
  courseId, 
  isEnrolled,
  lang 
}: { 
  userId: string, 
  courseId: string, 
  isEnrolled: boolean,
  lang: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleEnroll = async () => {
    if (!userId) {
      router.push(`/${lang}/auth/signin`)
      return
    }

    setLoading(true)
    try {
      const result = await enrollInCourse(userId, courseId)
      if (result.success) {
        toast({
          title: "Inscription réussie !",
          description: "Bienvenue dans le programme. Vous pouvez commencer dès maintenant.",
        })
        router.refresh()
        router.push(`/${lang}/dashboard`)
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de s'inscrire au cours.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Erreur serveur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isEnrolled) {
    return (
      <Button 
        className="h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] gap-2"
        onClick={() => router.push(`/${lang}/dashboard`)}
      >
        <CheckCircle2 className="w-5 h-5" /> Accéder à mon espace
      </Button>
    )
  }

  return (
    <Button 
      className="h-14 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-bold px-12 text-lg shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] gap-2"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-[#0066cc]" />}
      S'inscrire gratuitement
    </Button>
  )
}
