"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPost } from "@/app/actions/posts";
import { Send } from "lucide-react";

export function CreatePostForm({ userId }: { userId: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createPost(userId, content);
      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-[#d2d2d7] shadow-none bg-[#f5f5f7] rounded-[24px]">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <textarea 
            className="w-full bg-white border border-[#d2d2d7] rounded-[16px] p-4 text-[#1d1d1f] placeholder:text-[#86868b] resize-none focus:outline-none focus:border-[#1d1d1f] transition-colors"
            placeholder="Share an update, project, or insight..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="bg-[#1d1d1f] hover:bg-black text-white font-medium rounded-full h-10 px-6 gap-2"
            >
              {isSubmitting ? "Posting..." : "Post"}
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
