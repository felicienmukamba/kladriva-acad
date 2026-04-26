import { useDictionary } from "@/components/DictionaryProvider"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "@/app/[lang]/dashboard/data.json"

export function StudentDashboard() {
  const dict = useDictionary()
  
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#1d1d1f]">
            {dict.dashboard.student.title}
          </h2>
          <p className="text-[#86868b] text-[17px]">
            {dict.dashboard.student.tagline}
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <SectionCards />
        <div className="border border-[#d2d2d7] rounded-[24px] bg-white overflow-hidden p-6 shadow-none">
          <ChartAreaInteractive />
        </div>
        <div className="space-y-6">
          <h3 className="text-[20px] font-semibold tracking-tight text-[#1d1d1f] pl-2">{dict.dashboard.student.activePrograms}</h3>
          <div className="border border-[#d2d2d7] rounded-[24px] bg-white overflow-hidden p-6 shadow-none">
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
