import { Navigation } from "@/components/navigation"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsFilters } from "@/components/projects/projects-filters"
import { ProjectsList } from "@/components/projects/projects-list"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <ProjectsHeader />
        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1">
            <ProjectsFilters />
          </aside>
          <div className="lg:col-span-3">
            <ProjectsList />
          </div>
        </div>
      </main>
    </div>
  )
}
