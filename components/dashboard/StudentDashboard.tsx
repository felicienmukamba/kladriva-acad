import { useDictionary } from "@/components/DictionaryProvider"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "@/app/[lang]/dashboard/data.json"

export function StudentDashboard() {
  const dict = useDictionary()
  
  return (
    <div className="flex flex-col gap-10">
      <div className="apple-toolbar">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {dict.dashboard.student.title}
          </h2>
          <p className="text-muted-foreground">
            {dict.dashboard.student.tagline}
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <SectionCards />
        <div className="apple-card overflow-hidden">
          <ChartAreaInteractive />
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight text-foreground pl-2">{dict.dashboard.student.activePrograms}</h3>
          <div className="apple-card overflow-hidden p-2">
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
