"use client"

import { useState } from "react"
import { submitPeerReview } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export function PeerReviewForm({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const score = parseInt(formData.get("score") as string)
    const feedback = formData.get("feedback") as string
    
    await submitPeerReview(submissionId, score, feedback)
    setLoading(false)
  }

  return (
    <form action={onSubmit} className="space-y-4 mt-4 pt-4 border-t border-[#d2d2d7]">
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Score (0-100)</label>
          <Input type="number" name="score" required min="0" max="100" className="h-10 bg-white border-[#d2d2d7] rounded-lg text-[13px]" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Constructive Feedback</label>
        <textarea name="feedback" required rows={3} className="w-full bg-white border border-[#d2d2d7] rounded-lg p-3 text-[13px] resize-none focus:outline-none focus:border-[#0066cc]" placeholder="What did they do well? What can be improved?" />
      </div>
      <Button type="submit" disabled={loading} className="w-full h-10 bg-[#0066cc] text-white hover:bg-[#0055b3] font-medium rounded-lg">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
      </Button>
    </form>
  )
}
