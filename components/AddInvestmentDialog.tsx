"use client"

import { useState } from "react"
import { Investment } from "@/src/types/networth"
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

interface AddInvestmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (investment: Omit<Investment, "id" | "createdAt" | "updatedAt">) => void
}

export function AddInvestmentDialog({ open, onOpenChange, onAdd }: AddInvestmentDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<Investment["type"]>("stocks")
  const [currentValue, setCurrentValue] = useState("")
  const [currency, setCurrency] = useState("AED")
  const [initialInvestment, setInitialInvestment] = useState("")
  const [description, setDescription] = useState("")

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      userId: "user1",
      name,
      type,
      currentValue: parseFloat(currentValue) || 0,
      currency,
      initialInvestment: initialInvestment ? parseFloat(initialInvestment) : undefined,
      description: description || undefined,
    })
    setName("")
    setCurrentValue("")
    setType("stocks")
    setCurrency("AED")
    setInitialInvestment("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Investment</CardTitle>
          <CardDescription>Add a new investment to track</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Investment Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dubai Stocks Portfolio"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Investment Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as Investment["type"])}
              >
                <option value="stocks">Stocks</option>
                <option value="bonds">Bonds</option>
                <option value="mutual_fund">Mutual Fund</option>
                <option value="crypto">Crypto</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentValue">Current Value (AED)</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="initialInvestment">Initial Investment (AED)</Label>
              <Input
                id="initialInvestment"
                type="number"
                step="0.01"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="0.00"
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
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Investment</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

