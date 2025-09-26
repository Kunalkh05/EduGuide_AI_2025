import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Shield, Zap, Target, Heart, BarChart3 } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Target,
      title: "Dropout Risk Assessment",
      description:
        "AI-powered analysis of academic performance, attendance, and behavioral patterns to identify at-risk students early.",
    },
    {
      icon: Heart,
      title: "Mental Health Monitoring",
      description: "Track student wellbeing indicators and provide timely mental health support recommendations.",
    },
    {
      icon: BookOpen,
      title: "Academic Performance Tracking",
      description:
        "Comprehensive monitoring of CGPA, attendance, backlogs, and study patterns for personalized interventions.",
    },
    {
      icon: BarChart3,
      title: "Counselor Dashboard",
      description:
        "Professional tools for counselors to track student progress, add insights, and manage intervention strategies.",
    },
    {
      icon: Zap,
      title: "Real-time Interventions",
      description: "Immediate alerts and recommendations when students show signs of academic or personal distress.",
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description:
        "Secure data handling with privacy-first approach, ensuring student information remains confidential.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Comprehensive Student Support System</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines AI technology with human expertise to provide holistic support for Indian college
            students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
