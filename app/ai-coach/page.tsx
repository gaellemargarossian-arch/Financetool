"use client"

import { useFinanceData } from "@/hooks/useFinanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/formatCurrency"
import { Brain, TrendingDown, Target, Lightbulb } from "lucide-react"

export default function AICoachPage() {
  const { transactions, budgets, categorySpending, totalExpenses } = useFinanceData()

  const discretionaryCategories = ["Restaurants", "Coffee", "Entertainment", "Shopping"]
  const discretionarySpending = Object.entries(categorySpending)
    .filter(([cat]) => discretionaryCategories.includes(cat))
    .reduce((sum, [, amount]) => sum + amount, 0)

  const targetReduction = discretionarySpending * 0.1
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthTransactions = transactions.filter(
    (t) =>
      t.type === "expense" &&
      new Date(t.date).getMonth() === currentMonth &&
      new Date(t.date).getFullYear() === currentYear
  )

  const topSpendingCategory = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0]

  const insights = [
    {
      type: "warning",
      title: "Reduce Discretionary Spending",
      message: `You&apos;re spending ${formatCurrency(discretionarySpending, "AED")} on discretionary items. Aim to reduce by ${formatCurrency(targetReduction, "AED")} (10%) this month.`,
      icon: TrendingDown,
    },
    {
      type: "info",
      title: "Top Spending Category",
      message: `${topSpendingCategory?.[0] || "N/A"} is your highest expense at ${formatCurrency(topSpendingCategory?.[1] || 0, "AED")}. Consider reviewing this category.`,
      icon: Target,
    },
    {
      type: "success",
      title: "Budget Tracking",
      message: `You have ${budgets.length} active budgets. Keep monitoring your progress to stay on track.`,
      icon: Lightbulb,
    },
  ]

  const recommendations = [
    "Set up automatic transfers to savings on payday",
    "Review subscriptions and cancel unused services",
    "Use cashback credit cards for regular expenses",
    "Plan meals to reduce restaurant spending",
    "Compare prices before major purchases",
  ]

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="h-8 w-8" />
          <h1 className="text-3xl font-bold">AI Financial Coach</h1>
        </div>
        <p className="text-muted-foreground">Get personalized insights and recommendations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Discretionary Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(discretionarySpending, "AED")}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target reduction: {formatCurrency(targetReduction, "AED")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses, "AED")}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transactions Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthTransactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Personalized financial insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    insight.type === "warning" ? "bg-secondary" :
                    insight.type === "info" ? "bg-muted" : "bg-secondary"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      insight.type === "warning" ? "text-foreground" :
                      insight.type === "info" ? "text-muted-foreground" : "text-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{insight.title}</div>
                    <div className="text-sm text-muted-foreground">{insight.message}</div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Actionable tips to improve your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Analysis</CardTitle>
          <CardDescription>Breakdown of your spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categorySpending)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / totalExpenses) * 100
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span>{formatCurrency(amount, "AED")} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
      </div>
    </main>
  )
}

