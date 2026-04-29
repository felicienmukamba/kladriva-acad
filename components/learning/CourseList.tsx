"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Globe, ChevronDown, Filter, PlayCircle, Star, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CourseListProps {
  initialCourses: any[]
  lang: string
  dict: any
}

export function CourseList({ initialCourses, lang, dict }: CourseListProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const categories = useMemo(() => {
    return Array.from(new Set(initialCourses.map(c => c.category || "General")))
  }, [initialCourses])

  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

  const filteredCourses = useMemo(() => {
    return initialCourses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(search.toLowerCase()) || 
        course.description?.toLowerCase().includes(search.toLowerCase()) ||
        course.technologies?.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = !selectedCategory || course.category === selectedCategory
      const matchesLevel = !selectedLevel || course.level === selectedLevel
      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [initialCourses, search, selectedCategory, selectedLevel])

  return (
    <div className="space-y-12">
      {/* Search and Filters Bar */}
      <div className="py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl">
            <div className="flex-1 relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un cours, une techno..." 
                className="w-full pl-12 pr-4 h-14 bg-card border-border/50 rounded-2xl text-[17px] focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all shadow-apple"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button 
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-full h-9 px-5 text-[13px] font-bold transition-all shrink-0",
                  selectedCategory === null ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Tous les thèmes
              </Button>
              {categories.map(cat => (
                <Button 
                  key={cat}
                  variant="ghost"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-full h-9 px-5 text-[13px] font-bold transition-all shrink-0",
                    selectedCategory === cat ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-border hidden md:block mx-2"></div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button 
                variant="ghost"
                onClick={() => setSelectedLevel(null)}
                className={cn(
                  "rounded-full h-9 px-5 text-[13px] font-bold transition-all shrink-0",
                  selectedLevel === null ? "bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Tous les niveaux
              </Button>
              {levels.map(level => (
                <Button 
                  key={level}
                  variant="ghost"
                  onClick={() => setSelectedLevel(level)}
                  className={cn(
                    "rounded-full h-9 px-5 text-[13px] font-bold transition-all shrink-0",
                    selectedLevel === level ? "bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {level === "BEGINNER" ? "Débutant" : level === "INTERMEDIATE" ? "Intermédiaire" : "Avancé"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/${lang}/courses/${course.id}`} className="group block h-full">
                <div className="apple-card h-full flex flex-col p-0 overflow-hidden border-none shadow-apple hover:shadow-apple-lg hover:-translate-y-1 bg-card">
                  {/* Image Container */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                      src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                         <PlayCircle className="w-4 h-4 text-primary" /> Voir le programme
                       </span>
                    </div>
                    {course.level && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-black border-none font-bold text-[10px] rounded-lg shadow-sm">
                          {course.level}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">
                        {course.category || "Technologie"}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" /> {course.rating || "4.9"}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-[14px] line-clamp-2 leading-relaxed mb-6 flex-1">
                      {course.description}
                    </p>

                    <div className="pt-5 border-t border-border/50 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-primary/20">
                          {course.instructor?.image ? (
                             <AvatarImage src={course.instructor.image} />
                          ) : (
                             <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                               {(course.instructor?.name || "K").charAt(0)}
                             </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-[12px] font-bold text-foreground/80">{course.instructor?.name || "Expert Kladriva"}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration || "12h"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50"
        >
           <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border">
             <Search className="w-10 h-10 text-muted-foreground/30" />
           </div>
           <h3 className="text-xl font-bold text-foreground mb-2">Aucun cours trouvé</h3>
           <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou vos filtres thématiques.</p>
           <Button 
             variant="link" 
             onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedLevel(null); }}
             className="mt-4 text-primary font-bold h-auto p-0"
           >
             Réinitialiser tous les filtres
           </Button>
        </motion.div>
      )}
    </div>
  )
}
