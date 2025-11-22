"use client"

import { useState } from "react"
import { useFinanceData } from "@/hooks/useFinanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/formatCurrency"
import { Plus, ArrowDown, ArrowUp } from "lucide-react"
import { AddTransactionDialog } from "@/components/AddTransactionDialog"
import { DEFAULT_CATEGORIES } from "@/src/constants/categories"

export default function TransactionsPage() {
  const { transactions, addTransaction, accounts } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.merchant || transaction.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={addTransaction}
        accounts={accounts}
      />
      </div>
    </main>
  )
}

