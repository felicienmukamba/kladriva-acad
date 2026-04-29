"use client"

import * as React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase, CheckCircle2, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function JobApplyButton({ jobId, jobTitle, company }: { jobId: string, jobTitle: string, company: string }) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const coverNote = formData.get("coverNote") as string

    try {
      // In a real app, this would be a server action
      // For now, let's simulate the flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      toast({
        title: "Candidature envoyée !",
        description: `Votre profil a été transmis à ${company}.`,
      })
      
      setTimeout(() => {
        setOpen(false)
        setIsSuccess(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre candidature pour le moment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-semibold transition-all gap-2 text-[15px] shadow-lg shadow-black/5">
          Postuler maintenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] border-[#d2d2d7] p-0 overflow-hidden bg-white">
        {isSuccess ? (
          <div className="p-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1d1d1f]">Candidature Transmise</h2>
              <p className="text-[#86868b]">Bonne chance ! {company} examinera votre profil Kladriva sous peu.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="p-8 space-y-6">
              <DialogHeader>
                <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#1d1d1f]" />
                </div>
                <DialogTitle className="text-2xl font-bold text-[#1d1d1f]">Postuler pour {jobTitle}</DialogTitle>
                <DialogDescription className="text-[#86868b] text-[15px]">
                  Votre profil académique, vos projets validés et vos certifications seront automatiquement joints à cette candidature.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverNote" className="text-[14px] font-semibold text-[#1d1d1f]">Note d'accompagnement (Optionnel)</Label>
                  <Textarea 
                    id="coverNote" 
                    name="coverNote"
                    placeholder="Dites-en un peu plus sur votre motivation pour ce poste..." 
                    className="min-h-[120px] rounded-2xl border-[#d2d2d7] focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] resize-none p-4"
                  />
                </div>
                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#d2d2d7]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Briefcase className="w-4 h-4 text-[#1d1d1f]" />
                    </div>
                    <p className="text-[13px] text-[#1d1d1f] font-medium">
                      Votre CV Kladriva est à jour à 85%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-[#f5f5f7] border-t border-[#d2d2d7]">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-full h-12 px-6 font-semibold text-[#1d1d1f]">
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="rounded-full h-12 px-8 bg-[#1d1d1f] hover:bg-black text-white font-semibold gap-2 shadow-lg shadow-black/10">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Envoyer mon profil"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
