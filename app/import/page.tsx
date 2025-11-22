"use client"

import { useFinanceData } from "@/hooks/useFinanceData"
import { ExcelUpload } from "@/components/ExcelUpload"
import { EditableTransactionTable } from "@/components/EditableTransactionTable"
import { EditableAccountTable } from "@/components/EditableAccountTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

let XLSX: any
if (typeof window !== "undefined") {
  XLSX = require("xlsx")
}

export default function ImportPage() {
  const { transactions, accounts, importData, updateTransaction, deleteTransaction, updateAccount, deleteAccount } = useFinanceData()
  const [activeTab, setActiveTab] = useState("upload")

  const handleExport = () => {
    if (typeof window === "undefined" || !XLSX) {
      alert("Excel export is only available in the browser")
      return
    }
    const transactionsData = transactions.map((t) => ({
      Type: t.type,
      Amount: t.amount,
      Currency: t.currency,
      Merchant: t.merchant || "",
      Category: t.category,
      Description: t.description,
      Date: t.date.toISOString().split("T")[0],
      Recurring: t.isRecurring,
      "Recurring Pattern": t.recurringPattern || "",
    }))

    const accountsData = accounts.map((a) => ({
      Name: a.name,
      Type: a.type,
      Balance: a.balance,
      Currency: a.currency,
    }))

    const workbook = XLSX.utils.book_new()
    const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData)
    const accountsSheet = XLSX.utils.json_to_sheet(accountsData)

    XLSX.utils.book_append_sheet(workbook, transactionsSheet, "Transactions")
    XLSX.utils.book_append_sheet(workbook, accountsSheet, "Accounts")

    XLSX.writeFile(workbook, `budget-export-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Import & Edit Budget</h1>
          <p className="text-muted-foreground">Upload Excel files and edit your financial data</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Excel</TabsTrigger>
          <TabsTrigger value="transactions">Edit Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Edit Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <ExcelUpload onImport={importData} />
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Edit Transactions</CardTitle>
              <CardDescription>Click Edit to modify any transaction, or Delete to remove it</CardDescription>
            </CardHeader>
            <CardContent>
              <EditableTransactionTable
                transactions={transactions}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Edit Accounts</CardTitle>
              <CardDescription>Click Edit to modify any account balance or details, or Delete to remove it</CardDescription>
            </CardHeader>
            <CardContent>
              <EditableAccountTable
                accounts={accounts}
                onUpdate={updateAccount}
                onDelete={deleteAccount}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </main>
  )
}

