"use client"

import { useFinanceData } from "@/hooks/useFinanceData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Target } from "lucide-react"
import { formatCurrency } from "@/lib/formatCurrency"
import dynamic from "next/dynamic"
import { CategoriesList } from "@/components/CategoriesList"
import { FinancialSummary } from "@/components/FinancialSummary"
import { FeatureCard } from "@/components/FeatureCard"

const CategoryChart = dynamic(() => import("@/components/CategoryChart").then((mod) => ({ default: mod.CategoryChart })), {
  ssr: false,
})

export default function DashboardPage() {
  const { totalBalance, totalIncome, totalExpenses, categorySpending, transactions, budgets } = useFinanceData()
  
  const savings = totalIncome - totalExpenses

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
          <FeatureCard 
            title="Track your expenses" 
            icon={<Wallet className="h-16 w-16 text-muted-foreground opacity-40" />}
          />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">Expenses</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">{formatCurrency(totalExpenses, "AED")}</div>
            </CardHeader>
            <CardContent className="pt-0">
              <CategoryChart data={categorySpending} />
            </CardContent>
          </Card>

          <FeatureCard 
            title="Gain control" 
            icon={<Target className="h-16 w-16 text-muted-foreground opacity-40" />}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CategoriesList transactions={transactions} />
            </CardContent>
          </Card>

          <FeatureCard 
            title="Create budgets" 
            icon={<TrendingUp className="h-16 w-16 text-muted-foreground opacity-40" />}
          />

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-foreground">Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FinancialSummary
                income={totalIncome}
                expenses={totalExpenses}
                savings={savings}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
