import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { AIChat } from "@/components/ai-chat"
import { Stats } from "@/components/stats"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Stats />
        <Features />
        <AIChat />
      </main>
    </div>
  )
}
