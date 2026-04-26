"use client"

import { useState } from "react"
import { createThread, addCommentToThread } from "@/app/actions/community"
import { Button } from "@/components/ui/button"
import { MessageSquare, MessageCircle, Send, Loader2 } from "lucide-react"

export function CourseForum({ courseId, threads }: { courseId: string, threads: any[] }) {
  const [loading, setLoading] = useState(false)

  async function handleCreateThread(formData: FormData) {
    setLoading(true)
    await createThread(courseId, formData.get("title") as string, formData.get("content") as string)
    setLoading(false)
    ;(document.getElementById("threadForm") as HTMLFormElement).reset()
  }

  async function handleAddComment(formData: FormData) {
    await addCommentToThread(formData.get("threadId") as string, formData.get("content") as string)
    ;(document.getElementById("commentForm-" + formData.get("threadId")) as HTMLFormElement).reset()
  }

  return (
    <div className="mt-16 pt-12 border-t border-[#d2d2d7]">
      <div className="flex items-center gap-3 mb-8">
         <MessageSquare className="w-6 h-6 text-[#1d1d1f]" />
         <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f]">Course Discussion</h2>
      </div>

      <div className="space-y-8">
        <form id="threadForm" action={handleCreateThread} className="bg-[#f5f5f7] p-6 rounded-[24px] space-y-4">
           <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Ask a question</h3>
           <input name="title" required placeholder="Question Title" className="w-full h-12 bg-white border border-[#d2d2d7] rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#0066cc]" />
           <textarea name="content" required rows={3} placeholder="Describe what you need help with..." className="w-full bg-white border border-[#d2d2d7] rounded-xl p-4 text-[15px] resize-none focus:outline-none focus:border-[#0066cc]" />
           <Button type="submit" disabled={loading} className="h-10 bg-[#1d1d1f] hover:bg-black text-white font-medium rounded-full px-6">
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Question"}
           </Button>
        </form>

        <div className="space-y-6">
          {threads.map(thread => (
            <div key={thread.id} className="bg-white border border-[#d2d2d7] p-6 rounded-[24px]">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-semibold text-[11px]">
                     {(thread.author?.name || "U").charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1d1d1f]">{thread.title}</h4>
                    <p className="text-[12px] text-[#86868b]">{thread.author?.name || "Student"} • {new Date(thread.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>
               <p className="text-[15px] text-[#1d1d1f] leading-relaxed mb-6">{thread.content}</p>
               
               {thread.comments && thread.comments.length > 0 && (
                 <div className="pl-6 border-l-2 border-[#f5f5f7] space-y-4 mb-6">
                    {thread.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[9px] font-bold mt-1">
                           {(comment.user?.name || "U").charAt(0)}
                         </div>
                         <div>
                            <span className="text-[13px] font-semibold text-[#1d1d1f] mr-2">{comment.user?.name || "Student"}</span>
                            <span className="text-[14px] text-[#86868b]">{comment.content}</span>
                         </div>
                      </div>
                    ))}
                 </div>
               )}

               <form id={`commentForm-${thread.id}`} action={handleAddComment} className="flex gap-2">
                 <input type="hidden" name="threadId" value={thread.id} />
                 <input name="content" required placeholder="Write a reply..." className="flex-1 h-10 bg-[#f5f5f7] border-transparent rounded-full px-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20" />
                 <Button type="submit" variant="ghost" className="h-10 w-10 rounded-full bg-[#f5f5f7] text-[#1d1d1f] p-0 shrink-0">
                    <Send className="w-4 h-4" />
                 </Button>
               </form>
            </div>
          ))}
          {threads.length === 0 && (
            <p className="text-[15px] text-[#86868b] text-center py-8">No discussions yet. Be the first to ask a question!</p>
          )}
        </div>
      </div>
    </div>
  )
}
