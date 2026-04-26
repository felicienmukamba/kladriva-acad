"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { createModule, updateModule } from "@/app/actions/admin-curriculum"

interface ModuleDialogProps {
  courseId: string
  module?: {
    id: string
    title: string
    description: string | null
    order: number
  }
  nextOrder: number
}

export function ModuleDialog({ courseId, module, nextOrder }: ModuleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: module?.title || "",
    description: module?.description || "",
    order: module?.order ?? nextOrder,
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (module) {
        await updateModule(module.id, courseId, formData)
        toast.success("Module updated")
      } else {
        await createModule(courseId, formData)
        toast.success("Module created")
      }
      setOpen(false)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        module ? (
          <Button variant="ghost" size="sm" className="h-9 rounded-full font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50">Edit</Button>
        ) : (
          <Button size="sm" variant="outline" className="h-10 rounded-full font-medium border-slate-200 bg-white hover:bg-slate-50">
            <Plus className="w-4 h-4 mr-2" /> Add module
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{module ? "Edit Module" : "Add Module"}</DialogTitle>
            <DialogDescription>
              Create a new module to organize your course content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Introduction to React"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe what this module covers."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="apple-button w-full">
              {loading ? "Saving..." : "Save Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
