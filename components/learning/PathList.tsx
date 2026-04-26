"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Layers, Clock, Award, ArrowRight, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

interface PathListProps {
  initialPaths: any[]
  lang: string
  dict: any
}

export function PathList({ initialPaths, lang, dict }: PathListProps) {
  const [search, setSearch] = useState("")

  const filteredPaths = useMemo(() => {
    return initialPaths.filter(path => {
      return path.title.toLowerCase().includes(search.toLowerCase()) || 
             path.description?.toLowerCase().includes(search.toLowerCase())
    })
  }, [initialPaths, search])

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="max-w-2xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
        <Input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search learning paths..." 
          className="w-full pl-12 pr-4 h-14 bg-white border-slate-200 rounded-2xl text-base focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredPaths.map((path, idx) => (
            <motion.div
              key={path.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full group-hover:-translate-y-2">
                {/* Image Section */}
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img 
                    src={path.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"} 
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-black text-primary uppercase tracking-widest">
                       {path.courses.length} Courses
                     </div>
                     <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                       <Clock className="w-3.5 h-3.5" />
                       4-6 Months
                     </div>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  
                  <p className="text-slate-500 mb-8 line-clamp-3 leading-relaxed text-lg">
                    {path.description}
                  </p>

                  <div className="space-y-4 mb-10 bg-slate-50 p-6 rounded-[2rem]">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Curriculum Overview</h4>
                    <div className="space-y-3">
                      {path.courses.sort((a: any, b: any) => a.order - b.order).slice(0, 3).map((cp: any, i: number) => (
                        <div key={cp.courseId} className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                          <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{cp.course.title}</span>
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <div className="text-xs font-bold text-slate-400 pl-8 italic">
                          + {path.courses.length - 3} more modules...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                      <Award className="w-4 h-4" />
                      Certification
                    </div>
                    <Link href={`/${lang}/paths/${path.id}`}>
                      <Button className="rounded-2xl h-12 px-6 bg-slate-950 text-white hover:bg-primary transition-all font-bold group/btn gap-2">
                        Get Started <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPaths.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <p className="text-slate-500 font-bold">No paths found matching your search.</p>
        </div>
      )}
    </div>
  )
}
