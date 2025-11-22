"use client"

import { useState } from "react"
import { Account, AccountType } from "@/src/types"
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

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (account: Omit<Account, "id" | "createdAt" | "updatedAt">) => void
}

export function AddAccountDialog({ open, onOpenChange, onAdd }: AddAccountDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<AccountType>("bank")
  const [balance, setBalance] = useState("")
  const [currency, setCurrency] = useState("AED")

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      userId: "user1",
      name,
      type,
      balance: parseFloat(balance) || 0,
      currency,
    })
    setName("")
    setBalance("")
    setType("bank")
    setCurrency("AED")
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Account</CardTitle>
          <CardDescription>Add a new financial account to track</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Emirates NBD Savings"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Account Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
              >
                <option value="bank">Bank</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="loan">Loan</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="balance">Initial Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Account</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

