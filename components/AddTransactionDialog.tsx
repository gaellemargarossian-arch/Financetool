"use client"

import { useState } from "react"
import { Transaction, Account } from "@/src/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DEFAULT_CATEGORIES } from "@/src/constants/categories"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void
  accounts: Account[]
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  onAdd,
  accounts,
}: AddTransactionDialogProps) {
  const [accountId, setAccountId] = useState(accounts[0]?.id || "")
  const [type, setType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState("")
  const [merchant, setMerchant] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      userId: "user1",
      accountId,
      type,
      amount: parseFloat(amount) || 0,
      currency: "AED",
      merchant,
      category: category || "Other",
      description: description || merchant,
      date: new Date(date),
      isRecurring: false,
    })
    setAmount("")
    setMerchant("")
    setCategory("")
    setDescription("")
    setType("expense")
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
          <CardDescription>Record a new income or expense</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="account">Account</Label>
              <Select
                id="account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as "expense" | "income")}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount (AED)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g., Carrefour"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

