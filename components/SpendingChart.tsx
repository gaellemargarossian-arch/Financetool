"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/formatCurrency"

interface SpendingChartProps {
  data: Array<{ month: string; amount: number }>
}

export function SpendingChart({ data }: SpendingChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No spending data available</div>
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value} AED`} />
          <Tooltip formatter={(value: number) => formatCurrency(value, "AED")} />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Spending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

