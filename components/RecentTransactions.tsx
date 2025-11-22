"use client"

import { Transaction } from "@/src/types"
import { formatCurrency } from "@/lib/formatCurrency"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 rounded-full ${
                transaction.type === "income" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <div className="font-medium">{transaction.merchant || transaction.description}</div>
              <div className="text-sm text-muted-foreground">{transaction.category}</div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-bold ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

