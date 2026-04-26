"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from "@/app/actions/admin-courses"

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
        toast.success("Course updated successfully")
      } else {
        await createCourse(formData)
        toast.success("Course created successfully")
      }
      router.refresh()
      router.push(`/dashboard/admin/courses`)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl apple-surface bg-white p-6 sm:p-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Course Title</Label>
        <Input 
          id="title" 
          placeholder="e.g. Master React & Next.js"
          className="h-11 rounded-2xl border-slate-200 bg-white transition-all"
          value={formData.title} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
        <Textarea 
          id="description" 
          placeholder="What will students learn in this course?"
          className="rounded-2xl border-slate-200 bg-white transition-all min-h-[120px]"
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Image URL</Label>
        <Input 
          id="imageUrl" 
          placeholder="https://..."
          className="h-11 rounded-2xl border-slate-200 bg-white transition-all"
          value={formData.imageUrl} 
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
        />
      </div>

      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
        <Checkbox 
          id="published" 
          className="rounded-md"
          checked={formData.published} 
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })} 
        />
        <Label htmlFor="published" className="font-medium">Make this course public</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="h-11 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-medium px-8 shadow-sm">
          {course ? "Save Changes" : "Create Course"}
        </Button>
        {course && (
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-full h-11 px-8 text-destructive border-destructive/20 bg-white hover:bg-destructive/5 font-medium"
            disabled={loading}
            onClick={async () => {
              if (confirm("Are you sure? This action cannot be undone.")) {
                await deleteCourse(course.id)
                router.push(`/dashboard/admin/courses`)
              }
            }}
          >
            Delete Course
          </Button>
        )}
      </div>
    </form>
  )
}
