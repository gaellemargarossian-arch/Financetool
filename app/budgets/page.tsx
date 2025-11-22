"use client"

import { useState } from "react"
import { useFinanceData } from "@/hooks/useFinanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/formatCurrency"
import { Plus } from "lucide-react"
import { BudgetProgress } from "@/components/BudgetProgress"
import { AddBudgetDialog } from "@/components/AddBudgetDialog"
import { DEFAULT_CATEGORIES } from "@/src/constants/categories"

export default function BudgetsPage() {
  const { budgets, transactions, addBudget } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Budgets</h1>
          <p className="text-muted-foreground">Set and track your spending limits</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Budgets</CardTitle>
            <CardDescription>Your current budget goals</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetProgress budgets={budgets} transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>Overview of your budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-bold">
                  {formatCurrency(
                    budgets.reduce((sum, b) => sum + b.amount, 0),
                    "AED"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(
                    budgets.reduce((sum, budget) => {
                      const spent = transactions
                        .filter(
                          (t) =>
                            t.type === "expense" &&
                            t.category === budget.category &&
                            new Date(t.date) >= budget.startDate
                        )
                        .reduce((s, t) => s + t.amount, 0)
                      return sum + spent
                    }, 0),
                    "AED"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(
                    budgets.reduce((sum, budget) => {
                      const spent = transactions
                        .filter(
                          (t) =>
                            t.type === "expense" &&
                            t.category === budget.category &&
                            new Date(t.date) >= budget.startDate
                        )
                        .reduce((s, t) => s + t.amount, 0)
                      return sum + (budget.amount - spent)
                    }, 0),
                    "AED"
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>Complete list of your budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgets.map((budget) => {
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

              return (
                <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{budget.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(spent, budget.currency)} / {formatCurrency(budget.amount, budget.currency)}
                    </div>
                  </div>
                  <Badge variant={isOverBudget ? "destructive" : "default"}>
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AddBudgetDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAdd={addBudget} />
      </div>
    </main>
  )
}

