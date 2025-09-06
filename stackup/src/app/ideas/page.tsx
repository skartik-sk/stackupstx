import { Navigation } from "@/components/navigation"
import { IdeasHeader } from "@/components/ideas/ideas-header"
import { IdeasFilters } from "@/components/ideas/ideas-filters"
import { IdeasList } from "@/components/ideas/ideas-list"

export default function IdeasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <IdeasHeader />
        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1">
            <IdeasFilters />
          </aside>
          <div className="lg:col-span-3">
            <IdeasList />
          </div>
        </div>
      </main>
    </div>
  )
}
