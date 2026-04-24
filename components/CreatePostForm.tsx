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
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <textarea 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Share an update, project, or insight..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
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
