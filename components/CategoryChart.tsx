"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/formatCurrency"

// Distinct colors for better expense differentiation
const COLORS = [
  "#00d4ff", // Cyan - Primary accent
  "#ff6b6b", // Red - High priority expenses
  "#4ecdc4", // Teal - Utilities
  "#ffe66d", // Yellow - Food & Dining
  "#a8e6cf", // Green - Shopping
  "#ff8b94", // Pink - Entertainment
  "#95e1d3", // Mint - Transportation
  "#f38181", // Coral - Healthcare
  "#aa96da", // Purple - Education
  "#fcbad3", // Light Pink - Other
  "#ffd3a5", // Peach - Services
  "#c7ceea", // Lavender - Miscellaneous
]

interface CategoryChartProps {
  data: Record<string, number>
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name,
      value: Number(value),
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No spending data available</div>
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#000000"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value, "AED")}
            contentStyle={{ 
              backgroundColor: "#1a1a1a", 
              border: "1px solid #00d4ff", 
              borderRadius: "8px", 
              color: "#ffffff" 
            }}
            labelStyle={{ color: "#00d4ff" }}
          />
          <Legend 
            wrapperStyle={{ color: "#ffffff" }}
            iconType="square"
            formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

