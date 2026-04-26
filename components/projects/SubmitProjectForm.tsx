"use client"

import { useState } from "react"
import { submitProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, Loader2 } from "lucide-react"
import { IconBrandGithub } from "@tabler/icons-react"

export function SubmitProjectForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const repoUrl = formData.get("repoUrl") as string
    const liveUrl = formData.get("liveUrl") as string
    
    await submitProject(projectId, repoUrl, liveUrl)
    setLoading(false)
  }

  return (
    <form action={onSubmit} className="space-y-4 mt-6 p-4 bg-[#f5f5f7] rounded-[16px]">
      <div className="space-y-3">
        <h4 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider">Submit your work</h4>
        <div className="relative">
          <IconBrandGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
          <Input name="repoUrl" required placeholder="GitHub Repository URL" className="pl-10 h-10 bg-white border-[#d2d2d7] rounded-lg text-[13px]" />
        </div>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
          <Input name="liveUrl" placeholder="Live Demo URL (Optional)" className="pl-10 h-10 bg-white border-[#d2d2d7] rounded-lg text-[13px]" />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-10 bg-[#1d1d1f] text-white hover:bg-black font-medium rounded-lg">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit for Peer Review"}
      </Button>
    </form>
  )
}
