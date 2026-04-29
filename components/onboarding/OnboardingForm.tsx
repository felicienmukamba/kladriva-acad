"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, 
  Target, 
  Clock, 
  Code, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Brain,
  Briefcase,
  Gamepad2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "objectives",
    title: "Quels sont vos objectifs ?",
    description: "Nous personnaliserons votre parcours en fonction de vos ambitions.",
    icon: Target,
  },
  {
    id: "level",
    title: "Quel est votre niveau actuel ?",
    description: "Ne vous inquiétez pas, nous avons des cours pour tous les niveaux.",
    icon: Brain,
  },
  {
    id: "time",
    title: "Combien de temps pouvez-vous y consacrer ?",
    description: "Une planification réaliste est la clé du succès.",
    icon: Clock,
  },
  {
    id: "interests",
    title: "Quels domaines vous passionnent ?",
    description: "Choisissez vos centres d'intérêt pour des recommandations ciblées.",
    icon: Sparkles,
  },
];

const OBJECTIVES = [
  { id: "career_switch", label: "Reconversion Professionnelle", icon: Briefcase, color: "text-blue-400" },
  { id: "upskilling", label: "Montée en Compétences", icon: Rocket, color: "text-purple-400" },
  { id: "hobby", label: "Apprentissage Passion", icon: Gamepad2, color: "text-pink-400" },
  { id: "project", label: "Lancer un Projet Perso", icon: Code, color: "text-emerald-400" },
];

const LEVELS = [
  { id: "beginner", label: "Débutant", description: "Je pars de zéro ou presque." },
  { id: "intermediate", label: "Intermédiaire", description: "J'ai déjà quelques bases solides." },
  { id: "advanced", label: "Avancé", description: "Je suis déjà un professionnel du domaine." },
];

const TIME_COMMITMENTS = [
  { id: "light", label: "Léger", description: "2-5 heures / semaine" },
  { id: "moderate", label: "Modéré", description: "5-15 heures / semaine" },
  { id: "intensive", label: "Intensif", description: "15+ heures / semaine" },
];

const INTERESTS = [
  "Frontend Development", "Backend Development", "UI/UX Design", 
  "Mobile Apps", "Data Science", "Cybersecurity", "Cloud Computing",
  "Product Management", "Marketing Digital", "Intelligence Artificielle"
];

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    objective: "",
    level: "",
    timeCommitment: "",
    interests: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      console.log("Onboarding completed:", formData);
      window.location.href = "/dashboard";
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const stepProgress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Étape {currentStep + 1} sur {STEPS.length}
          </span>
          <span className="text-sm font-bold text-indigo-400">
            {Math.round(stepProgress)}% complété
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${stepProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center md:text-left">
            <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl mb-4">
              {React.createElement(STEPS[currentStep].icon, { className: "w-8 h-8 text-indigo-400" })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              {STEPS[currentStep].title}
            </h1>
            <p className="text-slate-400 text-lg">
              {STEPS[currentStep].description}
            </p>
          </div>

          {/* Step Contents */}
          <div className="grid gap-4 md:grid-cols-2">
            {currentStep === 0 && OBJECTIVES.map((obj) => (
              <Card 
                key={obj.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2 hover:scale-[1.02] active:scale-[0.98]",
                  formData.objective === obj.id 
                    ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                )}
                onClick={() => setFormData({ ...formData, objective: obj.id })}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl bg-slate-800", obj.color)}>
                    <obj.icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-semibold text-white">{obj.label}</span>
                  {formData.objective === obj.id && (
                    <div className="ml-auto bg-indigo-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {currentStep === 1 && LEVELS.map((lvl) => (
              <Card 
                key={lvl.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2 hover:scale-[1.02] active:scale-[0.98]",
                  formData.level === lvl.id 
                    ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                )}
                onClick={() => setFormData({ ...formData, level: lvl.id })}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-bold text-white">{lvl.label}</span>
                    {formData.level === lvl.id && (
                      <div className="bg-indigo-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400">{lvl.description}</p>
                </CardContent>
              </Card>
            ))}

            {currentStep === 2 && TIME_COMMITMENTS.map((time) => (
              <Card 
                key={time.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2 hover:scale-[1.02] active:scale-[0.98]",
                  formData.timeCommitment === time.id 
                    ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                )}
                onClick={() => setFormData({ ...formData, timeCommitment: time.id })}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-bold text-white">{time.label}</span>
                    {formData.timeCommitment === time.id && (
                      <div className="bg-indigo-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400">{time.description}</p>
                </CardContent>
              </Card>
            ))}

            {currentStep === 3 && (
              <div className="col-span-2 flex flex-wrap gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 border-2",
                      formData.interests.includes(interest)
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-12 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2 px-6 h-12 rounded-xl"
        >
          <ChevronLeft className="w-5 h-5" />
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            (currentStep === 0 && !formData.objective) ||
            (currentStep === 1 && !formData.level) ||
            (currentStep === 2 && !formData.timeCommitment)
          }
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 px-8 h-12 rounded-xl shadow-lg shadow-indigo-500/20"
        >
          {currentStep === STEPS.length - 1 ? "Terminer" : "Suivant"}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
