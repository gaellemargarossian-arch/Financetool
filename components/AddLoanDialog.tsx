"use client"

import { useState } from "react"
import { Loan } from "@/src/types/networth"
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

interface AddLoanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (loan: Omit<Loan, "id" | "createdAt" | "updatedAt">) => void
}

export function AddLoanDialog({ open, onOpenChange, onAdd }: AddLoanDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<Loan["type"]>("mortgage")
  const [principal, setPrincipal] = useState("")
  const [remainingBalance, setRemainingBalance] = useState("")
  const [currency, setCurrency] = useState("AED")
  const [interestRate, setInterestRate] = useState("")
  const [monthlyPayment, setMonthlyPayment] = useState("")

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      userId: "user1",
      name,
      type,
      principal: parseFloat(principal) || 0,
      remainingBalance: parseFloat(remainingBalance) || 0,
      currency,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : undefined,
    })
    setName("")
    setPrincipal("")
    setRemainingBalance("")
    setType("mortgage")
    setCurrency("AED")
    setInterestRate("")
    setMonthlyPayment("")
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Loan</CardTitle>
          <CardDescription>Add a new loan to track</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Loan Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Home Mortgage"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Loan Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as Loan["type"])}
              >
                <option value="mortgage">Mortgage</option>
                <option value="personal">Personal</option>
                <option value="car">Car</option>
                <option value="credit_card">Credit Card</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="principal">Principal Amount (AED)</Label>
              <Input
                id="principal"
                type="number"
                step="0.01"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="remainingBalance">Remaining Balance (AED)</Label>
              <Input
                id="remainingBalance"
                type="number"
                step="0.01"
                value={remainingBalance}
                onChange={(e) => setRemainingBalance(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 3.5"
              />
            </div>
            <div>
              <Label htmlFor="monthlyPayment">Monthly Payment (AED)</Label>
              <Input
                id="monthlyPayment"
                type="number"
                step="0.01"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Loan</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

