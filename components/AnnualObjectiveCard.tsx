"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"

interface AnnualObjectiveCardProps {
  title: string
  current: number
  total: number
  icon: ReactNode
}

export default function AnnualObjectiveCard({
  title,
  current,
  total,
  icon,
}: AnnualObjectiveCardProps) {
  const percent = Math.round((current / total) * 100)
  return (
    <Card className="rounded-2xl shadow transition hover:bg-muted">
      <CardHeader className="flex items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-sm font-semibold">
          {current} / {total}
        </div>
        <Progress value={percent} />
        <div className="text-xs text-muted-foreground">{percent}%</div>
      </CardContent>
    </Card>
  )
}
