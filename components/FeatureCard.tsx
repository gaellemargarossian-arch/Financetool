"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Target, Wallet } from "lucide-react"

interface FeatureCardProps {
  title: string
  icon?: React.ReactNode
}

export function FeatureCard({ title, icon }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-muted to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-primary glow-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-primary glow-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary glow-sm"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {icon || <Wallet className="h-16 w-16 text-primary opacity-60" />}
        </div>
      </div>
      <CardContent className="p-6 bg-card">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </CardContent>
    </Card>
  )
}

