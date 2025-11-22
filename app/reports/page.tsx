"use client"

import { useFinanceData } from "@/hooks/useFinanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/formatCurrency"
import dynamic from "next/dynamic"

const SpendingChart = dynamic(() => import("@/components/SpendingChart").then((mod) => ({ default: mod.SpendingChart })), {
  ssr: false,
})
const TrendChart = dynamic(() => import("@/components/TrendChart").then((mod) => ({ default: mod.TrendChart })), {
  ssr: false,
})
const CategoryChart = dynamic(() => import("@/components/CategoryChart").then((mod) => ({ default: mod.CategoryChart })), {
  ssr: false,
})

export default function ReportsPage() {
  const { transactions, categorySpending, totalIncome, totalExpenses } = useFinanceData()

  const monthlyData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }))

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
        <p className="text-muted-foreground">Detailed analysis and visualizations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome, "AED")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses, "AED")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalIncome - totalExpenses, "AED")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spending">Spending Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Monthly spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={chartData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Spending distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryChart data={categorySpending} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>Detailed monthly expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingChart data={chartData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </main>
  )
}

