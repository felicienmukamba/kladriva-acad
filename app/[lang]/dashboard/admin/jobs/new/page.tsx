import { isAdmin } from "@/lib/permissions"
import { JobForm } from "@/components/admin/JobForm"

export default async function NewJobPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  await isAdmin(lang)

  return (
    <div className="px-4 py-8 lg:px-6 lg:py-10 space-y-8 bg-[#f5f5f7] min-h-screen">
      <div className="apple-toolbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">Post new job</h1>
          <p className="text-sm text-slate-600">Fill in the details to list a new opportunity in the marketplace.</p>
        </div>
      </div>

      <JobForm lang={lang} />
    </div>
  )
}
