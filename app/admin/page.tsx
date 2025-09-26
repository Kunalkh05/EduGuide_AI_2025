import { AdminDashboard } from "@/components/admin-dashboard"
import { Navigation } from "@/components/navigation"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Add student data and view AI-generated insights for dropout risk assessment
          </p>
        </div>
        <AdminDashboard />
      </main>
    </div>
  )
}
