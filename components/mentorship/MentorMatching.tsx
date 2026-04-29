"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Search, Check, ChevronRight, Video, MessageCircle, Calendar, Target, Zap } from "lucide-react";
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
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!showResults && !isMatching && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 md:p-16 text-center space-y-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066cc]/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-[#0066cc]/10" />
            
            <div className="w-24 h-24 bg-[#f5f5f7] rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#d2d2d7]/30 transition-transform group-hover:rotate-12 duration-500">
              <Sparkles className="w-12 h-12 text-[#1d1d1f]" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight">
                Trouvez votre Mentor Idéal
              </h2>
              <p className="text-[#86868b] text-[18px] md:text-[20px] max-w-2xl mx-auto leading-relaxed">
                Notre algorithme de matching analyse vos objectifs et votre stack technique pour vous connecter avec l'expert parfait.
              </p>
            </div>

            <Button 
              onClick={startMatching}
              size="lg" 
              className="h-14 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold px-12 gap-3 shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              Lancer le Matching IA <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {isMatching && (
          <motion.div 
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 text-center space-y-8"
          >
            <div className="relative w-40 h-40 mx-auto">
              <motion.div 
                className="absolute inset-0 border-2 border-[#0066cc]/10 rounded-[48px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute inset-4 border-4 border-[#0066cc] rounded-[40px] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-12 h-12 text-[#0066cc]" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-[#1d1d1f]">Analyse de votre progression...</h3>
              <p className="text-[#86868b] text-[15px] font-medium uppercase tracking-widest">Calcul du score d'affinité avec +500 experts</p>
            </div>
          </motion.div>
        )}

        {showResults && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 md:p-12 space-y-10"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  Matchs Recommandés
                </h2>
                <p className="text-[#86868b] text-[15px]">Ces mentors sont les plus à même de vous aider à atteindre vos objectifs.</p>
              </div>
              <Button variant="ghost" onClick={() => setShowResults(false)} className="text-[#86868b] hover:bg-[#f5f5f7] rounded-full px-6 font-bold">Relancer l'IA</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {MOCK_MENTORS.map((mentor) => (
                <div 
                  key={mentor.id}
                  className={cn(
                    "group relative p-8 rounded-[40px] border-2 transition-all duration-500 cursor-pointer flex flex-col",
                    selectedMentor === mentor.id 
                      ? "border-[#1d1d1f] bg-[#f5f5f7]/50 shadow-2xl shadow-black/5" 
                      : "border-[#d2d2d7] bg-white hover:border-[#86868b]"
                  )}
                  onClick={() => setSelectedMentor(mentor.id)}
                >
                  {mentor.matchScore > 90 && (
                    <div className="absolute top-6 right-6 bg-[#1d1d1f] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                      Top Match
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center space-y-6 mb-8 flex-1">
                    <div className="relative">
                      <Avatar className="w-24 h-24 rounded-[32px] border-4 border-white shadow-xl transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage src={mentor.image} />
                        <AvatarFallback className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-2xl">{mentor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-2xl px-2.5 py-1.5 border-4 border-white shadow-lg text-[12px] font-black">
                        {mentor.matchScore}%
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight leading-tight">{mentor.name}</h3>
                      <p className="text-[14px] text-[#86868b] font-medium mt-1 leading-relaxed px-2">{mentor.role}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {mentor.specialties.map(s => (
                        <span key={s} className="text-[10px] px-3 py-1 rounded-lg bg-[#f5f5f7] text-[#1d1d1f] font-black uppercase tracking-tight border border-[#d2d2d7]/30">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-[#d2d2d7]/50">
                    {mentor.introVideo && (
                      <Button variant="outline" className="w-full h-11 rounded-full gap-2 border-[#d2d2d7] text-[#1d1d1f] font-bold hover:bg-[#f5f5f7] transition-all">
                        <Video className="w-4 h-4" /> Intro Video
                      </Button>
                    )}
                    <Button className="w-full h-11 rounded-full bg-[#1d1d1f] text-white hover:bg-black font-bold gap-2 shadow-lg shadow-black/5 transition-all active:scale-95">
                      <Calendar className="w-4 h-4" /> Réserver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
