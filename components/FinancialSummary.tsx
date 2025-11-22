"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/formatCurrency"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface FinancialSummaryProps {
  income: number
  expenses: number
  savings: number
  previousIncome?: number
  previousExpenses?: number
  previousSavings?: number
}

export function FinancialSummary({
  income,
  expenses,
  savings,
  previousIncome = income * 1.2,
  previousExpenses = expenses * 0.8,
  previousSavings = savings * 1.5,
}: FinancialSummaryProps) {
  const incomeChange = income - previousIncome
  const expensesChange = expenses - previousExpenses
  const savingsChange = savings - previousSavings

  const incomeTrend = [
    { value: previousIncome },
    { value: income },
  ]

  const expensesTrend = [
    { value: previousExpenses },
    { value: expenses },
  ]

  const savingsTrend = [
    { value: previousSavings },
    { value: savings },
  ]

  return (
    <div className="space-y-6">
      <SummaryItem
        label="Income"
        current={income}
        previous={previousIncome}
        change={incomeChange}
        trend={incomeTrend}
        isPositive={incomeChange >= 0}
      />
      <SummaryItem
        label="Expenses"
        current={expenses}
        previous={previousExpenses}
        change={expensesChange}
        trend={expensesTrend}
        isPositive={expensesChange <= 0}
      />
      <SummaryItem
        label="Savings"
        current={savings}
        previous={previousSavings}
        change={savingsChange}
        trend={savingsTrend}
        isPositive={savingsChange >= 0}
      />
    </div>
  )
}

function SummaryItem({
  label,
  current,
  previous,
  change,
  trend,
  isPositive,
}: {
  label: string
  current: number
  previous: number
  change: number
  trend: Array<{ value: number }>
  isPositive: boolean
}) {
  return (
    <div className="space-y-3 pb-4 border-b border-border last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-400" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-400" />
        )}
      </div>
      <div className="text-2xl font-bold text-foreground">{formatCurrency(current, "AED")}</div>
      <div className="text-sm text-muted-foreground">
        {formatCurrency(previous, "AED")} last period
      </div>
      <div className="h-10 w-full -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#34d399" : "#f87171"}
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

