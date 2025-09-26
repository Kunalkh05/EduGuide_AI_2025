import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Empowering Indian Students with <span className="text-primary">AI-Driven</span> Academic Guidance
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto text-pretty">
            Advanced dropout prediction, personalized counseling insights, and comprehensive academic support for
            colleges across India. Helping students succeed through intelligent intervention and guidance.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="#ai-chat">
                Start AI Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/counselor">Counselor Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">AI-Powered Predictions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Advanced machine learning algorithms predict dropout risk with 90%+ accuracy
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Expert Counselor Insights</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional counselors provide personalized recommendations and interventions
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Real-time Analytics</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comprehensive dashboards track student progress and institutional metrics
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
