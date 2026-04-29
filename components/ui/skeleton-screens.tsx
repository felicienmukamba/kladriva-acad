import React from "react";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-6 space-y-4 animate-pulse", className)}>
      <div className="h-40 bg-muted rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-4 w-2/3 bg-muted rounded"></div>
        <div className="h-3 w-1/2 bg-muted rounded opacity-70"></div>
      </div>
      <div className="flex gap-2 pt-4">
        <div className="h-6 w-16 bg-muted rounded-full"></div>
        <div className="h-6 w-16 bg-muted rounded-full"></div>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg"></div>
          <div className="h-4 w-64 bg-muted rounded opacity-70"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-muted rounded-2xl border"></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-muted rounded-2xl border"></div>
        <div className="h-[400px] bg-muted rounded-2xl border"></div>
      </div>
    </div>
  );
}

export function SkeletonCourseCard() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
      <div className="h-32 bg-muted"></div>
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-4/5 bg-muted rounded"></div>
        </div>
        <div className="h-3 w-1/3 bg-muted rounded opacity-70"></div>
        <div className="flex justify-between pt-4 border-t">
          <div className="h-4 w-20 bg-muted rounded"></div>
          <div className="h-4 w-20 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}
