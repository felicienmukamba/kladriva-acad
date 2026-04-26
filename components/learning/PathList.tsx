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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] w-5 h-5 group-focus-within:text-[#1d1d1f] transition-colors" />
        <Input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search learning paths..." 
          className="w-full pl-12 pr-4 h-12 bg-[#f5f5f7] border-transparent rounded-full text-[17px] focus-visible:ring-4 focus-visible:ring-[#0066cc]/20 focus-visible:border-[#0066cc] transition-all"
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
              <div className="group relative bg-white rounded-[24px] overflow-hidden border border-[#d2d2d7] hover:border-[#1d1d1f] transition-all duration-500 flex flex-col h-full group-hover:-translate-y-1">
                {/* Image Section */}
                <div className="aspect-[16/9] overflow-hidden relative border-b border-[#d2d2d7]">
                  <img 
                    src={path.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"} 
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="bg-[#f5f5f7] px-3 py-1 rounded-full text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wider">
                       {path.courses.length} Courses
                     </div>
                     <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#86868b]">
                       <Clock className="w-3.5 h-3.5" />
                       4-6 Months
                     </div>
                  </div>

                  <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-3 tracking-tight">
                    {path.title}
                  </h3>
                  
                  <p className="text-[#86868b] text-[15px] mb-8 line-clamp-2 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="space-y-4 mb-8 bg-[#f5f5f7] p-6 rounded-[16px]">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-2">Curriculum Overview</h4>
                    <div className="space-y-3">
                      {path.courses.sort((a: any, b: any) => a.order - b.order).slice(0, 3).map((cp: any, i: number) => (
                        <div key={cp.courseId} className="flex items-center gap-3 text-[14px] text-[#1d1d1f] font-medium">
                          <span className="w-5 h-5 rounded-full bg-white border border-[#d2d2d7] flex items-center justify-center text-[10px] text-[#86868b] shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{cp.course.title}</span>
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <div className="text-[12px] font-medium text-[#86868b] pl-8">
                          + {path.courses.length - 3} more modules...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-[#d2d2d7] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#0066cc] font-medium text-[12px] uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      Certification
                    </div>
                    <Link href={`/${lang}/paths/${path.id}`}>
                      <Button className="rounded-full h-10 px-6 bg-[#1d1d1f] text-white hover:bg-black transition-all font-medium gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
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
        <div className="text-center py-20 bg-[#f5f5f7] rounded-[24px]">
           <p className="text-[#86868b] text-[17px]">No paths found matching your search.</p>
        </div>
      )}
    </div>
  )
}
