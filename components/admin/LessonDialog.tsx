"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, FileText, Trash2, Globe } from "lucide-react"
import { toast } from "sonner"
import { createLesson, updateLesson, createResource, deleteResource } from "@/app/actions/admin-curriculum"

interface LessonDialogProps {
  moduleId: string
  courseId: string
  lesson?: {
    id: string
    title: string
    content: string | null
    videoUrl: string | null
    order: number
    resources?: any[]
  }
  nextOrder: number
}

export function LessonDialog({ moduleId, courseId, lesson, nextOrder }: LessonDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resLoading, setResLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    content: lesson?.content || "",
    videoUrl: lesson?.videoUrl || "",
    order: lesson?.order ?? nextOrder,
  })

  const [newRes, setNewRes] = useState({
    title: "",
    url: "",
    type: "PDF",
    category: "Technical"
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (lesson) {
        await updateLesson(lesson.id, courseId, formData)
        toast.success("Lesson updated")
      } else {
        await createLesson(moduleId, courseId, formData)
        toast.success("Lesson created")
      }
      setOpen(false)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onAddResource() {
    if (!lesson) return
    if (!newRes.title || !newRes.url) {
      toast.error("Resource title and URL are required")
      return
    }
    setResLoading(true)
    try {
      await createResource(lesson.id, courseId, newRes)
      setNewRes({ title: "", url: "", type: "PDF", category: "Technical" })
      toast.success("Resource added")
    } catch (error) {
      toast.error("Failed to add resource")
    } finally {
      setResLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        lesson ? (
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-white">
            <Settings className="w-4 h-4 text-slate-400" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-10 rounded-full text-slate-700 font-medium text-sm hover:bg-slate-50 w-full justify-start mt-2">
            <Plus className="w-4 h-4 mr-2" /> Add lesson
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lesson ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
            <DialogDescription>
              Configure lesson content and associated resources.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl">
              <TabsTrigger value="content" className="rounded-xl">Content</TabsTrigger>
              <TabsTrigger value="resources" className="rounded-xl" disabled={!lesson}>Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 py-4">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Setting up your environment"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="e.g. https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your lesson content here..."
                    rows={8}
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
                <Button type="submit" disabled={loading} className="apple-button w-full mt-4">
                  {loading ? "Saving..." : "Save Lesson"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Existing Resources</h4>
                {lesson?.resources?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No resources added yet.</p>
                ) : (
                  <div className="grid gap-2">
                    {lesson?.resources?.map((res) => (
                      <div key={res.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{res.title}</p>
                            <p className="text-[10px] text-slate-500">{res.type} • {res.category}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full text-slate-300 hover:text-destructive"
                          onClick={async () => {
                            if(confirm("Delete this resource?")) {
                              await deleteResource(res.id, courseId)
                              toast.success("Resource deleted")
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Add New Resource</h4>
                <div className="grid gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="grid gap-2">
                    <Label htmlFor="res-title">Resource Title</Label>
                    <Input 
                      id="res-title" 
                      value={newRes.title} 
                      onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
                      placeholder="e.g. Project Assets Zip"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="res-url">URL / Link</Label>
                    <Input 
                      id="res-url" 
                      value={newRes.url} 
                      onChange={(e) => setNewRes({ ...newRes, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="res-type">Type</Label>
                      <select 
                        id="res-type" 
                        value={newRes.type} 
                        onChange={(e) => setNewRes({ ...newRes, type: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                        aria-label="Resource Type"
                      >
                        <option value="PDF">PDF</option>
                        <option value="FIGMA">FIGMA</option>
                        <option value="ZIP">ZIP</option>
                        <option value="LINK">LINK</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="res-cat">Category</Label>
                      <select 
                        id="res-cat" 
                        value={newRes.category} 
                        onChange={(e) => setNewRes({ ...newRes, category: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                        aria-label="Resource Category"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Design">Design</option>
                        <option value="Career">Career</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={onAddResource} 
                    disabled={resLoading}
                    className="w-full bg-slate-900 text-white rounded-xl h-10"
                  >
                    {resLoading ? "Adding..." : "Add Resource"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
      </DialogContent>
    </Dialog>
  )
}
