"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createJob, updateJob } from "@/app/actions/admin-jobs"
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
      salary: formData.get("salary") as string,
      type: formData.get("type") as string,
      company: formData.get("company") as string,
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
          <Label htmlFor="salary">Salary / Rate</Label>
          <Input id="salary" name="salary" defaultValue={initialData?.salary} placeholder="e.g. $80k - $120k" className="rounded-xl h-12" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input id="company" name="company" defaultValue={initialData?.company} placeholder="e.g. Kladriva Academy" required className="rounded-xl h-12" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Job Type</Label>
          <select title={dict.admin.jobs.typejob} id="type" name="type" defaultValue={initialData?.type || "FULL_TIME"} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="FULL_TIME">{dict.admin.jobs.types.fulltime}</option>
            <option value="PART_TIME">{dict.admin.jobs.types.parttime}</option>
            <option value="CONTRACT">{dict.admin.jobs.types.contract}</option>
            <option value="FREELANCE">{dict.admin.jobs.types.freelance}</option>
          </select>
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
