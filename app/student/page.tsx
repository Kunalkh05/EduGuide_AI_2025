import { Navigation } from "@/components/navigation"
import { StudentInsights } from "@/components/student-insights"

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentInsights />
      </main>
    </div>
  )
}
