import { Navigation } from "@/components/navigation"
import { CounselorDashboard } from "@/components/counselor-dashboard"

export default function CounselorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CounselorDashboard />
      </main>
    </div>
  )
}
