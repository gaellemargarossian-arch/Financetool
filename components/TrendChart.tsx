"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/formatCurrency"

interface TrendChartProps {
  data: Array<{ month: string; amount: number }>
}

export function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No spending data available</div>
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value} AED`} />
          <Tooltip formatter={(value: number) => formatCurrency(value, "AED")} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} name="Spending" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

