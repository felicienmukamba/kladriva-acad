"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from "@/app/actions/admin-courses"
import { Loader2, Sparkles, Image as ImageIcon, Trash2 } from "lucide-react"

interface CourseFormProps {
  course?: {
    id: string
    title: string
    description: string
    imageUrl?: string | null
    published: boolean
  }
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    imageUrl: course?.imageUrl || "",
    published: course?.published || false,
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (course) {
        await updateCourse(course.id, formData)
        toast({
          title: "Cours mis à jour",
          description: "Les modifications ont été enregistrées avec succès.",
        })
      } else {
        await createCourse(formData)
        toast({
          title: "Cours créé",
          description: "Le nouveau programme a été ajouté au catalogue.",
        })
      }
      router.refresh()
      router.push(`/dashboard/admin/courses`)
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="title" className="text-[15px] font-bold text-[#1d1d1f] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0066cc]" /> Titre du Programme
          </Label>
          <Input 
            id="title" 
            placeholder="ex: Maîtrisez le Développement Fullstack avec Next.js"
            className="h-14 rounded-2xl border-[#d2d2d7] bg-white focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] text-[17px] font-medium shadow-sm transition-all"
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            required 
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="description" className="text-[15px] font-bold text-[#1d1d1f]">Description & Objectifs</Label>
          <Textarea 
            id="description" 
            placeholder="Détaillez le contenu de la formation, les prérequis et ce que vos étudiants vont accomplir..."
            className="rounded-2xl border-[#d2d2d7] bg-white focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] min-h-[160px] text-[17px] leading-relaxed p-6 shadow-sm transition-all resize-none"
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            required 
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="imageUrl" className="text-[15px] font-bold text-[#1d1d1f] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#86868b]" /> URL de l'image de couverture
          </Label>
          <Input 
            id="imageUrl" 
            placeholder="https://images.unsplash.com/..."
            className="h-14 rounded-2xl border-[#d2d2d7] bg-white focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] text-[15px] shadow-sm transition-all"
            value={formData.imageUrl} 
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
          />
          <p className="text-[13px] text-[#86868b] pl-2">Utilisez une image de haute qualité (16:9 recommandé).</p>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-[28px] bg-white border border-[#d2d2d7] shadow-sm transition-all hover:border-[#1d1d1f]/30">
          <div className="flex items-center justify-center w-12 h-12 bg-[#f5f5f7] rounded-xl shrink-0">
             <Checkbox 
                id="published" 
                className="w-6 h-6 rounded-md border-2 border-[#d2d2d7] data-[state=checked]:bg-[#1d1d1f] data-[state=checked]:border-transparent"
                checked={formData.published} 
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })} 
              />
          </div>
          <div>
            <Label htmlFor="published" className="text-[17px] font-bold text-[#1d1d1f] cursor-pointer">Publier le cours</Label>
            <p className="text-[14px] text-[#86868b]">Rendre ce programme visible dans le catalogue public immédiatement.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#d2d2d7]">
        <Button 
          type="submit" 
          disabled={loading} 
          className="h-14 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-12 text-lg shadow-xl shadow-black/10 transition-all hover:scale-[1.02] flex-1 sm:flex-none"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (course ? "Enregistrer les modifications" : "Créer le programme")}
        </Button>
        
        {course && (
          <Button 
            type="button" 
            variant="ghost" 
            className="rounded-full h-14 px-10 text-rose-600 hover:bg-rose-50 font-bold text-lg gap-2"
            disabled={loading}
            onClick={async () => {
              if (confirm("Êtes-vous sûr de vouloir supprimer ce cours définitivement ?")) {
                await deleteCourse(course.id)
                toast({ title: "Cours supprimé", variant: "destructive" })
                router.push(`/dashboard/admin/courses`)
              }
            }}
          >
            <Trash2 className="w-5 h-5" /> Supprimer
          </Button>
        )}
        
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => router.back()}
          className="rounded-full h-14 px-10 text-[#86868b] hover:bg-[#f5f5f7] font-bold text-lg"
          disabled={loading}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
