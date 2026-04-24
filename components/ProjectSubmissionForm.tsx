"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Globe, Send } from "lucide-react";
import { runAIProjectReview } from "@/app/actions/ai-review";

export function ProjectSubmissionForm({ 
  projectId, 
  projectTitle 
}: { 
  projectId: string; 
  projectTitle: string 
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/projects/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, repoUrl, liveUrl }),
      });
      
      if (response.ok) {
        const { submissionId } = await response.json();
        setIsSubmitted(true);
        // Trigger AI Review in the background
        runAIProjectReview(submissionId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-center py-8">
        <CardContent className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Send className="text-emerald-500 w-6 h-6" />
          </div>
          <CardTitle className="text-white">Submission Received!</CardTitle>
          <CardDescription className="text-slate-400">
            Your project "{projectTitle}" has been submitted for review.
            We'll notify you once a mentor has provided feedback.
          </CardDescription>
          <Button variant="outline" onClick={() => setIsSubmitted(false)} className="border-slate-700 text-slate-300">
            View My Submissions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Submit Project: {projectTitle}</CardTitle>
        <CardDescription className="text-slate-400">
          Provide your repository link and a live preview URL (optional).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="repoUrl" className="text-slate-300 flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> Repository URL
            </Label>
            <Input 
              id="repoUrl"
              placeholder="https://github.com/yourusername/project-repo"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl" className="text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Live Preview URL (Optional)
            </Label>
            <Input 
              id="liveUrl"
              placeholder="https://your-project-demo.vercel.app"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
          >
            {isSubmitting ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
