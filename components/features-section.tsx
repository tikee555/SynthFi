import { Code, Layers, Layout, Rocket, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      title: "Prompt-to-Program",
      description: "Convert natural language into audited Solana programs with a single prompt.",
      icon: <Code className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Plug-and-Play Modules",
      description: "Reusable components for staking, vesting, airdrops, and more.",
      icon: <Layers className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "AI-Generated Frontend",
      description: "Beautiful UIs automatically created to match your program's functionality.",
      icon: <Layout className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Launchpad Deployment",
      description: "One-click deployment to Solana with automated liquidity provision.",
      icon: <Rocket className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "AI Code Review",
      description: "Automatic security scanning and vulnerability detection.",
      icon: <Shield className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Verified Templates",
      description: "Pre-audited templates for common DeFi applications. (Coming Soon)",
      icon: <CheckCircle className="h-10 w-10 text-gray-500" />,
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2">
          <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
