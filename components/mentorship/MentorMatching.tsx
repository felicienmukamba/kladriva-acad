"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Search, Check, ChevronRight, Video, MessageCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MOCK_MENTORS = [
  {
    id: "1",
    name: "Alexandre Durant",
    role: "Senior Fullstack Engineer @ Google",
    specialties: ["React", "Node.js", "System Design"],
    image: "https://i.pravatar.cc/150?u=alex",
    matchScore: 98,
    introVideo: true,
  },
  {
    id: "2",
    name: "Sarah Lindberg",
    role: "Lead UI/UX Designer @ Apple",
    specialties: ["Figma", "Design Systems", "Prototyping"],
    image: "https://i.pravatar.cc/150?u=sarah",
    matchScore: 95,
    introVideo: true,
  },
  {
    id: "3",
    name: "Thomas Wick",
    role: "CTO @ Techflow",
    specialties: ["Go", "Kubernetes", "Cloud Arch"],
    image: "https://i.pravatar.cc/150?u=thomas",
    matchScore: 89,
    introVideo: false,
  }
];

export function MentorMatching() {
  const [isMatching, setIsMatching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  const startMatching = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setShowResults(true);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {!showResults && !isMatching && (
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <CardContent className="p-12 text-center space-y-6 relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center mx-auto mb-4 border border-white/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Trouvez votre Mentor Idéal</h2>
            <p className="text-indigo-100 text-lg max-w-xl mx-auto">
              Notre algorithme analyse vos objectifs et votre niveau technique pour vous proposer les meilleurs mentors.
            </p>
            <Button 
              onClick={startMatching}
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-full px-10 h-14 shadow-xl shadow-indigo-900/20 gap-3"
            >
              Lancer le Matching Algorithmique <ChevronRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {isMatching && (
        <div className="py-24 text-center space-y-8">
          <div className="relative w-32 h-32 mx-auto">
            <motion.div 
              className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-2 border-4 border-indigo-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Analyse de votre profil...</h3>
            <p className="text-slate-400">Nous parcourons notre réseau de +500 experts.</p>
          </div>
        </div>
      )}

      {showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Check className="w-6 h-6 text-emerald-500" /> Vos Matchs Recommandés
            </h2>
            <Button variant="ghost" onClick={() => setShowResults(false)} className="text-slate-400">Relancer</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MOCK_MENTORS.map((mentor) => (
              <Card 
                key={mentor.id}
                className={cn(
                  "cursor-pointer transition-all duration-500 border-2 relative overflow-hidden",
                  selectedMentor === mentor.id 
                    ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_30px_rgba(99,102,241,0.15)]" 
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                )}
                onClick={() => setSelectedMentor(mentor.id)}
              >
                {mentor.matchScore > 90 && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Best Match
                  </div>
                )}
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-2 border-indigo-500/50">
                        <AvatarImage src={mentor.image} />
                        <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5 border-2 border-slate-900">
                        <div className="text-[10px] font-bold text-white">{mentor.matchScore}%</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{mentor.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{mentor.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5">
                    {mentor.specialties.map(s => (
                      <span key={s} className="text-[10px] px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    {mentor.introVideo && (
                      <Button variant="outline" className="w-full h-10 rounded-xl gap-2 border-slate-700 text-slate-300 hover:bg-slate-800">
                        <Video className="w-4 h-4" /> Voir Intro Video
                      </Button>
                    )}
                    <Button className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2">
                      <Calendar className="w-4 h-4" /> Book Kick-off
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
