import { Navigation } from "@/components/navigation"
import { GrantsHeader } from "@/components/grants/grants-header"
import { GrantsFilters } from "@/components/grants/grants-filters"
import { GrantsList } from "@/components/grants/grants-list"

export default function GrantsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <GrantsHeader />
        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1">
            <GrantsFilters />
          </aside>
          <div className="lg:col-span-3">
            <GrantsList />
          </div>
        </div>
      </main>
    </div>
  )
}
