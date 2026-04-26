"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { enrollInCourse } from "@/app/actions/courses"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function EnrollButton({ 
  userId, 
  courseId, 
  isEnrolled,
  lang 
}: { 
  userId: string, 
  courseId: string, 
  isEnrolled: boolean,
  lang: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEnroll = async () => {
    if (!userId) {
      router.push(`/${lang}/auth/signin`)
      return
    }

    setLoading(true)
    const result = await enrollInCourse(userId, courseId)
    setLoading(false)

    if (result.success) {
      toast.success("Enrolled successfully!")
      router.push(`/${lang}/dashboard/learning`)
    } else {
      toast.error(result.error || "Failed to enroll")
    }
  }

  if (isEnrolled) {
    return (
      <Button 
        className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold"
        onClick={() => router.push(`/${lang}/dashboard/learning`)}
      >
        Go to Course
      </Button>
    )
  }

  return (
    <Button 
      className="w-full bg-[#0056d2] hover:bg-[#0041a8] h-14 text-lg font-bold"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
      Enroll for Free
    </Button>
  )
}
