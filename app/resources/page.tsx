import { Navigation } from "@/components/navigation"
import { CollegeResources } from "@/components/college-resources"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollegeResources />
      </main>
    </div>
  )
}
