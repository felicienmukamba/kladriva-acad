import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, Globe, Users, TrendingUp, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CreatePostForm } from "@/components/CreatePostForm";
import { redirect } from "next/navigation";

export default async function NetworkPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Fetch posts with author info and counts
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    take: 20,
  });

  // Fetch suggested users (excluding current user)
  const suggestedUsers = session.user?.id ? await prisma.user.findMany({
    where: {
      NOT: { id: session.user.id },
    },
    take: 5,
  }) : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Professional Network</h1>
          <p className="text-slate-400">Connect with peers, share your journey, and grow your professional influence.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Connections</CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-slate-500">No new this month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Profile Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-slate-500">Starting fresh</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Post Impressions</CardTitle>
            <Globe className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-slate-500">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          {session.user?.id && <CreatePostForm userId={session.user.id} />}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Community Feed</h2>
            {posts.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800 py-10 text-center">
                <p className="text-slate-500">The feed is quiet. Be the first to post!</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                        {post.user.image ? (
                          <img src={post.user.image} alt={post.user.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          post.user.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{post.user.name}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
                      <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-400 transition-colors group">
                        <Heart className="w-4 h-4 group-hover:fill-indigo-400/20" /> 
                        <span>{post._count.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                        <MessageCircle className="w-4 h-4" /> 
                        <span>{post._count.comments}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Suggested Connections */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Suggested for you</h2>
          {suggestedUsers.map((person) => (
            <Card key={person.id} className="bg-slate-900 border-slate-800">
              <CardContent className="py-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                  {person.image ? (
                    <img src={person.image} alt={person.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    person.name?.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{person.name}</p>
                  <p className="text-xs text-slate-400 truncate">{person.headline || 'Kladriva Student'}</p>
                </div>
                <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
