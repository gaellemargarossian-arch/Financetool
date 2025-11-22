"use client"

import { useState } from "react"
import { useFinanceData } from "@/hooks/useFinanceData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/formatCurrency"
import { Plus, Wallet, CreditCard, DollarSign, Banknote } from "lucide-react"
import { AddAccountDialog } from "@/components/AddAccountDialog"

const accountTypeIcons = {
  bank: Banknote,
  credit_card: CreditCard,
  cash: DollarSign,
  loan: Wallet,
}

export default function AccountsPage() {
  const { accounts, addAccount } = useFinanceData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Accounts</h1>
          <p className="text-muted-foreground">Manage all your financial accounts</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance, "AED")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.filter((a) => a.balance !== 0).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>Complete list of your financial accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => {
                const Icon = accountTypeIcons[account.type]
                return (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{account.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.type.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={account.balance >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(account.balance, account.currency)}
                      </span>
                    </TableCell>
                    <TableCell>{account.currency}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddAccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAdd={addAccount} />
      </div>
    </main>
  )
}

