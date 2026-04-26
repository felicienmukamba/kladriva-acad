"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Globe, ChevronDown, Filter, PlayCircle, Star, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

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

  const levels = ["Beginner", "Intermediate", "Advanced"]

  const filteredCourses = useMemo(() => {
    return initialCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                           course.description?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || course.category === selectedCategory
      const matchesLevel = !selectedLevel || (course as any).level === selectedLevel
      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [initialCourses, search, selectedCategory, selectedLevel])

  return (
    <div className="space-y-12">
      {/* Search and Filters Bar */}
      <div className="sticky top-20 z-30 py-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 -mx-6 px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you want to learn today?" 
                className="w-full pl-12 pr-4 h-14 bg-slate-50 border-transparent rounded-2xl text-base focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedLevel(null); }}
                className="rounded-2xl h-14 px-6 font-bold border-slate-200 hover:bg-slate-50 transition-all shrink-0"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-center">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Category</h4>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button 
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full h-9 px-5 font-bold transition-all shrink-0 ${selectedCategory === null ? 'bg-primary text-white' : 'border-slate-200'}`}
                >
                  All
                </Button>
                {categories.map(cat => (
                  <Button 
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full h-9 px-5 font-bold transition-all shrink-0 ${selectedCategory === cat ? 'bg-primary text-white' : 'border-slate-200'}`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Level</h4>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button 
                  variant={selectedLevel === null ? "default" : "outline"}
                  onClick={() => setSelectedLevel(null)}
                  className={`rounded-full h-9 px-5 font-bold transition-all shrink-0 ${selectedLevel === null ? 'bg-primary text-white' : 'border-slate-200'}`}
                >
                  All Levels
                </Button>
                {levels.map(level => (
                  <Button 
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full h-9 px-5 font-bold transition-all shrink-0 ${selectedLevel === level ? 'bg-primary text-white' : 'border-slate-200'}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link href={`/${lang}/courses/${course.id}`} className="group block h-full">
                <div className="relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <PlayCircle className="w-16 h-16 text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                        {course.category || "General"}
                      </div>
                      {(course as any).level && (
                        <div className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                          {(course as any).level}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-500" />
                        4.8
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <BookOpen className="w-3 h-3" />
                        {course.modules?.length || 0} Modules
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Globe className="w-3 h-3" />
                        </div>
                        English
                      </div>
                      <div className="text-sm font-black text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Details →
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
          className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
        >
           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
             <Search className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
           <p className="text-slate-500">Try adjusting your search or category filters.</p>
           <Button 
             variant="link" 
             onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedLevel(null); }}
             className="mt-4 text-primary font-bold"
           >
             Clear all filters
           </Button>
        </motion.div>
      )}
    </div>
  )
}
