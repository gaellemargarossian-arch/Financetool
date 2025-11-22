"use client"

import { useState } from "react"
import { Budget } from "@/src/types"
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

interface AddBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => void
}

export function AddBudgetDialog({ open, onOpenChange, onAdd }: AddBudgetDialogProps) {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [period, setPeriod] = useState<"monthly" | "weekly" | "yearly">("monthly")
  const [alertThreshold, setAlertThreshold] = useState("80")

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      userId: "user1",
      category,
      amount: parseFloat(amount) || 0,
      currency: "AED",
      period,
      startDate: new Date(),
      alertThreshold: parseFloat(alertThreshold) || 80,
      isActive: true,
    })
    setCategory("")
    setAmount("")
    setPeriod("monthly")
    setAlertThreshold("80")
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Budget</CardTitle>
          <CardDescription>Set a spending limit for a category</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
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
              <Label htmlFor="amount">Budget Amount (AED)</Label>
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
              <Label htmlFor="period">Period</Label>
              <Select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as "monthly" | "weekly" | "yearly")}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
              <Input
                id="alertThreshold"
                type="number"
                min="0"
                max="100"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                placeholder="80"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Budget</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

