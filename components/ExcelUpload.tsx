"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, X, Download } from "lucide-react"
import { Transaction, Account } from "@/src/types"

let XLSX: any
if (typeof window !== "undefined") {
  XLSX = require("xlsx")
}

interface ExcelUploadProps {
  onImport: (data: { transactions: Transaction[]; accounts: Account[] }) => void
}

export function ExcelUpload({ onImport }: ExcelUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (typeof window === "undefined" || !XLSX) {
      alert("Excel parsing is only available in the browser")
      return
    }

    setIsUploading(true)
    setUploadedFileName(file.name)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })

      const transactions: Transaction[] = []
      const accounts: Account[] = []

      workbook.SheetNames.forEach((sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (sheetName.toLowerCase().includes("transaction")) {
          jsonData.forEach((row: any, index: number) => {
            const transaction: Transaction = {
              id: `imported-${Date.now()}-${index}`,
              userId: "user1",
              accountId: row["Account ID"] || row["AccountId"] || "1",
              type: (row["Type"] || row["type"] || "expense").toLowerCase() as "expense" | "income" | "transfer",
              amount: parseFloat(row["Amount"] || row["amount"] || 0),
              currency: row["Currency"] || row["currency"] || "AED",
              merchant: row["Merchant"] || row["merchant"] || row["Description"] || row["description"] || "",
              category: row["Category"] || row["category"] || "Other",
              description: row["Description"] || row["description"] || row["Merchant"] || row["merchant"] || "",
              date: row["Date"] ? new Date(row["Date"]) : new Date(row["date"] || new Date()),
              isRecurring: row["Recurring"] || row["recurring"] || false,
              recurringPattern: row["Recurring Pattern"] || row["recurringPattern"] || undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            transactions.push(transaction)
          })
        } else if (sheetName.toLowerCase().includes("account")) {
          jsonData.forEach((row: any, index: number) => {
            const account: Account = {
              id: `imported-account-${Date.now()}-${index}`,
              userId: "user1",
              name: row["Name"] || row["name"] || `Account ${index + 1}`,
              type: (row["Type"] || row["type"] || "bank").toLowerCase().replace(" ", "_") as "bank" | "credit_card" | "cash" | "loan",
              balance: parseFloat(row["Balance"] || row["balance"] || 0),
              currency: row["Currency"] || row["currency"] || "AED",
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            accounts.push(account)
          })
        }
      })

      onImport({ transactions, accounts })
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      alert("Error parsing Excel file. Please check the format.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setUploadedFileName(null)
    const fileInput = document.getElementById("excel-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const downloadTemplate = () => {
    if (typeof window === "undefined" || !XLSX) return

    const transactionsTemplate = [
      {
        Type: "expense",
        Amount: 100,
        Currency: "AED",
        Merchant: "Example Store",
        Category: "Groceries",
        Description: "Weekly groceries",
        Date: "2024-12-01",
        Recurring: false,
        "Recurring Pattern": "",
      },
    ]

    const accountsTemplate = [
      {
        Name: "Emirates NBD Savings",
        Type: "bank",
        Balance: 10000,
        Currency: "AED",
      },
    ]

    const workbook = XLSX.utils.book_new()
    const transactionsSheet = XLSX.utils.json_to_sheet(transactionsTemplate)
    const accountsSheet = XLSX.utils.json_to_sheet(accountsTemplate)

    XLSX.utils.book_append_sheet(workbook, transactionsSheet, "Transactions")
    XLSX.utils.book_append_sheet(workbook, accountsSheet, "Accounts")

    XLSX.writeFile(workbook, "budget-template.xlsx")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Budget Data</CardTitle>
        <CardDescription>Upload an Excel file to import your transactions and accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="excel-upload" className="cursor-pointer">
              <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button type="button" variant="outline" disabled={isUploading} asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Choose Excel File"}
                </span>
              </Button>
            </label>
            <Button type="button" variant="secondary" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            {uploadedFileName && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{uploadedFileName}</span>
                <button onClick={handleRemove} className="text-red-600 hover:text-red-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Expected Excel format:</strong></p>
            <p>Sheet 1 (Transactions): Type, Amount, Currency, Merchant, Category, Description, Date</p>
            <p>Sheet 2 (Accounts): Name, Type, Balance, Currency</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

