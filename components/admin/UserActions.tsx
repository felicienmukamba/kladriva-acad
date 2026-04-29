"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Mail, Shield, UserX, Loader2, CheckCircle2, Trash2 } from "lucide-react"
import { updateUserRole, deleteUser } from "@/lib/admin-actions"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function UserActions({ userId, currentRole, userName }: { userId: string, currentRole: string, userName: string }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showRoleDialog, setShowRoleDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const { toast } = useToast()

  async function handleRoleChange(newRole: string) {
    setIsLoading(true)
    try {
      await updateUserRole(userId, newRole)
      toast({
        title: "Rôle mis à jour",
        description: `${userName} est maintenant ${newRole}.`,
      })
      setShowRoleDialog(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    setIsLoading(true)
    try {
      await deleteUser(userId)
      toast({
        title: "Utilisateur supprimé",
        description: `Le compte de ${userName} a été retiré.`,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-[#f5f5f7] h-10 w-10">
            <MoreVertical className="w-5 h-5 text-[#86868b]" />
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-64 rounded-[24px] p-2 shadow-2xl border-[#d2d2d7] bg-white/80 backdrop-blur-xl">
          <div className="px-3 py-2 text-[11px] font-black uppercase tracking-widest text-[#86868b]">Changer le rôle</div>
          <DropdownMenuItem render={
            <div onClick={() => handleRoleChange("STUDENT")} className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              Étudiant
            </div>
          } />
          <DropdownMenuItem render={
            <div onClick={() => handleRoleChange("MENTOR")} className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-600" />
              </div>
              Mentor
            </div>
          } />
          <DropdownMenuItem render={
            <div onClick={() => handleRoleChange("ADMIN")} className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-[#1d1d1f] hover:bg-[#f5f5f7]">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-rose-600" />
              </div>
              Administrateur
            </div>
          } />
          <div className="h-px bg-[#f5f5f7] my-2 mx-1" />
          <DropdownMenuItem render={
            <div onClick={handleDelete} className="rounded-2xl gap-3 font-semibold p-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
              <Trash2 className="w-4.5 h-4.5" /> Supprimer l'utilisateur
            </div>
          } />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="rounded-[32px] border-[#d2d2d7] p-8 bg-white max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1d1d1f]">Changer le rôle</DialogTitle>
            <DialogDescription className="text-[#86868b]">
              Sélectionnez le nouveau rôle pour <strong>{userName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-6">
            {["STUDENT", "MENTOR", "INSTRUCTOR", "COMPANY", "ADMIN"].map((role) => (
              <Button 
                key={role}
                variant={currentRole === role ? "default" : "outline"}
                disabled={isLoading}
                onClick={() => handleRoleChange(role)}
                className={`h-14 rounded-2xl font-bold justify-between px-6 ${
                  currentRole === role ? "bg-[#1d1d1f] text-white" : "border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                {role}
                {currentRole === role && <CheckCircle2 className="w-5 h-5" />}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-[32px] border-[#d2d2d7] p-8 bg-white max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1d1d1f]">Supprimer l'utilisateur ?</DialogTitle>
            <DialogDescription className="text-[#86868b]">
              Cette action est irréversible. Toutes les données de <strong>{userName}</strong> seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-6">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} className="rounded-full h-12 flex-1 font-bold">
              Annuler
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={isLoading}
              className="rounded-full h-12 flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-600/20"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
