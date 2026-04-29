import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, Globe, Users, TrendingUp, Heart, Sparkles, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CreatePostForm } from "@/components/CreatePostForm";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { likePost, followUser } from "@/app/actions/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function NetworkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/${lang}/auth/signin`);
  }

  const user = session.user as any;

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{dict.network.title}</h1>
          <p className="text-lg text-muted-foreground">{dict.network.tagline}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50 bg-card shadow-apple rounded-2xl overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Réseau</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">124</div>
            <p className="text-xs font-medium text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% cette semaine
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-apple rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Réputation</CardTitle>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{user.reputation || 0}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Niveau: Pionnier</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-apple rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Activités</CardTitle>
            <Activity className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">12</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Actions ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border-border/50 rounded-2xl p-6 shadow-apple">
             {session.user?.id && <CreatePostForm userId={session.user.id} />}
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Flux Communautaire</h2>
            {posts.length === 0 ? (
              <Card className="border-dashed border-2 py-16 text-center bg-muted/20">
                <p className="text-muted-foreground">Le flux est calme. Soyez le premier à poster !</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="apple-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12 border border-primary/20">
                        {post.user.image ? (
                          <AvatarImage src={post.user.image} />
                        ) : (
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">{post.user.name?.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-foreground text-[15px]">{post.user.name}</p>
                           {post.user.reputation > 500 && <Badge className="bg-amber-500/10 text-amber-600 border-none h-4 text-[8px] font-black">EXPERT</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground text-[15px] leading-relaxed mb-6">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-8 pt-6 border-t border-border/50">
                      <form action={async () => {
                        "use server"
                        if(!session?.user?.id) return;
                        await likePost(post.id, session.user.id);
                      }}>
                        <button type="submit" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
                          <Heart className="w-5 h-5 group-hover:fill-primary/20" /> 
                          <span>{post._count.likes}</span>
                        </button>
                      </form>
                      <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
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
          <h2 className="text-xl font-bold text-foreground">Suggestions de contacts</h2>
          <div className="space-y-3">
            {suggestedUsers.map((person) => (
              <Card key={person.id} className="border-border/50 bg-card hover:bg-muted/30 transition-colors rounded-2xl shadow-apple">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-primary/20">
                    <AvatarImage src={person.image || ''} />
                    <AvatarFallback>{person.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{person.bio || 'Étudiant Kladriva'}</p>
                  </div>
                  <form action={async () => {
                    "use server"
                    if(!session?.user?.id) return;
                    await followUser(session.user.id, person.id);
                  }}>
                    <Button type="submit" size="sm" variant="ghost" className="text-primary hover:bg-primary/10 rounded-full h-10 w-10 p-0">
                      <UserPlus className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ad/Highlight Section */}
          <Card className="apple-card border-none bg-gradient-to-br from-indigo-600 to-primary text-white p-6">
             <h4 className="font-bold mb-2">Devenez Mentor</h4>
             <p className="text-xs text-white/80 leading-relaxed mb-6">Partagez votre expertise et gagnez des points de réputation bonus en aidant les nouveaux apprenants.</p>
             <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold text-xs h-10">Postuler</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
