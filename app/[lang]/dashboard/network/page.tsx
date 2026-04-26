import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, Globe, Users, TrendingUp, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CreatePostForm } from "@/components/CreatePostForm";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { likePost, followUser } from "@/app/actions/posts";

export default async function NetworkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/${lang}/auth/signin`);
  }

  const dict = await getDictionary(lang as "en" | "fr");

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
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] mb-2">{dict.network.title}</h1>
          <p className="text-[17px] text-[#86868b]">{dict.network.tagline}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold uppercase tracking-wider text-[#86868b]">Connections</CardTitle>
            <Users className="h-5 w-5 text-[#1d1d1f]" />
          </CardHeader>
          <CardContent>
            <div className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">0</div>
            <p className="text-[13px] font-medium text-[#86868b]">No new this month</p>
          </CardContent>
        </Card>
        <Card className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold uppercase tracking-wider text-[#86868b]">Profile Views</CardTitle>
            <TrendingUp className="h-5 w-5 text-[#1d1d1f]" />
          </CardHeader>
          <CardContent>
            <div className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">0</div>
            <p className="text-[13px] font-medium text-[#86868b]">Starting fresh</p>
          </CardContent>
        </Card>
        <Card className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold uppercase tracking-wider text-[#86868b]">Post Impressions</CardTitle>
            <Globe className="h-5 w-5 text-[#1d1d1f]" />
          </CardHeader>
          <CardContent>
            <div className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">0</div>
            <p className="text-[13px] font-medium text-[#86868b]">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          {session.user?.id && <CreatePostForm userId={session.user.id} />}
          
          <div className="space-y-6">
            <h2 className="text-[20px] font-semibold text-[#1d1d1f]">Community Feed</h2>
            {posts.length === 0 ? (
              <Card className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-none py-16 text-center">
                <p className="text-[#86868b] text-[15px]">The feed is quiet. Be the first to post!</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="border border-[#d2d2d7] rounded-[24px] bg-white shadow-none overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-[14px] bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] font-semibold text-[15px] overflow-hidden">
                        {post.user.image ? (
                          <img src={post.user.image} alt={post.user.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          post.user.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1d1d1f] text-[15px]">{post.user.name}</p>
                        <p className="text-[13px] text-[#86868b] font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#1d1d1f] text-[15px] leading-relaxed mb-6">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-8 pt-6 border-t border-[#d2d2d7]">
                      <form action={async () => {
                        "use server"
                        if(!session?.user?.id) return;
                        await likePost(post.id, session.user.id);
                      }}>
                        <button type="submit" className="flex items-center gap-2 text-[14px] font-medium text-[#86868b] hover:text-[#0066cc] transition-colors group">
                          <Heart className="w-5 h-5 group-hover:fill-[#0066cc]/20" /> 
                          <span>{post._count.likes}</span>
                        </button>
                      </form>
                      <button className="flex items-center gap-2 text-[14px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                        <MessageCircle className="w-5 h-5" /> 
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
        <div className="space-y-6">
          <h2 className="text-[20px] font-semibold text-[#1d1d1f]">Suggested for you</h2>
          {suggestedUsers.map((person) => (
            <Card key={person.id} className="border border-[#d2d2d7] rounded-[20px] bg-white shadow-none">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-[14px] bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] font-semibold text-[15px] shrink-0 overflow-hidden">
                  {person.image ? (
                    <img src={person.image} alt={person.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    person.name?.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1d1d1f] text-[15px] truncate">{person.name}</p>
                  <p className="text-[13px] font-medium text-[#86868b] truncate">{person.headline || 'Kladriva Student'}</p>
                </div>
                <form action={async () => {
                  "use server"
                  if(!session?.user?.id) return;
                  await followUser(session.user.id, person.id);
                }}>
                  <Button type="submit" size="sm" variant="outline" className="border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
