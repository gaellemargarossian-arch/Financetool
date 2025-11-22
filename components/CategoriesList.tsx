"use client"

import { ShoppingCart, Home, Globe, HelpCircle, ChevronRight } from "lucide-react"
import { Transaction } from "@/src/types"

interface CategoriesListProps {
  transactions: Transaction[]
}

const categoryIcons: Record<string, any> = {
  Groceries: ShoppingCart,
  Household: Home,
  Rent: Home,
  Travel: Globe,
  Other: HelpCircle,
}

export function CategoriesList({ transactions }: CategoriesListProps) {
  const categoryCounts = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      count,
      icon: categoryIcons[name] || HelpCircle,
    }))

  return (
    <div className="space-y-3">
      {topCategories.map((category) => {
        const Icon = category.icon
        return (
          <div
            key={category.name}
            className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2.5 rounded-lg bg-secondary">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-base">{category.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{category.count} transactions</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        )
      })}
    </div>
  )
}

