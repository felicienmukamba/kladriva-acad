"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createJob, updateJob } from "@/lib/admin-actions"
import { useDictionary } from "@/components/DictionaryProvider"

export function JobForm({ initialData, lang }: { initialData?: any, lang: string }) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      salaryRange: formData.get("salaryRange") as string,
      type: formData.get("type") as string,
      remote: formData.get("remote") === "on",
    }

    try {
      if (initialData) {
        await updateJob(initialData.id, data)
      } else {
        await createJob(data)
      }
      router.push(`/${lang}/dashboard/admin/jobs`)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-10 apple-card bg-white">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input id="title" name="title" defaultValue={initialData?.title} required className="rounded-xl h-12" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={initialData?.description} required className="rounded-xl min-h-[150px]" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={initialData?.location} required className="rounded-xl h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input id="salaryRange" name="salaryRange" defaultValue={initialData?.salaryRange} placeholder="e.g. $80k - $120k" className="rounded-xl h-12" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Job Type</Label>
          <select title={dict.admin.jobs.typejob} id="type" name="type" defaultValue={initialData?.type || "FULL_TIME"} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="FULL_TIME">{dict.admin.jobs.types.fulltime}</option>
            <option value="PART_TIME">{dict.admin.jobs.types.parttime}</option>
            <option value="CONTRACT">{dict.admin.jobs.types.contract}</option>
            <option value="FREELANCE">{dict.admin.jobs.types.freelance}</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 pt-8">
           <input title={dict.admin.jobs.remote}  type="checkbox" id="remote" name="remote" defaultChecked={initialData?.remote} className="w-5 h-5 rounded border-slate-300" />
           <Label htmlFor="remote">Remote Opportunity</Label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="ghost" type="button" onClick={() => router.back()} className="rounded-xl h-12 px-8">Cancel</Button>
        <Button disabled={loading} type="submit" className="rounded-xl h-12 px-10 bg-slate-950 text-white hover:bg-slate-800">
          {loading ? "Saving..." : initialData ? "Update Job" : "Post Job"}
        </Button>
      </div>
    </form>
  )
}
