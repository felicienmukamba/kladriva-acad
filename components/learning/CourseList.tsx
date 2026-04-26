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
      <div className="py-8 bg-white">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl">
            <div className="flex-1 relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] w-5 h-5 group-focus-within:text-[#1d1d1f] transition-colors" />
              <Input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..." 
                className="w-full pl-12 pr-4 h-12 bg-[#f5f5f7] border-transparent rounded-full text-[17px] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button 
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full h-8 px-4 text-[13px] font-medium transition-all shrink-0 ${selectedCategory === null ? 'bg-[#1d1d1f] text-white hover:bg-black hover:text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'}`}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button 
                  key={cat}
                  variant="ghost"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full h-8 px-4 text-[13px] font-medium transition-all shrink-0 ${selectedCategory === cat ? 'bg-[#1d1d1f] text-white hover:bg-black hover:text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'}`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-[#d2d2d7] hidden md:block mx-2"></div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button 
                variant="ghost"
                onClick={() => setSelectedLevel(null)}
                className={`rounded-full h-8 px-4 text-[13px] font-medium transition-all shrink-0 ${selectedLevel === null ? 'bg-[#1d1d1f] text-white hover:bg-black hover:text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'}`}
              >
                All Levels
              </Button>
              {levels.map(level => (
                <Button 
                  key={level}
                  variant="ghost"
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-full h-8 px-4 text-[13px] font-medium transition-all shrink-0 ${selectedLevel === level ? 'bg-[#1d1d1f] text-white hover:bg-black hover:text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'}`}
                >
                  {level}
                </Button>
              ))}
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
              <Link href={`/${lang}/courses/${course.id}`} className="group block">
                <div className="flex flex-col gap-4">
                  {/* Image Container */}
                  <div className="aspect-[4/3] bg-[#f5f5f7] rounded-[18px] overflow-hidden relative">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-[#d2d2d7]" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                      {course.category || "General"} {(course as any).level && ` • ${(course as any).level}`}
                    </div>

                    <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2 leading-tight">
                      {course.title}
                    </h3>
                    
                    <p className="text-[#86868b] text-[15px] line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
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
