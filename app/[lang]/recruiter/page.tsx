"use client";

import React, { useState } from "react";
import { 
  Search, 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Award, 
  MapPin, 
  Code2, 
  ExternalLink,
  Filter,
  CheckCircle2,
  FileText,
  Building2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTalents = [
  { id: 1, name: "Amine Belkadi", role: "DevOps Engineer", location: "Casablanca, Maroc", skills: ["Docker", "Kubernetes", "AWS"], certifications: 3, image: "/avatars/1.png" },
  { id: 2, name: "Sophie Martin", role: "Full-Stack Developer", location: "Paris, France", skills: ["React", "Node.js", "Prisma"], certifications: 2, image: "/avatars/2.png" },
  { id: 3, name: "Jean-Claude Kamau", role: "Cloud Architect", location: "Nairobi, Kenya", skills: ["Terraform", "Azure", "Python"], certifications: 5, image: "/avatars/3.png" },
];

export default function RecruiterPortal() {
  const [certToken, setCertToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState<any>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulation
    setTimeout(() => {
      setVerifiedCert({
        student: "Amine Belkadi",
        course: "Expertise Kubernetes & Orchestration",
        date: "14 Janvier 2026",
        score: "94%",
        token: certToken || "KLA-CERT-8842-XF",
        status: "VALID"
      });
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[100%] bg-primary/20 rounded-full blur-[140px]"></div>
        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
           <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="text-primary border-primary/50 px-3 py-1 rounded-full bg-primary/5 uppercase tracking-widest text-[10px] font-bold">Portail Recruteur</Badge>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
             Recrutez les meilleurs <span className="text-primary">talents technologiques</span> d'Afrique et d'ailleurs.
           </h1>
           <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-10">
             Accédez à un vivier d'apprenants certifiés par Kladriva Academy. 100% de nos diplômés ont validé des projets réels et passé des revues par les pairs.
           </p>
           <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-xl h-14 px-8 text-lg font-bold">Publier une offre</Button>
              <Button size="lg" variant="outline" className="rounded-xl h-14 px-8 text-lg font-bold border-white/20 hover:bg-white/10">Contacter le support Talent</Button>
           </div>
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-7xl -mt-12">
        <Tabs defaultValue="search" className="space-y-8">
          <TabsList className="bg-card/50 backdrop-blur-xl border p-1 rounded-2xl h-16 w-full lg:w-fit">
            <TabsTrigger value="search" className="rounded-xl h-full px-8 text-sm font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-4 h-4" /> Trouver des talents
            </TabsTrigger>
            <TabsTrigger value="verify" className="rounded-xl h-full px-8 text-sm font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShieldCheck className="w-4 h-4" /> Vérifier un certificat
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-xl h-full px-8 text-sm font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Briefcase className="w-4 h-4" /> Mes offres actives
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            {/* Search Bar */}
            <div className="bg-card border rounded-2xl p-6 shadow-apple flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Rechercher par compétence (Docker, React...), rôle ou ville..." className="pl-12 h-14 rounded-xl text-md border-border/50" />
              </div>
              <Button variant="outline" className="h-14 px-6 rounded-xl gap-2 border-border/50">
                <Filter className="w-5 h-5" /> Filtres avancés
              </Button>
              <Button className="h-14 px-8 rounded-xl font-bold">Lancer la recherche</Button>
            </div>

            {/* Talent Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {mockTalents.map((talent) => (
                 <Card key={talent.id} className="apple-card group">
                   <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                         <Avatar className="w-16 h-16 border-2 border-primary/20 p-1 bg-white">
                           <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <Badge variant="secondary" className="rounded-full bg-green-500/10 text-green-600 border-none px-3 py-1 font-bold text-[10px] uppercase">Disponible</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{talent.name}</h3>
                      <p className="text-primary font-semibold text-sm mb-4">{talent.role}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                        <MapPin className="w-3.5 h-3.5" /> {talent.location}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-8">
                        {talent.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="rounded-full border-border/50 bg-muted/30 text-[10px] font-medium">{skill}</Badge>
                        ))}
                      </div>

                      <div className="pt-6 border-t flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Award className="w-4 h-4 text-amber-500" /> {talent.certifications} Certifs
                         </div>
                         <Button variant="ghost" size="sm" className="rounded-full text-primary font-bold gap-1.5">
                           Voir profil <ExternalLink className="w-3 h-3" />
                         </Button>
                      </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="max-w-3xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4 mb-12">
               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                 <ShieldCheck className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-bold tracking-tight">Authenticité Garanti par Kladriva</h2>
               <p className="text-muted-foreground max-w-md mx-auto">Saisissez l'ID unique figurant sur le certificat d'un candidat pour vérifier son authenticité en temps réel.</p>
            </div>

            <div className="flex gap-3">
              <Input 
                value={certToken} 
                onChange={(e) => setCertToken(e.target.value)}
                placeholder="Ex: KLA-CERT-8842-XF" 
                className="h-16 text-xl text-center font-mono rounded-2xl border-2 focus-visible:ring-primary/20" 
              />
              <Button onClick={handleVerify} disabled={isVerifying} className="h-16 px-10 rounded-2xl font-bold text-lg">
                {isVerifying ? "Vérification..." : "Vérifier"}
              </Button>
            </div>

            {verifiedCert && (
              <div className="animate-in fade-in zoom-in-95 duration-500 mt-12">
                 <Card className="border-green-500/30 bg-green-500/5 backdrop-blur-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-green-500 text-white p-6 flex flex-row items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6" />
                          <CardTitle>Certificat Vérifié & Authentique</CardTitle>
                       </div>
                       <Badge className="bg-white/20 text-white border-white/20">Valid</Badge>
                    </CardHeader>
                    <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Détenteur</p>
                            <p className="text-xl font-bold">{verifiedCert.student}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Certification</p>
                            <p className="text-xl font-bold">{verifiedCert.course}</p>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Délivré le</p>
                            <p className="text-xl font-bold">{verifiedCert.date}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Score final</p>
                            <p className="text-xl font-bold text-green-600">{verifiedCert.score}</p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer Info */}
      <section className="bg-slate-50 border-t py-20 mt-32">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold">Solutions Entreprise</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Formez vos équipes internes avec nos parcours personnalisés et suivez leur progression en temps réel.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold">Talents On-Demand</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Trouvez des freelances certifiés pour vos projets critiques en quelques minutes grâce à notre moteur de recherche.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold">Recrutement Direct</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Pas de commissions sur l'embauche. Nous facilitons simplement la mise en relation entre talents et entreprises.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
