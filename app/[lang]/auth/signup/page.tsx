"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowRight, User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { register } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await register({
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: "STUDENT"
      });

      if (result.error) {
        toast({
          title: "Erreur d'inscription",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Compte créé !",
          description: "Vous allez être redirigé vers la page de connexion.",
        });
        router.push("/auth/signin");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Value Proposition */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-950 items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 text-white max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="p-2 bg-primary rounded-xl">
              <GraduationCap className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Kladriva Academy</span>
          </Link>
          
          <h2 className="text-4xl font-bold leading-tight mb-8">
            Propulsez votre carrière au niveau supérieur.
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">Mentorat Personnalisé</h4>
                <p className="text-white/60 text-sm mt-1">Un expert dédié pour vous guider à chaque étape de votre apprentissage.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">Projets du Monde Réel</h4>
                <p className="text-white/60 text-sm mt-1">Bâtissez un portfolio impressionnant avec des cas d'études concrets.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">Réseau d'Élite</h4>
                <p className="text-white/60 text-sm mt-1">Connectez-vous avec des recruteurs et des talents du monde entier.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Créer un compte</h2>
            <p className="text-muted-foreground mt-2">
              Déjà membre ?{" "}
              <Link href="/auth/signin" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                Connectez-vous ici
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="firstName" name="firstName" placeholder="Jean" className="pl-10 h-11 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="lastName" name="lastName" placeholder="Dupont" className="pl-10 h-11 rounded-xl" required />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="jean.dupont@entreprise.com" className="pl-10 h-11 rounded-xl" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="Min. 8 caractères" className="pl-10 h-11 rounded-xl" required />
              </div>
              <p className="text-[10px] text-muted-foreground">Inclure une majuscule, un chiffre et un caractère spécial.</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
              <input type="checkbox" id="terms" title="Accepter les conditions" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" required />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-normal font-normal">
                J'accepte les <Link href="/terms" className="text-primary hover:underline">Conditions d'utilisation</Link> et la <Link href="/privacy" className="text-primary hover:underline">Politique de confidentialité</Link>.
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold gap-2 shadow-lg shadow-primary/20 mt-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Commencer l'aventure"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">Inscrivez-vous rapidement via</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-11 rounded-xl gap-2 hover:bg-muted/50 border-border/50">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
            <Button variant="outline" className="h-11 rounded-xl gap-2 hover:bg-muted/50 border-border/50">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
