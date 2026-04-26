import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Globe, CheckCircle, Clock, ChevronRight, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const submission = await prisma.projectSubmission.findUnique({
    where: { id },
    include: {
      project: true,
      user: true,
    }
  });

  if (!submission) notFound();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-200">Submission Details</span>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{submission.project.title}</h1>
          <p className="text-slate-400">Submitted on {new Date(submission.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`px-3 py-1 ${
            submission.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
            submission.status === 'REVIEWED' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
            'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            {submission.status}
          </Badge>
          {submission.grade && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span className="text-white font-bold text-xl">{submission.grade}</span>
              <span className="text-slate-500 text-sm">/100</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Feedback */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" /> AI Review Report
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {submission.status === 'PENDING' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400">AI is currently analyzing your code. This usually takes 30-60 seconds...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-slate max-w-none prose-headings:text-indigo-400 prose-strong:text-white prose-p:text-slate-300">
                  <ReactMarkdown>{submission.feedback || "No feedback available."}</ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submission Info */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Project Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-200 font-medium">Source Code Repository</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10" 
                  render={<a href={submission.repoUrl!} target="_blank" rel="noreferrer" />}
                >
                  Open Repo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              {submission.liveUrl && (
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-200 font-medium">Live Demo Preview</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10" 
                    render={<a href={submission.liveUrl} target="_blank" rel="noreferrer" />}
                  >
                    View Live <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-500/20 p-1 rounded">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-sm text-slate-300">Implement AI suggestions to improve your code quality.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-500/20 p-1 rounded">
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-sm text-slate-300">Book a session with a mentor to discuss the feedback in detail.</p>
                </div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4">
                Update Submission
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
