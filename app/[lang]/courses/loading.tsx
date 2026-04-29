import { SkeletonCourseCard } from "@/components/ui/skeleton-screens";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="h-8 w-64 bg-muted rounded-lg"></div>
        <div className="h-10 w-40 bg-muted rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <SkeletonCourseCard key={i} />
        ))}
      </div>
    </div>
  );
}
