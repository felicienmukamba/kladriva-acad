import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Target, Trophy, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, Alex!</h1>
        <p className="text-slate-400">Here's an overview of your learning progress and career goals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Current Course</CardTitle>
            <PlayCircle className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Full-Stack Next.js</div>
            <p className="text-xs text-slate-400 mt-1">
              65% completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <p className="text-xs text-slate-400 mt-1">
              1 pending review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Mentorship</CardTitle>
            <Clock className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1 Session</div>
            <p className="text-xs text-slate-400 mt-1">
              Tomorrow at 10:00 AM
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Job Matches</CardTitle>
            <Trophy className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">14</div>
            <p className="text-xs text-slate-400 mt-1">
              +3 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">Your latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-indigo-400 border-indigo-400/30">Project</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Submitted "E-commerce API"</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">Course</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Completed "React Hooks Deep Dive"</p>
                <p className="text-xs text-slate-400">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
            <CardDescription className="text-slate-400">Keep track of your goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 font-bold">
                24
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Portfolio Review Session</p>
                <p className="text-xs text-slate-400">Mentor: Sarah Jenkins</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400 font-bold">
                28
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Final Project Submission</p>
                <p className="text-xs text-slate-400">Full-Stack Next.js Course</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
