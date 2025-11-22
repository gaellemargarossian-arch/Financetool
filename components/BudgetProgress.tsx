"use client"

import { Budget, Transaction } from "@/src/types"
import { formatCurrency } from "@/lib/formatCurrency"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BudgetProgressProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export function BudgetProgress({ budgets, transactions }: BudgetProgressProps) {
  const budgetProgress = budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          new Date(t.date) >= budget.startDate
      )
      .reduce((sum, t) => sum + t.amount, 0)

    const percentage = (spent / budget.amount) * 100
    const isOverBudget = spent > budget.amount

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: Math.min(percentage, 100),
      isOverBudget,
    }
  })

  return (
    <div className="space-y-6">
      {budgetProgress.map((budget) => (
        <div key={budget.id}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium">{budget.category}</div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(budget.spent, budget.currency)} / {formatCurrency(budget.amount, budget.currency)}
              </div>
            </div>
            <Badge variant={budget.isOverBudget ? "destructive" : "default"}>
              {budget.percentage.toFixed(0)}%
            </Badge>
          </div>
          <Progress value={budget.percentage} className="h-2" />
          {budget.isOverBudget && (
            <div className="text-sm text-red-600 mt-1">Over budget by {formatCurrency(Math.abs(budget.remaining), budget.currency)}</div>
          )}
        </div>
      ))}
    </div>
  )
}

