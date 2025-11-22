"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/formatCurrency"

interface StackedBarChartProps {
  data: Record<string, number>
  transactions: Array<{ date: Date; amount: number; category: string }>
}

export function StackedBarChart({ data, transactions }: StackedBarChartProps) {
  const topCategories = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name)

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date)
    const month = monthNames[date.getMonth()]
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = { 
        month, 
        monthIndex: date.getMonth(),
        ...topCategories.reduce((cat, name) => ({ ...cat, [name]: 0 }), {}),
        Other: 0
      }
    }
    
    if (topCategories.includes(t.category)) {
      acc[monthKey][t.category] = (acc[monthKey][t.category] || 0) + t.amount
    } else {
      acc[monthKey]["Other"] = (acc[monthKey]["Other"] || 0) + t.amount
    }
    return acc
  }, {} as Record<string, any>)

  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.monthIndex - b.monthIndex)
    .slice(-6)
    .map((item: any) => {
      const { monthIndex, ...rest } = item
      return rest
    })

  const colors = {
    [topCategories[0] || "Category1"]: "#654f52",
    [topCategories[1] || "Category2"]: "#785d60",
    [topCategories[2] || "Category3"]: "#907276",
    Other: "#a88b8f",
  }

  if (chartData.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No spending data available</div>
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0e1" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: "#564648", fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: "#d4c4c6" }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: "#564648", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value, "AED")}
            labelFormatter={(label) => label}
            contentStyle={{ 
              backgroundColor: "#f9f7f7",
              border: "1px solid #e8e0e1",
              borderRadius: "4px",
              padding: "8px"
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
            iconType="square"
            iconSize={10}
          />
          {topCategories.map((category) => (
            <Bar 
              key={category}
              dataKey={category} 
              stackId="a" 
              fill={colors[category] || colors.Other}
              name={category}
              radius={[0, 0, 0, 0]}
            />
          ))}
          <Bar 
            dataKey="Other" 
            stackId="a" 
            fill={colors.Other}
            name="Other"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

